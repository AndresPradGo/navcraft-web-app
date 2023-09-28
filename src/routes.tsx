import { createBrowserRouter } from "react-router-dom";

import Layout from "./pages/Layout";

const router = createBrowserRouter([{ path: "/", element: <Layout /> }]);

export default router;
