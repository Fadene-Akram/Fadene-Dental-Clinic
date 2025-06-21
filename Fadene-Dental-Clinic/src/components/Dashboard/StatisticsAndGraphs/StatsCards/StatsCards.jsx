import { useEffect, useState } from "react";
import { fetchMonthlyReport } from "../../../../api/api";
import StatCard from "./StatCard";
import styles from "./StatsCards.module.css";

function StatsCards() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getStats = async () => {
      try {
        const data = await fetchMonthlyReport();
        setStats(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    getStats();
  }, []);

  if (loading) return <p>Loading stats...</p>;
  if (error) return <p className={styles.error}>{error}</p>;
  if (!stats) return null;

  const workingHours = Math.floor(stats.total_working_time_current_month / 60);
  const remainingMinutes = stats.total_working_time_current_month % 60;

  return (
    <div className={styles.statCardsContainer}>
      <StatCard
        icon={"src/assets/icons/payment.svg"}
        title={"Total Revenue Current Month"}
        value={`${stats.total_revenue_current_month} DA`}
      />
      <StatCard
        icon={"src/assets/icons/payment.svg"}
        title={"Total Expenses Current Month"}
        value={`${stats.total_expenses} DA`}
      />
      <StatCard
        icon={"src/assets/icons/payment.svg"}
        title={"Total Remaining Current Month"}
        value={`${stats.total_remaining_current_month} DA`}
      />
      <StatCard
        icon={"src/assets/icons/appointment.svg"}
        title={"Total Working Hours Current Month"}
        value={`${workingHours}h ${remainingMinutes}m`}
      />
    </div>
  );
}

export default StatsCards;
