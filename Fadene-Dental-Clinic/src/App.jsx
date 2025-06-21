import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppLayout from "./Pages/AppLayout";
import Dashboard from "./Pages/Dashboard/Dashboard";
import Patients from "./Pages/Patients/Patients";
import AddPatient from "./components/Patients/AddPatient";
import PatientHistory from "./components/Patients/PatientHistory";
import Appointement from "./Pages/Appointements/Appointement";
import TaskBoard from "./Pages/Notes/Notes";
import Payments from "./Pages/Payments/Payments";
import SignUp from "./Pages/SignUp/SignUp";
import Login from "./Pages/Login/Login";
import SplashScreen from "./Pages/Splash Screen/SplashScreen";
import ForgotPassword from "./Pages/ForgetPassword/ForgotPassword";
import PrivateRoute from "./Pages/PrivateRoute/PrivateRoute";
import Unauthorized from "./Pages/PrivateRoute/Unauthorized";
import NotFound from "./Pages/Not Found/NotFound";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SplashScreen />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forget-password" element={<ForgotPassword />} />

        <Route element={<AppLayout />}>
          <Route element={<PrivateRoute allowedRoles={["doctor", "nurse"]} />}>
            <Route path="/patients" element={<Patients />} />
            <Route path="/patients/add" element={<AddPatient />} />
            <Route
              path="/patients/patient-history/:id"
              element={<PatientHistory />}
            />
            <Route path="/appointments" element={<Appointement />} />
            <Route path="/notes" element={<TaskBoard />} />
          </Route>

          <Route element={<PrivateRoute allowedRoles={["doctor"]} />}>
            <Route path="/payment" element={<Payments />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>

          {/* Add more routes as needed */}
        </Route>
        <Route path="*" element={<NotFound />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
