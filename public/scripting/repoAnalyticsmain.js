// Ron Penones | November 20th 2025 - Feel free to share and reproduce, the core idea is mine with some assistance of AI. Padayon!

async function fetchAnalytics() {
  const html = await fetch("https://meowtivationhub.vercel.app/analyticsraw.html").then(res => res.text());
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  const starsMatch = doc.body.innerText.match(/Total repository stars:\s*(\d+)/);
  const totalStars = starsMatch ? parseInt(starsMatch[1]) : 0;

  const commentsMatch = doc.body.innerText.match(/Total number of comments:\s*(\d+)/);
  const totalComments = commentsMatch ? parseInt(commentsMatch[1]) : 0;

  const rows = [...doc.querySelectorAll("table tr")].slice(1);
  const labels = [];
  const values = [];

  rows.forEach(row => {
    const tds = row.querySelectorAll("td");
    if (tds.length === 2) {
      labels.push(tds[0].innerText.trim());
      values.push(parseInt(tds[1].innerText.trim()));
    }
  });

  return { totalStars, totalComments, labels, values };
}

async function createChart() {
  const data = await fetchAnalytics();

  // Iyong total stars at comments dito po iyon.
  document.getElementById("starsValue").innerText = data.totalStars;
  document.getElementById("commentsValue").innerText = data.totalComments;

  const ctx = document.getElementById("commentsPerDayChart").getContext("2d");

  const gradient = ctx.createLinearGradient(0, 0, 0, 400);
  gradient.addColorStop(0, "rgba(0, 255, 255, 0.55)");
  gradient.addColorStop(1, "rgba(0, 140, 255, 0)");

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
        legend: { labels: { color: "#fff" }},
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
