
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { 
  Card, 
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { MessageSquare, ThumbsUp, ArrowLeft, Eye } from 'lucide-react';
import { toast } from 'sonner';
import { mockForumTopics, getForumTopic, getForumComments, getUser } from '@/lib/data';
import { useAuth } from '@/contexts/AuthContext';

const ForumTopic: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  
  // Get topic and comments
  const topic = getForumTopic(id || '');
  const comments = id ? getForumComments(id) : [];
  
  if (!topic) {
    return (
      <Layout requiresAuth>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-2">Topic Not Found</h2>
          <p className="text-gray-600 mb-6">The topic you're looking for doesn't exist or has been removed.</p>
          <Link to="/forums">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Forums
            </Button>
          </Link>
        </div>
      </Layout>
    );
  }
  
  const topicAuthor = getUser(topic.createdBy);
  
  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newComment.trim()) {
      toast.error('Please enter a comment');
      return;
    }
    
    setSubmitting(true);
    
    // In a real app, this would send data to an API
    setTimeout(() => {
      toast.success('Comment posted successfully!');
      setNewComment('');
      setSubmitting(false);
    }, 800);
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };
  
  return (
    <Layout requiresAuth>
      <div className="mb-6">
        <Link to="/forums" className="inline-flex items-center text-gray-500 hover:text-collegium-primary mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Forums
        </Link>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">{topic.title}</h1>
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm">
                  {topic.category}
                </span>
                {topic.tags.map((tag, i) => (
                  <span 
                    key={i} 
                    className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="flex items-center gap-x-4 text-sm text-gray-500">
              <div className="flex items-center">
                <MessageSquare className="h-4 w-4 mr-1" />
                {topic.commentsCount}
              </div>
              <div className="flex items-center">
                <Eye className="h-4 w-4 mr-1" />
                {topic.viewsCount}
              </div>
            </div>
          </div>
          
          <div className="mb-6">
            <p className="text-gray-700 whitespace-pre-line">{topic.description}</p>
          </div>
          
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center">
              <Avatar className="h-6 w-6 mr-2">
                <AvatarImage src={topicAuthor?.avatar} alt={topicAuthor?.name} />
                <AvatarFallback>{topicAuthor?.name ? getInitials(topicAuthor.name) : 'U'}</AvatarFallback>
              </Avatar>
              <span className="font-medium">{topicAuthor?.name || 'Unknown'}</span>
              <span className="mx-2">•</span>
              <span>{formatDate(topic.createdAt)}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">Comments ({comments.length})</h2>
        
        {comments.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <MessageSquare className="h-12 w-12 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-600 mb-1">No comments yet</h3>
            <p className="text-gray-500">Be the first to share your thoughts!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {comments.map((comment) => {
              const commentAuthor = getUser(comment.createdBy);
              
              return (
                <Card key={comment.id}>
                  <CardHeader className="p-4 pb-0 flex items-start space-x-4">
                    <Avatar>
                      <AvatarImage src={commentAuthor?.avatar} alt={commentAuthor?.name} />
                      <AvatarFallback>
                        {commentAuthor?.name ? getInitials(commentAuthor.name) : 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                      <div className="font-medium">{commentAuthor?.name || 'Unknown'}</div>
                      <div className="text-xs text-gray-500">{formatDate(comment.createdAt)}</div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 pt-2">
                    <p className="text-gray-700 whitespace-pre-line">{comment.content}</p>
                  </CardContent>
                  <CardFooter className="p-4 pt-0 flex justify-end">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-gray-500 hover:text-collegium-primary"
                      onClick={() => toast.success('Comment liked!')}
                    >
                      <ThumbsUp className="h-4 w-4 mr-2" />
                      Like ({comment.likeCount})
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )}
      </div>
      
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="font-medium mb-3">Add Your Comment</h3>
        <form onSubmit={handleSubmitComment}>
          <Textarea
            placeholder="Share your thoughts..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            rows={4}
            className="mb-4"
          />
          <Button type="submit" disabled={submitting || !newComment.trim()}>
            {submitting ? 'Posting...' : 'Post Comment'}
          </Button>
        </form>
      </div>
    </Layout>
  );
};

export default ForumTopic;
