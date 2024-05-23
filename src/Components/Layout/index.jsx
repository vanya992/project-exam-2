import { Outlet } from "react-router-dom";
import { Header } from "./Header/index.jsx";
import { Footer } from "./Footer/index.jsx";

export const Layout = () => {
  return (
    <div className="page">
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
};
