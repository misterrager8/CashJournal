import { useContext, useState } from "react";
import { StatsContext } from "../pages/Stats";

export default function CategoryStatItem({ item }) {
  const [showAvg, setShowAvg] = useState(false);
  const { charges } = useContext(StatsContext);

  return (
    <div className=" between" style={{ borderBottom: ".5px solid" }}>
      <div
        className=" text-truncate"
        title={item.category}
        style={{ fontSize: "1.5rem" }}>
        {item.category}
      </div>
      <div
        onClick={() => setShowAvg(!showAvg)}
        className=" my-auto"
        style={{ fontSize: "1rem" }}>
        {`${parseFloat(
          item.txns.reduce((y, z) => y + Math.abs(Number(z.amount)), 0) /
            (showAvg ? charges.length : 1),
        ).toLocaleString("en-US", {
          style: "currency",
          currency: "USD",
        })}${showAvg ? "/month" : ""}`}
      </div>
    </div>
  );
}
