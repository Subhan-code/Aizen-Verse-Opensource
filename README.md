# Aizen Verse 🌌  
Modern Anime Streaming Platform

## Overview
**Aizen Verse** is a modern, mobile-first anime streaming web application built with **React 19**, **TypeScript**, and **Vite 6**.  
It focuses on performance, responsive design, and a smooth viewing experience across mobile, tablet, and desktop devices.

This repository contains the **frontend application and player logic only**.  
The **hosted backend, streaming APIs, and infrastructure are privately maintained**.

---

## Features
- 🎬 **HLS.js video streaming** with adaptive playback
- 📱 **Mobile-first responsive design**
- 🔍 Anime search, favorites, watch history, and profiles
- 🌗 Dark / light theme toggle
- 📺 Episode browsing and detailed anime pages
- ⚡ SPA navigation using React Router v7
- 🎨 Custom UI components, sliders, and animations

---

## Tech Stack
- **Frontend:** React 19, TypeScript, Vite 6  
- **Styling:** Tailwind CSS + custom CSS  
- **Streaming:** HLS.js  
- **Routing:** React Router v7  
- **Icons:** Lucide React  
- **State Management:** React Hooks  

---

## Project Structure
```plaintext
├── components/        # Reusable UI components
├── pages/             # Page-level components
├── services/          # API abstraction layer
├── utils/             # Utility helpers
├── App.tsx            # Main app component
├── index.tsx          # Application entry point
├── custom.css         # Custom styling
└── vite.config.ts     # Vite configuration
Video Player Capabilities
Fullscreen playback (cross-browser)

Touch-friendly controls (mobile optimized)

Subtitle support

Playback speed control (0.5x – 3x)

Volume and mute controls

Native fullscreen API support

Responsive Design Strategy
Mobile-first approach

Tablets (768px–1023px) use the mobile layout

Desktop-optimized layouts for large screens

Minimum 44px touch targets for mobile usability

Stable scrolling with no layout jitter

Hosted API & Streaming
This project is open source, but the official hosted backend and streaming APIs are private.

Public access may be rate-limited

Endpoints may change without notice

No uptime or availability guarantees

For extended or production usage, users are encouraged to self-host their own backend implementation.

Local Development
Prerequisites
Node.js (latest LTS)

npm or yarn

Installation
bash
Copy code
npm install
Development Server
bash
Copy code
npm run dev
Build
bash
Copy code
npm run build
Preview Build
bash
Copy code
npm run preview
Custom Styling
The project uses Tailwind CSS alongside custom utility classes defined in custom.css, including:

.touch-control – mobile-optimized controls

.mobile-video-container – stable mobile video layout

.glass – glass-morphism UI effects

.animate-glitch, .shutter-up-anim – animation utilities

.dark, .light-mode – theme handling

Performance Optimizations
Lazy loading for images and components

Minimal re-renders via optimized component design

CSS containment for layout stability

Touch-optimized scrolling behavior

Accessibility
Semantic HTML structure

Keyboard navigation support

Screen-reader friendly labels

Proper contrast ratios

Touch-target sizing compliance

Security Notes
No production secrets are included in this repository

Environment variables are required for API integration

Streaming sources are not part of this codebase

This project does not distribute or host copyrighted content

Contributing
Contributions are welcome!

Fork the repository

Create a feature branch

Commit your changes

Push to your branch

Open a pull request

Please keep changes focused and well-documented.

License
MIT License

This license applies to the source code only.
It does not grant rights to any streaming content, hosted services, or private APIs.

Disclaimer
This project is provided “as is”, without warranty of any kind.
The author is not responsible for third-party deployments, content sources, or usage.

Author
Developed and maintained by Syed Subhan

⭐ If you find this project useful, consider starring the repository!