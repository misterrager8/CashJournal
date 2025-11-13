import { useContext, useEffect, useState } from "react";
import Button from "./atoms/Button";
import { Context } from "../Context";

export default function Nav({ className = "" }) {
  const ctx = useContext(Context);

  const [theme, setTheme] = useState(
    localStorage.getItem("cash-journal-theme") || "light"
  );

  useEffect(() => {
    localStorage.setItem("cash-journal-theme", theme);
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <div className={className + " nav-custom between"}>
      <div>
        {/* <Button border={false} icon="currency-dollar" /> */}
        <Button
          active={ctx.currentPage === "auth"}
          onClick={() => ctx.setCurrentPage("auth")}
          text={ctx.currentUser?.username}
          border={false}
          icon="person-circle"
        />
        {ctx.currentUser && (
          <>
            <Button
              active={ctx.currentPage === "accounts"}
              onClick={() => ctx.setCurrentPage("accounts")}
              text="Accounts"
              border={false}
              icon="piggy-bank-fill"
            />
            {/* <Button
              active={ctx.currentPage === "bills"}
              onClick={() => ctx.setCurrentPage("bills")}
              text="Bills"
              border={false}
              icon="calendar-day"
            />
            <Button
              active={ctx.currentPage === "wish-list"}
              onClick={() => ctx.setCurrentPage("wish-list")}
              text="Wish List"
              border={false}
              icon="cart"
            /> */}
          </>
        )}
      </div>
      <div>
        <Button
          border={false}
          icon={theme === "light" ? "sun-fill" : "moon-fill"}
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          // className="text-capitalize"
        />
      </div>
    </div>
  );
}
