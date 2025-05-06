
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Send, Search, MessageSquare as MessageIcon } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { mockUsers, getUser } from '@/lib/data';
import { getCollection, addItem, generateId } from '@/utils/localStorageDB';

interface User {
  id: string;
  name: string;
  email: string;
  college: string;
  major: string;
  avatar?: string;
}

interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  sentAt: string;
  isRead: boolean;
}

interface Conversation {
  id: string;
  participants: string[];
  lastMessage: string;
  lastMessageAt: string;
  unreadCount: number;
}

const MessagesPage: React.FC = () => {
  const { user, profile } = useAuth();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  
  // Load conversations and messages on component mount
  useEffect(() => {
    if (user?.id) {
      // Load conversations
      const storedConversations = getCollection<Conversation>('conversations');
      const userConversations = storedConversations.filter(
        conv => conv.participants.includes(user.id)
      );
      setConversations(userConversations);
      
      // Load messages for selected user if any
      if (selectedUser) {
        loadMessages(selectedUser.id);
      }
    }
  }, [user?.id, selectedUser?.id]);
  
  // Load messages between current user and selected user
  const loadMessages = (userId: string) => {
    if (!user?.id) return;
    
    const allMessages = getCollection<Message>('messages');
    const chatMessages = allMessages.filter(
      msg => 
        (msg.senderId === user.id && msg.receiverId === userId) || 
        (msg.senderId === userId && msg.receiverId === user.id)
    );
    
    // Sort by sent time
    chatMessages.sort((a, b) => 
      new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime()
    );
    
    setMessages(chatMessages);
    
    // Mark messages as read
    const updatedMessages = allMessages.map(msg => 
      msg.senderId === userId && msg.receiverId === user.id && !msg.isRead
        ? { ...msg, isRead: true }
        : msg
    );
    
    // Update unread count in conversations
    const updatedConversations = conversations.map(conv => 
      conv.participants.includes(userId)
        ? { ...conv, unreadCount: 0 }
        : conv
    );
    
    // Save back to localStorage
    localStorage.setItem('collegium_messages', JSON.stringify(updatedMessages));
    localStorage.setItem('collegium_conversations', JSON.stringify(updatedConversations));
    
    setConversations(updatedConversations);
  };
  
  // Filter users by search query
  const filteredUsers = mockUsers.filter(u => 
    u.id !== user?.id && 
    (u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
     u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
     u.college.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !selectedUser || !user?.id) {
      return;
    }
    
    try {
      // Create new message
      const newMsg: Message = {
        id: generateId(),
        senderId: user.id,
        receiverId: selectedUser.id,
        content: newMessage,
        sentAt: new Date().toISOString(),
        isRead: false
      };
      
      // Add message to storage
      const allMessages = getCollection<Message>('messages');
      const updatedMessages = [...allMessages, newMsg];
      localStorage.setItem('collegium_messages', JSON.stringify(updatedMessages));
      
      // Update local state
      setMessages([...messages, newMsg]);
      
      // Update or create conversation
      const allConversations = getCollection<Conversation>('conversations');
      
      // Check if conversation exists
      const existingConvIndex = allConversations.findIndex(
        c => c.participants.includes(user.id) && c.participants.includes(selectedUser.id)
      );
      
      if (existingConvIndex >= 0) {
        // Update existing conversation
        const updatedConversations = [...allConversations];
        updatedConversations[existingConvIndex] = {
          ...updatedConversations[existingConvIndex],
          lastMessage: newMessage,
          lastMessageAt: new Date().toISOString()
        };
        
        localStorage.setItem('collegium_conversations', JSON.stringify(updatedConversations));
        
        // Update state
        const userConversations = updatedConversations.filter(
          conv => conv.participants.includes(user.id)
        );
        setConversations(userConversations);
      } else {
        // Create new conversation
        const newConv: Conversation = {
          id: generateId(),
          participants: [user.id, selectedUser.id],
          lastMessage: newMessage,
          lastMessageAt: new Date().toISOString(),
          unreadCount: 0
        };
        
        const updatedConversations = [...allConversations, newConv];
        localStorage.setItem('collegium_conversations', JSON.stringify(updatedConversations));
        
        // Update state
        const userConversations = updatedConversations.filter(
          conv => conv.participants.includes(user.id)
        );
        setConversations(userConversations);
      }
      
      // Clear input
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    }
  };
  
  // Format date
  const formatMessageTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };
  
  const formatConversationTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 3600 * 24));
    
    if (diffInDays === 0) {
      return date.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      });
    } else if (diffInDays === 1) {
      return 'Yesterday';
    } else if (diffInDays < 7) {
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short',
        day: 'numeric'
      });
    }
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
    <Layout requiresAuth title="Messages">
      <div className="flex h-[calc(80vh-2rem)] overflow-hidden rounded-lg border">
        {/* Conversations sidebar */}
        <div className="w-full max-w-xs border-r bg-white flex flex-col">
          <div className="p-3 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input 
                placeholder="Search users..." 
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          <ScrollArea className="flex-1">
            {searchQuery ? (
              // Search results
              <div className="py-2">
                <div className="px-3 py-1.5 text-sm font-medium text-gray-500">
                  Search Results
                </div>
                {filteredUsers.length === 0 ? (
                  <div className="px-3 py-2 text-center text-sm text-gray-500">
                    No users found
                  </div>
                ) : (
                  filteredUsers.map(user => (
                    <button
                      key={user.id}
                      className="w-full px-3 py-3 flex items-center space-x-3 hover:bg-gray-50 transition-colors"
                      onClick={() => {
                        setSelectedUser(user);
                        setSearchQuery('');
                        loadMessages(user.id);
                      }}
                    >
                      <Avatar>
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                      </Avatar>
                      <div className="text-left">
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.college}</div>
                      </div>
                    </button>
                  ))
                )}
              </div>
            ) : (
              // Conversation list
              <div className="py-2">
                {conversations.length === 0 ? (
                  <div className="px-3 py-8 text-center text-sm text-gray-500">
                    <div className="flex justify-center mb-3">
                      <MessageIcon className="h-8 w-8 text-gray-300" />
                    </div>
                    <p>No conversations yet</p>
                    <p className="mt-1">Search for users to start messaging</p>
                  </div>
                ) : (
                  conversations.map(conv => {
                    // Find the other participant (not current user)
                    const otherParticipantId = conv.participants.find(id => id !== user?.id);
                    const otherUser = getUser(otherParticipantId || '') || { 
                      name: 'Unknown User',
                      id: 'unknown',
                      college: '',
                      avatar: ''
                    };
                    
                    return (
                      <button
                        key={conv.id}
                        className={`w-full px-3 py-3 flex items-center space-x-3 hover:bg-gray-50 transition-colors
                          ${selectedUser?.id === otherUser.id ? 'bg-gray-50' : ''}`}
                        onClick={() => {
                          setSelectedUser(otherUser);
                          loadMessages(otherUser.id);
                        }}
                      >
                        <Avatar>
                          <AvatarImage src={otherUser.avatar} alt={otherUser.name} />
                          <AvatarFallback>{getInitials(otherUser.name)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0 text-left">
                          <div className="flex items-center justify-between">
                            <div className="font-medium truncate">{otherUser.name}</div>
                            <div className="text-xs text-gray-500">{formatConversationTime(conv.lastMessageAt)}</div>
                          </div>
                          <div className="text-sm text-gray-500 truncate">{conv.lastMessage}</div>
                        </div>
                        {conv.unreadCount > 0 && (
                          <Badge className="ml-2 bg-collegium-primary">{conv.unreadCount}</Badge>
                        )}
                      </button>
                    );
                  })
                )}
              </div>
            )}
          </ScrollArea>
        </div>
        
        {/* Message area */}
        <div className="flex-1 flex flex-col bg-gray-50">
          {selectedUser ? (
            <>
              {/* Header */}
              <div className="p-3 border-b bg-white flex items-center space-x-3">
                <Avatar>
                  <AvatarImage src={selectedUser.avatar} alt={selectedUser.name} />
                  <AvatarFallback>{getInitials(selectedUser.name)}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{selectedUser.name}</div>
                  <div className="text-xs text-gray-500">{selectedUser.college}</div>
                </div>
              </div>
              
              {/* Messages */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messages.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="inline-block p-3 bg-gray-100 rounded-full mb-3">
                        <MessageIcon className="h-6 w-6 text-gray-400" />
                      </div>
                      <p className="text-gray-500">No messages yet</p>
                      <p className="text-sm text-gray-400">Send a message to start the conversation</p>
                    </div>
                  ) : (
                    messages.map((message) => {
                      const isSender = message.senderId === user?.id;
                      
                      return (
                        <div 
                          key={message.id} 
                          className={`flex ${isSender ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className="flex items-end space-x-2">
                            {!isSender && (
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={selectedUser.avatar} alt={selectedUser.name} />
                                <AvatarFallback>{getInitials(selectedUser.name)}</AvatarFallback>
                              </Avatar>
                            )}
                            <div 
                              className={`max-w-md px-4 py-2 rounded-lg ${
                                isSender 
                                  ? 'bg-collegium-primary text-white rounded-br-none' 
                                  : 'bg-white text-gray-700 rounded-bl-none'
                              }`}
                            >
                              <p>{message.content}</p>
                              <div 
                                className={`text-xs mt-1 ${
                                  isSender ? 'text-blue-100' : 'text-gray-500'
                                }`}
                              >
                                {formatMessageTime(message.sentAt)}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </ScrollArea>
              
              {/* Message input */}
              <div className="p-3 border-t bg-white">
                <form onSubmit={handleSendMessage} className="flex space-x-2">
                  <Textarea
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="min-h-[60px] resize-none"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage(e);
                      }
                    }}
                  />
                  <Button type="submit" disabled={!newMessage.trim()}>
                    <Send className="h-4 w-4" />
                    <span className="sr-only">Send message</span>
                  </Button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-4 text-center">
              <div className="bg-gray-100 p-4 rounded-full mb-4">
                <MessageIcon className="h-10 w-10 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">Your Messages</h3>
              <p className="text-gray-600 max-w-md mb-6">
                Select a conversation or search for other students to start messaging.
              </p>
              <p className="text-sm text-gray-500">
                Connect with classmates, form study groups, or get help with coursework
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default MessagesPage;
