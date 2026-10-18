import { createBrowserRouter } from "react-router-dom";
import HomePage from "../pages/Home";
import RepositoryDetail from "../pages/Detail";
import Layout from "../pages/Layout";
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "/detail",
        element: <RepositoryDetail />,
      },
    ],
  },
]);
export default router;
