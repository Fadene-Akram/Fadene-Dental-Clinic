import PopulationBarChart from "./BarChart";
import styles from "./Graphs.module.css";
import LineChartComponent from "./LineChart";

function Graphs() {
  return (
    <div className={styles.graphsContainer}>
      <PopulationBarChart />
      <LineChartComponent />
    </div>
  );
}

export default Graphs;
