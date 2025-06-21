import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { addPatient } from "../../api/api";
import { useState } from "react";
import styles from "./AddPatient.module.css";
import SuccessErrorModal from "./SuccessErrorModal";

function AddPatient() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(true);

  function handleGoBackPatients() {
    navigate(-1);
  }

  const calculateBirthYear = (age) => {
    const currentYear = new Date().getFullYear();
    return `${currentYear - age}-01-01`; // Default to Jan 1st
  };

  const calculateAge = (dob) => {
    const birthYear = new Date(dob).getFullYear();
    const currentYear = new Date().getFullYear();
    return currentYear - birthYear;
  };

  const handleAgeChange = (e) => {
    const newAge = e.target.value;
    setValue("dateOfBirth", calculateBirthYear(newAge));
  };

  const handleDateChange = (e) => {
    const newDate = e.target.value;
    setValue("age", calculateAge(newDate));
  };

  const onSubmit = async (data) => {
    try {
      const transformedData = {
        full_name: `${data.firstName} ${data.lastName}`,
        age: data.age,
        date_of_birth: new Date(data.dateOfBirth).toISOString().split("T")[0],
        phone_number: data.phoneNumber,
        gender:
          data.gender === "male" ? "M" : data.gender === "female" ? "F" : "O",
      };

      await addPatient(transformedData);
      setModalMessage("Patient added successfully!");
      setIsSuccess(true);
      setModalOpen(true);
    } catch (error) {
      setModalMessage("Failed to add patient. Please try again.");
      setIsSuccess(false);
      setModalOpen(true);
    }
  };

  return (
    <div className={styles.addPatientContainer}>
      <p className={styles.backToPatients} onClick={handleGoBackPatients}>
        <span className={styles.backArrow}>&larr; </span>
        Go back to Patients
      </p>

      <p className={styles.addPatientHeader}>Add a new patient</p>

      <div className={styles.formContainer}>
        <p className={styles.basicInfo}>Patient Information :</p>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className={styles.basicInfoForm}
        >
          <div className={styles.pairInputs}>
            <div className={styles.formGroup}>
              <label htmlFor="firstName" className={styles.formLabel}>
                First Name
              </label>
              <input
                {...register("firstName", {
                  required: "First name is required",
                  minLength: { value: 2, message: "At least 2 characters" },
                  pattern: {
                    value: /^[A-Za-z]+(?: [A-Za-z]+)*$/,
                    message: "First name must contain only letters",
                  },
                })}
                type="text"
                id="firstName"
                className={styles.formInput}
                placeholder="Enter First Name"
              />
              {errors.firstName && (
                <span className={styles.errorMessage}>
                  {errors.firstName.message}
                </span>
              )}
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="lastName" className={styles.formLabel}>
                Last Name
              </label>
              <input
                {...register("lastName", {
                  required: "Last name is required",
                  minLength: { value: 2, message: "At least 2 characters" },
                  pattern: {
                    value: /^[A-Za-z]+(?: [A-Za-z]+)*$/,
                    message: "Last name must contain only letters",
                  },
                })}
                type="text"
                id="lastName"
                className={styles.formInput}
                placeholder="Enter Last Name"
              />
              {errors.lastName && (
                <span className={styles.errorMessage}>
                  {errors.lastName.message}
                </span>
              )}
            </div>
          </div>
          <div className={styles.pairInputs}>
            <div className={styles.formGroup}>
              <label htmlFor="age" className={styles.formLabel}>
                Age
              </label>
              <input
                {...register("age", {
                  required: "Age is required",
                  min: { value: 0, message: "Must be a positive number" },
                  max: { value: 150, message: "Must be less than 150" },
                })}
                type="number"
                id="age"
                className={`${styles.formInput} ${
                  errors.age ? styles["border-red-500"] : ""
                }`}
                placeholder="Enter Age"
                onChange={handleAgeChange}
              />
              {errors.age && (
                <span className={styles.errorMessage}>
                  {errors.age.message}
                </span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="dateOfBirth" className={styles.formLabel}>
                Date of Birth
              </label>
              <input
                {...register("dateOfBirth", {
                  required: "Date of birth is required",
                })}
                type="date"
                id="dateOfBirth"
                className={`${styles.formInput} ${
                  errors.dateOfBirth ? styles["border-red-500"] : ""
                }`}
                placeholder="Select a date"
                onChange={handleDateChange}
              />
              {errors.dateOfBirth && (
                <span className={styles.errorMessage}>
                  {errors.dateOfBirth.message}
                </span>
              )}
            </div>
          </div>

          <div className={styles.pairInputs}>
            <div className={styles.formGroup}>
              <label htmlFor="gender" className={styles.formLabel}>
                Gender
              </label>
              <select
                {...register("gender", { required: "Gender is required" })}
                id="gender"
                className={`${styles.formInput} ${
                  errors.gender ? styles["border-red-500"] : ""
                }`}
              >
                <option value="">Select Gender</option>
                <option value="male" className={styles.selectopt}>
                  Male
                </option>
                <option value="female" className={styles.selectopt}>
                  Female
                </option>
              </select>
              {errors.gender && (
                <span className={styles.errorMessage}>
                  {errors.gender.message}
                </span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="phoneNumber" className={styles.formLabel}>
                Phone Number
              </label>
              <input
                {...register("phoneNumber", {
                  required: "Phone number is required",
                  pattern: {
                    value: /^[0-9+-]+$/,
                    message: "Invalid phone number",
                  },
                })}
                type="tel"
                id="phoneNumber"
                className={`${styles.formInput} ${
                  errors.phoneNumber ? styles["border-red-500"] : ""
                }`}
                placeholder="Enter a phone number"
              />
              {errors.phoneNumber && (
                <span className={styles.errorMessage}>
                  {errors.phoneNumber.message}
                </span>
              )}
            </div>
          </div>
          <button type="submit" className={styles.submitButton}>
            Add Patient
          </button>
        </form>
      </div>

      <SuccessErrorModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          if (isSuccess) navigate("/patients");
        }}
        title={isSuccess ? "Success" : "Error"}
        description={modalMessage}
        isSuccess={isSuccess}
      />
    </div>
  );
}

export default AddPatient;
