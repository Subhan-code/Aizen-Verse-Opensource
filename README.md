# Aizen Verse 🌌
**Modern Anime Streaming Platform**

[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?style=flat-square&logo=vite)](https://vitejs.dev/)
[![License](https://img.shields.io/github/license/subhanqed/Aizen-Verse?style=flat-square)](LICENSE)

**Aizen Verse** is a modern, mobile-first anime streaming web application built with **React 19**, **TypeScript**, and **Vite 6**. It focuses on performance, responsive design, and a smooth viewing experience across mobile, tablet, and desktop devices.

> ⚠️ **Important Notice**: This repository contains the **frontend application and player logic only**. The **hosted backend, streaming APIs, and infrastructure are privately maintained**.

## 🚀 Features

- 🎬 **HLS.js Video Streaming** with adaptive playback
- 📱 **Mobile-First Responsive Design** optimized for all devices
- 🔍 **Advanced Anime Search** with filtering capabilities
- ❤️ **Favorites System** to save your preferred content
- 📜 **Watch History** to track your viewing progress
- 🌗 **Dark/Light Theme Toggle** with seamless transitions
- 📺 **Episode Browsing** with detailed anime information
- ⚡ **SPA Navigation** using React Router v7 for instant page transitions
- 🎨 **Custom UI Components** with animations and glass-morphism effects
- 🛡️ **Security-Focused** with environment-based configuration

## 🛠️ Tech Stack

| Technology      | Purpose                     |
|-----------------|-----------------------------|
| **React 19**    | Frontend Framework          |
| **TypeScript**  | Type Safety                 |
| **Vite 6**      | Build Tool & Dev Server     |
| **Tailwind CSS**| Utility-First Styling       |
| **HLS.js**      | Adaptive Video Streaming    |
| **React Router**| Client-Side Routing         |
| **Lucide React**| Icon Library                |

## 📁 Project Structure

```
Aizen-Verse/
├── components/        # Reusable UI components
├── pages/             # Page-level components
├── services/          # API abstraction layer
├── utils/             # Utility functions
├── App.tsx            # Main application component
├── index.tsx          # Application entry point
├── constants.ts        # Configuration constants
├── custom.css         # Custom styling
└── vite.config.ts     # Vite configuration
```

## ▶️ Video Player Capabilities

- Fullscreen playback (cross-browser compatible)
- Touch-friendly controls optimized for mobile
- Subtitle support with multiple language options
- Playback speed control (0.5x – 3x)
- Volume and mute controls
- Native fullscreen API support
- Responsive design for all screen sizes

## 📱 Responsive Design Strategy

- Mobile-first approach for optimal performance
- Tablets (768px–1023px) use the mobile layout
- Desktop-optimized layouts for large screens
- Minimum 44px touch targets for mobile usability
- Stable scrolling with no layout jitter

## 🔌 API Integration & Streaming

> **Note**: This project is open source, but the official hosted backend and streaming APIs are private.

- Public access may be rate-limited
- Endpoints may change without notice
- No uptime or availability guarantees
- For extended or production usage, users are encouraged to self-host their own backend implementation

## 🧪 Local Development

### Prerequisites

- [Node.js](https://nodejs.org/) (Latest LTS version)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Environment Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/subhanqed/Aizen-Verse.git
   cd Aizen-Verse
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

### Available Scripts

| Command              | Description                        |
|----------------------|------------------------------------|
| `npm run dev`        | Starts the development server      |
| `npm run build`      | Builds the production bundle       |
| `npm run preview`    | Previews the production build      |

## 🎨 Custom Styling

The project uses Tailwind CSS alongside custom utility classes defined in `custom.css`, including:

- `.touch-control` – Mobile-optimized controls
- `.mobile-video-container` – Stable mobile video layout
- `.glass` – Glass-morphism UI effects
- `.animate-glitch`, `.shutter-up-anim` – Animation utilities
- `.dark`, `.light-mode` – Theme handling

## ⚡ Performance Optimizations

- Lazy loading for images and components
- Minimal re-renders via optimized component design
- CSS containment for layout stability
- Touch-optimized scrolling behavior
- Efficient state management with React Hooks

## ♿ Accessibility

- Semantic HTML structure
- Keyboard navigation support
- Screen-reader friendly labels
- Proper contrast ratios for readability
- Touch-target sizing compliance (minimum 44px)

## 🔐 Security

- No production secrets included in this repository
- Environment variables required for API integration
- Streaming sources are not part of this codebase
- This project does not distribute or host copyrighted content
- Secure handling of user preferences in localStorage

## 🤝 Contributing

Contributions are welcome! Here's how you can contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

Please ensure your code follows the existing style and includes appropriate tests.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

> **Note**: This license applies to the source code only. It does not grant rights to any streaming content, hosted services, or private APIs.

## ⚠️ Disclaimer

This project is provided "as is", without warranty of any kind, express or implied. The author is not responsible for third-party deployments, content sources, or usage.

## 👨‍💻 Author

**Syed Subhan**

- GitHub: [@subhanqed](https://github.com/subhanqed)
- Twitter: [@SubhanHQ](https://twitter.com/SubhanHQ)

⭐ If you find this project useful, consider starring the repository!
