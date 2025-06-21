import CalenderAndNotes from "../../components/Dashboard/CalenderAndNotes/CalenderAndNotes";
import StatisticsAndVisualization from "../../components/Dashboard/StatisticsAndGraphs/StatisticsAndVisualization";
import styles from "./Dashboard.module.css";

function Dashboard() {
  return (
    <div className={styles.dashboardContainer}>
      <StatisticsAndVisualization />
      <CalenderAndNotes />
    </div>
  );
}

export default Dashboard;
