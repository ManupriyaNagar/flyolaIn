// lib/baseUrl.js
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://app.jetserveaviation.com";
console.log('BASE_URL loaded:', BASE_URL);
console.log('NEXT_PUBLIC_API_URL:', process.env.NEXT_PUBLIC_API_URL);
export default BASE_URL