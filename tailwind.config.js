/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        extreme: {
          black: '#0A0A0A',
          dark: '#141414',
          gray: '#1F1F1F',
          royal: '#4169E1',
          'royal-light': '#5A7FE8',
          orange: '#FF6B00',
          'orange-light': '#FF8533',
          white: '#FFFFFF',
          offwhite: '#F4F4F4',
        },
      },
      fontFamily: {
        manrope: ['Manrope', 'sans-serif'],
        'dm-sans': ['DM Sans', 'sans-serif'],
        playfair: ['Playfair Display', 'serif'],
      },
      backgroundImage: {
        'gradient-royal-orange': 'linear-gradient(135deg, #4169E1, #FF6B00)',
        'gradient-dark': 'linear-gradient(180deg, #0A0A0A 0%, #141414 100%)',
        'glass': 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'counter': 'counter 2s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(65, 105, 225, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(65, 105, 225, 0.6)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      boxShadow: {
        'glass': '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
        'royal': '0 0 30px rgba(65, 105, 225, 0.4)',
        'orange': '0 0 30px rgba(255, 107, 0, 0.4)',
        'card': '0 4px 24px rgba(0, 0, 0, 0.5)',
      },
      backdropBlur: {
        'glass': '20px',
      },
    },
  },
  plugins: [],
}
