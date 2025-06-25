import {
  users,
  friendships,
  groups,
  groupMemberships,
  chatRooms,
  chatParticipants,
  messages,
  stories,
  polls,
  pollVotes,
  auctions,
  auctionBids,
  screenSharingSessions,
  screenSharingParticipants,
  type User,
  type UpsertUser,
  type Friendship,
  type Group,
  type Message,
  type Story,
  type Poll,
  type Auction,
  type ScreenSharingSession,
  type InsertFriendship,
  type InsertGroup,
  type InsertMessage,
  type InsertStory,
  type InsertPoll,
  type InsertAuction,
  type InsertScreenSharingSession,
} from "../shared/schema.js";
import { db } from "./db";
import { eq, and, or, desc, sql } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  getUserByEmail(email: string): Promise<User | undefined>;
  updateUserOnlineStatus(id: string, isOnline: boolean): Promise<void>;
  
  // Friend operations
  sendFriendRequest(requesterId: string, receiverId: string): Promise<Friendship>;
  getFriendRequests(userId: string): Promise<Friendship[]>;
  respondToFriendRequest(friendshipId: string, status: "accepted" | "declined"): Promise<void>;
  getFriends(userId: string): Promise<User[]>;
  
  // Group operations
  createGroup(group: InsertGroup): Promise<Group>;
  getGroups(userId: string): Promise<Group[]>;
  joinGroup(groupId: string, userId: string): Promise<void>;
  
  // Chat operations
  getOrCreatePrivateChat(userId1: string, userId2: string): Promise<string>;
  getChatMessages(chatRoomId: string, limit?: number): Promise<Message[]>;
  sendMessage(message: InsertMessage): Promise<Message>;
  getUserChats(userId: string): Promise<any[]>;
  
  // Story operations
  createStory(story: InsertStory): Promise<Story>;
  getActiveStories(): Promise<Story[]>;
  
  // Poll operations
  createPoll(poll: InsertPoll): Promise<Poll>;
  getPolls(limit?: number): Promise<Poll[]>;
  voteOnPoll(pollId: string, userId: string, optionIndex: number): Promise<void>;
  
  // Auction operations
  createAuction(auction: InsertAuction): Promise<Auction>;
  getActiveAuctions(): Promise<Auction[]>;
  placeBid(auctionId: string, bidderId: string, amount: number): Promise<void>;
  
  // Screen sharing operations
  createScreenSharingSession(session: InsertScreenSharingSession): Promise<ScreenSharingSession>;
  joinScreenSharingSession(sessionId: string, userId: string): Promise<void>;
  getActiveScreenSharingSessions(): Promise<ScreenSharingSession[]>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async updateUserOnlineStatus(id: string, isOnline: boolean): Promise<void> {
    await db
      .update(users)
      .set({ 
        isOnline, 
        lastSeen: isOnline ? null : new Date(),
        updatedAt: new Date() 
      })
      .where(eq(users.id, id));
  }

  async sendFriendRequest(requesterId: string, receiverId: string): Promise<Friendship> {
    const [friendship] = await db
      .insert(friendships)
      .values({ requesterId, receiverId })
      .returning();
    return friendship;
  }

  async getFriendRequests(userId: string): Promise<Friendship[]> {
    return await db
      .select()
      .from(friendships)
      .where(
        and(
          eq(friendships.receiverId, userId),
          eq(friendships.status, "pending")
        )
      );
  }

  async respondToFriendRequest(friendshipId: string, status: "accepted" | "declined"): Promise<void> {
    await db
      .update(friendships)
      .set({ status, updatedAt: new Date() })
      .where(eq(friendships.id, friendshipId));
  }

  async getFriends(userId: string): Promise<User[]> {
    const friendIds = await db
      .select({
        friendId: sql<string>`CASE 
          WHEN ${friendships.requesterId} = ${userId} THEN ${friendships.receiverId}
          ELSE ${friendships.requesterId}
        END`
      })
      .from(friendships)
      .where(
        and(
          or(
            eq(friendships.requesterId, userId),
            eq(friendships.receiverId, userId)
          ),
          eq(friendships.status, "accepted")
        )
      );

    if (friendIds.length === 0) return [];

    return await db
      .select()
      .from(users)
      .where(
        sql`${users.id} IN (${sql.join(friendIds.map(f => sql`${f.friendId}`), sql`, `)})`
      );
  }

  async createGroup(group: InsertGroup): Promise<Group> {
    const [newGroup] = await db.insert(groups).values(group).returning();
    
    // Add creator as admin
    await db.insert(groupMemberships).values({
      groupId: newGroup.id,
      userId: group.createdById,
      role: "admin"
    });

    return newGroup;
  }

  async getGroups(userId: string): Promise<Group[]> {
    return await db
      .select()
      .from(groups)
      .innerJoin(groupMemberships, eq(groups.id, groupMemberships.groupId))
      .where(eq(groupMemberships.userId, userId));
  }

  async joinGroup(groupId: string, userId: string): Promise<void> {
    await db.insert(groupMemberships).values({
      groupId,
      userId,
      role: "member"
    });
  }

  async getOrCreatePrivateChat(userId1: string, userId2: string): Promise<string> {
    // Check if chat already exists
    const existingChat = await db
      .select({ id: chatRooms.id })
      .from(chatRooms)
      .innerJoin(chatParticipants, eq(chatRooms.id, chatParticipants.chatRoomId))
      .where(
        and(
          eq(chatRooms.type, "private"),
          sql`${chatRooms.id} IN (
            SELECT ${chatParticipants.chatRoomId} 
            FROM ${chatParticipants} 
            WHERE ${chatParticipants.userId} = ${userId1}
          ) AND ${chatRooms.id} IN (
            SELECT ${chatParticipants.chatRoomId} 
            FROM ${chatParticipants} 
            WHERE ${chatParticipants.userId} = ${userId2}
          )`
        )
      )
      .limit(1);

    if (existingChat.length > 0) {
      return existingChat[0].id;
    }

    // Create new chat room
    const [chatRoom] = await db
      .insert(chatRooms)
      .values({ type: "private" })
      .returning();

    // Add participants
    await db.insert(chatParticipants).values([
      { chatRoomId: chatRoom.id, userId: userId1 },
      { chatRoomId: chatRoom.id, userId: userId2 }
    ]);

    return chatRoom.id;
  }

  async getChatMessages(chatRoomId: string, limit: number = 50): Promise<Message[]> {
    return await db
      .select()
      .from(messages)
      .where(eq(messages.chatRoomId, chatRoomId))
      .orderBy(desc(messages.createdAt))
      .limit(limit);
  }

  async sendMessage(message: InsertMessage): Promise<Message> {
    const [newMessage] = await db.insert(messages).values(message).returning();
    return newMessage;
  }

  async getUserChats(userId: string): Promise<any[]> {
    return await db
      .select({
        chatRoom: chatRooms,
        lastMessage: messages
      })
      .from(chatRooms)
      .innerJoin(chatParticipants, eq(chatRooms.id, chatParticipants.chatRoomId))
      .leftJoin(
        messages,
        sql`${messages.chatRoomId} = ${chatRooms.id} AND ${messages.createdAt} = (
          SELECT MAX(${messages.createdAt}) 
          FROM ${messages} 
          WHERE ${messages.chatRoomId} = ${chatRooms.id}
        )`
      )
      .where(eq(chatParticipants.userId, userId))
      .orderBy(desc(messages.createdAt));
  }

  async createStory(story: InsertStory): Promise<Story> {
    const [newStory] = await db.insert(stories).values(story).returning();
    return newStory;
  }

  async getActiveStories(): Promise<Story[]> {
    return await db
      .select()
      .from(stories)
      .where(sql`${stories.expiresAt} > NOW()`)
      .orderBy(desc(stories.createdAt));
  }

  async createPoll(poll: InsertPoll): Promise<Poll> {
    const [newPoll] = await db.insert(polls).values(poll).returning();
    return newPoll;
  }

  async getPolls(limit: number = 20): Promise<Poll[]> {
    return await db
      .select()
      .from(polls)
      .orderBy(desc(polls.createdAt))
      .limit(limit);
  }

  async voteOnPoll(pollId: string, userId: string, optionIndex: number): Promise<void> {
    await db.insert(pollVotes).values({
      pollId,
      userId,
      selectedOption: optionIndex
    });
  }

  async createAuction(auction: InsertAuction): Promise<Auction> {
    const [newAuction] = await db.insert(auctions).values(auction).returning();
    return newAuction;
  }

  async getActiveAuctions(): Promise<Auction[]> {
    return await db
      .select()
      .from(auctions)
      .where(
        and(
          eq(auctions.isActive, true),
          sql`${auctions.endsAt} > NOW()`
        )
      )
      .orderBy(desc(auctions.createdAt));
  }

  async placeBid(auctionId: string, bidderId: string, amount: number): Promise<void> {
    await db.transaction(async (tx) => {
      // Insert bid
      await tx.insert(auctionBids).values({
        auctionId,
        bidderId,
        amount
      });

      // Update current price
      await tx
        .update(auctions)
        .set({ currentPrice: amount })
        .where(eq(auctions.id, auctionId));
    });
  }

  async createScreenSharingSession(session: InsertScreenSharingSession): Promise<ScreenSharingSession> {
    const roomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    const [newSession] = await db
      .insert(screenSharingSessions)
      .values({ ...session, roomCode })
      .returning();
    return newSession;
  }

  async joinScreenSharingSession(sessionId: string, userId: string): Promise<void> {
    await db.insert(screenSharingParticipants).values({
      sessionId,
      userId
    });
  }

  async getActiveScreenSharingSessions(): Promise<ScreenSharingSession[]> {
    return await db
      .select()
      .from(screenSharingSessions)
      .where(eq(screenSharingSessions.isActive, true))
      .orderBy(desc(screenSharingSessions.createdAt));
  }
}

export const storage = new DatabaseStorage();