import Navbar from "../components/navbar";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function HomePage() {
  const Navigate = useNavigate();

  const [user, setUser] = useState({});
  useEffect(() => {
    const authUser = async () => {
      try {
        const response = await axios.get(import.meta.env.VITE_USER_URL, {
          withCredentials: true,
        });
        console.log(response);
        setUser(response.data.userInfo);
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
    </>
  );
}
export default HomePage;
