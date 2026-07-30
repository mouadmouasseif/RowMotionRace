import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        race: {
          background: "#020B18",
          surface: "#071426",
          elevated: "#0B1B30",
          primary: "#1677FF",
          success: "#22C77A",
          warning: "#F5B942",
          danger: "#FF3B4D",
          text: "#F8FAFC",
          muted: "#94A3B8"
        }
      }
    }
  },
  plugins: []
};
export default config;
