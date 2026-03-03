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
          icon="si:user-alt-6-fill"
        />
        {ctx.currentUser && (
          <>
            <Button
              active={ctx.currentPage === "accounts"}
              onClick={() => ctx.setCurrentPage("accounts")}
              text="Accounts"
              border={false}
              icon="bi:credit-card-fill"
            />
            {/* <Button
              active={ctx.currentPage === "bills"}
              onClick={() => ctx.setCurrentPage("bills")}
              text="Bills"
              border={false}
              icon="bi:calendar-day"
            /> */}
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
        <Dropdown
          border={false}
          icon="fluent:paint-bucket-24-filled"
          target="themes">
          <div style={{ height: "600px", overflowY: "auto" }}>
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
          </div>
        </Dropdown>
      </div>
    </div>
  );
}
