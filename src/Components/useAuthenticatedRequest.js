// useAuthenticatedRequest.js
import { useClerk, useSession } from "@clerk/clerk-react";
import { useContext } from "react";
import { MyContext } from "./ContextProvider";

const useAuthenticatedRequest = () => {
  const { user } = useClerk();
  const {BaseURL } = useContext(MyContext);

  const authenticatedFetch = async (options = {}) => {
    const headers = {
      ...options.headers,
      Authorization: `Bearer ${user}`,
    };

    const response = await fetch(`${BaseURL}/register`, {
      ...options,
      headers,
    });

    return response;
  };

  return authenticatedFetch;
};

export default useAuthenticatedRequest;
