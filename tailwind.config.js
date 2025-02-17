/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      animation: {
        fade: "fade 3s ease-in-out forwards",
      },
      keyframes: {
        fade: {
          "0%, 100%": { opacity: 0 },
          "50%": { opacity: 1 },
        },
      },
    },
  },
  daisyui: {
    themes: ["light","dark"],
  },
  plugins: [
    require("daisyui")
  ],
}
