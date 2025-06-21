import { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import "chart.js/auto";
import styles from "./LineChart.module.css";
import { fetchRevenueExpenses } from "../../../../api/api";

function LineChartComponent() {
  const [selectedFilter, setSelectedFilter] = useState("Week");
  const [data, setData] = useState({ revenue: [], expenses: [], labels: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await fetchRevenueExpenses(selectedFilter);
        setData({
          revenue: result.revenue,
          expenses: result.total_expenses,
          labels: result.labels,
        });
      } catch (err) {
        setError("Failed to load data. Please try again later.", err);
      }
      setLoading(false);
    };

    getData();
  }, [selectedFilter]);

  const chartData = {
    labels: data.labels,
    datasets: [
      {
        label: "Revenue",
        data: data.revenue,
        borderColor: "#a2f2ef",
        backgroundColor: "rgba(162, 242, 239, 0.5)",
        tension: 0.3,
      },
      {
        label: "Expenses",
        data: data.expenses,
        borderColor: "#243956",
        backgroundColor: "rgba(36, 57, 86, 0.5)",
        tension: 0.3,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
    },
    scales: {
      x: { grid: { display: false } },
      y: { grid: { display: false } },
    },
  };

  return (
    <div className={styles.lineChartContainer}>
      <div className={styles.lineChartHeader}>
        <p className={styles.lineChartHeaderP}>Revenue vs Expenses</p>
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
        <div
          className={styles.lineChartParent}
          style={{ height: "fit-content" }}
        >
          <Line data={chartData} options={options} />
        </div>
      )}
    </div>
  );
}

export default LineChartComponent;
