module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        wagmi: "Satoshi",
      },
      colors: {
        primary: "#ffae33",
        tan: "#dbb877",
        pita: "#000612",
      },
      boxShadow: {
        damn: "0 2px 2px rgba(4,4,7,.45),0 8px 24px rgba(4,4,7,.6)",
      },
      dropShadow: {
        soju: "0 0 5px #1da7eb",
        tabler: "0 0 5px #fff",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--gradient-color-stops))",
      },
      keyframes: {
        hide: {
          "0%": {
            opacity: 1,
          },
          "100%": {
            opacity: 0,
          },
        },
        slideIn: {
          "0%": {
            transform: "translateY(-110%)",
          },
          "100%": {
            transform: "translateY(0)",
          },
        },
      },
      animation: {
        hide: "hide 100ms ease-in",
        slideIn: "slideIn 150ms cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [
    require("tailwindcss-radix")({
      variantPrefix: "rdx",
    }),
    require("tailwind-gradient-mask-image"),
  ],
};
