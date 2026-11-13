import { useEffect, useState } from "react";

type HealthState = "loading" | "ok" | "error";

export default function App() {
  const [health, setHealth] = useState<HealthState>("loading");

  useEffect(() => {
    fetch("/api/health")
      .then((response) => setHealth(response.ok ? "ok" : "error"))
      .catch(() => setHealth("error"));
  }, []);

  return (
    <main>
      <h1>KATA Météo</h1>
      <p>
        État de l'API :{" "}
        {health === "loading" && "vérification…"}
        {health === "ok" && "connectée ✅"}
        {health === "error" && "injoignable ❌"}
      </p>
    </main>
  );
}