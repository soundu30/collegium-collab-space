
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
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Download, 
  Search, 
  Plus, 
  Star, 
  File,
  FileType,
  Image,
  Archive,
  Table,
  FileText as FileTextIcon
} from 'lucide-react';
import { toast } from 'sonner';
import { mockResources, getUser } from '@/lib/data';
import { useAuth } from '@/contexts/AuthContext';

const Resources: React.FC = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [resourceDialogOpen, setResourceDialogOpen] = useState(false);
  const [newResource, setNewResource] = useState({
    title: '',
    description: '',
    category: '',
    tags: '',
  });
  
  // Sample resource categories
  const categories = [
    'Computer Science', 
    'Chemistry', 
    'Mathematics', 
    'Psychology', 
    'Biology', 
    'Engineering',
    'Literature',
    'Economics',
    'Physics'
  ];
  
  // Filter resources based on search query and selected category
  const filteredResources = mockResources.filter(resource => {
    const matchesSearch = 
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || resource.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });
  
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewResource(prev => ({ ...prev, [name]: value }));
  };
  
  const handleCreateResource = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newResource.title || !newResource.description || !newResource.category) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    // In a real app, this would send data to an API and handle file upload
    toast.success('Resource uploaded successfully!');
    setResourceDialogOpen(false);
    setNewResource({
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
  
  // Get file icon based on file type
  const getFileIcon = (fileType: string) => {
    switch (fileType.toLowerCase()) {
      case 'pdf':
        return <FileType className="h-8 w-8 text-red-500" />;
      case 'jpg':
      case 'png':
      case 'jpeg':
      case 'gif':
        return <Image className="h-8 w-8 text-blue-500" />;
      case 'zip':
      case 'rar':
        return <Archive className="h-8 w-8 text-yellow-500" />;
      case 'xlsx':
      case 'csv':
        return <Table className="h-8 w-8 text-green-500" />;
      case 'doc':
      case 'docx':
        return <FileTextIcon className="h-8 w-8 text-blue-600" />;
      default:
        return <File className="h-8 w-8 text-gray-500" />;
    }
  };
  
  // Render star rating
  const renderRating = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    return (
      <div className="flex">
        {Array(fullStars).fill(0).map((_, i) => (
          <Star key={`full-${i}`} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
        ))}
        {hasHalfStar && (
          <Star className="h-4 w-4 text-yellow-400" />
        )}
        {Array(emptyStars).fill(0).map((_, i) => (
          <Star key={`empty-${i}`} className="h-4 w-4 text-gray-300" />
        ))}
      </div>
    );
  };
  
  return (
    <Layout requiresAuth title="Academic Resources">
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex flex-col md:flex-row gap-3 flex-1">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input 
              placeholder="Search resources..." 
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
        
        <Dialog open={resourceDialogOpen} onOpenChange={setResourceDialogOpen}>
          <DialogTrigger asChild>
            <Button className="whitespace-nowrap">
              <Plus className="h-4 w-4 mr-2" /> Upload Resource
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>Upload Academic Resource</DialogTitle>
              <DialogDescription>
                Share study materials, notes, or other resources with your peers
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleCreateResource} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Resource Title <span className="text-red-500">*</span></Label>
                <Input
                  id="title"
                  name="title"
                  value={newResource.title}
                  onChange={handleFormChange}
                  placeholder="e.g., Calculus Formulas Cheat Sheet"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category">Category <span className="text-red-500">*</span></Label>
                <Select name="category" value={newResource.category} onValueChange={(value) => {
                  setNewResource(prev => ({ ...prev, category: value }));
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
                  value={newResource.description}
                  onChange={handleFormChange}
                  placeholder="Describe the resource in detail..."
                  rows={3}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="file">File <span className="text-red-500">*</span></Label>
                <Input
                  id="file"
                  type="file"
                  className="cursor-pointer"
                />
                <p className="text-xs text-gray-500">
                  Accepted formats: PDF, DOCX, XLSX, PPT, ZIP (Max 50MB)
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="tags">Tags (comma-separated)</Label>
                <Input
                  id="tags"
                  name="tags"
                  value={newResource.tags}
                  onChange={handleFormChange}
                  placeholder="e.g., calculus, math, cheat sheet"
                />
              </div>
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setResourceDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Upload Resource</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      
      {filteredResources.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl font-medium text-gray-600 mb-2">No resources found</h3>
          <p className="text-gray-500 max-w-md mx-auto">
            {searchQuery
              ? "Try adjusting your search or category filter to find what you're looking for."
              : "Be the first to upload resources in this category!"}
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredResources.map(resource => {
            const uploader = getUser(resource.uploadedBy);
            
            return (
              <Card key={resource.id} className="card-hover overflow-hidden">
                <CardHeader className="p-4 flex-row items-center space-x-4">
                  <div className="flex-shrink-0">
                    {getFileIcon(resource.fileType)}
                  </div>
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{resource.title}</CardTitle>
                    <div className="flex items-center text-sm">
                      <Badge variant="outline">{resource.fileType}</Badge>
                      <span className="mx-2 text-gray-400">•</span>
                      <span className="text-gray-500">{resource.category}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{resource.description}</p>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {resource.tags.map((tag, i) => (
                      <span 
                        key={i} 
                        className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <div className="mr-2">{renderRating(resource.rating)}</div>
                    <span className="text-xs">({resource.rating.toFixed(1)})</span>
                  </div>
                </CardContent>
                <CardFooter className="p-4 flex justify-between items-center border-t">
                  <div className="text-xs text-gray-500">
                    <p>Uploaded by {uploader?.name || 'Unknown'}</p>
                    <p>{formatDate(resource.uploadedAt)}</p>
                  </div>
                  <Button 
                    size="sm" 
                    className="flex items-center"
                    onClick={() => toast.success('Resource downloaded!')}
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
    </Layout>
  );
};

export default Resources;
