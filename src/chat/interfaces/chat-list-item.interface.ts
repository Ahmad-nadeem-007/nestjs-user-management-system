import { User } from "src/user/entities/user.entity";

export interface ChatListItem {
    roomId: string;
    otherUser: User;
    latestMessage: {
        content: string;
        createdAt: Date;
        isRead: boolean;
    };
    unreadCount: number;
}
