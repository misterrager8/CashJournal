import { useContext, useEffect, useState } from "react";
import Button from "./atoms/Button";
import { Context } from "../Context";
import Dropdown from "./atoms/Dropdown";
import Spinner from "./atoms/Spinner";

export default function Nav({ className = "" }) {
  const ctx = useContext(Context);

  const [theme, setTheme] = useState(
    localStorage.getItem("cash-journal-theme") || "light",
  );

  useEffect(() => {
    localStorage.setItem("cash-journal-theme", theme);
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const themes = [
    "light",
    "plum-iris",
    "sky-pumpkin",
    "ice-firetruck",
    "sapphire-firetruck",
    "marmalade-strawberry",
    "corn-eggplant",
    "blood-navy",
    "ocean-concord",
    "ice-nebula",
    "dark",
    "sky-lavender",
    "blood-marigold",
    "pumpkin-ocean",
    "ice-mustard",
    "citrus-blueberry",
    "butter-wine",
    "lilac-sapphire",
    "lemon-lavender",
    "blueberry-crimson",
  ];

  return (
    <div className={className + " nav-custom between"}>
      <div className="d-flex">
        {ctx.loading && (
          <div className="d-flex">
            <Spinner className="my-auto" />
          </div>
        )}
        <Button
          active={ctx.currentPage === "auth"}
          onClick={() => ctx.setCurrentPage("auth")}
          text={ctx.currentUser?.username}
          border={false}
          icon="bi:person-circle"
        />
        {ctx.currentUser && (
          <>
            <Button
              active={ctx.currentPage === "accounts"}
              onClick={() => ctx.setCurrentPage("accounts")}
              text="Accounts"
              border={false}
              icon="bi:piggy-bank-fill"
            />
            <Button
              active={ctx.currentPage === "bills"}
              onClick={() => ctx.setCurrentPage("bills")}
              text="Bills"
              border={false}
              icon="bi:calendar-day"
            />
            {/* <Button
              active={ctx.currentPage === "wish-list"}
              onClick={() => ctx.setCurrentPage("wish-list")}
              text="Wish List"
              border={false}
              icon="bi:cart"
            /> */}
          </>
        )}
      </div>

      <div>
        <Dropdown border={false} icon="bi:paint-bucket" target="themes">
          {themes.map((item) => (
            <>
              <div
                onClick={() => setTheme(item)}
                className={
                  "dropdown-item text-capitalize text-center" +
                  (theme === item ? " active" : "")
                }>
                {item}
              </div>
            </>
          ))}
        </Dropdown>
      </div>
    </div>
  );
}
