export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        sage: {
          50: '#f8faf8',
          100: '#f0f3f0',
          200: '#d8e0d8',
          300: '#c0ccc0',
          400: '#8fa88f',
          500: '#6b8a6b',
          600: '#5a7a5a',
          700: '#456a45',
          800: '#374a37',
          900: '#2a3a2a',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
