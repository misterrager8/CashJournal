import Button from "./components/Button";

import { useContext, useEffect, useState } from "react";
import { MultiContext } from "./MultiContext";
import Accounts from "./components/pages/Accounts";
import Bills from "./components/pages/Bills";
import ShoppingList from "./components/pages/ShoppingList";
import Users from "./components/pages/Users";
import { AuthContext } from "./AuthContext";
import Spinner from "./components/Spinner";
import Badge from "./components/Badge";
import { Link, Outlet, useLocation, useNavigate } from "react-router";

export default function Container() {
  const multiCtx = useContext(MultiContext);
  const authCtx = useContext(AuthContext);

  const location = useLocation();

  const [theme, setTheme] = useState(
    localStorage.getItem("cash-journal") || "light"
  );

  useEffect(() => {
    localStorage.setItem("cash-journal", theme);
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <div className="p-4">
      <div className="nav-custom">
        <div>
          {multiCtx.loading ? (
            <Spinner className="" />
          ) : (
            <Button
              className="nav-toggle "
              size={null}
              icon="currency-dollar"
              border={false}
            />
          )}
          <Link to="/users">
            <Button
              size={null}
              active={location.pathname === "/users"}
              className=" mx-1"
              icon="person-circle"
              border={false}
            />
          </Link>
          {authCtx.username && authCtx.email && (
            <>
              <Link to="/accounts">
                <Button
                  size={null}
                  active={location.pathname === "/accounts"}
                  className=" mx-1"
                  icon="piggy-bank-fill"
                  border={false}
                />
              </Link>
              <Link to="/bills">
                <Button
                  size={null}
                  active={location.pathname === "/bills"}
                  className=" mx-1"
                  icon="calendar3"
                  border={false}
                />
              </Link>
              <Link to="/shopping">
                <Button
                  size={null}
                  active={location.pathname === "/shopping"}
                  className=""
                  icon="cart4"
                  border={false}>
                  <span className="small ms-2">
                    {multiCtx.shoppingList.filter((x) => !x.bought).length}
                  </span>
                </Button>
              </Link>
            </>
          )}
        </div>
        <Button
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          size={null}
          className=" text-capitalize"
          icon={theme === "light" ? "sun-fill" : "moon-fill"}
          border={false}
        />
      </div>
      <Outlet />
    </div>
  );
}
