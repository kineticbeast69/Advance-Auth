import LoginForm from "../components/loginForm";
import { useContext } from "react";
import { Context } from "../context/contextProvider";
import Modal from "../components/modal";
function LoginPage() {
  const { showModal } = useContext(Context);
  return (
    <main className="flex justify-center items-center w-full h-[100vh] bg-image">
      <LoginForm />
      {showModal ? <Modal /> : ""}
    </main>
  );
}
export default LoginPage;
