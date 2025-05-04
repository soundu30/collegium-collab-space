
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
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
import { MessageSquare, Eye, BookOpen, Search, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { mockForumTopics, getUser } from '@/lib/data';
import { useAuth } from '@/contexts/AuthContext';

const Forums: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [topicDialogOpen, setTopicDialogOpen] = useState(false);
  const [newTopic, setNewTopic] = useState({
    title: '',
    description: '',
    category: '',
    tags: '',
  });
  
  // All forum categories
  const categories = ['Academic', 'Study Groups', 'Technology', 'Campus Life', 'Career', 'General'];
  
  // Filter topics based on search query and selected category
  const filteredTopics = mockForumTopics.filter(topic => {
    const matchesSearch = 
      topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      topic.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      topic.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || topic.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });
  
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewTopic(prev => ({ ...prev, [name]: value }));
  };
  
  const handleCreateTopic = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newTopic.title || !newTopic.description || !newTopic.category) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    // In a real app, this would send data to an API
    toast.success('Topic created successfully!');
    setTopicDialogOpen(false);
    setNewTopic({
      title: '',
      description: '',
      category: '',
      tags: '',
    });
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };
  
  return (
    <Layout requiresAuth title="Discussion Forums">
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex flex-col md:flex-row gap-3 flex-1">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input 
              placeholder="Search topics..." 
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
        </div>
        
        <Dialog open={topicDialogOpen} onOpenChange={setTopicDialogOpen}>
          <DialogTrigger asChild>
            <Button className="whitespace-nowrap">
              <Plus className="h-4 w-4 mr-2" /> New Topic
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>Create New Topic</DialogTitle>
              <DialogDescription>
                Start a new discussion with the community
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleCreateTopic} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Topic Title <span className="text-red-500">*</span></Label>
                <Input
                  id="title"
                  name="title"
                  value={newTopic.title}
                  onChange={handleFormChange}
                  placeholder="e.g., Tips for Freshman Year"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category">Category <span className="text-red-500">*</span></Label>
                <Select name="category" value={newTopic.category} onValueChange={(value) => {
                  setNewTopic(prev => ({ ...prev, category: value }));
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
                  value={newTopic.description}
                  onChange={handleFormChange}
                  placeholder="Describe your topic in detail..."
                  rows={5}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="tags">Tags (comma-separated)</Label>
                <Input
                  id="tags"
                  name="tags"
                  value={newTopic.tags}
                  onChange={handleFormChange}
                  placeholder="e.g., advice, study tips, freshman"
                />
              </div>
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setTopicDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Create Topic</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      
      {filteredTopics.length === 0 ? (
        <div className="text-center py-12">
          <BookOpen className="h-12 w-12 mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl font-medium text-gray-600 mb-2">No topics found</h3>
          <p className="text-gray-500 max-w-md mx-auto">
            {searchQuery
              ? "Try adjusting your search or category filter to find what you're looking for."
              : "Be the first to start a discussion in this category!"}
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
        <div className="space-y-4">
          {filteredTopics.map(topic => {
            const user = getUser(topic.createdBy);
            
            return (
              <Card key={topic.id} className="card-hover overflow-hidden">
                <CardHeader className="p-4 pb-0">
                  <CardTitle className="text-lg">
                    <Link to={`/forums/${topic.id}`} className="hover:text-collegium-primary transition-colors">
                      {topic.title}
                    </Link>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-2">
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{topic.description}</p>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {topic.tags.map((tag, i) => (
                      <span 
                        key={i} 
                        className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="p-4 pt-0 flex justify-between border-t text-sm">
                  <div className="flex items-center gap-x-4">
                    <div className="flex items-center text-gray-500">
                      <MessageSquare className="h-4 w-4 mr-1" />
                      {topic.commentsCount}
                    </div>
                    <div className="flex items-center text-gray-500">
                      <Eye className="h-4 w-4 mr-1" />
                      {topic.viewsCount}
                    </div>
                  </div>
                  
                  <div className="flex flex-col md:flex-row md:items-center gap-x-2 text-gray-500 text-xs">
                    <span>
                      Posted by <span className="font-medium">{user?.name || 'Unknown'}</span>
                    </span>
                    <span className="hidden md:inline">•</span>
                    <span>{formatDate(topic.createdAt)}</span>
                    <span className="hidden md:inline">•</span>
                    <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-xs">
                      {topic.category}
                    </span>
                  </div>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
    </Layout>
  );
};

export default Forums;
