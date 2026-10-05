import { useFormik } from "formik";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import { register, login } from "../services/authService";
import type { RegisterFormValues, User } from "../types/task";

const validationSchema = Yup.object({
  name: Yup.string()
    .trim()
    .required("Name is required")
    .min(2, "Name must be at least 2 characters"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

interface RegisterProps {
  onLogin: (user: User, token: string) => void;
}

function Register({ onLogin }: RegisterProps) {
  const navigate = useNavigate();

  const formik = useFormik<RegisterFormValues>({
    initialValues: { name: "", email: "", password: "" },
    validationSchema,
    validateOnBlur: true,
    validateOnChange: false,
    onSubmit: async (values, { setStatus, setSubmitting }) => {
      try {
        // Register then immediately log in
        await register(values);
        const { user, token } = await login({
          email: values.email,
          password: values.password,
        });
        onLogin(user, token);
        navigate("/");
      } catch (err) {
        setStatus(err instanceof Error ? err.message : "Registration failed");
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
          <h1>Create account</h1>
          <p className="auth-subtitle">Start tracking your work</p>
        </div>

        {formik.status && (
          <div className="error-banner">
            <p>{formik.status}</p>
          </div>
        )}

        <form onSubmit={formik.handleSubmit} noValidate>
          <div className="field">
            <label htmlFor="name">Name</label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Your full name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.name && formik.errors.name && (
              <span className="field-error">{formik.errors.name}</span>
            )}
          </div>

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
              placeholder="Min. 6 characters"
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
            {formik.isSubmitting ? "Creating account…" : "Create Account"}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account?{" "}
          <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
