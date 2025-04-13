
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type User = {
  id: string;
  username: string;
  password: string; // In a real app, never store plain text passwords
  avatarColor: string;
  createdAt: number;
};

export type Category = {
  id: string;
  name: string;
  description: string;
  icon: string;
};

export type Topic = {
  id: string;
  title: string;
  content: string;
  categoryId: string;
  authorId: string;
  createdAt: number;
  upvotes: string[]; // Array of user IDs who upvoted
  downvotes: string[]; // Array of user IDs who downvoted
};

export type Reply = {
  id: string;
  topicId: string;
  content: string;
  authorId: string;
  createdAt: number;
  upvotes: string[];
  downvotes: string[];
};

interface ForumState {
  users: User[];
  categories: Category[];
  topics: Topic[];
  replies: Reply[];
  currentUser: User | null;
  
  // Auth actions
  register: (username: string, password: string) => { success: boolean; message: string };
  login: (username: string, password: string) => { success: boolean; message: string };
  logout: () => void;
  
  // Forum actions
  addTopic: (title: string, content: string, categoryId: string) => Topic | null;
  addReply: (content: string, topicId: string) => Reply | null;
  upvoteTopic: (topicId: string) => void;
  downvoteTopic: (topicId: string) => void;
  upvoteReply: (replyId: string) => void;
  downvoteReply: (replyId: string) => void;
  
  // Getters
  getTopicsByCategory: (categoryId: string) => Topic[];
  getRepliesByTopic: (topicId: string) => Reply[];
  getUserById: (userId: string) => User | undefined;
  getTopicById: (topicId: string) => Topic | undefined;
}

// Generate a random color for user avatars
const getRandomColor = () => {
  const colors = [
    'bg-red-500', 'bg-blue-500', 'bg-green-500', 
    'bg-yellow-500', 'bg-purple-500', 'bg-pink-500', 
    'bg-indigo-500', 'bg-teal-500'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

// Initial categories
const initialCategories: Category[] = [
  {
    id: '1',
    name: 'General Discussion',
    description: 'Talk about anything and everything',
    icon: 'message-square',
  },
  {
    id: '2',
    name: 'Technology',
    description: 'Discuss the latest in tech',
    icon: 'cpu',
  },
  {
    id: '3',
    name: 'Gaming',
    description: 'Share your gaming experiences',
    icon: 'gamepad-2',
  },
  {
    id: '4',
    name: 'Movies & TV',
    description: 'Discuss film and television',
    icon: 'film',
  },
  {
    id: '5',
    name: 'Music',
    description: 'Share your favorite tunes',
    icon: 'music',
  },
];

export const useForumStore = create<ForumState>()(
  persist(
    (set, get) => ({
      users: [],
      categories: initialCategories,
      topics: [],
      replies: [],
      currentUser: null,
      
      register: (username, password) => {
        const users = get().users;
        const exists = users.some(user => user.username.toLowerCase() === username.toLowerCase());
        
        if (exists) {
          return { success: false, message: 'Username already taken' };
        }
        
        if (username.length < 3) {
          return { success: false, message: 'Username must be at least 3 characters' };
        }
        
        if (password.length < 6) {
          return { success: false, message: 'Password must be at least 6 characters' };
        }
        
        const newUser: User = {
          id: Date.now().toString(),
          username,
          password, // In a real app, this should be hashed
          avatarColor: getRandomColor(),
          createdAt: Date.now(),
        };
        
        set(state => ({ 
          users: [...state.users, newUser],
          currentUser: newUser 
        }));
        
        return { success: true, message: 'Registration successful' };
      },
      
      login: (username, password) => {
        const user = get().users.find(
          user => user.username.toLowerCase() === username.toLowerCase() && user.password === password
        );
        
        if (!user) {
          return { success: false, message: 'Invalid username or password' };
        }
        
        set({ currentUser: user });
        return { success: true, message: 'Login successful' };
      },
      
      logout: () => {
        set({ currentUser: null });
      },
      
      addTopic: (title, content, categoryId) => {
        const currentUser = get().currentUser;
        
        if (!currentUser) return null;
        
        const newTopic: Topic = {
          id: Date.now().toString(),
          title,
          content,
          categoryId,
          authorId: currentUser.id,
          createdAt: Date.now(),
          upvotes: [],
          downvotes: [],
        };
        
        set(state => ({
          topics: [...state.topics, newTopic]
        }));
        
        return newTopic;
      },
      
      addReply: (content, topicId) => {
        const currentUser = get().currentUser;
        
        if (!currentUser) return null;
        
        const newReply: Reply = {
          id: Date.now().toString(),
          topicId,
          content,
          authorId: currentUser.id,
          createdAt: Date.now(),
          upvotes: [],
          downvotes: [],
        };
        
        set(state => ({
          replies: [...state.replies, newReply]
        }));
        
        return newReply;
      },
      
      upvoteTopic: (topicId) => {
        const currentUser = get().currentUser;
        if (!currentUser) return;
        
        set(state => ({
          topics: state.topics.map(topic => {
            if (topic.id === topicId) {
              const hasUpvoted = topic.upvotes.includes(currentUser.id);
              const hasDownvoted = topic.downvotes.includes(currentUser.id);
              
              let upvotes = [...topic.upvotes];
              let downvotes = [...topic.downvotes];
              
              // If already upvoted, remove the upvote (toggle)
              if (hasUpvoted) {
                upvotes = upvotes.filter(id => id !== currentUser.id);
              } else {
                // Add upvote and remove any downvote
                upvotes.push(currentUser.id);
                downvotes = downvotes.filter(id => id !== currentUser.id);
              }
              
              return { ...topic, upvotes, downvotes };
            }
            return topic;
          })
        }));
      },
      
      downvoteTopic: (topicId) => {
        const currentUser = get().currentUser;
        if (!currentUser) return;
        
        set(state => ({
          topics: state.topics.map(topic => {
            if (topic.id === topicId) {
              const hasUpvoted = topic.upvotes.includes(currentUser.id);
              const hasDownvoted = topic.downvotes.includes(currentUser.id);
              
              let upvotes = [...topic.upvotes];
              let downvotes = [...topic.downvotes];
              
              // If already downvoted, remove the downvote (toggle)
              if (hasDownvoted) {
                downvotes = downvotes.filter(id => id !== currentUser.id);
              } else {
                // Add downvote and remove any upvote
                downvotes.push(currentUser.id);
                upvotes = upvotes.filter(id => id !== currentUser.id);
              }
              
              return { ...topic, upvotes, downvotes };
            }
            return topic;
          })
        }));
      },
      
      upvoteReply: (replyId) => {
        const currentUser = get().currentUser;
        if (!currentUser) return;
        
        set(state => ({
          replies: state.replies.map(reply => {
            if (reply.id === replyId) {
              const hasUpvoted = reply.upvotes.includes(currentUser.id);
              const hasDownvoted = reply.downvotes.includes(currentUser.id);
              
              let upvotes = [...reply.upvotes];
              let downvotes = [...reply.downvotes];
              
              // If already upvoted, remove the upvote (toggle)
              if (hasUpvoted) {
                upvotes = upvotes.filter(id => id !== currentUser.id);
              } else {
                // Add upvote and remove any downvote
                upvotes.push(currentUser.id);
                downvotes = downvotes.filter(id => id !== currentUser.id);
              }
              
              return { ...reply, upvotes, downvotes };
            }
            return reply;
          })
        }));
      },
      
      downvoteReply: (replyId) => {
        const currentUser = get().currentUser;
        if (!currentUser) return;
        
        set(state => ({
          replies: state.replies.map(reply => {
            if (reply.id === replyId) {
              const hasUpvoted = reply.upvotes.includes(currentUser.id);
              const hasDownvoted = reply.downvotes.includes(currentUser.id);
              
              let upvotes = [...reply.upvotes];
              let downvotes = [...reply.downvotes];
              
              // If already downvoted, remove the downvote (toggle)
              if (hasDownvoted) {
                downvotes = downvotes.filter(id => id !== currentUser.id);
              } else {
                // Add downvote and remove any upvote
                downvotes.push(currentUser.id);
                upvotes = upvotes.filter(id => id !== currentUser.id);
              }
              
              return { ...reply, upvotes, downvotes };
            }
            return reply;
          })
        }));
      },
      
      getTopicsByCategory: (categoryId) => {
        return get().topics.filter(topic => topic.categoryId === categoryId);
      },
      
      getRepliesByTopic: (topicId) => {
        return get().replies.filter(reply => reply.topicId === topicId);
      },
      
      getUserById: (userId) => {
        return get().users.find(user => user.id === userId);
      },
      
      getTopicById: (topicId) => {
        return get().topics.find(topic => topic.id === topicId);
      },
    }),
    {
      name: 'crimson-echo-forums',
    }
  )
);
