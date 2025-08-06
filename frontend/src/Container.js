import Button from "./components/Button";

import { useContext, useEffect, useState } from "react";
import { MultiContext } from "./MultiContext";
import Accounts from "./components/pages/Accounts";
import Bills from "./components/pages/Bills";
import ShoppingList from "./components/pages/ShoppingList";
import Users from "./components/pages/Users";
import { AuthContext } from "./AuthContext";
import Spinner from "./components/Spinner";

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
        {multiCtx.loading ? (
          <Spinner className="mx-3" />
        ) : (
          <Button
            className="nav-toggle w-100"
            size={"sm"}
            icon="coin"
            border={false}
          />
        )}
        <hr className="my-2" />

        <Button
          active={multiCtx.currentPage === "users"}
          onClick={() => multiCtx.setCurrentPage("users")}
          className="w-100 my-2"
          icon="person-fill"
          border={false}
        />
        {authCtx.username && authCtx.email && (
          <>
            <Button
              active={multiCtx.currentPage === "accounts"}
              onClick={() => multiCtx.setCurrentPage("accounts")}
              className="w-100 my-2"
              icon="bank2"
              border={false}
            />
            <Button
              active={multiCtx.currentPage === "bills"}
              onClick={() => multiCtx.setCurrentPage("bills")}
              className="w-100 my-2"
              icon="receipt"
              border={false}
            />
            <Button
              active={multiCtx.currentPage === "shopping-list"}
              onClick={() => multiCtx.setCurrentPage("shopping-list")}
              className="w-100 my-2"
              icon="cart4"
              border={false}
            />
          </>
        )}
        <div className="bottom">
          <Button
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            size={"sm"}
            className=" text-capitalize w-100"
            icon={theme === "light" ? "sun-fill" : "moon-fill"}
            border={false}
          />
        </div>
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
