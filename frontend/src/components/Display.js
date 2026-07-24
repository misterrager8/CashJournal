import { useContext } from "react";
import Nav from "./Nav";

import Accounts from "./pages/Accounts";
import Auth from "./pages/Auth";
import Bills from "./pages/Bills";
import { Context } from "../Context";
import moment from "moment";
import Stats from "./pages/Stats";

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
      value: "stats",
      component: <Stats />,
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
