import { useFormik } from "formik";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../services/authService";
import type { LoginFormValues, User } from "../types/task";

const validationSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

interface LoginProps {
  onLogin: (user: User, token: string) => void;
}

function Login({ onLogin }: LoginProps) {
  const navigate = useNavigate();

  const formik = useFormik<LoginFormValues>({
    initialValues: { email: "", password: "" },
    validationSchema,
    validateOnBlur: true,
    validateOnChange: false,
    onSubmit: async (values, { setStatus, setSubmitting }) => {
      try {
        const { user, token } = await login(values);
        onLogin(user, token);
        navigate("/");
      } catch (err) {
        setStatus(err instanceof Error ? err.message : "Login failed");
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <p className="eyebrow">SMART WORK TRACKER</p>
          <h1>Welcome back</h1>
          <p className="auth-subtitle">Sign in to your account</p>
        </div>

        {formik.status && (
          <div className="error-banner">
            <p>{formik.status}</p>
          </div>
        )}

        <form onSubmit={formik.handleSubmit} noValidate>
          <div className="field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.email && formik.errors.email && (
              <span className="field-error">{formik.errors.email}</span>
            )}
          </div>

          <div className="field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.password && formik.errors.password && (
              <span className="field-error">{formik.errors.password}</span>
            )}
          </div>

          <button
            type="submit"
            className="primary-button auth-submit"
            disabled={formik.isSubmitting}
          >
            {formik.isSubmitting ? "Signing in…" : "Sign In"}
          </button>
        </form>

        <p className="auth-switch">
          Don't have an account?{" "}
          <Link to="/register">Create one</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
