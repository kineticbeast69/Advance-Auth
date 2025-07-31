import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { MdOutlineVerified } from "react-icons/md";
import { toast } from "react-toastify";
import axios from "axios";
function Navbar({ user }) {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  // logout function
  const logout = async () => {
    try {
      const response = await axios.delete(
        import.meta.env.VITE_BASE_URL + "logout",
        { withCredentials: true }
      );
      //  console.log(response);
      navigate("/login");
    } catch (error) {
      if (error.response) {
        console.log(error.response);
      }
    }
  };

  // sending email verification otp function
  const verificationOtp = async () => {
    try {
      const response = await axios.get(
        import.meta.env.VITE_BASE_URL + "email-verification-otp",
        {
          withCredentials: true,
        }
      );
      // console.log(response);
      toast.success(response.data.message, {
        position: "top-right",
        autoClose: 5000,
        closeOnClick: true,
      });
      navigate("/verification");
    } catch (error) {
      if (error.response) {
        // console.log(error.response);
      }
    }
  };

  return (
    <nav className="bg-indigo-800 shadow-md  sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-white tracking-tight">
          AD-Auth
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-6 items-center">
          <Link to="/" className="text-white font-medium hover:text-indigo-300">
            Home
          </Link>

          {/* Role-based buttons */}
          {user?.role === "admin" && (
            <button type="button" className="text-gray-700 hover:text-blue-600">
              Admin Panel
            </button>
          )}
          {user?.role === "editor" && (
            <button type="click" className="text-gray-700 hover:text-blue-600">
              Editor
            </button>
          )}

          {/* Authenticated user */}

          <span className="text-white font-medium flex items-center justify-center gap-1">
            {user?.name}
            {user?.verified ? (
              <span>
                <MdOutlineVerified color="green" size={28} />
              </span>
            ) : (
              <button
                type="button"
                onClick={() => verificationOtp()}
                className="px-4 py-1.5 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
              >
                Verification
              </button>
            )}
          </span>
          <button
            type="button"
            onClick={logout}
            className="px-4 py-1.5 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>

        {/* Hamburger for mobile */}
        <button
          className="md:hidden text-gray-700"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? (
            <FaTimes size={24} color="white" />
          ) : (
            <FaBars size={24} color="white" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden px-4 pb-4 space-y-3 bg-white shadow-md">
          <Link to="/" className="block text-gray-700 hover:text-blue-600">
            Home
          </Link>

          {user?.role === "admin" && (
            <button
              type="button"
              className="block text-gray-700 hover:text-blue-600"
            >
              Admin Panel
            </button>
          )}
          {user?.role === "editor" && (
            <button
              type="button"
              className="block text-gray-700 hover:text-blue-600"
            >
              Editor
            </button>
          )}

          <span className="flex text-gray-600 font-medium  items-center  gap-2">
            {user?.name}
            {user?.verified ? (
              <span>
                <MdOutlineVerified color="green" size={28} />
              </span>
            ) : (
              <button
                type="button"
                onClick={() => verificationOtp(user?.email)}
                className="px-4 py-1.5 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
              >
                Verification
              </button>
            )}
          </span>
          <button
            type="button"
            onClick={logout}
            className="w-full px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}
export default Navbar;
