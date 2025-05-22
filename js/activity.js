import { saveActivity } from "./db.js";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("activity-form");
  const message = document.getElementById("message");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const type = document.getElementById("type").value;
    const duration = parseInt(document.getElementById("duration").value);

    if (!type || !duration) return;

    message.textContent = "Pobieram lokalizację...";

    // Geolokalizacja
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude.toFixed(4);
        const lon = position.coords.longitude.toFixed(4);

        message.textContent = "Pobieram dane o powietrzu...";

        // Open-Meteo API
        const url = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&hourly=pm10,pm2_5`;

        let pm25 = null;
        let pm10 = null;

        try {
          const res = await fetch(url);
          const data = await res.json();
          const i = data.hourly.pm2_5.length - 1;
          pm25 = data.hourly.pm2_5[i];
          pm10 = data.hourly.pm10[i];
        } catch (err) {
          console.warn("Nie udało się pobrać danych o powietrzu:", err);
        }

        const activity = {
          type,
          duration,
          date: new Date().toISOString(),
          pm25,
          pm10,
          lat,
          lon,
        };

        try {
          await saveActivity(activity);
          message.textContent = "Aktywność zapisana!";
          form.reset();
        } catch (err) {
          message.textContent = "Błąd zapisu aktywności 😞";
        }
      },
      (err) => {
        console.error("Błąd geolokalizacji:", err);
        message.textContent = "Nie udało się pobrać lokalizacji 😞";
      }
    );
  });
});
