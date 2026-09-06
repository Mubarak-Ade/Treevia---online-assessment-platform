import { useEffect, useState } from "react";
import type { HealthResponse } from "@treevia/shared";

const apiUrl = import.meta.env.VITE_API_URL ?? "http://localhost:3001";

export default function App() {
  const [health, setHealth] = useState<HealthResponse | null>(null);

  useEffect(() => {
    fetch(`${apiUrl}/health`)
      .then((response) => response.json())
      .then(setHealth)
      .catch(() => setHealth(null));
  }, []);

  return (
    <main>
      <p className="eyebrow">Treevia monorepo</p>
      <h1>React, Express, and PostgreSQL—ready to build.</h1>
      <p>
        API health: {health ? `${health.status} (${health.database})` : "checking…"}
      </p>
    </main>
  );
}
