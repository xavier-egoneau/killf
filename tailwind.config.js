/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Couleurs personnalisées du design system
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
        success: 'var(--color-success)',
        danger: 'var(--color-danger)',
      },
      spacing: {
        // Spacing personnalisé du design system
        xs: 'var(--spacing-xs)',
        sm: 'var(--spacing-sm)',
        md: 'var(--spacing-md)',
        lg: 'var(--spacing-lg)',
        xl: 'var(--spacing-xl)',
      },
      fontFamily: {
        primary: 'var(--font-family)',
        secondary: 'var(--font-family-secondary)',
      },
      fontSize: {
        sm: 'var(--font-sm)',
        md: 'var(--font-md)',
        lg: 'var(--font-lg)',
        xl: 'var(--font-xl)',
      }
    },
  },
  plugins: [],
}