import RegisterForm from "../components/registerForm";
import Modal from "../components/modal";
import { useContext } from "react";
import { Context } from "../context/contextProvider";
function RegisterPage() {
  const { showModal } = useContext(Context);
  return (
    <main className="flex justify-center items-center w-full h-[100vh] bg-image">
      <RegisterForm />
      {showModal ? <Modal /> : ""}
    </main>
  );
}
export default RegisterPage;
