const dailyScoreEl = document.getElementById("dailyScoreValue");
const averageScoreEl = document.getElementById("averageScoreValue");
const goodHabitsEl = document.getElementById("progressList");
const badHabitsEl = document.getElementById("growthList");
const tipsContainerEl = document.getElementById("tipsContainer");
const chartCanvas = document.getElementById("trendChart");
let trendChart;

async function loadDashboard() {
  try {
    showLoader();
    const { data } = await api.get("/dashboard", { params: { range: "week" } });
    renderSummary(data);
    renderChart(data?.trend || []);
  } catch (error) {
    showToast(error.response?.data?.message || "Failed to load dashboard");
  } finally {
    hideLoader();
  }
}

function renderSummary(data) {
  if (dailyScoreEl) dailyScoreEl.textContent = data?.dailyScore ?? "--";
  if (averageScoreEl) averageScoreEl.textContent = data?.averageScore ?? "--";
  fillList(goodHabitsEl, data?.progressPoints || []);
  fillList(badHabitsEl, data?.growthAreas || []);
  fillTips(tipsContainerEl, data?.tips || []);
}

function fillList(target, items) {
  if (!target) return;
  target.innerHTML = "";
  if (!items.length) {
    target.innerHTML = '<li>No data yet</li>';
    return;
  }
  items.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    target.appendChild(li);
  });
}

function fillTips(target, tips) {
  if (!target) return;
  target.innerHTML = "";
  if (!tips.length) {
    target.innerHTML = '<p>Tips will appear after your first log.</p>';
    return;
  }
  tips.forEach((tip) => {
    const p = document.createElement("p");
    p.textContent = tip;
    target.appendChild(p);
  });
}

function renderChart(points) {
  if (!chartCanvas) return;
  const labels = points.map((item) => item.label);
  const values = points.map((item) => item.value);
  if (trendChart) trendChart.destroy();
  trendChart = new Chart(chartCanvas, {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: "Eco Score",
          data: values,
          borderColor: "#f2d08f",
          backgroundColor: "rgba(242, 208, 143, 0.25)",
          tension: 0.4,
          fill: true,
        },
      ],
    },
    options: {
      plugins: { legend: { display: false } },
      scales: {
        y: { beginAtZero: true, suggestedMax: 100 },
      },
    },
  });
}

loadDashboard();
