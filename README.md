# Gemini Note Taker

A powerful, AI-enhanced note-taking application built with React, TypeScript, and Google's Gemini AI. This app combines traditional note-taking functionality with advanced AI capabilities to help you create, organize, and improve your notes.

## Features

### 📝 Core Note-Taking
- **Create and Edit Notes**: Rich text editing with real-time saving
- **Organize with Tags**: Add and manage tags for better organization
- **Search Functionality**: Search through notes by content or filter by tags
- **Persistent Storage**: Notes are automatically saved to local storage
- **Responsive Design**: Clean, modern interface that works on all devices

### 🤖 AI-Powered Features
- **Smart Summarization**: Generate concise summaries with adjustable detail levels
- **Content Improvement**: Enhance writing with customizable options for:
  - Target audience (general, familiar, expert)
  - Tone (neutral, casual, formal, persuasive)
  - Length adjustments (shorter, longer, summary)
  - Grammar and clarity improvements
  - Structure enhancements (lists, headings, TL;DR)
- **Brainstorming Assistant**: Generate creative ideas with adjustable creativity levels
- **Auto-Tagging**: Automatically suggest relevant tags based on note content
- **Prompt Engineering**: Refine and improve AI prompts for better results

### 🎨 Customization
- **Multiple Themes**: Choose between "Charcoal Gold" and "Indigo Purple" themes
- **Gradient Backgrounds**: Beautiful gradient overlays for enhanced visual appeal
- **Modern UI**: Built with Tailwind CSS for a sleek, professional look

### 🎤 Additional Features
- **Speech Recognition**: Voice-to-text input for hands-free note creation
- **Export Options**: Save notes in various formats
- **Keyboard Shortcuts**: Efficient navigation and editing

## Technology Stack

- **Frontend**: React 19, TypeScript
- **Styling**: Tailwind CSS with custom theme system
- **AI Integration**: Google Gemini 2.5 Pro API
- **Build Tool**: Vite
- **State Management**: React hooks with local storage persistence

## Prerequisites

- **Node.js** (version 16 or higher)
- **Google Gemini API Key** (get one from [Google AI Studio](https://makersuite.google.com/app/apikey))

## Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd gemini-note-taker
   ```

2. **Install dependencies**:
   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Set up your Gemini API key**:
   - Create a `.env.local` file in the root directory
   - Add your API key:
     ```
     GEMINI_API_KEY=your_api_key_here
     ```
   - Alternatively, you can set the API key directly in the app's settings

4. **Run the development server**:
   ```bash
   npm run dev
   # or
   pnpm run dev
   ```

5. **Open your browser** and navigate to `http://localhost:5173`

## Usage Guide

### Getting Started
1. **Create a New Note**: Click the "+" button in the header
2. **Edit Notes**: Click on any note in the sidebar to start editing
3. **Add Tags**: Use the tag manager to organize your notes
4. **Search**: Use the search bar to find specific notes or filter by tags

### AI Features
1. **Summarize**: Select text and use the summarize tool with adjustable detail levels
2. **Improve Writing**: Enhance your text with customizable improvement options
3. **Brainstorm Ideas**: Generate creative ideas based on your note titles
4. **Auto-Tag**: Let AI suggest relevant tags for your notes

### Customization
1. **Change Themes**: Click the settings icon to switch between available themes
2. **Adjust AI Settings**: Configure AI behavior in the settings modal

## Project Structure

```
gemini-note-taker/
├── components/           # React components
│   ├── Header.tsx       # App header with navigation
│   ├── NoteList.tsx     # Sidebar note list
│   ├── NoteEditor.tsx   # Main note editing interface
│   ├── *Modal.tsx       # Various modal components
│   └── icons/           # SVG icon components
├── contexts/            # React context providers
│   └── ThemeContext.tsx # Theme management
├── hooks/               # Custom React hooks
│   └── useSpeechRecognition.ts
├── services/            # External service integrations
│   └── geminiService.ts # Google Gemini AI integration
├── types.ts             # TypeScript type definitions
└── App.tsx              # Main application component
```

## Build & Deploy

1. **Build for production**:
   ```bash
   npm run build
   ```

2. **Preview production build**:
   ```bash
   npm run preview
   ```

3. **Deploy**: The built files in the `dist/` directory can be deployed to any static hosting service

## Docker Support

The project includes Docker configuration for containerized deployment:

```bash
# Build the Docker image
docker build -t gemini-note-taker .

# Run with Docker Compose
docker-compose up
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes and commit: `git commit -m 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

If you encounter any issues or have questions:
1. Check the browser console for error messages
2. Ensure your Gemini API key is correctly configured
3. Verify you have a stable internet connection for AI features
4. Create an issue in the repository for bugs or feature requests
