// router.tsx
import { createBrowserRouter } from "react-router-dom";
import { NotFound } from "../pages/NotFound";
import Home from "../pages/Home";
import Redirector from "../components/Redirector";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    errorElement: <NotFound />,
  },
  {
    path: "/NotFound",
    element: <NotFound />,
  },
  {
    path: "/:shortKey",
    element: <Redirector />,
    errorElement: <NotFound />,
  },
]);

export default router;