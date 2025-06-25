import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { setupSocketIO } from "./socketHandler";
import { insertFriendshipSchema, insertGroupSchema, insertMessageSchema, insertStorySchema, insertPollSchema, insertAuctionSchema, insertScreenSharingSessionSchema } from "../shared/schema.js";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Friend routes
  app.post('/api/friends/request', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { receiverId } = insertFriendshipSchema.parse(req.body);
      
      if (userId === receiverId) {
        return res.status(400).json({ message: "Cannot send friend request to yourself" });
      }

      const friendship = await storage.sendFriendRequest(userId, receiverId);
      res.json(friendship);
    } catch (error) {
      console.error("Error sending friend request:", error);
      res.status(500).json({ message: "Failed to send friend request" });
    }
  });

  app.get('/api/friends/requests', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const requests = await storage.getFriendRequests(userId);
      res.json(requests);
    } catch (error) {
      console.error("Error fetching friend requests:", error);
      res.status(500).json({ message: "Failed to fetch friend requests" });
    }
  });

  app.post('/api/friends/respond', isAuthenticated, async (req: any, res) => {
    try {
      const { friendshipId, status } = req.body;
      await storage.respondToFriendRequest(friendshipId, status);
      res.json({ success: true });
    } catch (error) {
      console.error("Error responding to friend request:", error);
      res.status(500).json({ message: "Failed to respond to friend request" });
    }
  });

  app.get('/api/friends', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const friends = await storage.getFriends(userId);
      res.json(friends);
    } catch (error) {
      console.error("Error fetching friends:", error);
      res.status(500).json({ message: "Failed to fetch friends" });
    }
  });

  // Group routes
  app.post('/api/groups', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const groupData = insertGroupSchema.parse({ ...req.body, createdById: userId });
      const group = await storage.createGroup(groupData);
      res.json(group);
    } catch (error) {
      console.error("Error creating group:", error);
      res.status(500).json({ message: "Failed to create group" });
    }
  });

  app.get('/api/groups', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const groups = await storage.getGroups(userId);
      res.json(groups);
    } catch (error) {
      console.error("Error fetching groups:", error);
      res.status(500).json({ message: "Failed to fetch groups" });
    }
  });

  app.post('/api/groups/:groupId/join', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { groupId } = req.params;
      await storage.joinGroup(groupId, userId);
      res.json({ success: true });
    } catch (error) {
      console.error("Error joining group:", error);
      res.status(500).json({ message: "Failed to join group" });
    }
  });

  // Chat routes
  app.get('/api/chats', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const chats = await storage.getUserChats(userId);
      res.json(chats);
    } catch (error) {
      console.error("Error fetching chats:", error);
      res.status(500).json({ message: "Failed to fetch chats" });
    }
  });

  app.post('/api/chats/private', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { otherUserId } = req.body;
      const chatRoomId = await storage.getOrCreatePrivateChat(userId, otherUserId);
      res.json({ chatRoomId });
    } catch (error) {
      console.error("Error creating private chat:", error);
      res.status(500).json({ message: "Failed to create private chat" });
    }
  });

  app.get('/api/chats/:chatRoomId/messages', isAuthenticated, async (req: any, res) => {
    try {
      const { chatRoomId } = req.params;
      const { limit } = req.query;
      const messages = await storage.getChatMessages(chatRoomId, limit ? parseInt(limit as string) : undefined);
      res.json(messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
      res.status(500).json({ message: "Failed to fetch messages" });
    }
  });

  // Story routes
  app.post('/api/stories', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const storyData = insertStorySchema.parse({ ...req.body, userId });
      const story = await storage.createStory(storyData);
      res.json(story);
    } catch (error) {
      console.error("Error creating story:", error);
      res.status(500).json({ message: "Failed to create story" });
    }
  });

  app.get('/api/stories', isAuthenticated, async (req: any, res) => {
    try {
      const stories = await storage.getActiveStories();
      res.json(stories);
    } catch (error) {
      console.error("Error fetching stories:", error);
      res.status(500).json({ message: "Failed to fetch stories" });
    }
  });

  // Poll routes
  app.post('/api/polls', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const pollData = insertPollSchema.parse({ ...req.body, createdById: userId });
      const poll = await storage.createPoll(pollData);
      res.json(poll);
    } catch (error) {
      console.error("Error creating poll:", error);
      res.status(500).json({ message: "Failed to create poll" });
    }
  });

  app.get('/api/polls', isAuthenticated, async (req: any, res) => {
    try {
      const { limit } = req.query;
      const polls = await storage.getPolls(limit ? parseInt(limit as string) : undefined);
      res.json(polls);
    } catch (error) {
      console.error("Error fetching polls:", error);
      res.status(500).json({ message: "Failed to fetch polls" });
    }
  });

  app.post('/api/polls/:pollId/vote', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { pollId } = req.params;
      const { optionIndex } = req.body;
      await storage.voteOnPoll(pollId, userId, optionIndex);
      res.json({ success: true });
    } catch (error) {
      console.error("Error voting on poll:", error);
      res.status(500).json({ message: "Failed to vote on poll" });
    }
  });

  // Auction routes
  app.post('/api/auctions', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const auctionData = insertAuctionSchema.parse({ 
        ...req.body, 
        createdById: userId,
        currentPrice: req.body.startingPrice 
      });
      const auction = await storage.createAuction(auctionData);
      res.json(auction);
    } catch (error) {
      console.error("Error creating auction:", error);
      res.status(500).json({ message: "Failed to create auction" });
    }
  });

  app.get('/api/auctions', isAuthenticated, async (req: any, res) => {
    try {
      const auctions = await storage.getActiveAuctions();
      res.json(auctions);
    } catch (error) {
      console.error("Error fetching auctions:", error);
      res.status(500).json({ message: "Failed to fetch auctions" });
    }
  });

  app.post('/api/auctions/:auctionId/bid', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { auctionId } = req.params;
      const { amount } = req.body;
      await storage.placeBid(auctionId, userId, amount);
      res.json({ success: true });
    } catch (error) {
      console.error("Error placing bid:", error);
      res.status(500).json({ message: "Failed to place bid" });
    }
  });

  // Screen sharing routes
  app.post('/api/screen-sharing', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const sessionData = insertScreenSharingSessionSchema.parse({ 
        ...req.body, 
        hostId: userId 
      });
      const session = await storage.createScreenSharingSession(sessionData);
      res.json(session);
    } catch (error) {
      console.error("Error creating screen sharing session:", error);
      res.status(500).json({ message: "Failed to create screen sharing session" });
    }
  });

  app.get('/api/screen-sharing', isAuthenticated, async (req: any, res) => {
    try {
      const sessions = await storage.getActiveScreenSharingSessions();
      res.json(sessions);
    } catch (error) {
      console.error("Error fetching screen sharing sessions:", error);
      res.status(500).json({ message: "Failed to fetch screen sharing sessions" });
    }
  });

  app.post('/api/screen-sharing/:sessionId/join', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { sessionId } = req.params;
      await storage.joinScreenSharingSession(sessionId, userId);
      res.json({ success: true });
    } catch (error) {
      console.error("Error joining screen sharing session:", error);
      res.status(500).json({ message: "Failed to join screen sharing session" });
    }
  });

  const httpServer = createServer(app);
  
  // Setup Socket.IO
  setupSocketIO(httpServer);
  
  return httpServer;
}