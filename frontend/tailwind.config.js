export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      boxShadow: {
        glow: '0 25px 80px rgba(14, 165, 233, 0.18)',
      },
      backgroundImage: {
        'hero-glow': 'radial-gradient(circle at top right, rgba(56, 189, 248, 0.18), transparent 28%)',
      },
    },
  },
  plugins: [],
};
