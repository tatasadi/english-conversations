import type { Config } from "tailwindcss";
const colors = require("tailwindcss/colors");

export default {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: colors.green,
        secondary: colors.teal,
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
} satisfies Config;
