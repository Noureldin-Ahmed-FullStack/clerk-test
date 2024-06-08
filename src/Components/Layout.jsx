import React from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";

import {
  ClerkProvider,
  SignIn,
  SignUp,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/clerk-react";
import MyContextProvider from "./ContextProvider";
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}
export default function Layout() {
  const navigate = useNavigate();

  return (
    <ClerkProvider
      routerPush={(to) => navigate(to)}
      routerReplace={(to) => navigate(to, { replace: true })}
      publishableKey={PUBLISHABLE_KEY}
    >
      <MyContextProvider>
        <SignedOut>
          <div>
            <h2>This app uses</h2>
            <h4>Clerk + React + Node + Mongo + Routing</h4>
          </div>
          <SignUp />
        </SignedOut>
        <SignedIn>
          <main>
            <Outlet />
          </main>
        </SignedIn>
      </MyContextProvider>
    </ClerkProvider>
  );
}
