import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./index.css";
import {
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";
import Layout from "./Components/Layout.jsx";
import { RedirectToSignIn, SignIn, SignUp, SignedIn, SignedOut } from "@clerk/clerk-react";

const router = createBrowserRouter(
  [
    {
      element: <Layout />,
      children: [
        { path: "/", element: <>
          <SignedIn>
            <App />
          </SignedIn>
        <SignedOut>
          <RedirectToSignIn />
        </SignedOut>
        </>},
        { path: "sign-up", element: <SignUp forceRedirectUrl={'/clerk-test'}/> },
        { path: "sign-in", element: <SignIn forceRedirectUrl={'/clerk-test'}/> },
      ],
    },
  ],
  {
    basename: "/clerk-test",
  }
);
ReactDOM.createRoot(document.getElementById("root")).render(
    <RouterProvider router={router} />
  // <React.StrictMode></React.StrictMode>

);
