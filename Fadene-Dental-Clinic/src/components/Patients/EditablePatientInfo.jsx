import { useState } from "react";
import { Pencil, Check, X } from "lucide-react";
import styles from "./EditablePatientInfo.module.css";

const EditablePatientInfo = ({ patientHistory, onUpdate }) => {
  const [editingField, setEditingField] = useState(null);
  const [editValues, setEditValues] = useState({});

  const fields = [
    { label: "Age", key: "age", type: "number" },
    { label: "Phone", key: "phone_number", type: "tel" },
    { label: "Date of Birth", key: "date_of_birth", type: "date" },
    {
      label: "Gender",
      key: "gender",
      type: "select",
      options: ["M", "F"],
    },
  ];

  const calculateBirthDateFromAge = (age) => {
    const today = new Date();
    const birthYear = today.getFullYear() - age;
    return new Date(birthYear, today.getMonth(), today.getDate())
      .toISOString()
      .split("T")[0];
  };

  const calculateAgeFromBirthDate = (birthDate) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
      age--;
    }
    return age;
  };

  const handleEdit = (field) => {
    setEditingField(field.key);
    setEditValues({
      age: patientHistory.age,
      date_of_birth: patientHistory.date_of_birth,
      [field.key]: patientHistory[field.key],
    });
  };

  const handleChange = (field, value) => {
    let updatedValues = { ...editValues, [field]: value };
    if (field === "age") {
      updatedValues.date_of_birth = calculateBirthDateFromAge(value);
    } else if (field === "date_of_birth") {
      updatedValues.age = calculateAgeFromBirthDate(value);
    }
    setEditValues(updatedValues);
  };

  const handleSave = async () => {
    if (onUpdate) {
      await onUpdate(patientHistory.id, editValues);
    }
    setEditingField(null);
  };

  const handleCancel = () => {
    setEditingField(null);
    setEditValues({});
  };

  const renderEditableField = (field) => {
    const isEditing = editingField === field.key;

    if (isEditing) {
      return (
        <div className={styles.editContainer}>
          {field.type === "select" ? (
            <select
              value={editValues[field.key] || ""}
              onChange={(e) => handleChange(field.key, e.target.value)}
              className={styles.input}
            >
              {field.options.map((option) => (
                <option key={option} value={option}>
                  {option === "M" ? "Male" : "Female"}
                </option>
              ))}
            </select>
          ) : (
            <input
              type={field.type}
              value={editValues[field.key] || ""}
              onChange={(e) => handleChange(field.key, e.target.value)}
              className={styles.input}
            />
          )}
          <button onClick={handleSave} className={styles.saveButton}>
            <Check className={styles.saveIcon} />
          </button>
          <button onClick={handleCancel} className={styles.cancelButton}>
            <X className={styles.cancelIcon} style={{ color: "white" }} />
          </button>
        </div>
      );
    }

    return (
      <div className={styles.valueContainer}>
        <p className={styles.valueText}>{patientHistory[field.key]}</p>
        <button onClick={() => handleEdit(field)} className={styles.editButton}>
          <Pencil className={styles.editIcon} />
        </button>
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <p className={styles.title}>Patient Information</p>
      <div className={styles.fieldsContainer}>
        {fields.map((field) => (
          <div key={field.key} className={styles.fieldRow}>
            <p className={styles.fieldLabel}>{field.label} :</p>
            {renderEditableField(field)}
          </div>
        ))}
        {/* Separately render the registration date as non-editable */}
        <div className={styles.fieldRow}>
          <p className={styles.fieldLabel}>Registration Date :</p>
          <p className={styles.valueText}>{patientHistory.registration_date}</p>
        </div>
      </div>
    </div>
  );
};

export default EditablePatientInfo;
