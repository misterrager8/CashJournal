import { createContext, useContext, useEffect, useState } from "react";
import { Context } from "../../Context";
import { AccountContext } from "./Accounts";
import { api } from "../../util";
import { v4 as uuidv4 } from "uuid";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  Cell,
  ReferenceLine,
  CartesianGrid,
} from "recharts";
import moment from "moment";
import Dropdown from "../atoms/Dropdown";
import Button from "../atoms/Button";
import CategoryStatItem from "../items/CategoryStatItem";

export const StatsContext = createContext();

export default function Stats({ className = "" }) {
  const { setLoading, merchants, setMerchants } = useContext(Context);
  const [charges, setCharges] = useState([]);
  const [deposits, setDeposits] = useState([]);
  const [nets, setNets] = useState([]);
  const [balances, setBalances] = useState([]);
  const [merchantGroups, setMerchantGroups] = useState([]);
  const [categoryGroups, setCategoryGroups] = useState([]);

  const [merchantFilter, setMerchantFilter] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState(null);

  const getAllTxns = () => {
    setLoading(true);
    api("get_all_txns", {}, (data) => {
      let charges_ = [...data.txns].filter((x) =>
        ["expense", "adjustment"].includes(x.type_),
      );
      let deposits_ = [...data.txns].filter((x) => x.type_ === "income");
      let nets = [];
      let all_txns = [...data.txns];
      let balances_ = [];

      const chargesByMonth = Object.values(
        charges_.reduce((acc, txn) => {
          const month = txn.timestamp.slice(0, 7); // "YYYY-MM"
          if (!acc[month]) {
            acc[month] = { month, total: 0, txns: [] };
          }
          acc[month].total += parseFloat(Math.abs(txn.amount));
          acc[month].txns.push(txn);
          return acc;
        }, {}),
      ).sort((a, b) => b.month.localeCompare(a.month));

      const depositsByMonth = Object.values(
        deposits_.reduce((acc, txn) => {
          const month = txn.timestamp.slice(0, 7); // "YYYY-MM"
          if (!acc[month]) {
            acc[month] = { month, total: 0, txns: [] };
          }
          acc[month].total += parseFloat(Math.abs(txn.amount));
          acc[month].txns.push(txn);
          return acc;
        }, {}),
      ).sort((a, b) => b.month.localeCompare(a.month));

      const merchantGroups_ = Object.values(
        all_txns.reduce((acc, txn) => {
          const merchant = txn.merchant || "Unknown";
          if (!acc[merchant]) {
            acc[merchant] = { merchant, txns: [] };
          }
          acc[merchant].txns.push(txn);
          return acc;
        }, {}),
      );

      const categoryGroups_ = Object.values(
        all_txns.reduce((acc, txn) => {
          const category = txn.category?.name || "Unknown";
          if (!acc[category]) {
            acc[category] = { category, txns: [] };
          }
          acc[category].txns.push(txn);
          return acc;
        }, {}),
      );

      setCharges(chargesByMonth);
      setDeposits(depositsByMonth);

      let merchants_ = charges_.map((x) => x.merchant);
      let merchants__ = [...new Set(merchants_)];
      setMerchants(merchants__);

      for (
        let i = 0;
        i < Math.max(chargesByMonth.length, depositsByMonth.length);
        i++
      ) {
        const charge = chargesByMonth[i] || {
          month: depositsByMonth[i].month,
          total: 0,
        };
        const deposit = depositsByMonth[i] || {
          month: chargesByMonth[i].month,
          total: 0,
        };
        nets.push({
          month: charge.month || deposit.month,
          net: deposit.total - charge.total,
        });
      }

      for (let x = 0; x < all_txns.length; x++) {
        let current = all_txns[x];
        let txns_before = all_txns.filter((y) =>
          moment(y.timestamp).isBefore(moment(current.timestamp)),
        );
        balances_.push({
          timestamp: current.timestamp,
          balance: txns_before.reduce((y, z) => y + parseFloat(z.amount), 0),
        });
      }

      setNets(nets);
      setBalances(
        balances_
          .sort((x, y) => moment(y).valueOf() - moment(x).valueOf())
          .filter((x) => x.balance < 12000 && x.balance !== 0),
      );
      setMerchantGroups(merchantGroups_);
      setCategoryGroups(categoryGroups_);
      setLoading(false);
    });
  };

  useEffect(() => {
    getAllTxns();
  }, []);

  const contextValue = {
    charges: charges,
  };

  return (
    <div className={className}>
      <div className="row" style={{ height: "80vh", overflowY: "auto" }}>
        <div className="col-12 mb-5">
          <div className="between">
            <div className="text-truncate" style={{ fontSize: "2rem" }}>
              Monthly Expenses
            </div>
            <div className="my-auto d-flex">
              <Dropdown
                text={merchantFilter || "Merchants"}
                icon="tdesign:store-filled"
                target="filter-merchants">
                <div style={{ height: "300px", overflowY: "auto" }}>
                  {merchants.map((x) => (
                    <a
                      onClick={() => setMerchantFilter(x)}
                      className="dropdown-item">
                      {x}
                    </a>
                  ))}
                </div>
              </Dropdown>
              {merchantFilter && (
                <Button
                  icon="bi:x-lg"
                  onClick={() => setMerchantFilter(null)}
                  border={false}
                />
              )}
              <Dropdown
                classNameBtn="ms-3"
                text="Categories"
                // icon="tdesign:store-filled"
                target="filter-categories"></Dropdown>
            </div>
          </div>
          <ResponsiveContainer height={250}>
            <BarChart margin={{ left: 20, top: 30 }} data={charges}>
              <Bar fill="#ff5b5b" radius={10} dataKey="total" />
              <XAxis reversed domain={["dataMin", "dataMax"]} dataKey="month" />
              <YAxis
                tickFormatter={(x) =>
                  parseFloat(x).toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD",
                  })
                }
                domain={["auto", "auto"]}
                type="number"
              />
              <Tooltip
                formatter={(x) =>
                  parseFloat(x).toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD",
                  })
                }
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="col-12 mb-5">
          <div className="" style={{ fontSize: "2rem" }}>
            Monthly Income
          </div>
          <ResponsiveContainer height={250}>
            <BarChart margin={{ left: 20, top: 30 }} data={deposits}>
              <Bar fill="#3c803c" radius={10} dataKey="total" />
              <XAxis reversed domain={["dataMin", "dataMax"]} dataKey="month" />
              <YAxis
                tickFormatter={(x) =>
                  parseFloat(x).toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD",
                  })
                }
                domain={["auto", "auto"]}
                type="number"
              />
              <Tooltip
                formatter={(x) =>
                  parseFloat(x).toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD",
                  })
                }
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="col-12 mb-5">
          <div className="" style={{ fontSize: "2rem" }}>
            Net Savings
          </div>
          <ResponsiveContainer height={250}>
            <BarChart margin={{ left: 20, top: 30 }} data={nets}>
              <ReferenceLine strokeDasharray="4 4" strokeWidth={2} y={0} />
              <Bar radius={10} dataKey="net">
                {nets.map((entry, index) => {
                  // Condition: Red for negative values, Green for positive values
                  const color = entry.net < 0 ? "#ff5b5b" : "#3c803c";
                  return <Cell key={`cell-${index}`} fill={color} />;
                })}
              </Bar>
              <XAxis reversed domain={["dataMin", "dataMax"]} dataKey="month" />
              <YAxis
                tickFormatter={(x) =>
                  parseFloat(x).toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD",
                  })
                }
                domain={["auto", "auto"]}
                type="number"
              />
              <Tooltip
                formatter={(x) =>
                  parseFloat(x).toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD",
                  })
                }
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="col-12 mb-5">
          <div className="" style={{ fontSize: "2rem" }}>
            Total Balance
          </div>
          <ResponsiveContainer height={250}>
            <LineChart margin={{ left: 30, top: 30 }} data={balances}>
              <CartesianGrid vertical={false} />
              <ReferenceLine strokeDasharray="4 4" strokeWidth={2} y={0} />
              <Line
                type="basis"
                strokeWidth={5}
                dot={false}
                dataKey="balance"
              />
              <XAxis
                tickFormatter={(x) => moment(x).format("M/D")}
                tickMargin={10}
                reversed
                domain={["dataMin", "dataMax"]}
                dataKey="timestamp"
              />
              <YAxis
                tickFormatter={(x) =>
                  parseFloat(x).toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD",
                  })
                }
                domain={["auto", "auto"]}
                type="number"
              />
              <Tooltip
                formatter={(x) =>
                  parseFloat(x).toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD",
                  })
                }
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="d-flex mt-4">
          <div className="w-50 px-4">
            {merchantGroups
              .sort(
                (v, w) =>
                  v.txns.reduce((y, z) => y + Number(z.amount), 0) -
                  w.txns.reduce((y, z) => y + Number(z.amount), 0),
              )
              .map((x) => (
                <div className="row" style={{ borderBottom: ".5px solid" }}>
                  <div
                    className="col text-truncate"
                    title={x.merchant}
                    style={{ fontSize: "1.5rem" }}>
                    {x.merchant}
                  </div>
                  <div className="col my-auto" style={{ fontSize: "1rem" }}>
                    {parseFloat(
                      x.txns.reduce((y, z) => y + Number(z.amount), 0),
                    ).toLocaleString("en-US", {
                      style: "currency",
                      currency: "USD",
                    })}
                  </div>
                </div>
              ))}
          </div>
          <StatsContext.Provider value={contextValue}>
            <div className="w-50 px-4">
              {categoryGroups
                .sort(
                  (v, w) =>
                    v.txns.reduce((y, z) => y + Number(z.amount), 0) -
                    w.txns.reduce((y, z) => y + Number(z.amount), 0),
                )
                .map((x) => (
                  <CategoryStatItem key={uuidv4()} item={x} />
                ))}
            </div>
          </StatsContext.Provider>
        </div>
      </div>
    </div>
  );
}
