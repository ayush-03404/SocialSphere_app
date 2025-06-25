# Replit.md

## Overview

**SocialSphere** is a comprehensive multi-functional social web application designed to connect users across India through real-time communication and interactive features. The platform provides chat, screen sharing, friend networks, polls, auctions, stories, and group functionality in a unified social experience.

**Current Status**: Fully functional social platform with real-time features, authentication, and database persistence.

## System Architecture

**Technology Stack**:
- **Frontend**: React 19 with TypeScript, Vite, TailwindCSS, Wouter routing
- **Backend**: Node.js with Express, Socket.IO for real-time communication
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Replit OpenID Connect integration
- **Real-time**: Socket.IO for chat, screen sharing, and live updates

**Key Architecture Decisions**:
- Monorepo structure with shared schema for type safety
- Real-time Socket.IO server for instant messaging and screen sharing
- PostgreSQL for persistent data with full relational schema
- Component-based UI with shadcn/ui design system
- Server-side session management with database storage

## Key Components

**Frontend Components**:
- Landing page for unauthenticated users
- Home dashboard with quick actions and statistics
- Navigation sidebar with dark/light mode toggle
- Real-time chat interface with typing indicators
- Friend management with request/accept system
- Stories, polls, auctions, and screen sharing modules

**Backend Services**:
- RESTful API routes for all social features
- Socket.IO handlers for real-time communication
- Authentication middleware with session management
- Database storage layer with comprehensive CRUD operations
- Screen sharing session management with room codes

**Database Schema**:
- Users table with profile and online status
- Friendships with request/accept workflow
- Groups and group memberships with roles
- Chat rooms and messages with file support
- Stories with expiration timestamps
- Polls with voting system
- Auctions with bidding mechanism
- Screen sharing sessions with participants

## Data Flow

**Authentication Flow**:
1. User clicks login → Redirected to Replit OAuth
2. OAuth callback creates/updates user in database
3. Session stored in PostgreSQL with expiration
4. Frontend receives user data via `/api/auth/user`

**Real-time Communication**:
1. Socket.IO connection established on authentication
2. User joins personal and chat room channels
3. Messages broadcast to room participants
4. Online status updates propagated to friends
5. Screen sharing signals relayed between participants

**Feature Interactions**:
- Friend requests → Real-time notifications
- Chat messages → Instant delivery with read status
- Poll votes → Live result updates
- Auction bids → Real-time price updates
- Stories → 24-hour expiration cleanup

## External Dependencies

**Core Dependencies**:
- React ecosystem (React, React DOM, React Query)
- Backend framework (Express, Socket.IO)
- Database (Drizzle ORM, PostgreSQL driver)
- Authentication (OpenID Client, Passport)
- UI Components (Lucide React, TailwindCSS)
- Development tools (TypeScript, Vite, TSX)

**Authentication Provider**: Replit OpenID Connect
**Database**: Neon PostgreSQL (managed)
**Real-time**: Socket.IO WebSocket connections

## Deployment Strategy

**Current Deployment**: Replit hosting with automatic SSL and domain
**Server Configuration**: Express server on port 3000 with Socket.IO
**Database**: Managed PostgreSQL with connection pooling
**Static Assets**: Served by Express in production, Vite in development

**Environment Variables**:
- `DATABASE_URL`: PostgreSQL connection string
- `SESSION_SECRET`: Session encryption key
- `REPLIT_DOMAINS`: OAuth redirect domains
- `REPL_ID`: OAuth client identifier

## Recent Changes

```
June 25, 2025:
- Built complete SocialSphere social platform
- Implemented real-time chat with Socket.IO
- Created friend request and networking system
- Added screen sharing with WebRTC signaling
- Developed polls, auctions, and stories features
- Set up PostgreSQL database with full schema
- Integrated Replit authentication system
- Created responsive UI with dark/light themes
- Added comprehensive error handling and validation
```

## User Preferences

```
Preferred communication style: Simple, everyday language
Feature priorities: Real-time communication, social networking
Design preferences: Modern UI with dark mode support
Technical approach: Full-stack TypeScript with type safety
```

## Development Notes

**Project Structure**:
- `/client/src/` - React frontend application
- `/server/` - Express backend with Socket.IO
- `/shared/` - Common schema and types
- Database tables created and populated

**Running the Application**:
- Server runs on port 3000 via `tsx server/index.ts`
- Frontend served by Vite in development mode
- Socket.IO handles real-time features
- PostgreSQL database fully configured

**Key Features Implemented**:
1. User authentication with Replit OAuth
2. Real-time messaging with typing indicators
3. Friend request system with notifications
4. Screen sharing with room codes
5. Temporary stories with 24h expiration
6. Interactive polls with live voting
7. Auction system with real-time bidding
8. Group creation and management
9. Dark/light theme toggle
10. Responsive mobile-friendly design