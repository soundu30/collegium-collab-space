
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

const Profile: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    college: '',
    major: '',
    interests: '',
    bio: '',
  });
  
  const [isEditing, setIsEditing] = useState(false);
  
  // Set initial data from user context
  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        college: user.college || '',
        major: user.major || '',
        interests: user.interests ? user.interests.join(', ') : '',
        bio: '',
      });
    }
  }, [user]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real app, this would send data to an API
    toast.success('Profile updated successfully!');
    setIsEditing(false);
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
    <Layout requiresAuth title="Profile">
      <Tabs defaultValue="profile">
        <TabsList className="mb-6">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="account">Account Settings</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <Avatar className="h-24 w-24 mb-4">
                  <AvatarImage src={user?.avatar} alt={user?.name} />
                  <AvatarFallback className="text-xl">
                    {user?.name ? getInitials(user.name) : 'U'}
                  </AvatarFallback>
                </Avatar>
                
                <div className="text-center space-y-1 mb-4">
                  <h3 className="text-xl font-bold">{user?.name}</h3>
                  <p className="text-gray-500">{user?.email}</p>
                </div>
                
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => toast.success('Profile picture update feature coming soon!')}
                >
                  Change Profile Picture
                </Button>
              </CardContent>
            </Card>
            
            <Card className="col-span-1 md:col-span-2">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Academic Profile</CardTitle>
                  <CardDescription>
                    Your academic information visible to other students
                  </CardDescription>
                </div>
                {!isEditing && (
                  <Button variant="outline" onClick={() => setIsEditing(true)}>
                    Edit Profile
                  </Button>
                )}
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        name="name"
                        value={profileData.name}
                        onChange={handleChange}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={profileData.email}
                        onChange={handleChange}
                        disabled
                      />
                      <p className="text-xs text-gray-500">
                        Email cannot be changed for security reasons
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="college">College/University</Label>
                      <Input
                        id="college"
                        name="college"
                        value={profileData.college}
                        onChange={handleChange}
                        placeholder="e.g., University of California, Berkeley"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="major">Major/Field of Study</Label>
                      <Input
                        id="major"
                        name="major"
                        value={profileData.major}
                        onChange={handleChange}
                        placeholder="e.g., Computer Science"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="interests">Academic Interests (comma separated)</Label>
                      <Input
                        id="interests"
                        name="interests"
                        value={profileData.interests}
                        onChange={handleChange}
                        placeholder="e.g., AI, Web Development, Data Science"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        name="bio"
                        value={profileData.bio}
                        onChange={handleChange}
                        placeholder="Tell other students about yourself"
                        rows={4}
                      />
                    </div>
                    
                    <div className="flex justify-end space-x-2">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setIsEditing(false)}
                      >
                        Cancel
                      </Button>
                      <Button type="submit">Save Changes</Button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">College/University</h3>
                      <p className="mt-1">{profileData.college || 'Not specified'}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Major/Field of Study</h3>
                      <p className="mt-1">{profileData.major || 'Not specified'}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Academic Interests</h3>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {profileData.interests ? (
                          profileData.interests.split(',').map((interest, i) => (
                            <span 
                              key={i} 
                              className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm"
                            >
                              {interest.trim()}
                            </span>
                          ))
                        ) : (
                          <p className="text-gray-500">No interests specified</p>
                        )}
                      </div>
                    </div>
                    
                    {profileData.bio && (
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Bio</h3>
                        <p className="mt-1 whitespace-pre-line">{profileData.bio}</p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card className="col-span-1 md:col-span-3">
              <CardHeader>
                <CardTitle>Profile Privacy</CardTitle>
                <CardDescription>
                  Control what information is visible to other students
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Show Email Address</h3>
                      <p className="text-sm text-gray-500">Allow other students to see your email</p>
                    </div>
                    <div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toast.success('Privacy settings coming soon!')}
                      >
                        Private
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Activity Status</h3>
                      <p className="text-sm text-gray-500">Show when you're online</p>
                    </div>
                    <div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toast.success('Privacy settings coming soon!')}
                      >
                        Visible
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>
                Manage your account preferences and security
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-4">Password</h3>
                <Button 
                  variant="outline"
                  onClick={() => toast.success('Password change feature coming soon!')}
                >
                  Change Password
                </Button>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-4">Connected Accounts</h3>
                <div className="flex flex-col space-y-2">
                  <Button 
                    variant="outline"
                    onClick={() => toast.success('Google integration coming soon!')}
                  >
                    Connect Google Account
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => toast.success('Microsoft integration coming soon!')}
                  >
                    Connect Microsoft Account
                  </Button>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-4">Account Management</h3>
                <Button 
                  variant="destructive"
                  onClick={() => toast.error('Account deletion is disabled in this demo')}
                >
                  Delete Account
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="preferences">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Control how and when you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-4">Email Notifications</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">New Messages</h4>
                      <p className="text-sm text-gray-500">Get notified when you receive a message</p>
                    </div>
                    <div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toast.success('Notification settings coming soon!')}
                      >
                        Enabled
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Forum Replies</h4>
                      <p className="text-sm text-gray-500">Get notified when someone replies to your forum post</p>
                    </div>
                    <div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toast.success('Notification settings coming soon!')}
                      >
                        Enabled
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Event Reminders</h4>
                      <p className="text-sm text-gray-500">Get reminders about upcoming events</p>
                    </div>
                    <div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toast.success('Notification settings coming soon!')}
                      >
                        Enabled
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Resource Updates</h4>
                      <p className="text-sm text-gray-500">Get notified when resources you follow are updated</p>
                    </div>
                    <div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toast.success('Notification settings coming soon!')}
                      >
                        Enabled
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-4">Website Preferences</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Theme</h4>
                      <p className="text-sm text-gray-500">Choose your preferred theme</p>
                    </div>
                    <div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toast.success('Theme settings coming soon!')}
                      >
                        Light
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Language</h4>
                      <p className="text-sm text-gray-500">Choose your preferred language</p>
                    </div>
                    <div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toast.success('Language settings coming soon!')}
                      >
                        English
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </Layout>
  );
};

export default Profile;
