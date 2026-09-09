# DPLTED — Developer Community & Network Platform

DPLTED is a modern, production-grade social platform and community network tailored for software engineers, creators, and developers. Built with **React**, **TypeScript**, **Tailwind CSS**, **Lucide Icons**, and powered by **Convex** for real-time backend state and database reactivity.

---

## Key Features

- **Activity Feed & Media Sharing**: Share updates, code snippets, photos, videos, and audio clips. Engage through likes, threaded comments, and real-time pagination.
- **Direct Messaging**: Connect privately with fellow developers through real-time peer-to-peer chat threads with contact search and unread indicators.
- **Communities & Groups**: Join or create public and private developer groups with dedicated topic chatrooms and community discovery.
- **Interactive Notifications**: Real-time notifications for likes, comments, direct messages, and group invitations with instant mark-as-read actions.
- **Developer Profile Management**: Customize user profiles with custom avatars, cover banners, tech stack bios, and online status indicators.
- **Portfolio Showcase View**: Built-in interactive portfolio view highlighting selected projects, technical skill domains, and endorsements.
- **Light & Dark Theme Engine**: Built-in design token system supporting smooth switching between dark and light themes.

---

## Tech Stack & Architecture

### Frontend Architecture
- **Framework**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v3](https://tailwindcss.com/) with CSS Variable design tokens
- **Component System**: Modular UI Primitive Architecture (`src/components/ui/`)
- **Iconography**: [Lucide React Icons](https://lucide.dev/) (no emojis)
- **Notifications & Toasts**: [Sonner](https://sonner.emilkowal.ski/)

### Backend Architecture
- **Real-Time Database & Auth**: [Convex](https://convex.dev/) + `@convex-dev/auth`
- **File & Media Storage**: Convex File Storage API
- **Deployment & Hosting**: [Render](https://render.com/)

---

## Global Design System

The application relies on a tokenized design system defined in `tailwind.config.js` and `src/index.css`:

```text
Design Tokens (Colors, Radius, Shadows, CSS Variables)
    ↓
Primitive Components (Button, Input, Textarea, Badge, Avatar, Spinner, Skeleton, Card, Modal, EmptyState)
    ↓
Feature Components (Feed, CreatePost, Messages, Groups, Notifications, Profile)
    ↓
Application Shell (Top Navbar, Responsive Sidebar, Mobile Bottom Bar)
```

### UI Primitives Summary (`src/components/ui/`)
- **`Button`**: Supports `primary`, `secondary`, `outline`, `ghost`, `subtle`, and `danger` variants with loading spinners and icon slots.
- **`Input` & `Textarea`**: Standardized controls with active focus ring highlights, left/right icon support, and inline validation states.
- **`Card`**: Surface container component with elevated, outline, and hover-interactive variants.
- **`Modal`**: Accessible dialog layer with backdrop blur, smooth exit animations, and keyboard `Escape` closing.
- **`Avatar`**: Fallback user initials or custom profile images with optional online status badges.
- **`Badge`**: Status indicators for member counts, group privacy, and notification tags.
- **`EmptyState`**: Meaningful zero-data states with contextual icons and actionable guidance.

---

## Directory Structure

```text
src/
├── components/
│   ├── ui/                    # Reusable primitive UI components
│   │   ├── Avatar.tsx
│   │   ├── Badge.tsx
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── EmptyState.tsx
│   │   ├── Input.tsx
│   │   ├── Modal.tsx
│   │   ├── Spinner.tsx
│   │   ├── Textarea.tsx
│   │   └── index.ts
│   ├── CreatePost.tsx         # Media attachment & post publisher
│   ├── CTASection.tsx         # Contact CTA view
│   ├── Feed.tsx               # Activity feed & comment threads
│   ├── Groups.tsx             # Public discovery & private group chats
│   ├── HeroSection.tsx        # Portfolio hero section
│   ├── Messages.tsx           # Dual-pane direct messaging
│   ├── Notifications.tsx      # Activity notification center
│   ├── Profile.tsx            # User profile editor & banner
│   ├── ProfileSetup.tsx       # Onboarding profile setup
│   ├── ProjectsSection.tsx    # Project showcase
│   ├── SkillsSection.tsx      # Technical skill categorization
│   └── TestimonialsSection.tsx # Endorsements section
├── App.tsx                    # Main layout shell & routing state
├── SignInForm.tsx             # Authentication form
├── SignOutButton.tsx          # Sign-out control
├── index.css                  # CSS Variables & theme tokens
└── main.tsx                   # Application entry point
convex/                        # Backend data models & mutations
```

---

## Getting Started

### 1. Prerequisites
- [Node.js](https://nodejs.org/) v18+
- [npm](https://www.npmjs.com/)

### 2. Installation
Clone the repository and install dependencies:

```bash
npm install
```

### 3. Environment Configuration
Ensure your `.env.local` file contains your Convex URL:

```env
VITE_CONVEX_URL=https://your-convex-deployment.convex.cloud
```

### 4. Running Development Servers
To start the frontend local server:

```bash
npm run dev:frontend
```

### 5. Type Checking & Production Build
To run TypeScript validation and compile the production build:

```bash
./node_modules/.bin/tsc -p . --noEmit
npx vite build
```

---

## License

This project is licensed under the MIT License.
