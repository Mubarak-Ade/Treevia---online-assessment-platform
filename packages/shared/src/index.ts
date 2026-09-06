export type HealthResponse = {
  status: "ok";
  database: "connected" | "unavailable";
  timestamp: string;
};
