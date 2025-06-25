"use client";

import styles from "./page.module.css";
import { useState } from "react";

export default function Home() {
  const [prompt, setPrompt] = useState<string>("");
  const [response, setResponse] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [responseTime, setResponseTime] = useState<number>(0);
  const [modelType, setModelType] = useState<ModelType>("langchain");

  type ModelType = "modelfusion" | "langchain";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    setResponse("");

    try {
      const startTime = performance.now();

      const res = await fetch(
        `/api/${modelType}?prompt=${encodeURIComponent(prompt)}`
      );
      const data = await res.json();

      const endTime = performance.now();
      const timeTaken = endTime - startTime;

      setResponse(data.response);
      setResponseTime(timeTaken);

      // eslint-disable-next-line no-console
      console.log(`La petición ha tardado ${timeTaken} milisegundos`);
    } catch (error) {
      console.error("Error:", error);
      setResponse("Error al obtener la respuesta");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.main}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.selectContainer}>
          <label htmlFor="model-select">Selecciona un modelo:</label>
          <select
            id="model-select"
            value={modelType}
            onChange={(e) => setModelType(e.target.value as ModelType)}
            className={styles.select}
            disabled={loading}
          >
			<option value='modelfusion'>ModelFusion</option>
			<option value='langchain'>LangChain</option>
		  </select>
        </div>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Escribe tu prompt aquí..."
          className={styles.textarea}
          rows={4}
        />
        <button type="submit" disabled={loading} className={styles.button}>
          {loading ? "Procesando..." : "Enviar Prompt"}
        </button>
      </form>

      {response && (
        <div className={styles.response}>
          <h3>Respuesta ({modelType === "modelfusion" ? "ModelFusion" : "LangChain"}):</h3>
          <p>{response}</p>
          <p className={styles.time}>
            Tiempo de respuesta: {responseTime.toFixed(0)} ms
          </p>
        </div>
      )}
    </main>
  );
}
