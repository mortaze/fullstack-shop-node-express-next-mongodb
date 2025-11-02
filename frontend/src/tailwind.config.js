/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      boxShadow: {},
      // چون از layout.js استفاده نمی‌کنید، این بخش را حذف کردم
      // تا تداخلی با روش تعریف فونت شما در index.scss یا globals.css ایجاد نکند
    },
  },
  plugins: [],
};
