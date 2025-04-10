// lib/baseUrl.js

const BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://api.flyola.in/"
    : "http://localhost:4000";

export default BASE_URL;
