import { useContext, useEffect, useState } from "react";
import { AccountContext } from "../pages/Accounts";
import { Context } from "../../Context";
import Button from "../atoms/Button";

export default function GetMonth() {
  const { currentMonth, setCurrentMonth, setCurrentYear, currentYear } =
    useContext(AccountContext);
  const ctx = useContext(Context);

  const [monthInput, setMonthInput] = useState(new Date().getMonth() + 1);
  const onChangeMonthInput = (e) => setMonthInput(e.target.value);

  const [yearInput, setYearInput] = useState(new Date().getFullYear());
  const onChangeYearInput = (e) => setYearInput(e.target.value);

  const [jumpingToMonth, setJumpingToMonth] = useState(false);

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const currentMonthSelected = () => {
    let today = new Date();
    return (
      currentMonth === today.getMonth() + 1 &&
      currentYear === today.getFullYear()
    );
  };

  // useEffect(() => {
  //   if (!jumpingToMonth) {
  //     setMonthInput(new Date().getMonth() + 1);
  //     setYearInput(new Date().getFullYear());
  //   }
  // }, [jumpingToMonth]);

  return (
    <>
      <div className="d-flex text-truncate">
        <Button
          className="mx-1"
          active={jumpingToMonth}
          onClick={() => setJumpingToMonth(!jumpingToMonth)}
          border={false}
          icon="ant-design:calendar-filled"
        />
        {jumpingToMonth ? (
          <>
            <form
              className="d-flex"
              onSubmit={(e) => {
                e.preventDefault();
                setCurrentMonth(monthInput);
                setCurrentYear(yearInput);
              }}>
              <input
                style={{ width: "35px" }}
                className="form-control form-control-sm me-1"
                type="number"
                min={1}
                max={12}
                value={monthInput}
                onChange={onChangeMonthInput}
              />
              <input
                // style={{width:'70px'}}
                className="form-control form-control-sm"
                type="number"
                min={2000}
                max={new Date().getFullYear()}
                value={yearInput}
                onChange={onChangeYearInput}
              />
              <Button type_="submit" className="d-none" />
            </form>
          </>
        ) : (
          <>
            <Button
              border={false}
              icon="bi:caret-left-fill"
              onClick={() => {
                if (currentMonth === 1) {
                  setCurrentMonth(12);
                  setCurrentYear(currentYear - 1);
                } else {
                  setCurrentMonth(currentMonth - 1);
                }
              }}
            />
            <Button
              className="text-truncate"
              active={!currentMonthSelected()}
              onClick={() => {
                if (!currentMonthSelected()) {
                  setCurrentMonth(new Date().getMonth() + 1);
                  setCurrentYear(new Date().getFullYear());
                }
              }}
              border={false}
              text={`${months[currentMonth - 1]} '${currentYear.toString().substring(2)}`}
            />
            <Button
              className={currentMonthSelected() ? "invisible" : ""}
              border={false}
              icon="bi:caret-right-fill"
              onClick={() => {
                if (currentMonth === 12) {
                  setCurrentMonth(1);
                  setCurrentYear(currentYear + 1);
                } else {
                  setCurrentMonth(currentMonth + 1);
                }
              }}
            />
          </>
        )}
      </div>
    </>
  );
}
