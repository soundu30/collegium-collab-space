
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Calendar,
  MapPin,
  User,
  Globe,
  Search,
  Plus,
  CalendarDays,
  Users,
  CheckCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { getCollection, addItem, updateItem, generateId } from '@/utils/localStorageDB';

// Define the event type
interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  isOnline: boolean;
  link?: string;
  category: string;
  organizerId: string;
  imageUrl?: string;
  createdAt: string;
  participantCount: number;
}

// Define the event participant type
interface EventParticipant {
  id: string;
  eventId: string;
  userId: string;
  createdAt: string;
}

const EventsPage: React.FC = () => {
  const { user, profile } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [myParticipations, setMyParticipations] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showPast, setShowPast] = useState<boolean>(false);
  const [eventDialogOpen, setEventDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    isOnline: false,
    link: '',
    category: '',
  });

  // Sample event categories
  const categories = [
    'Academic',
    'Social',
    'Workshop',
    'Seminar',
    'Study Group',
    'Career',
    'Club Meeting',
    'Cultural',
    'Sports',
    'Other'
  ];

  // Load events on component mount
  useEffect(() => {
    const loadedEvents = getCollection<Event>('events');
    setEvents(loadedEvents);

    // Load user participations
    if (user?.id) {
      const participations = getCollection<EventParticipant>('eventParticipants');
      const userEvents = participations
        .filter(p => p.userId === user.id)
        .map(p => p.eventId);
      
      setMyParticipations(userEvents);
    }
  }, [user?.id]);

  // Filter events based on search, category and date
  const filteredEvents = events.filter(event => {
    // Search query filter
    const matchesSearch = 
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Category filter
    const matchesCategory = selectedCategory === 'all' || event.category === selectedCategory;
    
    // Date filter
    const eventDate = new Date(event.date);
    const now = new Date();
    const isPast = eventDate < now;
    const matchesTimeframe = showPast || !isPast;
    
    return matchesSearch && matchesCategory && matchesTimeframe;
  });

  // Sort events by date (upcoming first)
  filteredEvents.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewEvent(prev => ({ ...prev, [name]: value }));
  };

  const handleToggleChange = (value: boolean) => {
    setNewEvent(prev => ({ ...prev, isOnline: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!newEvent.title || !newEvent.description || !newEvent.date || !newEvent.category) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!newEvent.isOnline && !newEvent.location) {
      toast.error('Please provide a location for in-person events');
      return;
    }

    if (newEvent.isOnline && !newEvent.link) {
      toast.error('Please provide a link for online events');
      return;
    }

    try {
      let imageUrl = '';
      
      // If image is selected, convert to base64
      if (selectedFile) {
        const reader = new FileReader();
        await new Promise<void>((resolve, reject) => {
          reader.onload = () => {
            imageUrl = reader.result as string;
            resolve();
          };
          reader.onerror = reject;
          reader.readAsDataURL(selectedFile);
        });
      }

      // Combine date and time
      const dateTime = newEvent.time 
        ? `${newEvent.date}T${newEvent.time}` 
        : `${newEvent.date}T00:00:00`;

      // Create the event object
      const event: Event = {
        id: generateId(),
        title: newEvent.title,
        description: newEvent.description,
        date: dateTime,
        location: newEvent.location,
        isOnline: newEvent.isOnline,
        link: newEvent.link,
        category: newEvent.category,
        organizerId: user?.id || 'unknown',
        imageUrl: imageUrl,
        createdAt: new Date().toISOString(),
        participantCount: 1 // Creator is automatically a participant
      };

      // Save to storage
      addItem('events', event);
      
      // Create participant record for the creator
      if (user?.id) {
        const participant: EventParticipant = {
          id: generateId(),
          eventId: event.id,
          userId: user.id,
          createdAt: new Date().toISOString()
        };
        
        addItem('eventParticipants', participant);
        setMyParticipations([...myParticipations, event.id]);
      }

      // Update local state
      setEvents(prev => [...prev, event]);
      
      // Reset form
      setNewEvent({
        title: '',
        description: '',
        date: '',
        time: '',
        location: '',
        isOnline: false,
        link: '',
        category: '',
      });
      setSelectedFile(null);
      
      toast.success('Event created successfully!');
      setEventDialogOpen(false);
    } catch (error) {
      console.error('Error creating event:', error);
      toast.error('Failed to create event');
    }
  };

  const handleJoinEvent = (eventId: string) => {
    if (!user?.id) {
      toast.error('Please log in to join events');
      return;
    }

    try {
      // Check if already participating
      if (myParticipations.includes(eventId)) {
        // Leave the event
        const participants = getCollection<EventParticipant>('eventParticipants');
        const updatedParticipants = participants.filter(
          p => !(p.eventId === eventId && p.userId === user.id)
        );
        
        // Update storage
        localStorage.setItem('collegium_eventParticipants', JSON.stringify(updatedParticipants));
        
        // Update the event's participant count
        const updatedEvents = events.map(e => {
          if (e.id === eventId) {
            return { ...e, participantCount: Math.max(0, e.participantCount - 1) };
          }
          return e;
        });
        
        localStorage.setItem('collegium_events', JSON.stringify(updatedEvents));
        
        // Update state
        setMyParticipations(myParticipations.filter(id => id !== eventId));
        setEvents(updatedEvents);
        
        toast.success('You have left the event');
      } else {
        // Join the event
        const participant: EventParticipant = {
          id: generateId(),
          eventId,
          userId: user.id,
          createdAt: new Date().toISOString()
        };
        
        // Add to storage
        addItem('eventParticipants', participant);
        
        // Update the event's participant count
        const updatedEvents = events.map(e => {
          if (e.id === eventId) {
            return { ...e, participantCount: e.participantCount + 1 };
          }
          return e;
        });
        
        localStorage.setItem('collegium_events', JSON.stringify(updatedEvents));
        
        // Update state
        setMyParticipations([...myParticipations, eventId]);
        setEvents(updatedEvents);
        
        toast.success('You have joined the event!');
      }
    } catch (error) {
      console.error('Error updating event participation:', error);
      toast.error('Failed to update event participation');
    }
  };

  // Format date for display
  const formatEventDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    };
    
    return date.toLocaleDateString('en-US', options);
  };

  // Check if event is today
  const isToday = (dateString: string) => {
    const today = new Date();
    const eventDate = new Date(dateString);
    
    return (
      eventDate.getDate() === today.getDate() &&
      eventDate.getMonth() === today.getMonth() &&
      eventDate.getFullYear() === today.getFullYear()
    );
  };

  // Check if event is in the past
  const isPastEvent = (dateString: string) => {
    const now = new Date();
    const eventDate = new Date(dateString);
    return eventDate < now;
  };

  return (
    <Layout requiresAuth title="Campus Events">
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex flex-col md:flex-row gap-3 flex-1">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search events..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(category => (
                <SelectItem key={category} value={category}>{category}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            variant={showPast ? "default" : "outline"}
            onClick={() => setShowPast(!showPast)}
            className="md:w-auto w-full"
          >
            {showPast ? "Showing All Events" : "Hiding Past Events"}
          </Button>
        </div>

        <Dialog open={eventDialogOpen} onOpenChange={setEventDialogOpen}>
          <DialogTrigger asChild>
            <Button className="whitespace-nowrap">
              <Plus className="h-4 w-4 mr-2" /> Create Event
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>Create New Event</DialogTitle>
              <DialogDescription>
                Organize an event and invite your campus community
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleCreateEvent} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Event Title <span className="text-red-500">*</span></Label>
                <Input
                  id="title"
                  name="title"
                  value={newEvent.title}
                  onChange={handleFormChange}
                  placeholder="e.g., Study Group for Calculus Final"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category <span className="text-red-500">*</span></Label>
                <Select name="category" value={newEvent.category} onValueChange={(value) => {
                  setNewEvent(prev => ({ ...prev, category: value }));
                }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description <span className="text-red-500">*</span></Label>
                <Textarea
                  id="description"
                  name="description"
                  value={newEvent.description}
                  onChange={handleFormChange}
                  placeholder="Describe your event in detail..."
                  rows={3}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Date <span className="text-red-500">*</span></Label>
                  <Input
                    id="date"
                    name="date"
                    type="date"
                    value={newEvent.date}
                    onChange={handleFormChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="time">Time</Label>
                  <Input
                    id="time"
                    name="time"
                    type="time"
                    value={newEvent.time}
                    onChange={handleFormChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Event Type <span className="text-red-500">*</span></Label>
                <div className="flex space-x-4">
                  <Button
                    type="button"
                    variant={!newEvent.isOnline ? "default" : "outline"}
                    className="flex-1"
                    onClick={() => handleToggleChange(false)}
                  >
                    <MapPin className="h-4 w-4 mr-2" /> In Person
                  </Button>
                  <Button
                    type="button"
                    variant={newEvent.isOnline ? "default" : "outline"}
                    className="flex-1"
                    onClick={() => handleToggleChange(true)}
                  >
                    <Globe className="h-4 w-4 mr-2" /> Online
                  </Button>
                </div>
              </div>

              {!newEvent.isOnline ? (
                <div className="space-y-2">
                  <Label htmlFor="location">Location <span className="text-red-500">*</span></Label>
                  <Input
                    id="location"
                    name="location"
                    value={newEvent.location}
                    onChange={handleFormChange}
                    placeholder="e.g., Library Study Room 204"
                    required={!newEvent.isOnline}
                  />
                </div>
              ) : (
                <div className="space-y-2">
                  <Label htmlFor="link">Meeting Link <span className="text-red-500">*</span></Label>
                  <Input
                    id="link"
                    name="link"
                    value={newEvent.link}
                    onChange={handleFormChange}
                    placeholder="e.g., https://zoom.us/j/123456"
                    required={newEvent.isOnline}
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="image">Event Image</Label>
                <Input
                  id="image"
                  type="file"
                  className="cursor-pointer"
                  accept="image/*"
                  onChange={handleFileChange}
                />
                {selectedFile && (
                  <p className="text-xs text-green-600">
                    Selected: {selectedFile.name}
                  </p>
                )}
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setEventDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Create Event</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {filteredEvents.length === 0 ? (
        <div className="text-center py-12">
          <CalendarDays className="h-12 w-12 mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl font-medium text-gray-600 mb-2">No events found</h3>
          <p className="text-gray-500 max-w-md mx-auto">
            {searchQuery || selectedCategory !== 'all'
              ? "Try adjusting your search or category filter."
              : showPast
                ? "No events have been created yet. Be the first to create one!"
                : "No upcoming events. Be the first to create one!"}
          </p>
          {(searchQuery || selectedCategory !== 'all' || !showPast) && (
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setShowPast(true);
              }}
            >
              Clear filters
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredEvents.map(event => {
            const isParticipating = myParticipations.includes(event.id);
            const isOrganizer = event.organizerId === user?.id;
            const past = isPastEvent(event.date);

            return (
              <Card key={event.id} className={`card-hover overflow-hidden ${past ? 'opacity-75' : ''}`}>
                {event.imageUrl ? (
                  <div className="relative h-40 w-full overflow-hidden">
                    <img 
                      src={event.imageUrl} 
                      alt={event.title}
                      className="w-full h-full object-cover" 
                    />
                    {isToday(event.date) && (
                      <div className="absolute top-2 left-2">
                        <Badge className="bg-green-500">Today</Badge>
                      </div>
                    )}
                    {past && (
                      <div className="absolute top-2 right-2">
                        <Badge variant="outline" className="bg-gray-200 text-gray-700">Past Event</Badge>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="relative h-24 w-full bg-gradient-to-r from-blue-100 to-green-100 flex items-center justify-center">
                    <CalendarDays className="h-8 w-8 text-gray-400" />
                    {isToday(event.date) && (
                      <div className="absolute top-2 left-2">
                        <Badge className="bg-green-500">Today</Badge>
                      </div>
                    )}
                    {past && (
                      <div className="absolute top-2 right-2">
                        <Badge variant="outline" className="bg-gray-200 text-gray-700">Past Event</Badge>
                      </div>
                    )}
                  </div>
                )}
                
                <CardHeader className="p-4">
                  <div className="flex justify-between items-start">
                    <Badge variant="outline">{event.category}</Badge>
                    {isOrganizer && (
                      <Badge variant="outline" className="bg-blue-50 text-blue-700">Organizer</Badge>
                    )}
                  </div>
                  <CardTitle className="text-lg mt-2">{event.title}</CardTitle>
                </CardHeader>
                
                <CardContent className="p-4 pt-0">
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{event.description}</p>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center text-gray-600">
                      <Calendar className="h-4 w-4 mr-2" />
                      {formatEventDate(event.date)}
                    </div>
                    
                    <div className="flex items-center text-gray-600">
                      {event.isOnline ? (
                        <>
                          <Globe className="h-4 w-4 mr-2" />
                          Online Event
                        </>
                      ) : (
                        <>
                          <MapPin className="h-4 w-4 mr-2" />
                          {event.location}
                        </>
                      )}
                    </div>
                    
                    <div className="flex items-center text-gray-600">
                      <Users className="h-4 w-4 mr-2" />
                      {event.participantCount} {event.participantCount === 1 ? 'Participant' : 'Participants'}
                    </div>
                  </div>
                </CardContent>
                
                <CardFooter className="p-4 border-t flex justify-between">
                  {event.isOnline && event.link && (
                    <a 
                      href={event.link.startsWith('http') ? event.link : `https://${event.link}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline"
                    >
                      Join Link
                    </a>
                  )}
                  
                  {!past && (
                    <Button 
                      onClick={() => handleJoinEvent(event.id)} 
                      variant={isParticipating ? "outline" : "default"}
                      className="ml-auto"
                    >
                      {isParticipating ? (
                        <>
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Joined
                        </>
                      ) : (
                        "Join Event"
                      )}
                    </Button>
                  )}
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
    </Layout>
  );
};

export default EventsPage;
