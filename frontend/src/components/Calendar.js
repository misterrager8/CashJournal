import { useEffect, useState } from "react";
import { api } from "../util";
import Button from "./Button";
import { v4 as uuidv4 } from "uuid";

const weekdays = ["S", "M", "T", "W", "Th", "F", "S"];

export default function Calendar({ className = "" }) {
  const [selectedDay, setSelectedDay] = useState(null);
  const [hoveredDay, setHoveredDay] = useState(null);
  const [days, setDays] = useState([]);

  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const prevMonth = () => {
    let month_ = currentMonth - 1;
    if (month_ === 0) {
      setCurrentYear(currentYear - 1);
      setCurrentMonth(12);
    } else {
      setCurrentMonth(month_);
    }
  };

  const nextMonth = () => {
    let month_ = currentMonth + 1;
    if (month_ === 13) {
      setCurrentYear(currentYear + 1);
      setCurrentMonth(1);
    } else {
      setCurrentMonth(month_);
    }
  };

  const resetMonth = () => {
    let today = new Date();
    setCurrentYear(today.getFullYear());
    setCurrentMonth(today.getMonth() + 1);
  };

  const isFilled = (day) => day.bills?.length > 0 && !day.filler;

  const isHovered = (day) => hoveredDay?.id === day.id && !day.filler;

  const isSelected = (day) => selectedDay?.id === day.id && !day.filler;

  const isToday = (day) => {
    let today = new Date();
    return (
      day.day === today.getDate() &&
      day.month === today.getMonth() + 1 &&
      day.year === today.getFullYear()
    );
  };

  const currentMonthSelected = () => {
    let today = new Date();
    return (
      currentMonth === today.getMonth() + 1 &&
      currentYear === today.getFullYear()
    );
  };

  useEffect(() => {
    setSelectedDay(null);
  }, [currentMonth]);

  useEffect(() => {
    getCalendar();
  }, [currentMonth]);

  const getCalendar = () => {
    api(
      "get_calendar",
      {
        month: currentMonth,
        year: currentYear,
      },
      (data) => {
        let days_ = data.days;

        let offset = days_[0].weekdayInt;
        let offsetEnd = days_[days_.length - 1].weekdayInt;

        let filler = Array(offset + 1).fill({ filler: true });
        let fillerEnd = Array(Math.abs(offsetEnd - 7)).fill({ filler: true });

        days_ = days_.concat(fillerEnd);

        setDays(offset + 1 < 7 ? filler.concat(days_) : days_);
      }
    );
  };

  return (
    <div className={className + " d-flex"}>
      <div className="m-auto">
        <div className="text-center mb-3">
          <div className="h5 m-0">
            {hoveredDay
              ? hoveredDay?.label
              : selectedDay
              ? selectedDay?.label
              : days.find((x) => !x.filler)?.monthLabel}
          </div>
        </div>
        <div className="between">
          <Button
            onClick={() => prevMonth()}
            icon="arrow-left"
            className="border-0"
          />
          {!currentMonthSelected() && (
            <Button
              onClick={() => resetMonth()}
              icon="fast-forward-fill"
              className="blue border-0"
              text="Today"
            />
          )}
          <div>
            <Button
              disabled={currentMonthSelected()}
              onClick={() => nextMonth()}
              icon="arrow-right"
              className="border-0"
            />
          </div>
        </div>
        <div className="month mt-3" onMouseLeave={() => setHoveredDay(null)}>
          {weekdays.map((x) => (
            <div key={uuidv4()} className="weekday mb-2">
              {x}
            </div>
          ))}
          {days.map((x) => (
            <div
              key={x.id}
              onClick={() =>
                setSelectedDay(x.id === selectedDay?.id ? null : x)
              }
              onMouseEnter={() => setHoveredDay(x.filler ? null : x)}
              className={
                "day d-flex" +
                (x.filler ? " filler" : "") +
                (isFilled(x) ? " filled" : "") +
                (isHovered(x) ? " hovered-day" : "") +
                (isSelected(x) ? " selected-day" : "") +
                (isToday(x) ? " today" : "")
              }>
              <div className="m-auto small">
                {isFilled(x) && x.bills?.length > 1 ? x.bills?.length : ""}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
