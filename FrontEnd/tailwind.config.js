module.exports = {
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    zIndex: {
      10: 10,
      20: 20,
      30: 30,
      40: 40,
      50: 50,
      60: 60,
      70: 70,
      80: 80,
      90: 90,
      100: 100,
      110: 110,
    },
    rotate: {
      "-10": "-10deg",
      "-20": "-20deg",
      "-30": "-30deg",
      "-40": "-40deg",
      "-50": "-50deg",
      "-60": "-60deg",
      "-70": "-70deg",
      "-80": "-80deg",
    },
    extend: {
      spacing: {
        16: "4rem",
        32: "8rem",
        64: "16rem",
        72: "18rem",
        76: "19rem",
        84: "21rem",
        96: "24rem",
        108: "27rem",
        120: "30rem",
        132: "33rem",
        135: "36rem",
        137: "39rem",
        200: "50rem",
        240: "60rem",
        280: "70rem",
        300: "75rem",
        340: "85rem",
        388: "97rem",
        600: "150rem",
      },
    },
  },
  variants: {
    rotate: ["responsive", "hover", "focus", "group-hover"],
    translate: ["responsive", "hover", "focus", "group-hover"],
    width: ["responsive", "hover", "focus", "group-hover"],
    height: ["responsive", "hover", "focus", "group-hover"],
    extend: {},
  },
  plugins: [],
};
