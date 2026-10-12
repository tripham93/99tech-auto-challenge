import http from "k6/http"
import encoding from "k6/encoding"
import { check } from "k6"
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js"
import { textSummary } from "https://jslib.k6.io/k6-summary/0.1.0/index.js"

const target = __ENV.PERFORMANCE_TARGET
const username = __ENV.DEMOBLAZE_USERNAME
const password = __ENV.DEMOBLAZE_PASSWORD

if (!target || !username || !password) {
  throw new Error("PERFORMANCE_TARGET and test credentials are required")
}

export const options = {
  scenarios: {
    login_ramp: {
      executor: "ramping-arrival-rate",
      startRate: 1,
      timeUnit: "1s",
      preAllocatedVUs: 5,
      maxVUs: 50,
      stages: [
        { duration: "5s", target: 50 },
        { duration: "20s", target: 50 },
        { duration: "10s", target: 10 },
        { duration: "5s", target: 0 },
      ],
    },
  },
  thresholds: {
    http_req_failed: ["rate<0.01"],
    http_req_duration: ["p(95)<500"],
  },
}

export default function () {
  const response = http.post(
    `${target.replace(/\/$/, "")}/login`,
    JSON.stringify({
      username,
      password: encoding.b64encode(password),
    }),
    { headers: { "Content-Type": "application/json" } },
  )
  check(response, {
    "login responds successfully": (result) => result.status === 200,
    "login returns a token": (result) => result.body.includes("Auth_token:"),
  })
}

export function handleSummary(data) {
  return {
    "performance/reports/k6-summary.html": htmlReport(data),
    stdout: textSummary(data, { indent: " ", enableColors: true }),
  }
}