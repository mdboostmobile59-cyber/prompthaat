import type { Config } from "tailwindcss";
const config: Config = {
  darkMode: "class",
  content: ["./src/pages/**/*.{js,ts,jsx,tsx,mdx}","./src/components/**/*.{js,ts,jsx,tsx,mdx}","./src/app/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: { extend: { colors: { brand: { orange: "#FF6B00", orangeHover: "#E05E00", dark: "#0B0F17", cardDark: "#151B28", grayText: "#94A3B8" } } } },
  plugins: [],
};
export default config;
