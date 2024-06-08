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
import { SignIn, SignUp } from "@clerk/clerk-react";

const router = createBrowserRouter(
  [
    {
      element: <Layout />,
      children: [
        { path: "/", element: <App /> },
        { path: "sign-up", element: <SignUp /> },
        { path: "sign-in", element: <SignIn /> },
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
