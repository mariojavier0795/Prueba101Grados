import React from "react";
import { Navigate } from "react-router-dom";
import DashboardLayout from "src/layouts/DashboardLayout";
import MainLayout from "src/layouts/MainLayout";
import LoginView from "src/views/auth/LoginView";
import NotFoundView from "src/views/errors/NotFoundView";
import RegisterView from "src/views/auth/RegisterView";
import TableMovies from "./views/movie/Movie";
import TableActors from "./views/actor/Actor";

const routes = [
  {
    path: "app",
    element: <DashboardLayout />,
    children: [
      { path: "movie", element: <TableMovies /> },
      { path: "actor", element: <TableActors /> },
      { path: "*", element: <Navigate to="/404" /> },
    ],
  },
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { path: "login", element: <LoginView /> },
      { path: "register", element: <RegisterView /> },
      { path: "404", element: <NotFoundView /> },
      { path: "/", element: <Navigate to="/app/movie" /> },
      { path: "*", element: <Navigate to="/404" /> },
    ],
  },
];

export default routes;
