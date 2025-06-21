import { useForm } from "react-hook-form";
import { useState } from "react";
import styles from "./SignUp.module.css";
import { registerUser } from "../../api/api";
import { useNavigate } from "react-router-dom";

function SignUp() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm();

  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [showModal, setShowModal] = useState(false);

  const password = watch("password");

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      setSubmitError("");

      // Include the role data from the form submission
      const response = await registerUser({
        username: data.username,
        password: data.password,
        security_question: data.security_question,
        security_answer: data.security_answer,
        role: data.role, // Send the selected role
      });

      console.log("Registration successful:", response.data);
      reset();
      setShowModal(true);

      // Redirect to login page after 3 seconds
      setTimeout(() => {
        setShowModal(false);
        navigate("/login");
      }, 2500);
    } catch (error) {
      console.error("Registration failed:", error);
      setSubmitError(error || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.signUpContainer}>
      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3 className={styles.modalContentH3}>Registration Successful!</h3>
            <p className={styles.modalContentP}>
              You will be redirected to the login page shortly.
            </p>
          </div>
        </div>
      )}

      <div className={styles.signUpLeft}>
        <div className={styles.signUpContent}>
          <h2 className={styles.signUpTitle}>Sign Up</h2>

          {submitError && (
            <div className={styles.errorMessage}>{submitError}</div>
          )}

          <form className={styles.signUpForm} onSubmit={handleSubmit(onSubmit)}>
            {/* Username */}
            <div className={styles.formGroup}>
              <label htmlFor="username" className={styles.formLabel}>
                Full Name
              </label>
              <input
                type="text"
                id="username"
                className={styles.signUpInput}
                {...register("username", { required: "Username is required" })}
              />
              {errors.username && (
                <p className={styles.errorText}>{errors.username.message}</p>
              )}
            </div>

            {/* Password */}
            <div className={styles.formGroup}>
              <label htmlFor="password" className={styles.formLabel}>
                Password
              </label>
              <input
                type="password"
                id="password"
                className={styles.signUpInput}
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters long",
                  },
                })}
              />
              {errors.password && (
                <p className={styles.errorText}>{errors.password.message}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div className={styles.formGroup}>
              <label htmlFor="confirmPassword" className={styles.formLabel}>
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                className={styles.signUpInput}
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                  validate: (value) =>
                    value === password || "Passwords do not match",
                })}
              />
              {errors.confirmPassword && (
                <p className={styles.errorText}>
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* Security Question */}
            <div className={styles.formGroup}>
              <label htmlFor="security_question" className={styles.formLabel}>
                Create Your Security Question
              </label>
              <input
                type="text"
                id="security_question"
                className={styles.signUpInput}
                placeholder="E.g., What was the name of your first school?"
                {...register("security_question", {
                  required: "Security question is required",
                  minLength: {
                    value: 5,
                    message: "Question must be at least 5 characters long",
                  },
                })}
              />
              {errors.security_question && (
                <p className={styles.errorText}>
                  {errors.security_question.message}
                </p>
              )}
            </div>

            {/* Security Answer */}
            <div className={styles.formGroup}>
              <label htmlFor="security_answer" className={styles.formLabel}>
                Your Answer
              </label>
              <input
                type="text"
                id="security_answer"
                className={styles.signUpInput}
                {...register("security_answer", {
                  required: "Security answer is required",
                  minLength: {
                    value: 2,
                    message: "Answer must be at least 2 characters long",
                  },
                })}
              />
              {errors.security_answer && (
                <p className={styles.errorText}>
                  {errors.security_answer.message}
                </p>
              )}
            </div>

            {/* Role Selection */}
            <div className={styles.formGroup}>
              <label htmlFor="role" className={styles.formLabel}>
                Select Your Role
              </label>
              <select
                id="role"
                className={styles.signUpInput}
                {...register("role", { required: "Role is required" })}
              >
                <option value="doctor">Doctor</option>
                <option value="nurse">Nurse</option>
              </select>
              {errors.role && (
                <p className={styles.errorText}>{errors.role.message}</p>
              )}
            </div>

            <button
              type="submit"
              className={styles.signUpButton}
              disabled={isLoading}
            >
              {isLoading ? "Signing Up..." : "Sign Up"}
            </button>
          </form>

          <p className={styles.signInText}>
            Already have an account? <a href="/login">Sign In</a>
          </p>
        </div>
      </div>

      <div className={styles.signUpImgContainer}>
        <img
          src="src/assets/images/Landing-page1.svg"
          alt="Sign up"
          className={styles.signUpImg}
        />
      </div>
    </div>
  );
}

export default SignUp;
