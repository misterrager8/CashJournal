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

export default function Container() {
  const multiCtx = useContext(MultiContext);
  const authCtx = useContext(AuthContext);

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
          <Button
            size={null}
            active={multiCtx.currentPage === "users"}
            onClick={() => multiCtx.setCurrentPage("users")}
            className=" mx-1"
            icon="person-circle"
            border={false}
          />
          {authCtx.username && authCtx.email && (
            <>
              <Button
                size={null}
                active={multiCtx.currentPage === "accounts"}
                onClick={() => multiCtx.setCurrentPage("accounts")}
                className=" mx-1"
                icon="piggy-bank-fill"
                border={false}
              />
              <Button
                size={null}
                active={multiCtx.currentPage === "bills"}
                onClick={() => multiCtx.setCurrentPage("bills")}
                className=" mx-1"
                icon="calendar3"
                border={false}
              />
              <Button
                size={null}
                active={multiCtx.currentPage === "shopping-list"}
                onClick={() => multiCtx.setCurrentPage("shopping-list")}
                className=""
                icon="cart4"
                border={false}>
                {/* <Badge className=" border-0" text={multiCtx.shoppingList.length} /> */}
                <span className="small ms-2">
                  {multiCtx.shoppingList.filter((x) => !x.bought).length}
                </span>
              </Button>
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
      {multiCtx.currentPage === "accounts" ? (
        <Accounts />
      ) : multiCtx.currentPage === "bills" ? (
        <Bills />
      ) : multiCtx.currentPage === "shopping-list" ? (
        <ShoppingList />
      ) : (
        <Users />
      )}
    </div>
  );
}
