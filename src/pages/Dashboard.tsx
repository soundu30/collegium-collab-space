
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, MessageSquare, Users, FileText, BookOpen, ArrowRight } from 'lucide-react';
import { mockEvents, mockForumTopics, mockResources } from '@/lib/data';

const Dashboard: React.FC = () => {
  const { user, profile } = useAuth();
  
  // Get upcoming events (sorted by date)
  const upcomingEvents = [...mockEvents]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3);
  
  // Get recent forum topics
  const recentTopics = [...mockForumTopics]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3);
  
  // Get popular resources
  const popularResources = [...mockResources]
    .sort((a, b) => b.downloadCount - a.downloadCount)
    .slice(0, 3);
  
  // Format date
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  return (
    <Layout requiresAuth title="Dashboard">
      {/* Welcome Section */}
      <div className="mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Welcome back, {profile?.name?.split(' ')[0] || 'Student'}!
          </h2>
          <p className="text-gray-600">
            Here's what's happening in your academic community today.
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Upcoming Events */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-collegium-primary" />
              Upcoming Events
            </CardTitle>
            <CardDescription>
              Mark your calendar for these events
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingEvents.length > 0 ? (
              upcomingEvents.map((event) => (
                <div key={event.id} className="pb-3 border-b last:border-0 last:pb-0">
                  <h4 className="font-medium text-gray-900">{event.title}</h4>
                  <div className="flex items-center text-sm text-gray-500 mt-1">
                    <Clock className="h-3 w-3 mr-1" />
                    {formatDate(event.date)}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    {event.isOnline ? 'Online Event' : event.location}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-gray-500">
                No upcoming events scheduled
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button variant="ghost" size="sm" asChild className="w-full">
              <Link to="/events" className="flex justify-center items-center">
                View All Events
                <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
        
        {/* Recent Forum Topics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BookOpen className="h-5 w-5 mr-2 text-collegium-primary" />
              Recent Discussions
            </CardTitle>
            <CardDescription>
              Join the conversation on these topics
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentTopics.map((topic) => (
              <div key={topic.id} className="pb-3 border-b last:border-0 last:pb-0">
                <Link to={`/forums/${topic.id}`} className="font-medium text-gray-900 hover:text-collegium-primary">
                  {topic.title}
                </Link>
                <div className="flex items-center justify-between text-sm text-gray-500 mt-1">
                  <span className="inline-flex items-center">
                    <MessageSquare className="h-3 w-3 mr-1" />
                    {topic.commentsCount} comments
                  </span>
                  <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-xs">
                    {topic.category}
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
          <CardFooter>
            <Button variant="ghost" size="sm" asChild className="w-full">
              <Link to="/forums" className="flex justify-center items-center">
                View All Discussions
                <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
        
        {/* Popular Resources */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="h-5 w-5 mr-2 text-collegium-primary" />
              Popular Resources
            </CardTitle>
            <CardDescription>
              Top study materials and notes
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {popularResources.map((resource) => (
              <div key={resource.id} className="pb-3 border-b last:border-0 last:pb-0">
                <h4 className="font-medium text-gray-900">{resource.title}</h4>
                <div className="flex justify-between text-sm mt-1">
                  <span className="text-gray-500">
                    {resource.fileType} • {resource.downloadCount} downloads
                  </span>
                  <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-xs">
                    {resource.category}
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
          <CardFooter>
            <Button variant="ghost" size="sm" asChild className="w-full">
              <Link to="/resources" className="flex justify-center items-center">
                View All Resources
                <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
        
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common tasks and shortcuts
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link to="/forums">
                <BookOpen className="mr-2 h-4 w-4" />
                Start a New Discussion
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link to="/resources">
                <FileText className="mr-2 h-4 w-4" />
                Upload Study Material
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link to="/events">
                <Calendar className="mr-2 h-4 w-4" />
                Create an Event
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link to="/messages">
                <MessageSquare className="mr-2 h-4 w-4" />
                Send a Message
              </Link>
            </Button>
          </CardContent>
        </Card>
        
        {/* My Profile */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2 text-collegium-primary" />
              My Profile
            </CardTitle>
            <CardDescription>
              Your academic information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <h4 className="text-sm font-medium text-gray-500">College/University</h4>
                <p className="text-gray-900">{profile?.college || 'Not specified'}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Major</h4>
                <p className="text-gray-900">{profile?.major || 'Not specified'}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Interests</h4>
                <div className="flex flex-wrap gap-1 mt-1">
                  {profile?.interests && profile.interests.length > 0 ? (
                    profile.interests.map((interest, index) => (
                      <span key={index} className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">
                        {interest}
                      </span>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm">No interests specified</p>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="ghost" size="sm" asChild className="w-full">
              <Link to="/profile" className="flex justify-center items-center">
                Edit Profile
                <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </Layout>
  );
};

export default Dashboard;
