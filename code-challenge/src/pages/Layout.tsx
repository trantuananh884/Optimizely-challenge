import type { JSX } from "react";
import { Outlet } from "react-router-dom";
import Header from "../component/Header";
function Layout(): JSX.Element {
  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
    </>
  );
}
export default Layout;
