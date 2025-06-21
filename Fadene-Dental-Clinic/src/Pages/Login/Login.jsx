import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { loginUser } from "../../api/api";
import styles from "./Login.module.css";

function Login() {
  const navigate = useNavigate();
  const [loginError, setLoginError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const response = await loginUser(data);
      console.log("Login successful:", response);

      if (response.role === "doctor") {
        navigate("/dashboard");
      } else if (response.role === "nurse") {
        navigate("/appointments");
      }
    } catch (error) {
      console.error(error);
      setLoginError("Invalid username or password. Please try again.");
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginLeft}>
        <div className={styles.loginContent}>
          <h2 className={styles.loginTitle}>Login</h2>

          {loginError && <p className={styles.errorText}>{loginError}</p>}

          <form className={styles.loginForm} onSubmit={handleSubmit(onSubmit)}>
            <div className={styles.formGroup}>
              <label htmlFor="username" className={styles.formLabel}>
                Username
              </label>
              <input
                type="text"
                id="username"
                className={styles.loginInput}
                {...register("username", { required: "Username is required" })}
              />
              {errors.username && (
                <p className={styles.errorText}>{errors.username.message}</p>
              )}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="password" className={styles.formLabel}>
                Password
              </label>
              <input
                type="password"
                id="password"
                className={styles.loginInput}
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters long",
                  },
                })}
              />
              {errors.password && (
                <p className={styles.errorText}>{errors.password.message}</p>
              )}
            </div>

            <button type="submit" className={styles.loginButton}>
              Login
            </button>
          </form>
          <p className={styles.resetPasswordText}>
            Did you forget the password ?{" "}
            <a href="/forget-password">Reset Password</a>
          </p>
          <p className={styles.signUpText}>
            You dont have an account ? <a href="/signup">Sign Up</a>
          </p>
        </div>
      </div>
      <div className={styles.loginImgContainer}>
        <img
          src="src/assets/images/Landing-page1.svg"
          alt="Sign up"
          className={styles.signUpImg}
        />
      </div>
    </div>
  );
}

export default Login;
