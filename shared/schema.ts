import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  boolean,
  integer,
  uuid,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table for authentication
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  bio: text("bio"),
  isOnline: boolean("is_online").default(false),
  lastSeen: timestamp("last_seen"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Friend requests and friendships
export const friendships = pgTable("friendships", {
  id: uuid("id").primaryKey().defaultRandom(),
  requesterId: varchar("requester_id").notNull().references(() => users.id),
  receiverId: varchar("receiver_id").notNull().references(() => users.id),
  status: varchar("status", { enum: ["pending", "accepted", "declined"] }).notNull().default("pending"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Groups
export const groups = pgTable("groups", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name").notNull(),
  description: text("description"),
  imageUrl: varchar("image_url"),
  createdById: varchar("created_by_id").notNull().references(() => users.id),
  isPrivate: boolean("is_private").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Group memberships
export const groupMemberships = pgTable("group_memberships", {
  id: uuid("id").primaryKey().defaultRandom(),
  groupId: uuid("group_id").notNull().references(() => groups.id),
  userId: varchar("user_id").notNull().references(() => users.id),
  role: varchar("role", { enum: ["admin", "moderator", "member"] }).notNull().default("member"),
  joinedAt: timestamp("joined_at").defaultNow(),
});

// Chat rooms (for both private chats and group chats)
export const chatRooms = pgTable("chat_rooms", {
  id: uuid("id").primaryKey().defaultRandom(),
  type: varchar("type", { enum: ["private", "group"] }).notNull(),
  groupId: uuid("group_id").references(() => groups.id),
  name: varchar("name"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Chat room participants
export const chatParticipants = pgTable("chat_participants", {
  id: uuid("id").primaryKey().defaultRandom(),
  chatRoomId: uuid("chat_room_id").notNull().references(() => chatRooms.id),
  userId: varchar("user_id").notNull().references(() => users.id),
  joinedAt: timestamp("joined_at").defaultNow(),
});

// Messages
export const messages = pgTable("messages", {
  id: uuid("id").primaryKey().defaultRandom(),
  chatRoomId: uuid("chat_room_id").notNull().references(() => chatRooms.id),
  senderId: varchar("sender_id").notNull().references(() => users.id),
  content: text("content").notNull(),
  messageType: varchar("message_type", { enum: ["text", "image", "file"] }).notNull().default("text"),
  fileUrl: varchar("file_url"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Stories
export const stories = pgTable("stories", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: varchar("user_id").notNull().references(() => users.id),
  content: text("content"),
  imageUrl: varchar("image_url"),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Polls
export const polls = pgTable("polls", {
  id: uuid("id").primaryKey().defaultRandom(),
  createdById: varchar("created_by_id").notNull().references(() => users.id),
  question: text("question").notNull(),
  options: text("options").array().notNull(),
  expiresAt: timestamp("expires_at"),
  isAnonymous: boolean("is_anonymous").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Poll votes
export const pollVotes = pgTable("poll_votes", {
  id: uuid("id").primaryKey().defaultRandom(),
  pollId: uuid("poll_id").notNull().references(() => polls.id),
  userId: varchar("user_id").notNull().references(() => users.id),
  selectedOption: integer("selected_option").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Auctions
export const auctions = pgTable("auctions", {
  id: uuid("id").primaryKey().defaultRandom(),
  createdById: varchar("created_by_id").notNull().references(() => users.id),
  title: varchar("title").notNull(),
  description: text("description"),
  imageUrl: varchar("image_url"),
  startingPrice: integer("starting_price").notNull(),
  currentPrice: integer("current_price").notNull(),
  buyNowPrice: integer("buy_now_price"),
  endsAt: timestamp("ends_at").notNull(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Auction bids
export const auctionBids = pgTable("auction_bids", {
  id: uuid("id").primaryKey().defaultRandom(),
  auctionId: uuid("auction_id").notNull().references(() => auctions.id),
  bidderId: varchar("bidder_id").notNull().references(() => users.id),
  amount: integer("amount").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Screen sharing sessions
export const screenSharingSessions = pgTable("screen_sharing_sessions", {
  id: uuid("id").primaryKey().defaultRandom(),
  hostId: varchar("host_id").notNull().references(() => users.id),
  title: varchar("title"),
  isActive: boolean("is_active").default(true),
  roomCode: varchar("room_code").unique().notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Screen sharing participants
export const screenSharingParticipants = pgTable("screen_sharing_participants", {
  id: uuid("id").primaryKey().defaultRandom(),
  sessionId: uuid("session_id").notNull().references(() => screenSharingSessions.id),
  userId: varchar("user_id").notNull().references(() => users.id),
  joinedAt: timestamp("joined_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  sentFriendRequests: many(friendships, { relationName: "requester" }),
  receivedFriendRequests: many(friendships, { relationName: "receiver" }),
  groupMemberships: many(groupMemberships),
  messages: many(messages),
  stories: many(stories),
  polls: many(polls),
  pollVotes: many(pollVotes),
  auctions: many(auctions),
  auctionBids: many(auctionBids),
  screenSharingSessions: many(screenSharingSessions),
}));

export const friendshipsRelations = relations(friendships, ({ one }) => ({
  requester: one(users, {
    fields: [friendships.requesterId],
    references: [users.id],
    relationName: "requester",
  }),
  receiver: one(users, {
    fields: [friendships.receiverId],
    references: [users.id],
    relationName: "receiver",
  }),
}));

export const groupsRelations = relations(groups, ({ one, many }) => ({
  createdBy: one(users, {
    fields: [groups.createdById],
    references: [users.id],
  }),
  memberships: many(groupMemberships),
  chatRooms: many(chatRooms),
}));

export const messagesRelations = relations(messages, ({ one }) => ({
  sender: one(users, {
    fields: [messages.senderId],
    references: [users.id],
  }),
  chatRoom: one(chatRooms, {
    fields: [messages.chatRoomId],
    references: [chatRooms.id],
  }),
}));

export const pollsRelations = relations(polls, ({ one, many }) => ({
  createdBy: one(users, {
    fields: [polls.createdById],
    references: [users.id],
  }),
  votes: many(pollVotes),
}));

export const auctionsRelations = relations(auctions, ({ one, many }) => ({
  createdBy: one(users, {
    fields: [auctions.createdById],
    references: [users.id],
  }),
  bids: many(auctionBids),
}));

// Types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type Friendship = typeof friendships.$inferSelect;
export type Group = typeof groups.$inferSelect;
export type ChatRoom = typeof chatRooms.$inferSelect;
export type Message = typeof messages.$inferSelect;
export type Story = typeof stories.$inferSelect;
export type Poll = typeof polls.$inferSelect;
export type PollVote = typeof pollVotes.$inferSelect;
export type Auction = typeof auctions.$inferSelect;
export type AuctionBid = typeof auctionBids.$inferSelect;
export type ScreenSharingSession = typeof screenSharingSessions.$inferSelect;

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertFriendshipSchema = createInsertSchema(friendships).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertGroupSchema = createInsertSchema(groups).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertMessageSchema = createInsertSchema(messages).omit({
  id: true,
  createdAt: true,
});

export const insertStorySchema = createInsertSchema(stories).omit({
  id: true,
  createdAt: true,
});

export const insertPollSchema = createInsertSchema(polls).omit({
  id: true,
  createdAt: true,
});

export const insertAuctionSchema = createInsertSchema(auctions).omit({
  id: true,
  createdAt: true,
});

export const insertScreenSharingSessionSchema = createInsertSchema(screenSharingSessions).omit({
  id: true,
  createdAt: true,
});

// Insert types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertFriendship = z.infer<typeof insertFriendshipSchema>;
export type InsertGroup = z.infer<typeof insertGroupSchema>;
export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type InsertStory = z.infer<typeof insertStorySchema>;
export type InsertPoll = z.infer<typeof insertPollSchema>;
export type InsertAuction = z.infer<typeof insertAuctionSchema>;
export type InsertScreenSharingSession = z.infer<typeof insertScreenSharingSessionSchema>;