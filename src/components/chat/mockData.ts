import { User, Conversation, Message } from "@/types/Chat";

export const mockUsers: User[] = [
  {
    id: "current-user",
    name: "You",
    avatar: "https://ui-avatars.com/api/?name=You&background=9b87f5&color=fff",
    isOnline: true,
  },
  {
    id: "user-1",
    name: "Alex Johnson",
    avatar:
      "https://ui-avatars.com/api/?name=Alex+Johnson&background=6E59A5&color=fff",
    isOnline: true,
  },
  {
    id: "user-2",
    name: "Sam Taylor",
    avatar:
      "https://ui-avatars.com/api/?name=Sam+Taylor&background=7E69AB&color=fff",
    isOnline: false,
    lastSeen: "2025-04-17T10:30:00Z",
  },
  {
    id: "user-3",
    name: "Jordan Lee",
    avatar:
      "https://ui-avatars.com/api/?name=Jordan+Lee&background=D6BCFA&color=6E59A5",
    isOnline: true,
  },
  {
    id: "user-4",
    name: "Casey Martinez",
    avatar:
      "https://ui-avatars.com/api/?name=Casey+Martinez&background=9b87f5&color=fff",
    isOnline: false,
    lastSeen: "2025-04-16T18:45:00Z",
  },
];

export const mockConversations: Conversation[] = [
  {
    id: "conv-1",
    participants: [mockUsers[0], mockUsers[1]],
    unreadCount: 3,
  },
  {
    id: "conv-2",
    participants: [mockUsers[0], mockUsers[2]],
    unreadCount: 0,
  },
  {
    id: "conv-3",
    participants: [mockUsers[0], mockUsers[3]],
    unreadCount: 2,
  },
  {
    id: "conv-4",
    participants: [mockUsers[0], mockUsers[4]],
    unreadCount: 0,
  },
];

// Helper to get the other user in a conversation
const getOtherUser = (conversation: Conversation): User => {
  return (
    conversation.participants.find((user) => user.id !== "current-user") ||
    conversation.participants[0]
  );
};

// Current timestamp minus some offset for the messages
const getTimestamp = (minutesAgo: number): string => {
  const date = new Date();
  date.setMinutes(date.getMinutes() - minutesAgo);
  return date.toISOString();
};

export const mockMessages: Message[] = [
  // Conversation 1
  {
    id: "conv-1-msg-1",
    senderId: "user-1",
    text: "Hey there! How's your day going?",
    timestamp: getTimestamp(120),
    type: "text",
    reactions: [],
    status: "read",
    isDeleted: false,
  },
  {
    id: "conv-1-msg-2",
    senderId: "current-user",
    text: "Pretty good! Just finishing up some work. How about you?",
    timestamp: getTimestamp(115),
    type: "text",
    reactions: [{ emoji: "👍", userId: "user-1", username: "Alex Johnson" }],
    status: "read",
    isDeleted: false,
  },
  {
    id: "conv-1-msg-3",
    senderId: "user-1",
    text: "I'm doing well! Just sent you some project files to review when you get a chance.",
    timestamp: getTimestamp(110),
    type: "text",
    reactions: [],
    status: "read",
    isDeleted: false,
  },
  {
    id: "conv-1-msg-4",
    senderId: "user-1",
    text: "",
    timestamp: getTimestamp(105),
    type: "image",
    mediaUrl: "https://images.unsplash.com/photo-1531297484001-80022131f5a1",
    mediaType: "image/jpeg",
    reactions: [
      { emoji: "❤️", userId: "current-user", username: "You" },
      { emoji: "👀", userId: "user-1", username: "Alex Johnson" },
    ],
    status: "read",
    isDeleted: false,
  },
  {
    id: "conv-1-msg-5",
    senderId: "current-user",
    text: "That looks great! I'll check out the files soon.",
    timestamp: getTimestamp(100),
    type: "text",
    reactions: [],
    status: "read",
    isDeleted: false,
  },
  {
    id: "conv-1-msg-6",
    senderId: "user-1",
    text: "Here's my current location. I'm at the coffee shop if you want to join!",
    timestamp: getTimestamp(30),
    type: "location",
    location: {
      latitude: 40.7128,
      longitude: -74.006,
      address: "Local Coffee, 123 Main St",
    },
    reactions: [],
    status: "delivered",
    isDeleted: false,
  },
  {
    id: "conv-1-msg-7",
    senderId: "user-1",
    text: "Just sent you the presentation file too",
    timestamp: getTimestamp(20),
    type: "file",
    fileName: "project_presentation.pdf",
    fileSize: 2500000,
    mediaUrl: "#",
    reactions: [],
    status: "delivered",
    isDeleted: false,
  },
  {
    id: "conv-1-msg-8",
    senderId: "user-1",
    text: "Let me know what you think!",
    timestamp: getTimestamp(5),
    type: "text",
    reactions: [],
    status: "delivered",
    isDeleted: false,
  },

  // Conversation 2
  {
    id: "conv-2-msg-1",
    senderId: "user-2",
    text: "Are we still meeting tomorrow?",
    timestamp: getTimestamp(1440), // 1 day ago
    type: "text",
    reactions: [],
    status: "read",
    isDeleted: false,
  },
  {
    id: "conv-2-msg-2",
    senderId: "current-user",
    text: "Yes, 2pm at the office works for me!",
    timestamp: getTimestamp(1435),
    type: "text",
    reactions: [{ emoji: "👍", userId: "user-2", username: "Sam Taylor" }],
    status: "read",
    isDeleted: false,
  },
  {
    id: "conv-2-msg-3",
    senderId: "user-2",
    text: "Perfect, see you then!",
    timestamp: getTimestamp(1430),
    type: "text",
    reactions: [],
    status: "read",
    isDeleted: false,
  },

  // Conversation 3
  {
    id: "conv-3-msg-1",
    senderId: "user-3",
    text: "Check out this cool video!",
    timestamp: getTimestamp(60),
    type: "text",
    reactions: [],
    status: "delivered",
    isDeleted: false,
  },
  {
    id: "conv-3-msg-2",
    senderId: "user-3",
    text: "",
    timestamp: getTimestamp(59),
    type: "video",
    mediaUrl:
      "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4",
    mediaType: "video/mp4",
    reactions: [],
    status: "delivered",
    isDeleted: false,
  },
  {
    id: "conv-3-msg-3",
    senderId: "user-3",
    text: "What do you think? 😊",
    timestamp: getTimestamp(55),
    type: "text",
    reactions: [],
    status: "delivered",
    isDeleted: false,
  },

  // Conversation 4
  {
    id: "conv-4-msg-1",
    senderId: "current-user",
    text: "Do you have the schedule for next week's meeting?",
    timestamp: getTimestamp(2880), // 2 days ago
    type: "text",
    reactions: [],
    status: "read",
    isDeleted: false,
  },
  {
    id: "conv-4-msg-2",
    senderId: "user-4",
    text: "Yes, I'll send it over shortly.",
    timestamp: getTimestamp(2870),
    type: "text",
    reactions: [],
    status: "read",
    isDeleted: false,
  },
  {
    id: "conv-4-msg-3",
    senderId: "user-4",
    text: "This message was deleted",
    timestamp: getTimestamp(2860),
    type: "text",
    reactions: [],
    status: "read",
    isDeleted: true,
  },
  {
    id: "conv-4-msg-4",
    senderId: "user-4",
    text: "",
    timestamp: getTimestamp(2855),
    type: "file",
    fileName: "meeting_schedule.docx",
    fileSize: 1200000,
    mediaUrl: "#",
    reactions: [{ emoji: "🙏", userId: "current-user", username: "You" }],
    status: "read",
    isDeleted: false,
  },
];

// Update the conversations with last messages
mockConversations.forEach((conversation) => {
  const conversationMessages = mockMessages.filter((message) =>
    message.id.startsWith(conversation.id)
  );
  if (conversationMessages.length > 0) {
    // Sort by timestamp descending
    const sortedMessages = [...conversationMessages].sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
    conversation.lastMessage = sortedMessages[0];
  }
});
