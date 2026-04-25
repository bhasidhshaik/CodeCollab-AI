
export interface TestResult {
  http: number;
  id: number;
  socket: number;
  timestamp: string;
}

export interface Stats {
  avg: number;
  max: number;
  median: number;
  min: number;
  stdDev: number;
}
