import Chart from "chart.js/auto";
import { useEffect, useRef, useState } from "react";
import styles from "./PieChart.module.css";
import { fetchPatientGenderData } from "../../../../api/api";

const PatientOverview = () => {
  const [genderData, setGenderData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    const getGenderData = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchPatientGenderData();
        setGenderData(data);
      } catch (err) {
        setError("Failed to load gender distribution.", err);
      }
      setLoading(false);
    };

    getGenderData();
  }, []);

  useEffect(() => {
    if (genderData.length > 0 && chartRef.current) {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
      const ctx = chartRef.current.getContext("2d");
      chartInstance.current = new Chart(ctx, {
        type: "doughnut",
        data: {
          labels: genderData.map((item) => item.label),
          datasets: [
            {
              data: genderData.map((item) => item.value),
              backgroundColor: genderData.map((item) => item.color),
              borderWidth: 4,
            },
          ],
        },
        options: {
          responsive: true,
          cutout: "60%", // Makes the doughnut thinner
          plugins: {
            legend: { position: "top" },
          },
        },
      });
    }
  }, [genderData]);

  return (
    <div className={styles.pieChartContainer}>
      <p className={styles.pieChartTitle}>Patient Gender Distribution</p>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className={styles.errorMessage}>{error}</p>
      ) : (
        <canvas ref={chartRef}></canvas>
      )}
    </div>
  );
};

export default PatientOverview;
