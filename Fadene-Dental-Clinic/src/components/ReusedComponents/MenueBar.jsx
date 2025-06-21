// import { useState, useEffect, useMemo } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import styles from "./MenueBar.module.css";
// import clinicLogo from "../../assets/icons/tooth.svg";
// import dashboardLogo from "../../assets/icons/dashboard.svg";
// import patientLogo from "../../assets/icons/patient.svg";
// import appointmentLogo from "../../assets/icons/appointment.svg";
// import paymentLogo from "../../assets/icons/payment.svg";
// import NotesLogo from "../../assets/icons/Notes.svg";

// function MenueBar() {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [activeItem, setActiveItem] = useState("Dashboard");
//   const userRole = localStorage.getItem("userRole");

//   const pathToItem = useMemo(
//     () => ({
//       "/dashboard": "Dashboard",
//       "/patients": "Patients",
//       "/appointments": "Appointments",
//       "/payment": "Payment",
//       "/notes": "Notes",
//     }),
//     []
//   );
//   useEffect(() => {
//     const matchedItem =
//       Object.entries(pathToItem).find(([path]) =>
//         location.pathname.startsWith(path)
//       )?.[1] || "Dashboard";

//     setActiveItem(matchedItem);
//   }, [location.pathname, pathToItem]);

//   function handleItemClick(itemName, path) {
//     setActiveItem(itemName);
//     navigate(path);
//   }

//   const allMenuItems = [
//     {
//       name: "Dashboard",
//       icon: dashboardLogo,
//       path: "/dashboard",
//       logoClass: styles.itemLogo1,
//     },
//     {
//       name: "Patients",
//       icon: patientLogo,
//       path: "/patients",
//       logoClass: styles.itemLogo3,
//     },
//     {
//       name: "Appointments",
//       icon: appointmentLogo,
//       path: "/appointments",
//       logoClass: styles.itemLogo1,
//     },
//     {
//       name: "Payment",
//       icon: paymentLogo,
//       path: "/payment",
//       logoClass: styles.itemLogo,
//     },
//     {
//       name: "Notes",
//       icon: NotesLogo,
//       path: "/notes",
//       logoClass: styles.itemLogo,
//     },
//   ];

//   // Filter menu based on user role
//   const menuItems =
//     userRole === "nurse"
//       ? allMenuItems.filter((item) =>
//           ["Patients", "Appointments", "Notes"].includes(item.name)
//         )
//       : allMenuItems;

//   return (
//     <div className={styles.menueBarContainer}>
//       <div className={styles.menueBarLogo}>
//         <img
//           className={styles.menueBarLogoImg}
//           src={clinicLogo}
//           alt="Fadene-Dental-Logo"
//         />
//         <p className={styles.menueBarLogoP}>Fadene Dental Clinic</p>
//       </div>
//       <ul className={styles.menueBarItems}>
//         {menuItems.map((item) => (
//           <li
//             key={item.name}
//             className={`${styles.menueBarItem} ${
//               activeItem === item.name ? styles.activeItem : ""
//             }`}
//             onClick={() => handleItemClick(item.name, item.path)}
//           >
//             <img className={item.logoClass} src={item.icon} alt={item.name} />
//             <p className={styles.itemP}>{item.name}</p>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }

// export default MenueBar;

import { useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./MenueBar.module.css";
import clinicLogo from "../../assets/images/toothh.png";
import dashboardLogo from "../../assets/icons/dashboard.svg";
import patientLogo from "../../assets/icons/patient.svg";
import appointmentLogo from "../../assets/icons/appointment.svg";
import paymentLogo from "../../assets/icons/payment.svg";
import NotesLogo from "../../assets/icons/Notes.svg";

function MenueBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeItem, setActiveItem] = useState("Dashboard");
  const userRole = localStorage.getItem("userRole");

  const pathToItem = useMemo(
    () => ({
      "/dashboard": "Dashboard",
      "/patients": "Patients",
      "/appointments": "Appointments",
      "/payment": "Payment",
      "/notes": "Notes",
    }),
    []
  );

  useEffect(() => {
    const matchedItem =
      Object.entries(pathToItem).find(([path]) =>
        location.pathname.startsWith(path)
      )?.[1] || "Dashboard";

    setActiveItem(matchedItem);
  }, [location.pathname, pathToItem]);

  function handleItemClick(itemName, path) {
    setActiveItem(itemName);
    navigate(path);
  }

  function handleLogout() {
    localStorage.clear();
    navigate("/login");
  }

  const allMenuItems = [
    {
      name: "Dashboard",
      icon: dashboardLogo,
      path: "/dashboard",
      logoClass: styles.itemLogo1,
    },
    {
      name: "Patients",
      icon: patientLogo,
      path: "/patients",
      logoClass: styles.itemLogo3,
    },
    {
      name: "Appointments",
      icon: appointmentLogo,
      path: "/appointments",
      logoClass: styles.itemLogo1,
    },
    {
      name: "Payment",
      icon: paymentLogo,
      path: "/payment",
      logoClass: styles.itemLogo,
    },
    {
      name: "Notes",
      icon: NotesLogo,
      path: "/notes",
      logoClass: styles.itemLogo,
    },
  ];

  // Filter menu based on user role
  const menuItems =
    userRole === "nurse"
      ? allMenuItems.filter((item) =>
          ["Patients", "Appointments", "Notes"].includes(item.name)
        )
      : allMenuItems;

  return (
    <div className={styles.menueBarContainer}>
      <div className={styles.menueBarLogo}>
        <img
          className={styles.menueBarLogoImg}
          src={clinicLogo}
          alt="Fadene-Dental-Logo"
        />
        <p className={styles.menueBarLogoP}>Fadene Dental Clinic</p>
      </div>
      <ul className={styles.menueBarItems}>
        {menuItems.map((item) => (
          <li
            key={item.name}
            className={`${styles.menueBarItem} ${
              activeItem === item.name ? styles.activeItem : ""
            }`}
            onClick={() => handleItemClick(item.name, item.path)}
          >
            <img className={item.logoClass} src={item.icon} alt={item.name} />
            <p className={styles.itemP}>{item.name}</p>
          </li>
        ))}
      </ul>
      <button className={styles.logoutButton} onClick={handleLogout}>
        Log Out
      </button>
    </div>
  );
}

export default MenueBar;
