/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./templates/**/*.html.twig", // Or your template files
    "./js/**/*.js", // If you use JavaScript with Tailwind classes
    // './src/includes/**/*.inc',
  ],
  safelist: [
    {
      pattern: /grid-(1|2|3|4|5|6|7|8|9|10|11|12)/,
      variants: ['tablet', 'laptop', 'desktop', 'wide'],
    },
  ],
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
}

