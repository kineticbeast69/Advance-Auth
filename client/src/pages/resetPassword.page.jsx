import { Link } from "react-router-dom";
import { FaArrowLeftLong } from "react-icons/fa6";
import ResetPasswordForm from "../components/resetPasswordForm";
import UpdatePasswordForm from "../components/updatePasswordForm";
import { Context } from "../context/contextProvider";
import { useContext } from "react";
function ResetPasswordPage() {
  const { changePass } = useContext(Context);
  return (
    <main className="flex justify-center items-center w-full h-[100vh] bg-gray-200">
      <section className="bg-gray-50 border border-gray-300 shadow-lg rounded-md">
        <div className="flex flex-col items-center justify-center px-2 py-3 mx-auto  lg:py-0">
          <div className="w-full p-3 bg-white rounded-lg shadow  md:mt-0 sm:max-w-md  sm:p-5">
            <h2 className="mb-1 text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl ">
              Forget Your Password
            </h2>

            {/* form section logic */}
            {changePass ? <UpdatePasswordForm /> : <ResetPasswordForm />}

            {/* sending back the user */}
            <Link
              to="/login"
              className="flex items-center justify-center gap-2 mt-2 md:mt-3 hover:gap-3 text-xs md:text-sm"
            >
              <span>
                <FaArrowLeftLong />
              </span>
              <p>Back to log in</p>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
export default ResetPasswordPage;
