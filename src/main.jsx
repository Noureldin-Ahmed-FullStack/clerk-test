import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter, Route, RouterProvider, Routes, createBrowserRouter, createHashRouter, useNavigate } from "react-router-dom";
import Layout from "./Components/Layout.jsx";
import Test from "./Components/Test.jsx";
import { SignIn, SignUp } from "@clerk/clerk-react";

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: "/", element: <App /> },
      { path: "test", element: <Test /> },
      { path: "sign-up", element: <SignUp /> },
      { path: "sign-in", element: <SignIn /> },
    ]
  }
], {
  basename: "/clerk-test"
});
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router}  />
  </React.StrictMode>
);
