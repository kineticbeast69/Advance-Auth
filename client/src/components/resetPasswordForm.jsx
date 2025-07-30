import { useState, useContext } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { Context } from "../context/contextProvider";
function ResetPasswordForm() {
  const [error, setError] = useState();
  const { setChangePass } = useContext(Context);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // reset password email otp
  const submitEmail = async (data) => {
    const { email } = data;
    try {
      const response = await axios.post(
        import.meta.env.VITE_BASE_URL + "reset-password",
        {
          email,
        }
      );
      // console.log(response);
      toast.success(response.data.message, {
        position: "top-right",
        autoClose: 5000,
        closeOnClick: true,
      });
      setChangePass(true);
    } catch (error) {
      if (error.response) {
        // console.log(error.response);
        setError(error.response.data.message);
      }
    }
  };
  return (
    <form
      className="mt-4 space-y-3 lg:mt-5 md:space-y-4"
      method="post"
      onSubmit={handleSubmit(submitEmail)}
    >
      <div>
        <label
          htmlFor="email"
          className="block mb-2 text-xs font-medium text-gray-900 "
        >
          Enter your Email.
        </label>
        <input
          type="email"
          name="email"
          id="email"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
          placeholder="name@user.com"
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
      {/* server error */}
      {error ? <p className="form-error">{error}</p> : ""}
      <button type="submit" className="w-full  button">
        Send OTP
      </button>
    </form>
  );
}
export default ResetPasswordForm;
