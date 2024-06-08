// useAuthenticatedRequest.js
import { useClerk, useSession } from "@clerk/clerk-react";

const useAuthenticatedRequest = () => {
  const { user } = useClerk();

  const authenticatedFetch = async (options = {}) => {
    const headers = {
      ...options.headers,
      Authorization: `Bearer ${user}`,
    };

    const response = await fetch("http://localhost:3000/register", {
      ...options,
      headers,
    });

    return response;
  };

  return authenticatedFetch;
};

export default useAuthenticatedRequest;
