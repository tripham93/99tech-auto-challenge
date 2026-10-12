import "dotenv/config"

export const settings = {
  baseUrl: process.env.BASE_URL ?? "https://www.demoblaze.com",
  apiUrl: process.env.API_URL ?? "https://api.demoblaze.com",
  username: process.env.DEMOBLAZE_USERNAME,
  password: process.env.DEMOBLAZE_PASSWORD,
  order: {
    name: process.env.ORDER_NAME ?? "QA Test",
    country: process.env.ORDER_COUNTRY ?? "United States",
    city: process.env.ORDER_CITY ?? "Seattle",
    card: process.env.ORDER_CARD ?? "4111111111111111",
    month: process.env.ORDER_MONTH ?? "12",
    year: process.env.ORDER_YEAR ?? "2030",
  },
}