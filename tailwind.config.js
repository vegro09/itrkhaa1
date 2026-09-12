/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // Critical for Dark Mode toggle
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        background: 'var(--bg-main)',
        foreground: 'var(--text-main)',
        primary: 'var(--primary)',
        accent: 'var(--accent)',
        card: 'var(--card-bg)',
        border: 'var(--border-color)',
      }
    }
  }
};
