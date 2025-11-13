import { useContext } from "react";
import Nav from "./Nav";

import Accounts from "./pages/Accounts";
import Auth from "./pages/Auth";
import Bills from "./pages/Bills";
import WishList from "./pages/WishList";
import { Context } from "../Context";

export default function Display({ className = "" }) {
  const ctx = useContext(Context);

  const pages = [
    {
      value: "auth",
      component: <Auth />,
    },
    {
      value: "accounts",
      component: <Accounts />,
    },
    {
      value: "bills",
      component: <Bills />,
    },
    {
      value: "wish-list",
      component: <WishList />,
    },
  ];

  return (
    <>
      <div className={className + " body"}>
        <div className="inner">
          <Nav />
          <div className="mt-4">
            {pages.find((x) => x.value === ctx.currentPage)?.component}
          </div>
        </div>
      </div>
    </>
  );
}
