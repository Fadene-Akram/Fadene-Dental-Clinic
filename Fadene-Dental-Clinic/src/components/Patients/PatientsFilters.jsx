import { useState } from "react";
import { Search, Calendar, Users, User } from "lucide-react";
import styles from "./PatientsFilters.module.css";
import { useNavigate } from "react-router-dom";

// const PatientsFilters = () => {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [startDate, setStartDate] = useState("");
//   const [endDate, setEndDate] = useState("");
//   const [selectedGender, setSelectedGender] = useState("All");
//   const [selectedAge, setSelectedAge] = useState("All Ages");
//   const [isDateOpen, setIsDateOpen] = useState(false);
//   const [isGenderOpen, setIsGenderOpen] = useState(false);
//   const [isAgeOpen, setIsAgeOpen] = useState(false);

//   const genderOptions = ["All", "Male", "Female"];
//   const ageOptions = ["All Ages", "Children", "Adult", "Elderly"];
//   const navigate = useNavigate();

//   function handleAddPatient() {
//     navigate("/patients/add");
//   }
//   return (
//     <div className={styles.container}>
//       <div className={styles.filtersGroup}>
//         {/* Date Range Filter */}
//         <div className={styles.filterContainer}>
//           <button
//             onClick={() => {
//               setIsDateOpen(!isDateOpen);
//               setIsGenderOpen(false);
//               setIsAgeOpen(false);
//             }}
//             className={styles.filterButton}
//           >
//             <Calendar className={styles.filterIcon} />
//             <span className={styles.filterText}>
//               {startDate && endDate
//                 ? `${startDate} - ${endDate}`
//                 : "Filter by Registration Date"}
//             </span>
//           </button>

//           {isDateOpen && (
//             <div className={`${styles.dropdownMenu} ${styles.dateDropdown}`}>
//               <div className={styles.dateInputGroup}>
//                 <div className={styles.dateInputWrapper}>
//                   <label className={styles.dateLabel}>Start Date</label>
//                   <input
//                     type="date"
//                     value={startDate}
//                     onChange={(e) => setStartDate(e.target.value)}
//                     className={styles.dateInput}
//                   />
//                 </div>
//                 <div className={styles.dateInputWrapper}>
//                   <label className={styles.dateLabel}>End Date</label>
//                   <input
//                     type="date"
//                     value={endDate}
//                     onChange={(e) => setEndDate(e.target.value)}
//                     className={styles.dateInput}
//                   />
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Gender Filter */}
//         <div className={styles.filterContainer}>
//           <button
//             onClick={() => {
//               setIsGenderOpen(!isGenderOpen);
//               setIsDateOpen(false);
//               setIsAgeOpen(false);
//             }}
//             className={styles.filterButton}
//           >
//             <Users className={styles.filterIcon} />
//             <span className={styles.filterText}>{selectedGender}</span>
//           </button>

//           {isGenderOpen && (
//             <div className={`${styles.dropdownMenu} ${styles.optionsDropdown}`}>
//               {genderOptions.map((gender) => (
//                 <button
//                   key={gender}
//                   onClick={() => {
//                     setSelectedGender(gender);
//                     setIsGenderOpen(false);
//                   }}
//                   className={styles.dropdownOption}
//                 >
//                   {gender}
//                 </button>
//               ))}
//             </div>
//           )}
//         </div>

//         {/* Age Filter */}
//         <div className={styles.filterContainer}>
//           <button
//             onClick={() => {
//               setIsAgeOpen(!isAgeOpen);
//               setIsDateOpen(false);
//               setIsGenderOpen(false);
//             }}
//             className={styles.filterButton}
//           >
//             <User className={styles.filterIcon} />
//             <span className={styles.filterText}>{selectedAge}</span>
//           </button>

//           {isAgeOpen && (
//             <div className={`${styles.dropdownMenu} ${styles.optionsDropdown}`}>
//               {ageOptions.map((age) => (
//                 <button
//                   key={age}
//                   onClick={() => {
//                     setSelectedAge(age);
//                     setIsAgeOpen(false);
//                   }}
//                   className={styles.dropdownOption}
//                 >
//                   {age}
//                 </button>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>

//       <div className={styles.searchSection}>
//         <div className={styles.searchWrapper}>
//           <Search className={styles.searchIcon} />
//           <input
//             type="text"
//             placeholder="Search patients..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className={styles.searchInput}
//           />
//         </div>
//         <button className={styles.addButton} onClick={handleAddPatient}>
//           <span className={styles.addButtonPlus}>+</span>
//           <span className={styles.addButtonLabel}>Add Patient</span>
//         </button>
//       </div>
//     </div>
//   );
// };

// export default PatientsFilters;

const PatientsFilters = ({
  searchTerm,
  setSearchTerm,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  selectedGender,
  setSelectedGender,
  selectedAge,
  setSelectedAge,
}) => {
  const [isDateOpen, setIsDateOpen] = useState(false);
  const [isGenderOpen, setIsGenderOpen] = useState(false);
  const [isAgeOpen, setIsAgeOpen] = useState(false);

  const genderOptions = ["All", "Male", "Female"];
  const ageOptions = ["All Ages", "Children", "Adult", "Elderly"];
  const navigate = useNavigate();

  function handleAddPatient() {
    navigate("/patients/add");
  }

  return (
    <div className={styles.container}>
      <div className={styles.filtersGroup}>
        {/* Date Range Filter */}
        <div className={styles.filterContainer}>
          <button
            onClick={() => {
              setIsDateOpen(!isDateOpen);
              setIsGenderOpen(false);
              setIsAgeOpen(false);
            }}
            className={styles.filterButton}
          >
            <Calendar className={styles.filterIcon} />
            <span className={styles.filterText}>
              {startDate && endDate
                ? `${startDate} - ${endDate}`
                : "Filter by Registration Date"}
            </span>
          </button>

          {isDateOpen && (
            <div className={`${styles.dropdownMenu} ${styles.dateDropdown}`}>
              <div className={styles.dateInputGroup}>
                <div className={styles.dateInputWrapper}>
                  <label className={styles.dateLabel}>Start Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className={styles.dateInput}
                  />
                </div>
                <div className={styles.dateInputWrapper}>
                  <label className={styles.dateLabel}>End Date</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className={styles.dateInput}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Gender Filter */}
        <div className={styles.filterContainer}>
          <button
            onClick={() => {
              setIsGenderOpen(!isGenderOpen);
              setIsDateOpen(false);
              setIsAgeOpen(false);
            }}
            className={styles.filterButton}
          >
            <Users className={styles.filterIcon} />
            <span className={styles.filterText}>{selectedGender}</span>
          </button>

          {isGenderOpen && (
            <div className={`${styles.dropdownMenu} ${styles.optionsDropdown}`}>
              {genderOptions.map((gender) => (
                <button
                  key={gender}
                  onClick={() => {
                    setSelectedGender(gender);
                    setIsGenderOpen(false);
                  }}
                  className={styles.dropdownOption}
                >
                  {gender}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Age Filter */}
        <div className={styles.filterContainer}>
          <button
            onClick={() => {
              setIsAgeOpen(!isAgeOpen);
              setIsDateOpen(false);
              setIsGenderOpen(false);
            }}
            className={styles.filterButton}
          >
            <User className={styles.filterIcon} />
            <span className={styles.filterText}>{selectedAge}</span>
          </button>

          {isAgeOpen && (
            <div className={`${styles.dropdownMenu} ${styles.optionsDropdown}`}>
              {ageOptions.map((age) => (
                <button
                  key={age}
                  onClick={() => {
                    setSelectedAge(age);
                    setIsAgeOpen(false);
                  }}
                  className={styles.dropdownOption}
                >
                  {age}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className={styles.searchSection}>
        <div className={styles.searchWrapper}>
          <Search className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search patients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>
        <button className={styles.addButton} onClick={handleAddPatient}>
          <span className={styles.addButtonPlus}>+</span>
          <span className={styles.addButtonLabel}>Add Patient</span>
        </button>
      </div>
    </div>
  );
};

export default PatientsFilters;
