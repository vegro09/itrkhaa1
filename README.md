# Steadfast Journey

# SYSTEM ROLE & CONTEXT

You are an Expert Full-Stack Developer and Principal UI/UX Designer.

Your objective is to build a production-ready, highly polished React/Next.js progressive web app (PWA) named "Leave It" (اتركها). This is a gamified, premium addiction recovery and habit-tracking application.

# 1. TECH STACK & GLOBAL ARCHITECTURE

- **Framework:** React (Next.js App Router preferred) + Tailwind CSS.

- **Animations:** Framer Motion (crucial for smooth page transitions and micro-interactions).

- **Icons:** Lucide React (use minimalist, 2D line-art icons only).

- **i18n & Layout:** Strict support for LTR (English) and RTL (Arabic). The layout must flip dynamically based on the selected language.

# 2. DESIGN SYSTEM & TOKENS (STRICT ADHERENCE)

You must strictly use these exact hex codes. Do not invent new colors.

- **Color Palette:**

  - `--color-cotton`: `#EDEBDE` (Global background, cards inner background).

  - `--color-cherry-red`: `#810100` (Primary actions, panic button, active states, Minecraft hearts).

  - `--color-maroon`: `#630102` (Primary typography, main headings, structural accents).

  - `--color-noir-black`: `#1B1716` (Subtle borders, secondary micro-text, unselected icons).

- **Typography:**

  - Primary Font: 'Thamanya' (ثمانية) for Arabic, clean Sans-serif for English.

  - Numbers: Strictly use `font-mono` for the timer numbers to prevent layout shift.

- **UI Style (Soft Bento Box):**

  - Generous spacing (`gap-4` to `gap-6`, `p-6`).

  - Cards must float over the background with ultra-rounded corners (`rounded-[32px]`).

  - Use Glassmorphism (`backdrop-blur-md`, subtle inner borders using `--color-noir-black` at 5% opacity).

- **Global Background:** Pure `--color-cotton` with an extremely subtle, slowly moving abstract background wave (opacity 3%).

# 3. CORE LOGIC & STATE MANAGEMENT

- **Lives System:** User starts with 3 lives (represented by hearts).

- **Timer Logic:** The main recovery timer counts Days, Hours, Minutes, and Seconds continuously.

- **Relapse Rule (CRITICAL):** If a user relapses, deduct 1 life. DO NOT reset the main timer.

# 4. SCREEN-BY-SCREEN SPECIFICATIONS

### A. Navigation

- **Global Bottom Nav:** Floating pill-shaped bar containing 4 icons (Home, Hakeem AI, Library, Profile). Active state glows with `--color-cherry-red`.

- **Exception:** The Bottom Nav MUST completely disappear on the `/hakeem` chat route.

### B. Phase 1: Onboarding Flow (13 Steps)

Create a seamless, Framer Motion slider for these steps:

1.  **Language:** Choose "العربية" or "English" (Triggers RTL/LTR globally).

2.  **Welcome:** "Welcome to your safe space" with a Cherry Red "Start" button.

3.  **Gender:** Male / Female.

4.  **Age:** Number input.

5.  **Target Habit:** Visual / Physical / Both.

6.  **Duration:** <1 year, 1-3 years, 3-5 years, >5 years.

7.  **Frequency (CRITICAL LOGIC):** Ask "How many times per day?". When the user enters a number and clicks Next, immediately show a 3-second "Math Shock" screen. Use a fast-rolling number animation to calculate and display: Weekly (x7), Monthly (x30), and Yearly (x365). Then auto-advance.

8.  **Triggers:** Multi-select pills.

9.  **Pre-action Emotions:** Multi-select pills.

10. **Post-action Emotions:** Multi-select pills.

11. **Cumulative Damage:** Multi-select pills.

12. **Previous Attempts:** Single choice.

13. **Core Motivation:** Single choice.

14. **Mandatory Tasks:** Select 2 locked daily habits + input for custom habits.

15. **Nickname:** Dynamically suggest names based on Gender (e.g., "The Calm Falcon") + custom input option.

### C. Phase 2: Main Dashboard (`/dashboard`)

- **Minecraft Hearts:** Display exactly 3 static (NON-PULSING), pixel-art SVG hearts colored in Cherry Red at the very top.

- **Hero Timer Card (Bento Style):** A large, premium card. Background is Cotton with subtle, overlapping minimalist circles in the corner for depth. It displays the timer (DD:HH:MM:SS) in Maroon Monospace font.

- **Wa'eth Card (بطاقة واعظ):** A beautiful card with a subtle geometric watermark. Displays a short Islamic quote/verse in 'Thamanya' font. Clicking it opens a smooth bottom-sheet drawer with detailed text.

- **Daily Habits Grid:** Displays the 2 locked habits + up to 3 flexible ones. Tapping one triggers a strikethrough and a floating "+XP" micro-animation.

- **Relapse Button:** A large, prominent pill button in Cherry Red at the bottom. Clicking it opens a soft modal ("We all stumble. Confirm?"). Confirming deducts 1 heart but KEEPS THE TIMER RUNNING.

### D. Phase 3: Hakeem AI Chat (`/hakeem`)

- **Layout:** Clean, full-screen WhatsApp-style interface.

- **Header:** Simple top bar with a "Home" icon to exit.

- **Footer:** Sticky input box and send button at the bottom (keyboard-aware). NO bottom navigation bar on this screen.

- **Quick Replies:** Scrollable horizontal chips above the text input (e.g., "I feel a trigger").

- **Styling:** User messages in Cherry Red, AI messages in Cotton (with subtle Noir Black borders).

### E. Phase 4: Library (`/library`)

- Grid layout with filter pills (All, Videos, Articles, Books).

- **Cards:** Each item MUST have a high-quality, relevant placeholder thumbnail image (Cover Image) above the title to make it look like a premium media app.

### F. Phase 5: Profile & Settings (`/profile`)

- **90-Day Healing Calendar:** A visual heatmap grid (GitHub contribution style) representing 90 days. Days are color-coded based on habit completion.

- **Settings List:** Clean segment controls for Language (AR/EN), Theme (Light/Dark), Hakeem Tone (Empathetic / Scientific / Strict), and a Logout button.

# EXECUTION INSTRUCTIONS

1. Start by defining the Tailwind configuration with the exact CSS variables provided.

2. Build the Layout wrapper and the routing state (including the conditionally hidden bottom nav).

3. Implement the Onboarding flow with the "Math Shock" calculation logic.

4. Build the Dashboard, ensuring the Bento Box aesthetic and the precise Relapse logic.

5. Provide fully functional, copy-pasteable React code. Ensure all UI elements reflect a luxurious, calm, and modern-classic lifestyle app.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://stay-strong-journey.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/655ece98-5004-4f5d-996a-9ba8a1866fb9).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
