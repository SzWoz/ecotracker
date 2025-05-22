import { getAllActivities } from "./db.js";

document.addEventListener("DOMContentLoaded", async () => {
  const list = document.getElementById("history-list");
  list.innerHTML = "";

  try {
    const activities = await getAllActivities();

    if (activities.length === 0) {
      list.innerHTML = "<li>Brak zapisanych aktywności.</li>";
      return;
    }

    activities
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .forEach((act) => {
        const item = document.createElement("li");
        const date = new Date(act.date).toLocaleString("pl-PL");

        let airQuality = "";

        if (act.pm25 != null && act.pm10 != null) {
          airQuality += `<br/><small>PM2.5: ${act.pm25.toFixed(
            1
          )} | PM10: ${act.pm10.toFixed(1)}</small>`;
        } else {
          airQuality += `<br/><small>Brak danych o powietrzu</small>`;
        }

        if (act.lat && act.lon) {
          airQuality += `<br/><small>📍 ${act.lat}, ${act.lon}</small>`;
        }

        item.innerHTML = `
          <strong>${act.type}</strong> – ${act.duration} min<br/>
          <small>${date}</small>
          ${airQuality}
        `;

        list.appendChild(item);
      });
  } catch (err) {
    list.innerHTML = "<li>Błąd ładowania aktywności 😞</li>";
  }
});
