import { createContext, useState } from "react";

const Context = createContext();

function ContextProvider({ children }) {
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState("");
  const [changePass, setChangePass] = useState(false);
  return (
    <Context.Provider
      value={{
        showModal,
        setShowModal,
        email,
        setEmail,
        changePass,
        setChangePass,
      }}
    >
      {children}
    </Context.Provider>
  );
}
export { ContextProvider, Context };
