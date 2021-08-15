module.exports = {
  purge: ["./src/components/**/*.vue"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        primary: {
          100: "#b0f4e6",
          200: "#84edd8",
          300: "#57e7cb",
          400: "#2ae1bd",
          500: "#1BBD9D",
          600: "#159078",
          700: "#0e6453",
          800: "#08372e",
          900: "#010a09",
        },
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
