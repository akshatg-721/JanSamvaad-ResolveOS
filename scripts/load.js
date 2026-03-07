import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 100,
  duration: '30s',
  thresholds: {
    http_req_failed: ['rate<0.05'],
    http_req_duration: ['p(95)<2000']
  }
};

const baseUrl = __ENV.BASE_URL || 'http://localhost:3000';
const endpoint = __ENV.LOAD_ENDPOINT || '/record';

export default function () {
  const payload = {
    RecordingUrl: `${baseUrl}/mock-recording.wav`,
    From: '+919999999999'
  };

  const response = http.post(`${baseUrl}${endpoint}`, payload, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });

  check(response, {
    'request completed': (res) => res.status >= 200 && res.status < 500
  });

  sleep(1);
}
