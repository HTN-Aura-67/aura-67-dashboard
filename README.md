# Aura-67 - Robot Controller Web UI

A modern web-based robot controller interface featuring live video streaming and natural language command input.

## Features

### Video Panel
- **HLS Streaming**: Supports HLS video streams with automatic fallback (native Safari support + hls.js)
- **Stream Controls**: Connect/disconnect, fullscreen, snapshot capture, mute/unmute
- **Status Indicators**: Real-time connection status with visual feedback
- **Error Handling**: Comprehensive error states with retry functionality
- **Latency Display**: Mock latency estimation for stream monitoring

### Chat Panel
- **Natural Language Commands**: Send instructions using plain English
- **Mock Aura-67 Responses**: Intelligent keyword-based responses
- **Quick Commands**: Pre-defined action buttons for common tasks
- **Typing Indicators**: Visual feedback when Aura-67 is "thinking"
- **Message History**: Persistent chat history with timestamps

### Technical Features
- **Responsive Design**: Optimized for both desktop and mobile devices
- **Dark/Light Mode**: System-aware theme switching
- **Local Storage**: Automatic persistence of chat history and stream URLs
- **Accessibility**: Full keyboard navigation and screen reader support
- **Real-time Updates**: Live status synchronization across components

## Getting Started

### Prerequisites
- Node.js 18+ and pnpm (or npm/yarn)

### Installation

\`\`\`bash
# Install dependencies
pnpm install

# Start development server
pnpm dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Default Stream
The app comes pre-configured with a test HLS stream: `https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8`

## Usage

### Video Streaming
1. The default demo stream URL is pre-loaded for testing
2. Click "Connect" to start streaming
3. Use the control buttons for fullscreen, snapshots, and audio
4. Replace with your own HLS stream URL as needed

### Aura-67 Commands
1. Type natural language instructions in the chat input
2. Use quick command buttons for common actions
3. Press Enter to send, Shift+Enter for new lines
4. Use Ctrl/Cmd+K to quickly focus the input

### Example Commands
- "Scan the area"
- "Go towards the apple"
- "Avoid obstacles"
- "Return to base"

## Architecture

### Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS v4 + shadcn/ui components
- **Video**: hls.js with native HLS fallback
- **State**: React hooks with localStorage persistence
- **TypeScript**: Full type safety throughout

### File Structure
\`\`\`
app/
├── layout.tsx          # Root layout with theme provider
├── page.tsx           # Main application page
└── globals.css        # Global styles and theme variables

components/
├── VideoPanel.tsx     # Video streaming interface
├── ChatPanel.tsx      # Chat command interface
├── MessageList.tsx    # Chat message display
├── Composer.tsx       # Message input component
├── QuickCommands.tsx  # Quick action buttons
├── StatusPill.tsx     # Connection status indicator
├── TypingIndicator.tsx # Bot typing animation
└── Toolbar.tsx        # Top navigation bar

lib/
├── storage.ts         # localStorage utilities
├── mockBot.ts         # Mock Aura-67 response logic
└── hlsClient.ts       # HLS streaming utilities
\`\`\`

## Customization

### Adding Real Backend
To connect to a real Aura-67 backend:

1. Replace mock responses in `lib/mockBot.ts` with actual API calls
2. Update video streaming to use Aura-67's camera feed
3. Add authentication if required
4. Implement real-time WebSocket communication for live updates

### Stream Sources
The UI accepts any HLS-compatible stream URL. For other video formats:
- **WebRTC**: Use a media server like mediamtx to convert to HLS
- **RTMP/UDP**: Convert using FFmpeg or similar tools
- **IP Cameras**: Most modern cameras support HLS output

### Styling
The app uses Tailwind CSS with a custom design system. Key customization points:
- Theme colors in `app/globals.css`
- Component variants in shadcn/ui components
- Responsive breakpoints in component files

## Browser Support
- **Chrome/Edge**: Full support via hls.js
- **Firefox**: Full support via hls.js  
- **Safari**: Native HLS support (optimal performance)
- **Mobile**: Responsive design with touch-friendly controls

## Development Notes

### Mock Responses
The bot currently provides canned responses based on keywords:
- "scan" → Area scanning response
- "apple" → Navigation response  
- "return"/"base" → Return to base response
- Default → Generic acknowledgment

### Local Storage
The app automatically saves:
- Chat message history
- Last used stream URL
- User preferences

### Performance
- HLS.js is loaded dynamically only when needed
- Video elements use hardware acceleration when available
- Efficient re-rendering with React optimization patterns

## License
Created with v0.app - Customize and deploy as needed for your Aura-67 control applications.
