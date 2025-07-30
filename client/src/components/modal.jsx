import { useState, useContext, useEffect } from "react";
import { RxCross2 } from "react-icons/rx";
import { Context } from "../context/contextProvider";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
const Modal = () => {
  const Navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const { setShowModal, email } = useContext(Context);
  const [timer, setTimer] = useState(60);
  const [sendOtp, setSendOtp] = useState(false);

  //veriying the user function
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        import.meta.env.VITE_BASE_URL + "verify-user-otp",
        { otp: String(otp), email },
        { withCredentials: true }
      );
      // console.log(response);
      Navigate("/");
      setOtp("");
      setShowModal(false);
    } catch (error) {
      if (error.response) {
        // console.log(error.response.data.message);
        toast.error(error.response.data.message, {
          position: "top-center",
          autoClose: 5000,
          closeOnClick: true,
        });
      }
    }
  };

  // resending the otp request is over here
  const resendOtp = async () => {
    // console.log("otp sent");
    setSendOtp(false);
    setTimer(60);
    try {
      const response = await axios.get(
        import.meta.env.VITE_BASE_URL + "resend-otp",
        {
          params: {
            email: email,
          },
        }
      );
      // console.log(response);
      toast.success(response.data.message, {
        position: "top-right",
        autoClose: 5000,
        closeOnClick: true,
      });
    } catch (error) {
      if (error.response) {
        console.log(error.response);
      }
    }
  };

  // timer effect
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
    <div className="fixed inset-0 flex items-center justify-center bg-black/30 px-4">
      <div className="w-full relative max-w-sm p-6 bg-white rounded-xl shadow-xl text-center">
        <h1 className="text-2xl font-bold text-gray-800">OTP Verification</h1>
        <p className="text-sm text-gray-600 mt-1">
          Enter the 6-digit verification code sent to your email.
        </p>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-center gap-4 mt-5"
        >
          <input
            type="text"
            maxLength={6}
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-black bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
          >
            Verify
          </button>
        </form>

        <p className="text-sm text-gray-600 mt-4">
          Didn’t receive the code?{" "}
          {sendOtp ? (
            <span
              className="text-blue-600 font-medium cursor-pointer hover:underline"
              onClick={resendOtp}
            >
              Resend
            </span>
          ) : (
            <span className="text-red-400 font-medium">Resend OTP {timer}</span>
          )}
        </p>
        <RxCross2
          className="text-black absolute text-lg top-1 right-1"
          onClick={() => setShowModal(false)}
        />
      </div>
    </div>
  );
};

export default Modal;
