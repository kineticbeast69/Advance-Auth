import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { ContextProvider } from "./context/contextProvider.jsx";
// pages
import LoginPage from "./pages/login.page.jsx";
import RegisterPage from "./pages/register.page.jsx";
import ResetPasswordPage from "./pages/resetPassword.page.jsx";
import EmailVerificationPage from "./pages/emailVerificaton.page.jsx";
const route = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    path: "/reset-password",
    element: <ResetPasswordPage />,
  },
  {
    path: "/verification",
    element: <EmailVerificationPage />,
  },
]);
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ContextProvider>
      {/*context provider */}
      <RouterProvider router={route} />
    </ContextProvider>
    <ToastContainer />
  </StrictMode>
);
