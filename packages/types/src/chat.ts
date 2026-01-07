// Chat Types

export interface Message {
  id: string;
  matchId: string;
  senderId: string;
  content: string;
  readAt: Date | null;
  createdAt: Date;
}

export interface SendMessageDto {
  content: string;
}

export interface ChatState {
  isTyping: boolean;
  lastRead: Date | null;
}

export interface ChatWebSocketEvents {
  'message:new': Message;
  'message:read': { messageId: string; readAt: Date };
  'typing:start': { userId: string };
  'typing:stop': { userId: string };
  'match:revealed': { matchId: string };
}
