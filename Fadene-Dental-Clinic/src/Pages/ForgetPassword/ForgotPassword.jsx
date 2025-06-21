import { useForm } from "react-hook-form";
import { useState } from "react";
import { fetchSecurityQuestion, resetPassword } from "../../api/api";
import styles from "./ForgotPassword.module.css";
import { useNavigate } from "react-router-dom";

function ForgotPassword() {
  const [securityQuestion, setSecurityQuestion] = useState("");
  const [username, setUsername] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const handleFetchSecurityQuestion = async (username) => {
    try {
      const data = await fetchSecurityQuestion(username);
      if (data.status === "success") {
        setSecurityQuestion(data.security_question);
        setErrorMessage("");
      }
    } catch (error) {
      setSecurityQuestion("");
      setErrorMessage(error);
    }
  };

  const onSubmit = async (data) => {
    try {
      const response = await resetPassword(data);
      if (response.status === "success") {
        setSuccessMessage("Password reset successful. You can now log in.");
        setErrorMessage("");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    } catch (error) {
      setSuccessMessage("");
      setErrorMessage(error);
    }
  };

  return (
    <div className={styles.forgotPasswordContainer}>
      <div className={styles.forgotPasswordLeft}>
        <div className={styles.forgotPasswordContent}>
          <h2 className={styles.forgotPasswordTitle}>Forgot Password</h2>

          {errorMessage && <p className={styles.errorText}>{errorMessage}</p>}
          {successMessage && (
            <p className={styles.successText}>{successMessage}</p>
          )}

          <form
            className={styles.forgotPasswordForm}
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className={styles.formGroup}>
              <label htmlFor="username" className={styles.formLabel}>
                Username
              </label>
              <input
                type="text"
                id="username"
                className={styles.forgotPasswordInput}
                {...register("username", { required: "Username is required" })}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setValue("username", e.target.value);
                }}
                onBlur={() => username && handleFetchSecurityQuestion(username)}
              />
              {errors.username && (
                <p className={styles.errorText}>{errors.username.message}</p>
              )}
            </div>

            {securityQuestion && (
              <>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>{securityQuestion}</label>
                  <input
                    type="text"
                    id="security_answer"
                    className={styles.forgotPasswordInput}
                    {...register("security_answer", {
                      required: "Security answer is required",
                    })}
                  />
                  {errors.security_answer && (
                    <p className={styles.errorText}>
                      {errors.security_answer.message}
                    </p>
                  )}
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="new_password" className={styles.formLabel}>
                    New Password
                  </label>
                  <input
                    type="password"
                    id="new_password"
                    className={styles.forgotPasswordInput}
                    {...register("new_password", {
                      required: "New password is required",
                      minLength: {
                        value: 8,
                        message: "Password must be at least 8 characters long",
                      },
                    })}
                  />
                  {errors.new_password && (
                    <p className={styles.errorText}>
                      {errors.new_password.message}
                    </p>
                  )}
                </div>

                <button type="submit" className={styles.forgotPasswordButton}>
                  Reset Password
                </button>
              </>
            )}
          </form>

          <p className={styles.loginRedirectText}>
            Remember your password? <a href="/login">Back to Login</a>
          </p>
        </div>
      </div>
      <div className={styles.forgotPasswordImgContainer}>
        <img
          src="src/assets/images/Landing-page1.svg"
          alt="Sign up"
          className={styles.forgotPasswordImg}
        />
      </div>
    </div>
  );
}

export default ForgotPassword;
