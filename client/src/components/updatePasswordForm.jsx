import { useForm } from "react-hook-form";
import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../context/contextProvider";
import { toast } from "react-toastify";
import axios from "axios";
function UpdatePasswordForm() {
  const navigate = useNavigate();
  const { setChangePass } = useContext(Context);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [error, setError] = useState();
  const [showPassword, setShowPassword] = useState(false);
  const [timer, setTimer] = useState(3);
  const [sendOtp, setSendOtp] = useState(false);

  // updating the password function
  const submitPassword = async (data) => {
    const { email, otp, password, Cpassword } = data;
    if (password !== Cpassword) {
      setError("Confirm Password doesn't match.");
      return;
    }
    try {
      const response = await axios.put(
        import.meta.env.VITE_BASE_URL + "update-password",
        {
          email,
          otp,
          password,
        }
      );
      // console.log(response.data);
      toast.success(response.data.message, {
        position: "top-right",
        autoClose: 5000,
      });
      navigate("/login");
    } catch (error) {
      if (error.response) {
        // console.log(error.response);
        setError(error.response.data.message);
      }
    }
  };
  useEffect(() => {
    if (timer === 0) {
      setSendOtp(true);
      return;
    }
    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);
  return (
    <form
      onSubmit={handleSubmit(submitPassword)}
      className="space-y-5"
      method="post"
    >
      {/* email section */}
      <div>
        <label
          htmlFor="email"
          className="block mb-2 text-xs font-medium text-gray-900 "
        >
          Email
        </label>
        <input
          type="email"
          name="email"
          id="email"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
          placeholder="you@example.com"
          {...register("email", {
            required: "Email is requried.",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Enter the valid email address.",
            },
          })}
        />
        {errors.email && <p className="form-error">{errors.email.message}</p>}
      </div>

      {/* otp section */}
      <div>
        <label
          htmlFor="otp"
          className="block mb-2 text-xs font-medium text-gray-900 "
        >
          OTP
        </label>
        <input
          type="text"
          name="otp"
          id="otp"
          maxLength={6}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
          placeholder="Enter 6-digit OTP"
          {...register("otp", {
            required: "OTP is required.",
            pattern: {
              value: /^[0-9]{6}$/,
              message: "OTP can have number.",
            },
          })}
        />
        {errors.otp && <p className="form-error">{errors.otp.message}</p>}
      </div>

      {/* password section */}
      <div>
        <label
          htmlFor="password"
          className="block mb-2 text-xs font-medium text-gray-900 "
        >
          Password
        </label>
        <input
          type={showPassword ? "text" : "password"}
          name="password"
          id="password"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
          placeholder="Enter password"
          {...register("password", {
            required: "Password is required.",
            minLength: {
              value: 5,
              message: "Password must be greater than 5 characters.",
            },
            maxLength: {
              value: 15,
              message: "Password can't be greater than 15 characters.",
            },
            pattern: {
              value:
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&])[A-Za-z\d@$!%*?#&]{8,}$/,
              message:
                "Password must be 8+ chars, with uppercase, lowercase, number & special character",
            },
          })}
        />
        {errors.password && (
          <p className="form-error">{errors.password.message}</p>
        )}
      </div>

      {/* confirm password section */}
      <div>
        <label
          htmlFor="confirm-password"
          className="block mb-2 text-xs font-medium text-gray-900 "
        >
          Confirm Password
        </label>
        <input
          type={showPassword ? "text" : "password"}
          name="confirm-password"
          id="confirm-password"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
          placeholder="Re-enter password"
          {...register("Cpassword", {
            required: "Confirm Password is required.",
            minLength: {
              value: 5,
              message: "Password must be greater than 5 characters.",
            },
            maxLength: {
              value: 15,
              message: "Password can't be greater than 15 characters.",
            },
            pattern: {
              value:
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&])[A-Za-z\d@$!%*?#&]{8,}$/,
              message:
                "Password must be 8+ chars, with uppercase, lowercase, number & special character",
            },
          })}
        />
        {errors.Cpassword && (
          <p className="form-error">{errors.Cpassword.message}</p>
        )}
      </div>

      {/* hide and show password */}
      <div className="flex items-center justify-between">
        {/* show and hide password section */}
        <div className="flex items-start">
          <div className="flex items-center justify-center h-5">
            <input
              id="remember"
              aria-describedby="remember"
              type="checkbox"
              className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 "
              onClick={() => setShowPassword((prev) => !prev)}
            />
          </div>
          <div className="ml-2 text-xs lg:text-sm ">
            <label htmlFor="remember" className="text-gray-700">
              {showPassword ? "Hide" : "Show"} password
            </label>
          </div>
        </div>
        {/* resend  otp section */}
        {sendOtp ? (
          <span
            className="text-xs lg:text-sm font-medium text-primary-600 hover:underline "
            onClick={() => {
              setChangePass(false);
              setTimer(60);
            }}
          >
            Resend OTP
          </span>
        ) : (
          <span className="text-xs lg:text-sm font-medium text-primary-600 hover:underline ">
            Resend OTP {timer}
          </span>
        )}
      </div>
      {/* server error */}
      {error && <p className="form-error">{error}</p>}

      <button type="submit" className="w-full button">
        Update
      </button>
    </form>
  );
}
export default UpdatePasswordForm;
