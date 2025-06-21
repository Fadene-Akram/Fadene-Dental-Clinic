// import { useState, useEffect } from "react";
// import CircularProgress from "@mui/material/CircularProgress";
// import Box from "@mui/material/Box";
// import PatientsFilters from "../../components/Patients/PatientsFilters";
// import PatientTable from "../../components/Patients/PatientTable";
// import styles from "./Patients.module.css";
// import { fetchPatients, deletePatient } from "../../api/api";
// import { CustomPagination } from "../../components/Patients/CustomPagination";

// function Patients() {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [startDate, setStartDate] = useState("");
//   const [endDate, setEndDate] = useState("");
//   const [selectedGender, setSelectedGender] = useState("All");
//   const [selectedAge, setSelectedAge] = useState("All Ages");
//   const [page, setPage] = useState(1);
//   const rowsPerPage = 8;

//   const [patients, setPatients] = useState([]);
//   const [totalPages, setTotalPages] = useState(1);
//   const [loading, setLoading] = useState(false);

//   // Fetch data whenever filters or page change
//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true);
//       try {
//         const response = await fetchPatients({
//           searchTerm,
//           startDate,
//           endDate,
//           gender: selectedGender,
//           age: selectedAge,
//           page,
//           limit: rowsPerPage,
//         });
//         setPatients(response.patients);
//         setTotalPages(response.totalPages);
//       } catch (error) {
//         console.error("Failed to fetch patients:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [searchTerm, startDate, endDate, selectedGender, selectedAge, page]);

//   const handlePageChange = (newPage) => {
//     if (newPage >= 1 && newPage <= totalPages) {
//       setPage(newPage);
//     }
//   };

//   const handleDeletePatient = async (patientId) => {
//     try {
//       // Delete patient from backend
//       await deletePatient(patientId);

//       // Refetch the current page to maintain pagination and filters
//       const response = await fetchPatients({
//         searchTerm,
//         startDate,
//         endDate,
//         gender: selectedGender,
//         age: selectedAge,
//         page,
//         limit: rowsPerPage,
//       });

//       // Update patients and total pages
//       setPatients(response.patients);
//       setTotalPages(response.totalPages);

//       // Adjust page if current page becomes invalid after deletion
//       if (response.patients.length === 0 && page > 1) {
//         setPage(page - 1);
//       }
//     } catch (error) {
//       console.error("Failed to delete patient:", error);
//       alert(error.message || "Failed to delete patient. Please try again.");
//     }
//   };

//   return (
//     <div className={styles.patientsContainer}>
//       <h1 className={styles.patientsTitle}>Patients</h1>

//       <PatientsFilters
//         searchTerm={searchTerm}
//         setSearchTerm={setSearchTerm}
//         startDate={startDate}
//         setStartDate={setStartDate}
//         endDate={endDate}
//         setEndDate={setEndDate}
//         selectedGender={selectedGender}
//         setSelectedGender={setSelectedGender}
//         selectedAge={selectedAge}
//         setSelectedAge={setSelectedAge}
//       />

//       {loading ? (
//         <Box className={styles.loadingContainer}>
//           <CircularProgress size={150} />
//         </Box>
//       ) : (
//         <PatientTable
//           patients={patients}
//           onDeletePatient={handleDeletePatient}
//         />
//       )}

//       <div className={styles.patientsTablePagination}>
//         <CustomPagination
//           totalPages={totalPages}
//           currentPage={page}
//           onPageChange={handlePageChange}
//         />
//       </div>
//     </div>
//   );
// }

// export default Patients;

import { useState, useEffect } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import PatientsFilters from "../../components/Patients/PatientsFilters";
import PatientTable from "../../components/Patients/PatientTable";
import styles from "./Patients.module.css";
import { fetchPatients, deletePatient } from "../../api/api";
import { CustomPagination } from "../../components/Patients/CustomPagination";

function Patients() {
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedGender, setSelectedGender] = useState("All");
  const [selectedAge, setSelectedAge] = useState("All Ages");
  const [page, setPage] = useState(1);
  const rowsPerPage = 8;

  const [patients, setPatients] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  // Reset to first page when any filter changes
  useEffect(() => {
    setPage(1);
  }, [searchTerm, startDate, endDate, selectedGender, selectedAge]);

  // Fetch data whenever filters or page change
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetchPatients({
          searchTerm,
          startDate,
          endDate,
          gender: selectedGender,
          age: selectedAge,
          page,
          limit: rowsPerPage,
        });
        setPatients(response.patients);
        setTotalPages(response.totalPages);
      } catch (error) {
        console.error("Failed to fetch patients:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [searchTerm, startDate, endDate, selectedGender, selectedAge, page]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const handleDeletePatient = async (patientId) => {
    try {
      // Delete patient from backend
      await deletePatient(patientId);

      // Refetch the current page to maintain pagination and filters
      const response = await fetchPatients({
        searchTerm,
        startDate,
        endDate,
        gender: selectedGender,
        age: selectedAge,
        page,
        limit: rowsPerPage,
      });

      // Update patients and total pages
      setPatients(response.patients);
      setTotalPages(response.totalPages);

      // Adjust page if current page becomes invalid after deletion
      if (response.patients.length === 0 && page > 1) {
        setPage(page - 1);
      }
    } catch (error) {
      console.error("Failed to delete patient:", error);
      alert(error.message || "Failed to delete patient. Please try again.");
    }
  };

  return (
    <div className={styles.patientsContainer}>
      <h1 className={styles.patientsTitle}>Patients</h1>

      <PatientsFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        selectedGender={selectedGender}
        setSelectedGender={setSelectedGender}
        selectedAge={selectedAge}
        setSelectedAge={setSelectedAge}
      />

      {loading ? (
        <Box className={styles.loadingContainer}>
          <CircularProgress size={150} />
        </Box>
      ) : (
        <PatientTable
          patients={patients}
          onDeletePatient={handleDeletePatient}
        />
      )}

      <div className={styles.patientsTablePagination}>
        <CustomPagination
          totalPages={totalPages}
          currentPage={page}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}

export default Patients;
