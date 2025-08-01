import Navbar from "../components/navbar";
import Welcome from "../components/welcome";
import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Context } from "../context/contextProvider";
function HomePage() {
  const Navigate = useNavigate();
  const { setEmail } = useContext(Context);
  const [user, setUser] = useState({});
  useEffect(() => {
    const authUser = async () => {
      try {
        const response = await axios.get(import.meta.env.VITE_USER_URL, {
          withCredentials: true,
        });
        console.log(response);
        setUser(response.data.userInfo);
        setEmail(response.data.userInfo.email);
      } catch (error) {
        if (error.response) {
          console.log(error.response);
          Navigate("/login");
        }
      }
    };
    authUser();
    // return () => authUser();
  }, []);

  return (
    <>
      <Navbar user={user} />
      <Welcome username={user.name} role={user.role} />
    </>
  );
}
export default HomePage;
