import AppointementsTable from "./AppointementsTable/AppointementsTable";
import Graphs from "./Graphs/Graphs";
import PatientOverview from "./Graphs/PieChart";
import styles from "./StatisticsAndVisualization.module.css";
import StatsCards from "./StatsCards/StatsCards";

function StatisticsAndVisualization() {
  return (
    <div className={styles.statisticsContainer}>
      <StatsCards />
      <Graphs />
      <div className={styles.pieChartTableContainer}>
        <PatientOverview />
        <AppointementsTable />
      </div>
    </div>
  );
}

export default StatisticsAndVisualization;
