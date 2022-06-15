import http from 'k6/http';
import { check } from 'k6';

//Base config
export const options = {
  scenarios: {
    ya: {
      executor: 'ramping-arrival-rate',
      exec: 'yaRu',
      startRate: 0,
      timeUnit: '1m',
      preAllocatedVUs: 1,
      maxVUs: 10,

      stages: [
        { target: 60, duration: '5m' },
        { target: 60, duration: '10m' },
        { target: 72, duration: '5m' },
        { target: 72, duration: '10m' }
      ]
    },
    www: {
      executor: 'ramping-arrival-rate',
      exec: 'wwwRu',
      startRate: 0,
      timeUnit: '1m',
      preAllocatedVUs: 1,
      maxVUs: 10,

      stages: [
        { target: 120, duration: '5m' },
        { target: 120, duration: '10m' },
        { target: 144, duration: '5m' },
        { target: 144, duration: '10m' }
      ]
    }
  },

  thresholds: {
    http_req_duration: ['p(90) < 500', 'p(95) < 1000'],
    http_req_failed: ['rate < 0.01']
  }
}

export function yaRu () {
  const res = http.get('http://ya.ru');
  check(res, {
    'Response status 200': (r) => r.status === 200
  });
}

export function wwwRu () {
  const res = http.get('http://www.ru');
  check(res, {
    'Response status 200': (r) => r.status === 200
  });
}