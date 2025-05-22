document.addEventListener("DOMContentLoaded", () => {
  const lat = 50.2976;
  const lon = 18.6766;
  const url = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&hourly=pm10,pm2_5`;

  const pm25Span = document.getElementById("pm25");
  const pm10Span = document.getElementById("pm10");
  const recommendationSpan = document.getElementById("recommendation");

  fetch(url)
    .then((res) => res.json())
    .then((data) => {
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
    })
    .catch(() => {
      recommendationSpan.textContent = "Brak połączenia z API.";
    });
});
