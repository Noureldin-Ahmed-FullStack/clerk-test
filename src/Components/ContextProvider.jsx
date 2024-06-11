import React, { createContext, useContext, useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import axios from "axios";
import { toast } from "react-toastify";
// import axios from "axios";

export let MyContext = createContext();

export default function MyContextProvider(props) {
  const [UserDBData, setUserDBData] = useState();
  const [pending, setPending] = useState(false);
  const BaseURL = import.meta.env.VITE_BASE_URL;
  // const fetchUserData = async (userId) => {
  //   console.log(userId);
  //   try {
  //     await axios
  //       .get(`https://vetro-server.onrender.com/getSingleUser/${userId}`)
  //       .then((response) => {
  //         console.log(response.data.message);
  //         setUserDBData(response.data.message);
  //         setPending(false);
  //       })
  //       .catch((error) => {
  //         console.error("Error:", error);
  //         setPending(false);
  //       });

  //     setPending(false);

  //     // setUserDBData(userData);
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //     setPending(false);
  //   } finally {
  //     setPending(false);
  //   }
  // };
  const { isLoaded, isSignedIn, user } = useUser();

  useEffect(() => {
    setPending(true)
    console.log(user);

    if (isLoaded && isSignedIn && user) {
      axios
        .post(`${BaseURL}/register`, { user: user })
        .then((response) => {
          console.log("Success:", response.data);
          setUserDBData(response.data)
          setPending(false)
        })
        .catch((error) => {
          console.error("Error:", error);
          setPending(false)
          toast.error(error.message, {
              position: "top-center",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",
          });
        });
    }
  }, [isLoaded, isSignedIn, user]);

  const contextValue = {
    pending,
    setPending,
    UserDBData,
    setUserDBData,
    BaseURL
  };

  return (
    <MyContext.Provider value={contextValue}>
      {props.children}
    </MyContext.Provider>
  );
}
