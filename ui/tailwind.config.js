/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      backgroundImage: {
        welcome:
          "linear-gradient(0deg, rgba(5, 81, 81, 0.80) 0%, rgba(5, 81, 81, 0.80) 100%), url('./src/images/bg-welcome.jpeg')",
      },
    },
    fontFamily: {
      poppins: ['Poppins'],
    },
  },
  plugins: [],
};
