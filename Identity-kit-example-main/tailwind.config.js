/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      screens: {
        sxxs: "255px",
        sxs: "265px",
        sxs1: "275px",
        sxs2: "285px",
        sxs3: "295px",
        ss: "305px",
        ss1: "315px",
        ss2: "325px",
        ss3: "335px",
        ss4: "345px",
        dxs: "375px",
        xxs: "410px",
        xxs1: "435px",
        sm1: "480px",
        sm4: "508px",
        sm2: "538px",
        sm3: "550px",
        sm5: "590px",
        sm: "640px",
        md: "768px",
        md1: "870px",
        md2: "914px",
        md3: "936px",
        lg: "976px",
        dlg: "1025px",
        lg1: "1100px",
        lgx: "1180px",
        dxl: "1285px",
        xl: "1440px",
        xl2: "1600px",
      },
      backgroundImage: {
        "gamemania-gradient":
          "linear-gradient(to top right, #CD335F, #A15591, #717AC9, #4999F6)",
      },
      colors: {
        "custom-gradient-start": "rgba(255, 255, 255, 0.01)",
        "custom-gradient-end": "rgba(153, 153, 153, 0.2)",
        "dark-blue": "rgba(0, 123, 255, 1)",
      },
      fontFamily: {
        monckeberg: ["Monckeberg", "sans-serif"],
        inter: ["Inter", "sans-serif"],
        adam: ["Adam", "sans-serif"],
        monument: ["Monument", "sans-serif"],
        posterama: ["Posterama", "sans-serif"],
        kumbhSans: ["KumbhSans", "sans-serif"],
      },
      keyframes: {
        translateY: {
          "0%": { transform: "translateY(-90px)" },
          "100%": { transform: "translateY(0px)" },
        },
      },
      animation: {
        "translate-y": "translateY 1s ease-in-out",
      },
    },
  },
  plugins: [],
};
