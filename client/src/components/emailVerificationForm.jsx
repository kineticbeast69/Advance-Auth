import { useForm } from "react-hook-form";
import { useContext, useState } from "react";
import { Context } from "../context/contextProvider";
import { Link, useNavigate } from "react-router-dom";
import { FaArrowLeftLong } from "react-icons/fa6";
import { toast } from "react-toastify";
import axios from "axios";
function EmailVerificationForm() {
  const { email } = useContext(Context);
  const Navigate = useNavigate();
  const [error, setError] = useState();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const submitVerify = async (data) => {
    const { otp, email } = data;
    try {
      const response = await axios.put(
        import.meta.env.VITE_BASE_URL + "verifying-email",
        {
          email,
          otp,
        },
        {
          withCredentials: true,
        }
      );
      //  console.log(response);
      toast.success(response.data.message);
      Navigate("/");
    } catch (error) {
      if (error.response) {
        //    console.log(error.responses);
        setError(error.response.data.message);
      }
    }
  };
  return (
    <section className="border border-gray-300  rounded-md">
      <div className="flex flex-col items-center justify-center px-4 py-3 mx-auto  lg:py-0">
        <div className="w-full bg-white rounded-lg shadow-md dark:border md:mt-0 sm:max-w-md xl:p-0 ">
          <div className="p-2 space-y-4 md:space-y-6 sm:p-4">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl ">
              Verify your account
            </h1>
            {/* form group */}
            <form
              className="space-y-4 md:space-y-6"
              method="post"
              onSubmit={handleSubmit(submitVerify)}
            >
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
                  defaultValue={email}
                  className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 "
                  placeholder="name@company.com"
                  {...register("email", {
                    required: "Email is required",
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
                    minLength: {
                      value: 6,
                      message: "OTP must have 6 characters.",
                    },
                    maxLength: {
                      value: 6,
                      message: "OTP can't be greater than 6 characters.",
                    },
                    pattern: {
                      value: /^[0-9]{6}$/,
                      message: "OTP can have number.",
                    },
                  })}
                />
                {errors.otp && (
                  <p className="form-error">{errors.otp.message}</p>
                )}
              </div>
              {/* server error */}
              {error ? <p className="form-error">{error}</p> : ""}
              <button
                type="submit"
                className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center 0"
              >
                Verify
              </button>
            </form>
            {/* sending back the user */}
            <Link
              to="/"
              className="flex items-center justify-center gap-2 mt-2 md:mt-3 hover:gap-3 text-xs md:text-sm"
            >
              <span>
                <FaArrowLeftLong />
              </span>
              <p>Back to Home</p>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
export default EmailVerificationForm;
