
// Data types and mock data for Collegium platform

// User Types
export interface User {
  id: string;
  name: string;
  email: string;
  college: string;
  major: string;
  interests: string[];
  avatar?: string;
  joinedAt: string; // ISO Date string
}

// Forum Types
export interface ForumTopic {
  id: string;
  title: string;
  description: string;
  category: string;
  createdBy: string; // User ID
  createdAt: string; // ISO Date string
  commentsCount: number;
  viewsCount: number;
  tags: string[];
}

export interface ForumComment {
  id: string;
  topicId: string;
  content: string;
  createdBy: string; // User ID
  createdAt: string; // ISO Date string
  likeCount: number;
  isLiked?: boolean;
}

// Resource Types
export interface Resource {
  id: string;
  title: string;
  description: string;
  fileUrl: string;
  fileType: string;
  category: string;
  uploadedBy: string; // User ID
  uploadedAt: string; // ISO Date string
  downloadCount: number;
  rating: number;
  tags: string[];
}

// Event Types
export interface Event {
  id: string;
  title: string;
  description: string;
  date: string; // ISO Date string
  location: string;
  organizer: string; // User ID
  participants: string[]; // Array of User IDs
  category: string;
  isOnline: boolean;
  link?: string;
  imageUrl?: string;
}

// Message Types
export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  sentAt: string; // ISO Date string
  isRead: boolean;
}

export interface Conversation {
  id: string;
  participants: string[]; // User IDs
  lastMessage: string;
  lastMessageAt: string; // ISO Date string
  unreadCount: number;
}

// Mock Data
export const mockUsers: User[] = [
  {
    id: "1",
    name: "Demo Student",
    email: "demo@college.edu",
    college: "Demo University",
    major: "Computer Science",
    interests: ["Programming", "AI", "Web Development"],
    avatar: "/placeholder.svg",
    joinedAt: "2023-01-15T12:00:00Z"
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@college.edu",
    college: "State University",
    major: "Biology",
    interests: ["Genetics", "Medical Research", "Ecology"],
    joinedAt: "2023-02-20T10:30:00Z"
  },
  {
    id: "3",
    name: "Alex Johnson",
    email: "alex@college.edu",
    college: "Tech Institute",
    major: "Electrical Engineering",
    interests: ["Robotics", "IoT", "Circuit Design"],
    avatar: "/placeholder.svg",
    joinedAt: "2023-03-05T15:45:00Z"
  },
];

export const mockForumTopics: ForumTopic[] = [
  {
    id: "101",
    title: "Tips for Freshman Year Success",
    description: "Share your advice for incoming freshmen to help them navigate their first year of college successfully.",
    category: "Academic",
    createdBy: "1",
    createdAt: "2023-04-10T09:15:00Z",
    commentsCount: 24,
    viewsCount: 352,
    tags: ["freshman", "advice", "college life"]
  },
  {
    id: "102",
    title: "Study Group for Calculus II",
    description: "Looking for students taking Calculus II this semester to form a study group for weekly sessions.",
    category: "Study Groups",
    createdBy: "2",
    createdAt: "2023-04-15T14:30:00Z",
    commentsCount: 18,
    viewsCount: 205,
    tags: ["calculus", "math", "study group"]
  },
  {
    id: "103",
    title: "Best Laptop for Computer Science Major",
    description: "I'm starting my CS degree this fall and need recommendations for a good laptop that will last throughout my program.",
    category: "Technology",
    createdBy: "3",
    createdAt: "2023-04-18T11:20:00Z",
    commentsCount: 32,
    viewsCount: 478,
    tags: ["laptop", "tech", "computer science"]
  },
  {
    id: "104",
    title: "Campus Food Options Review Thread",
    description: "Let's create a comprehensive review of all food options on campus to help students find the best meals.",
    category: "Campus Life",
    createdBy: "1",
    createdAt: "2023-04-20T16:45:00Z",
    commentsCount: 41,
    viewsCount: 527,
    tags: ["food", "dining", "reviews"]
  },
  {
    id: "105",
    title: "Internship Application Strategies",
    description: "Share tips and strategies for landing internships in your field. What worked for you?",
    category: "Career",
    createdBy: "2",
    createdAt: "2023-04-25T13:10:00Z",
    commentsCount: 29,
    viewsCount: 412,
    tags: ["internships", "career", "job search"]
  }
];

export const mockForumComments: ForumComment[] = [
  {
    id: "201",
    topicId: "101",
    content: "My best advice is to attend professor office hours regularly! It helped me build relationships with faculty and better understand course material.",
    createdBy: "2",
    createdAt: "2023-04-10T10:20:00Z",
    likeCount: 15,
  },
  {
    id: "202",
    topicId: "101",
    content: "Don't be afraid to join clubs early on. It's the fastest way to make friends with similar interests!",
    createdBy: "3",
    createdAt: "2023-04-10T11:05:00Z",
    likeCount: 12,
  },
  {
    id: "203",
    topicId: "102",
    content: "I'm in Section 003 of Calc II and would love to join a study group. I'm available weekday evenings.",
    createdBy: "1",
    createdAt: "2023-04-15T15:40:00Z",
    likeCount: 3,
  }
];

export const mockResources: Resource[] = [
  {
    id: "301",
    title: "Comprehensive Organic Chemistry Notes",
    description: "Complete notes from Organic Chemistry I & II, covering all major reaction mechanisms and concepts.",
    fileUrl: "#",
    fileType: "PDF",
    category: "Chemistry",
    uploadedBy: "2",
    uploadedAt: "2023-05-05T08:30:00Z",
    downloadCount: 134,
    rating: 4.8,
    tags: ["chemistry", "organic chemistry", "notes"]
  },
  {
    id: "302",
    title: "Python Programming Basics Tutorial",
    description: "A beginner-friendly guide to Python programming with examples and exercises.",
    fileUrl: "#",
    fileType: "ZIP",
    category: "Computer Science",
    uploadedBy: "1",
    uploadedAt: "2023-05-10T14:15:00Z",
    downloadCount: 256,
    rating: 4.6,
    tags: ["python", "programming", "tutorial"]
  },
  {
    id: "303",
    title: "Introduction to Psychology Study Guide",
    description: "Comprehensive study guide covering the main concepts in introductory psychology courses.",
    fileUrl: "#",
    fileType: "PDF",
    category: "Psychology",
    uploadedBy: "3",
    uploadedAt: "2023-05-15T11:20:00Z",
    downloadCount: 189,
    rating: 4.7,
    tags: ["psychology", "study guide", "intro course"]
  },
  {
    id: "304",
    title: "Calculus Formulas Cheat Sheet",
    description: "One-page reference sheet with all essential calculus formulas and identities.",
    fileUrl: "#",
    fileType: "PDF",
    category: "Mathematics",
    uploadedBy: "2",
    uploadedAt: "2023-05-20T09:45:00Z",
    downloadCount: 312,
    rating: 4.9,
    tags: ["calculus", "math", "cheat sheet"]
  }
];

export const mockEvents: Event[] = [
  {
    id: "401",
    title: "Computer Science Career Fair",
    description: "Annual career fair featuring tech companies recruiting for internships and full-time positions.",
    date: "2023-10-15T10:00:00Z",
    location: "Student Union Building, Grand Hall",
    organizer: "1",
    participants: ["1", "3"],
    category: "Career",
    isOnline: false,
    imageUrl: "/placeholder.svg"
  },
  {
    id: "402",
    title: "Biology Research Symposium",
    description: "Undergraduate and graduate students present their research findings in biological sciences.",
    date: "2023-10-20T13:00:00Z",
    location: "Science Building, Auditorium A",
    organizer: "2",
    participants: ["2"],
    category: "Academic",
    isOnline: false,
    imageUrl: "/placeholder.svg"
  },
  {
    id: "403",
    title: "Virtual Study Session: Finals Prep",
    description: "Join fellow students for a structured study session to prepare for upcoming final exams.",
    date: "2023-11-25T18:00:00Z",
    location: "Online",
    organizer: "3",
    participants: ["1", "2", "3"],
    category: "Study",
    isOnline: true,
    link: "https://meeting.example.com/finals-prep"
  },
  {
    id: "404",
    title: "Campus Sustainability Workshop",
    description: "Learn about sustainability initiatives and how you can contribute to a greener campus.",
    date: "2023-11-10T15:30:00Z",
    location: "Environmental Sciences Building, Room 202",
    organizer: "2",
    participants: ["2", "3"],
    category: "Workshop",
    isOnline: false
  }
];

export const mockConversations: Conversation[] = [
  {
    id: "501",
    participants: ["1", "2"],
    lastMessage: "Do you have the notes from yesterday's lecture?",
    lastMessageAt: "2023-06-10T09:20:00Z",
    unreadCount: 0
  },
  {
    id: "502",
    participants: ["1", "3"],
    lastMessage: "The study group meeting is confirmed for 7PM tomorrow.",
    lastMessageAt: "2023-06-12T14:50:00Z",
    unreadCount: 1
  }
];

export const mockMessages: Message[] = [
  {
    id: "601",
    senderId: "2",
    receiverId: "1",
    content: "Hi! Do you have the notes from yesterday's lecture?",
    sentAt: "2023-06-10T09:20:00Z",
    isRead: true
  },
  {
    id: "602",
    senderId: "1",
    receiverId: "2",
    content: "Yes, I'll send them to you after class today.",
    sentAt: "2023-06-10T10:15:00Z",
    isRead: true
  },
  {
    id: "603",
    senderId: "1",
    receiverId: "3",
    content: "Hey, are we still meeting for the study group tomorrow?",
    sentAt: "2023-06-12T14:30:00Z",
    isRead: true
  },
  {
    id: "604",
    senderId: "3",
    receiverId: "1",
    content: "The study group meeting is confirmed for 7PM tomorrow.",
    sentAt: "2023-06-12T14:50:00Z",
    isRead: false
  }
];

// Mock data service functions
export const getForumTopics = () => {
  return [...mockForumTopics];
};

export const getForumTopic = (id: string) => {
  return mockForumTopics.find(topic => topic.id === id);
};

export const getForumComments = (topicId: string) => {
  return mockForumComments.filter(comment => comment.topicId === topicId);
};

export const getResources = () => {
  return [...mockResources];
};

export const getEvents = () => {
  return [...mockEvents];
};

export const getUser = (id: string) => {
  return mockUsers.find(user => user.id === id);
};

export const getConversations = (userId: string) => {
  return mockConversations.filter(conv => conv.participants.includes(userId));
};

export const getMessages = (userId: string, otherUserId: string) => {
  return mockMessages.filter(msg => 
    (msg.senderId === userId && msg.receiverId === otherUserId) || 
    (msg.senderId === otherUserId && msg.receiverId === userId)
  ).sort((a, b) => new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime());
};
