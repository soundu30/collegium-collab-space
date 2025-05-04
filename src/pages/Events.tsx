
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Card, 
  CardContent, 
  CardFooter,
  CardHeader, 
  CardTitle 
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
import { Calendar as CalendarIcon, Plus, MapPin, Globe, Users, ExternalLink, Calendar } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { mockEvents, getUser } from '@/lib/data';
import { useAuth } from '@/contexts/AuthContext';

const Events: React.FC = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [eventDialogOpen, setEventDialogOpen] = useState(false);
  const [date, setDate] = useState<Date>();
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    location: '',
    link: '',
    category: '',
    isOnline: false,
  });
  
  // Sample event categories
  const categories = ['Academic', 'Career', 'Social', 'Study', 'Workshop', 'Conference', 'Other'];
  
  // Filter events based on search query and selected category
  const filteredEvents = mockEvents.filter(event => {
    const matchesSearch = 
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || event.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });
  
  // Sort events by date (upcoming first)
  const sortedEvents = [...filteredEvents].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewEvent(prev => ({ ...prev, [name]: value }));
  };
  
  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newEvent.title || !newEvent.description || !date || !newEvent.category) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    if (newEvent.isOnline && !newEvent.link) {
      toast.error('Please provide a link for the online event');
      return;
    }
    
    // In a real app, this would send data to an API
    toast.success('Event created successfully!');
    setEventDialogOpen(false);
    setNewEvent({
      title: '',
      description: '',
      location: '',
      link: '',
      category: '',
      isOnline: false,
    });
    setDate(undefined);
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, 'MMM d, yyyy') + ' at ' + format(date, 'h:mm a');
  };
  
  const isUpcoming = (dateString: string) => {
    const eventDate = new Date(dateString);
    const now = new Date();
    return eventDate > now;
  };
  
  return (
    <Layout requiresAuth title="Event Calendar">
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex flex-col md:flex-row gap-3 flex-1">
          <div className="relative flex-1">
            <Input 
              placeholder="Search events..." 
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
                Schedule an event for your college community
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
                  placeholder="e.g., Study Group for Calculus II"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category">Event Category <span className="text-red-500">*</span></Label>
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
                <Label>Event Date & Time <span className="text-red-500">*</span></Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP HH:mm") : <span>Select date and time</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                    />
                    <div className="p-3 border-t">
                      <Label htmlFor="time">Time</Label>
                      <Input
                        id="time"
                        type="time"
                        className="mt-1"
                        onChange={(e) => {
                          if (date && e.target.value) {
                            const [hours, minutes] = e.target.value.split(':');
                            const newDate = new Date(date);
                            newDate.setHours(parseInt(hours, 10));
                            newDate.setMinutes(parseInt(minutes, 10));
                            setDate(newDate);
                          }
                        }}
                      />
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="isOnline" 
                    checked={newEvent.isOnline}
                    onCheckedChange={(checked) => {
                      setNewEvent(prev => ({ ...prev, isOnline: checked === true }));
                    }}
                  />
                  <label
                    htmlFor="isOnline"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    This is an online event
                  </label>
                </div>
              </div>
              
              {newEvent.isOnline ? (
                <div className="space-y-2">
                  <Label htmlFor="link">Meeting Link <span className="text-red-500">*</span></Label>
                  <Input
                    id="link"
                    name="link"
                    type="url"
                    value={newEvent.link}
                    onChange={handleFormChange}
                    placeholder="https://meeting-platform.com/your-event"
                  />
                </div>
              ) : (
                <div className="space-y-2">
                  <Label htmlFor="location">Location <span className="text-red-500">*</span></Label>
                  <Input
                    id="location"
                    name="location"
                    value={newEvent.location}
                    onChange={handleFormChange}
                    placeholder="e.g., Library Study Room 305"
                  />
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="description">Description <span className="text-red-500">*</span></Label>
                <Textarea
                  id="description"
                  name="description"
                  value={newEvent.description}
                  onChange={handleFormChange}
                  placeholder="Describe the event in detail..."
                  rows={3}
                  required
                />
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
      
      {sortedEvents.length === 0 ? (
        <div className="text-center py-12">
          <Calendar className="h-12 w-12 mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl font-medium text-gray-600 mb-2">No events found</h3>
          <p className="text-gray-500 max-w-md mx-auto">
            {searchQuery
              ? "Try adjusting your search or category filter to find what you're looking for."
              : "Be the first to create an event!"}
          </p>
          {searchQuery && (
            <Button 
              variant="outline"
              className="mt-4"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
            >
              Clear filters
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {/* Upcoming Events Section */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Upcoming Events</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sortedEvents.filter(event => isUpcoming(event.date)).map(event => {
                const organizer = getUser(event.organizerId);
                
                return (
                  <Card key={event.id} className="card-hover overflow-hidden">
                    <CardHeader className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                          {event.category}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 px-2 text-xs"
                          onClick={() => toast.success('You are now participating in this event!')}
                        >
                          Join
                        </Button>
                      </div>
                      <CardTitle className="text-lg">{event.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{event.description}</p>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center">
                          <CalendarIcon className="h-4 w-4 mr-2 text-gray-500" />
                          <span>{formatDate(event.date)}</span>
                        </div>
                        <div className="flex items-center">
                          {event.isOnline ? (
                            <>
                              <Globe className="h-4 w-4 mr-2 text-gray-500" />
                              <span>Online Event</span>
                            </>
                          ) : (
                            <>
                              <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                              <span>{event.location}</span>
                            </>
                          )}
                        </div>
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-2 text-gray-500" />
                          <span>{event.participants.length} participants</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="p-4 pt-0 flex justify-between items-center border-t mt-4">
                      <div className="text-xs text-gray-500">
                        <p>Organized by {organizer?.name || 'Unknown'}</p>
                      </div>
                      {event.isOnline && event.link && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="flex items-center"
                          asChild
                        >
                          <a href={event.link} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4 mr-1" />
                            Join Meeting
                          </a>
                        </Button>
                      )}
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
            
            {sortedEvents.filter(event => isUpcoming(event.date)).length === 0 && (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <p className="text-gray-500">No upcoming events scheduled</p>
              </div>
            )}
          </div>
          
          {/* Past Events Section */}
          {sortedEvents.filter(event => !isUpcoming(event.date)).length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold">Past Events</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {sortedEvents.filter(event => !isUpcoming(event.date)).map(event => {
                  const organizer = getUser(event.organizerId);
                  
                  return (
                    <Card key={event.id} className="bg-gray-50 overflow-hidden opacity-80">
                      <CardHeader className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="bg-gray-200 text-gray-700 text-xs font-medium px-2.5 py-0.5 rounded">
                            {event.category}
                          </span>
                          <span className="text-xs text-gray-500">Completed</span>
                        </div>
                        <CardTitle className="text-lg">{event.title}</CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{event.description}</p>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center">
                            <CalendarIcon className="h-4 w-4 mr-2 text-gray-500" />
                            <span>{formatDate(event.date)}</span>
                          </div>
                          <div className="flex items-center">
                            {event.isOnline ? (
                              <>
                                <Globe className="h-4 w-4 mr-2 text-gray-500" />
                                <span>Online Event</span>
                              </>
                            ) : (
                              <>
                                <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                                <span>{event.location}</span>
                              </>
                            )}
                          </div>
                          <div className="flex items-center">
                            <Users className="h-4 w-4 mr-2 text-gray-500" />
                            <span>{event.participants.length} participants</span>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="p-4 pt-0 flex justify-between items-center border-t mt-4">
                        <div className="text-xs text-gray-500">
                          <p>Organized by {organizer?.name || 'Unknown'}</p>
                        </div>
                      </CardFooter>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </Layout>
  );
};

export default Events;
