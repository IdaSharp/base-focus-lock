import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        base: {
          blue: "#0052ff",
          ink: "#1f2328",
          muted: "#667085",
          line: "#d9dee7",
          panel: "#f7f8fa",
          green: "#14884f",
          red: "#c93636",
        },
      },
      boxShadow: {
        panel: "0 14px 38px rgba(31, 35, 40, 0.08)",
      },
      borderRadius: {
        dashboard: "8px",
      },
    },
  },
  plugins: [],
};

export default config;
