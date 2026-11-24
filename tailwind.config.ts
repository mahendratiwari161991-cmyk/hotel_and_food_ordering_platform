import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "#E23744", // Zomato/Swiggy vibrant warm red
          hover: "#CB202D",
          light: "#FFF1F2",
          dark: "#991B1B",
        },
        secondary: {
          DEFAULT: "#2563EB",
          hover: "#1D4ED8",
          light: "#EFF6FF",
        },
        accent: {
          DEFAULT: "#F59E0B",
          hover: "#D97706",
          light: "#FEF3C7",
        },
        brand: {
          slate: "#0F172A",
          surface: "#1E293B",
          card: "#FFFFFF",
          border: "#E2E8F0",
        }
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [],
};
export default config;
