document.addEventListener("DOMContentLoaded", () => {
  const pm25Span = document.getElementById("pm25");
  const pm10Span = document.getElementById("pm10");
  const recommendationSpan = document.getElementById("recommendation");
  const citySpan = document.getElementById("city");

  if (!navigator.geolocation) {
    citySpan.textContent = "Brak wsparcia geolokalizacji";
    recommendationSpan.textContent = "Nie można ustalić jakości powietrza.";
    return;
  }

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const lat = position.coords.latitude.toFixed(4);
      const lon = position.coords.longitude.toFixed(4);

      // możesz zamienić na reverse geocoding żeby pokazać nazwę miasta (opcjonalnie)
      citySpan.textContent = `Twoja lokalizacja: ${lat}, ${lon}`;

      const url = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&hourly=pm10,pm2_5`;

      try {
        const res = await fetch(url);
        const data = await res.json();
        const pm25List = data.hourly.pm2_5;
        const pm10List = data.hourly.pm10;
        const lastIndex = pm25List.length - 1;

        const pm25 = pm25List[lastIndex];
        const pm10 = pm10List[lastIndex];

        pm25Span.textContent = pm25.toFixed(1);
        pm10Span.textContent = pm10.toFixed(1);

        let recommendation = "Brak danych";
        if (pm25 < 15 && pm10 < 20) {
          recommendation = "Świetna jakość – idź na spacer!";
        } else if (pm25 < 35 && pm10 < 50) {
          recommendation = "Umiarkowana – nie przesadzaj z aktywnością.";
        } else {
          recommendation = "Zła jakość – lepiej zostań w domu.";
        }

        recommendationSpan.textContent = recommendation;
      } catch (err) {
        pm25Span.textContent = "–";
        pm10Span.textContent = "–";
        recommendationSpan.textContent = "Błąd pobierania danych.";
      }
    },
    (err) => {
      citySpan.textContent = "Lokalizacja niedostępna";
      recommendationSpan.textContent = "Nie można ustalić jakości powietrza.";
    }
  );
});
