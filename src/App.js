import React, { useState } from "react";

function App() {
  const [form, setForm] = useState({
    artists: "",
    album_name: "",
    track_name: "",
    track_genre: "",
    duration_ms: "",
    energy: "",
    danceability: ""
  });

  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setErrorMsg(null);
    setPrediction(null);

    try {
      const response = await fetch("https://spotify-api-7yzn.onrender.com/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ...form,
          duration_ms: Number(form.duration_ms),
          energy: Number(form.energy),
          danceability: Number(form.danceability)
        })
      });

      // 🔥 VALIDACIÓN CLAVE
      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Error ${response.status}: ${text}`);
      }

      const data = await response.json();

      if (data.predicted_popularity !== undefined) {
        setPrediction(data.predicted_popularity);
      } else {
        throw new Error("La API no devolvió predicción");
      }

    } catch (error) {
      console.error("Error:", error);
      setErrorMsg(error.message);
    }

    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <h1>🎵 Spotify Popularity Predictor</h1>

      <div style={styles.form}>
        <input name="artists" placeholder="Artists" onChange={handleChange} style={styles.input} />
        <input name="album_name" placeholder="Album Name" onChange={handleChange} style={styles.input} />
        <input name="track_name" placeholder="Track Name" onChange={handleChange} style={styles.input} />
        <input name="track_genre" placeholder="Genre" onChange={handleChange} style={styles.input} />
        <input name="duration_ms" placeholder="Duration (ms)" onChange={handleChange} style={styles.input} />
        <input name="energy" placeholder="Energy (0-1)" onChange={handleChange} style={styles.input} />
        <input name="danceability" placeholder="Danceability (0-1)" onChange={handleChange} style={styles.input} />

        <button onClick={handleSubmit} style={styles.button}>
          {loading ? "Predicting..." : "Predict"}
        </button>
      </div>

      {prediction !== null && (
        <div style={styles.result}>
          🎯 Predicted Popularity: <b>{prediction.toFixed(2)}</b>
        </div>
      )}

      {errorMsg && (
        <div style={{ color: "red", marginTop: "20px" }}>
          ❌ {errorMsg}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    textAlign: "center",
    marginTop: "50px",
    fontFamily: "Arial"
  },
  form: {
    display: "flex",
    flexDirection: "column",
    width: "300px",
    margin: "auto",
    gap: "10px"
  },
  input: {
    padding: "10px",
    fontSize: "14px"
  },
  button: {
    padding: "10px",
    backgroundColor: "#1DB954",
    color: "white",
    border: "none",
    cursor: "pointer"
  },
  result: {
    marginTop: "20px",
    fontSize: "20px"
  }
};

export default App;