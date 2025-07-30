import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import axios from "axios";
import { Context } from "../context/contextProvider";
function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const { setShowModal, setEmail } = useContext(Context);
  const [error, setError] = useState();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  // handle submit call back
  const registerSubmit = async (data) => {
    const { name, email, password } = data;
    try {
      const response = await axios.post(
        import.meta.env.VITE_BASE_URL + "register",
        { name, email, password },
        { withCredentials: true }
      );
      // console.log(response);
      toast.success(response.data.message, {
        position: "top-right",
        autoClose: 5000,
        closeOnClick: true,
      });
      setEmail(email);
      setShowModal(true);
    } catch (error) {
      if (error.response) {
        setError(error.response.data.message);
      }
    }
  };
  return (
    <section className=" rounded-md">
      <div className="flex flex-col items-center justify-center px-2 py-3 mx-auto  lg:py-0">
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 ">
          <div className="p-2 space-y-3 md:space-y-4 sm:p-4">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl ">
              Sign up to your account
            </h1>
            {/* form group */}
            <form
              className="space-y-4 md:space-y-6"
              method="post"
              onSubmit={handleSubmit(registerSubmit)}
            >
              {/* name section */}
              <div>
                <label
                  htmlFor="name"
                  className="block mb-2 text-sm font-medium text-gray-900 "
                >
                  Your Name
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 "
                  placeholder="name"
                  {...register("name", {
                    required: "Name is required.",
                    minLength: {
                      value: 5,
                      message: "Name must have 5 characters.",
                    },
                    maxLength: {
                      value: 70,
                      message: "Name can't be longer than 70 characters.",
                    },
                    pattern: {
                      value: /^[A-Za-z\s]+$/,
                      message: "Name must contain alphabets and spaces.",
                    },
                  })}
                />
                {errors.name && (
                  <p className="form-error">{errors.name.message}</p>
                )}
              </div>
              {/* email section */}
              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-gray-900 "
                >
                  Your email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 "
                  placeholder="name@company.com"
                  {...register("email", {
                    required: "Email is required.",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Invalid email address",
                    },
                  })}
                />
                {errors.email && (
                  <p className="form-error">{errors.email.message}</p>
                )}
              </div>
              {/* password section */}
              <div>
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-gray-900 "
                >
                  Password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  id="password"
                  placeholder="••••••••"
                  className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                  {...register("password", {
                    required: "Password is requried.",
                    minLength: {
                      value: 5,
                      message: "Password must have 5 characters.",
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
              {/* show hide password and forget password */}
              <div className="flex items-center justify-between">
                {/* show and hide password section */}
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="remember"
                      aria-describedby="remember"
                      type="checkbox"
                      className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 "
                      onClick={() => setShowPassword((prev) => !prev)}
                    />
                  </div>
                  <div className="ml-2 text-xs md:text-sm">
                    <label htmlFor="remember" className="text-gray-700">
                      {showPassword ? "Hide" : "Show"} password
                    </label>
                  </div>
                </div>
              </div>
              {/* server error logs */}
              {error ? <p className="form-error">{error}</p> : ""}
              <button type="submit" className="w-full button">
                Register
              </button>
              <p className="text-sm md:text-base font-light text-gray-700">
                Have an account yet?{" "}
                <Link
                  to="/login"
                  className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                >
                  Login
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
export default RegisterForm;
