const withOpacity =
  (variable) =>
  ({ opacityValue }) =>
    opacityValue === undefined
      ? `rgb(var(${variable}))`
      : `rgb(var(${variable}) / ${opacityValue})`;

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        background: withOpacity("--bg-color"),
        surface: withOpacity("--surface-color"),
        textPrimary: withOpacity("--text-primary"),
        textSecondary: withOpacity("--text-secondary"),
        accent: withOpacity("--accent-color"),
        hover: withOpacity("--hover-color"),
        border: withOpacity("--border-color"),
      },
    },
  },
  plugins: [],
};
