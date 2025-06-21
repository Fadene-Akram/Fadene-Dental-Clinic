import { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import { fetchPatientPopulation } from "../../../../api/api";
import "chart.js/auto";
import styles from "./BarChart.module.css";

function PopulationBarChart() {
  const [selectedFilter, setSelectedFilter] = useState("Week");
  const [dataset, setDataset] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fallbackData = {
    Week: [
      { period: "Mon", children: 400, adults: 1200, elderly: 350 },
      { period: "Tue", children: 380, adults: 1150, elderly: 370 },
      { period: "Wed", children: 420, adults: 1280, elderly: 390 },
      { period: "Thu", children: 450, adults: 1300, elderly: 380 },
      { period: "Fri", children: 470, adults: 1350, elderly: 410 },
      { period: "Sat", children: 600, adults: 1500, elderly: 460 },
      { period: "Sun", children: 580, adults: 1480, elderly: 440 },
    ],
    Month: [
      { period: "Week 1", children: 1800, adults: 5500, elderly: 1600 },
      { period: "Week 2", children: 2000, adults: 5800, elderly: 1700 },
      { period: "Week 3", children: 2200, adults: 6000, elderly: 1750 },
      { period: "Week 4", children: 2400, adults: 6200, elderly: 1800 },
    ],
    Year: [
      { period: "Jan-Feb", children: 12000, adults: 35000, elderly: 10000 },
      { period: "Mar-Apr", children: 13000, adults: 36000, elderly: 10500 },
      { period: "May-Jun", children: 14000, adults: 37000, elderly: 11000 },
      { period: "Jul-Aug", children: 15000, adults: 38000, elderly: 11500 },
      { period: "Sep-Oct", children: 14500, adults: 37500, elderly: 11200 },
      { period: "Nov-Dec", children: 13500, adults: 36500, elderly: 10800 },
    ],
  };

  useEffect(() => {
    const getPatientPopulation = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await fetchPatientPopulation(selectedFilter);
        setDataset(
          data && data.length > 0 ? data : fallbackData[selectedFilter]
        );
      } catch (err) {
        setDataset(fallbackData[selectedFilter]);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    getPatientPopulation();
  }, [selectedFilter]);

  const chartData = {
    labels: dataset.map((item) => item.period),
    datasets: [
      {
        label: "Children",
        data: dataset.map((item) => item.children),
        backgroundColor: "#a2f2ef",
      },
      {
        label: "Adults",
        data: dataset.map((item) => item.adults),
        backgroundColor: "#243956",
      },
      {
        label: "Elderly",
        data: dataset.map((item) => item.elderly),
        backgroundColor: "#dff9fa",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" },
      tooltip: {
        callbacks: {
          label: (context) => `${context.raw} patients`,
        },
      },
    },
    scales: {
      x: { grid: { display: false } },
      y: { grid: { display: false } },
    },
  };

  return (
    <div className={styles.barChartContainer}>
      <div className={styles.barChartHeader}>
        <p className={styles.barChartHeaderP}>Patients Overview</p>
        <div className={styles.filterList}>
          {["Week", "Month", "Year"].map((filter) => (
            <p
              key={filter}
              onClick={() => setSelectedFilter(filter)}
              className={`${styles.filterListP} ${
                selectedFilter === filter ? styles.activeFilter : ""
              }`}
            >
              {filter}
            </p>
          ))}
        </div>
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className={styles.errorMessage}>{error}</p>
      ) : (
        <div style={{ height: "280px" }}>
          <Bar data={chartData} options={chartOptions} />
        </div>
      )}
    </div>
  );
}

export default PopulationBarChart;
