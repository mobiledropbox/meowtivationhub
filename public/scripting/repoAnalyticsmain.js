// Ron Penones | November 21st 2025 - Feel free to share and reproduce, the core idea is mine with some assistance of AI. Padayon!

async function fetchAnalytics() {
  const resp = await fetch("/api/repoStats", { cache: "no-store" }); // Kukuha siya ng data from repoStats.js imbis na html scraping.
  if (!resp.ok) throw new Error("Failed to load stats");

  const data = await resp.json();

  // Para mauna iyong earlier date mula sa kaliwa imbis na latest.
const sortedEntries = Object.entries(data.commentStats)
  .sort((a, b) => new Date(a[0]) - new Date(b[0]));

const labels = sortedEntries.map(entry => entry[0]);
const values = sortedEntries.map(entry => entry[1]);

  return {
    totalStars: data.totalStars,
    totalComments: data.totalComments,
    labels,
    values,
  };
}

async function createChart() {
  const data = await fetchAnalytics();

  // Fill summary values
  document.getElementById("starsValue").innerText = data.totalStars;
  document.getElementById("commentsValue").innerText = data.totalComments;

  const ctx = document.getElementById("commentsPerDayChart").getContext("2d");

  const gradient = ctx.createLinearGradient(0, 0, 0, 400);
  gradient.addColorStop(0, "rgba(0,255,255,0.55)");
  gradient.addColorStop(1, "rgba(0,140,255,0)");

  new Chart(ctx, {
    type: "line",
    data: {
      labels: data.labels,
      datasets: [{
        label: "Comments per date",
        data: data.values,
        tension: 0.35,
        borderWidth: 3,
        borderColor: "cyan",
        pointBackgroundColor: "white",
        pointRadius: 5,
        fill: true,
        backgroundColor: gradient,
      }]
    },
    options: {
      plugins: {
        legend: { labels: { color: "#fff" }}
      },
      scales: {
        x: {
          ticks: { color: "#d6e2ff" },
          grid: { color: "rgba(255,255,255,0.08)" }
        },
        y: {
          ticks: { color: "#d6e2ff" },
          grid: { color: "rgba(255,255,255,0.08)" }
        }
      }
    }
  });
}

createChart();
