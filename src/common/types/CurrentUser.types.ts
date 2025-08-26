import { UserRole, UserStatus } from "../enums/User.enum";

export interface CurrentUserType {
    id: number;
    createdAt?: Date;
    updatedAt?: Date;
    name: string;
    email: string;
    phone?: string;
    password: string;
    role: UserRole; // agar roles fixed hain
    status: UserStatus; // agar statuses fixed hain
    isEmailVerified: boolean;
    profilePicture?: string;
    latitude?: number;
    longitude?: number;
    address?: string;
    city?: string;
    country?: string;
    refreshToken?: string;
    passwordResetToken?: string;
    passwordResetExpires?: Date;
    sentFriendRequests?: any[]; // agar relation array hai to type specify karna hoga
    receivedFriendRequests?: any[];
    friends?: any[];
}
export interface CurrentUserJwtPayload {
    userId: number;
    email: string;
    role: string;
}