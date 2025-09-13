# Aura-67 Autonomous Robot Dashboard

A modern web-based control interface for the Aura-67 autonomous robot, featuring real-time video streaming, natural language command processing, and intelligent task execution.

## 🤖 About Aura-67

Aura-67 is an autonomous robot designed to understand and execute natural language commands in real-world environments. The robot can perform complex tasks such as object detection, navigation, and environmental interaction through advanced AI processing and computer vision.

## 🎯 Dashboard Purpose

This web application serves as the primary control interface for Aura-67, providing:

- **Real-time Monitoring**: Live video feed from the robot's camera system
- **Natural Language Control**: Send commands using plain English (e.g., "scan around and go to the apples around you")
- **Manual Override**: Direct control capabilities when needed
- **Task Visualization**: Monitor the robot's current state and processing status
- **Command History**: Track all interactions and robot responses

## ✨ Key Features

### 🎥 Live Video Streaming
- **Real-time Camera Feed**: HLS streaming from Aura-67's onboard cameras
- **Fullscreen Support**: Immersive viewing experience
- **Snapshot Capture**: Save images from the robot's perspective
- **Audio Controls**: Mute/unmute robot audio feed
- **Connection Status**: Visual indicators for stream health

### 🧠 AI-Powered Command Processing
- **Natural Language Understanding**: Process complex commands in plain English
- **Context Awareness**: Robot understands spatial relationships and object references
- **Task Planning**: Break down complex commands into executable steps
- **Real-time Processing**: Immediate response to new commands
- **Learning Capabilities**: Improve performance through interaction history

### 💬 Interactive Chat Interface
- **Command Input**: Type natural language instructions
- **Quick Commands**: Pre-defined action buttons for common tasks
- **Typing Indicators**: Visual feedback when Aura-67 is processing
- **Message History**: Persistent chat log with timestamps
- **Error Handling**: Clear feedback for failed commands

### 🎛️ Control Panel
- **Connection Management**: Easy stream URL configuration
- **Status Monitoring**: Real-time connection and processing status
- **Theme Support**: Dark/light mode for different environments
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## 🚀 Example Commands

Aura-67 can understand and execute various types of commands:

### Navigation Commands
- "Move forward 5 meters"
- "Turn left and scan the area"
- "Go to the kitchen"
- "Return to your starting position"

### Object Detection & Interaction
- "Find all apples in the room"
- "Go to the nearest red object"
- "Pick up the book on the table"
- "Scan around and identify all furniture"

### Environmental Tasks
- "Clean up the living room"
- "Check if all doors are closed"
- "Monitor the area for 10 minutes"
- "Take a photo of the current scene"

### Complex Multi-step Tasks
- "Scan around and go to the apples around you"
- "Find the remote control and bring it to me"
- "Check each room for any open windows"
- "Navigate to the garden and take photos of the plants"

## 🛠️ Technology Stack

### Frontend
- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **Radix UI**: Accessible component primitives
- **HLS.js**: Video streaming client
- **React Hook Form**: Form management

### Video Streaming
- **HLS (HTTP Live Streaming)**: Real-time video delivery
- **WebRTC**: Low-latency communication (future enhancement)
- **Hardware Acceleration**: Optimized video decoding

### AI Integration
- **Natural Language Processing**: Command understanding
- **Computer Vision**: Object detection and recognition
- **Task Planning**: Multi-step command execution
- **Context Management**: Spatial and temporal awareness

### Architecture
- **Component-based**: Modular React components
- **State Management**: Local state with React hooks
- **Responsive Design**: Mobile-first approach
- **Progressive Enhancement**: Works without JavaScript

## 📁 Project Structure

```
aura-67-dashboard/
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout with metadata
│   └── page.tsx           # Main dashboard page
├── components/            # React components
│   ├── ChatPanel.tsx      # Command interface
│   ├── VideoPanel.tsx     # Video streaming
│   ├── Toolbar.tsx        # Top navigation
│   ├── MessageList.tsx    # Chat message display
│   ├── Composer.tsx       # Command input
│   ├── TypingIndicator.tsx # AI processing indicator
│   └── ui/               # Reusable UI components
├── lib/                  # Utility libraries
│   ├── storage.ts        # Local storage management
│   ├── mockBot.ts        # AI response simulation
│   └── hlsClient.ts      # Video streaming utilities
└── public/               # Static assets
    └── robot-svgrepo-com.svg # Robot icon
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or pnpm package manager

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd aura-67-dashboard

# Install dependencies
npm install
# or
pnpm install

# Start development server
npm run dev
# or
pnpm dev
```

### Configuration
1. **Stream URL**: Update the default HLS stream URL in `lib/storage.ts`
2. **Robot Backend**: Connect to Aura-67's control API
3. **AI Processing**: Configure natural language processing endpoints

## 🔧 Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Adding New Features
1. **New Commands**: Add to `lib/mockBot.ts` response patterns
2. **UI Components**: Create in `components/` directory
3. **API Integration**: Add endpoints in `lib/` directory

## 🔮 Future Enhancements

### Planned Features
- **Voice Commands**: Speech-to-text input
- **3D Visualization**: Robot's spatial understanding
- **Task Scheduling**: Automated routine execution
- **Multi-robot Support**: Control multiple Aura-67 units
- **Advanced Analytics**: Performance metrics and insights

### Technical Improvements
- **WebRTC Integration**: Lower latency video streaming
- **WebSocket Communication**: Real-time bidirectional data
- **PWA Support**: Offline functionality
- **Mobile App**: Native iOS/Android applications

## 🤝 Contributing

We welcome contributions to improve Aura-67's capabilities:

1. **Command Processing**: Enhance natural language understanding
2. **UI/UX**: Improve user experience and accessibility
3. **Performance**: Optimize video streaming and responsiveness
4. **Documentation**: Help others understand and use the system

## 📄 License

This project is part of the Aura-67 autonomous robot system. All rights reserved.

---

**Aura-67 Dashboard** - Empowering autonomous robotics through intuitive human-robot interaction.