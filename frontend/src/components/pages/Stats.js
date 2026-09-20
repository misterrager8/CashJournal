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
import Input from "../atoms/Input";

export const StatsContext = createContext();

export default function Stats({ className = "" }) {
  const { setLoading, merchants, setMerchants, setAccounts, accounts } =
    useContext(Context);

  const [charges, setCharges] = useState([]);
  const [filteredCharges, setFilteredCharges] = useState([]);

  const [deposits, setDeposits] = useState([]);
  const [nets, setNets] = useState([]);
  const [balances, setBalances] = useState([]);
  const [merchantGroups, setMerchantGroups] = useState([]);
  const [categoryGroups, setCategoryGroups] = useState([]);

  const [merchantFilter, setMerchantFilter] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState(null);
  const [accountFilter, setAccountFilter] = useState(null);

  const [search, setSearch] = useState("");
  const onChangeSearch = (e) => setSearch(e.target.value);

  const getAllTxns = () => {
    setLoading(true);
    api("get_all_txns", {}, (data) => {
      let charges_ = [...data.txns].filter((x) => x.type_ === "expense");
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
      setAccounts(data.accounts);
      setLoading(false);
    });
  };

  useEffect(() => {
    if (merchantFilter) {
      setCategoryFilter(null);
      setAccountFilter(null);
      let x = charges.reduce((a, b) => {
        let filtered_ = b.txns.filter((c) => c.merchant === merchantFilter);
        a.push({
          ...b,
          total: filtered_.reduce((c, d) => c + Math.abs(d.amount), 0),
          txns: filtered_,
        });
        return a;
      }, []);
      setFilteredCharges(x);
    }
  }, [merchantFilter]);

  useEffect(() => {
    if (categoryFilter) {
      setMerchantFilter(null);
      setAccountFilter(null);
      let x = charges.reduce((a, b) => {
        let filtered_ = b.txns.filter((c) => {
          return c.category?.name === categoryFilter;
        });
        a.push({
          ...b,
          total: filtered_.reduce((c, d) => c + Math.abs(d.amount), 0),
          txns: filtered_,
        });
        return a;
      }, []);
      setFilteredCharges(x);
    }
  }, [categoryFilter]);

  useEffect(() => {
    if (accountFilter) {
      setMerchantFilter(null);
      setCategoryFilter(null);
      let x = charges.reduce((a, b) => {
        let filtered_ = b.txns.filter((c) => {
          return c.accountName === accountFilter;
        });
        a.push({
          ...b,
          total: filtered_.reduce((c, d) => c + Math.abs(d.amount), 0),
          txns: filtered_,
        });
        return a;
      }, []);
      setFilteredCharges(x);
    }
  }, [accountFilter]);

  useEffect(() => {
    getAllTxns();
  }, []);

  const expenseAverage = () =>
    (merchantFilter || categoryFilter || accountFilter
      ? filteredCharges
      : charges
    ).reduce((x, y) => x + parseFloat(y.total), 0) /
    (merchantFilter || categoryFilter || accountFilter
      ? filteredCharges
      : charges
    ).length;

  const incomeAverage = () =>
    deposits.reduce((x, y) => x + parseFloat(y.total), 0) / deposits.length;

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
          </div>
          <div className="d-flex flex-row-reverse my-2">
            <div className="d-flex">
              <Dropdown
                active={accountFilter}
                text={accountFilter || "Accounts"}
                icon="bi:credit-card-fill"
                target="filter-accounts">
                <div className="">
                  <div>
                    {accounts.map((x) => (
                      <a
                        onClick={() => setAccountFilter(x.name)}
                        className={
                          "dropdown-item" +
                          (x.name === accountFilter ? " active" : "")
                        }>
                        {x.name}
                      </a>
                    ))}
                  </div>
                </div>
              </Dropdown>
              {accountFilter && (
                <Button
                  icon="bi:x-lg"
                  onClick={() => setAccountFilter(null)}
                  border={false}
                />
              )}
              <Dropdown
                active={merchantFilter}
                text={merchantFilter || "Merchants"}
                icon="tdesign:store-filled"
                classNameBtn="ms-1"
                target="filter-merchants">
                <div className="">
                  <div className="d-flex p-2">
                    {search !== "" && (
                      <Button
                        icon="bi:x-lg"
                        border={false}
                        onClick={() => setSearch("")}
                      />
                    )}
                    <Input
                      onChange={onChangeSearch}
                      value={search}
                      placeholder="Search"
                      className=""
                    />
                  </div>
                  <div style={{ height: "300px", overflowY: "auto" }}>
                    {merchants
                      .filter((w) =>
                        w.toLowerCase().includes(search.toLowerCase()),
                      )
                      .map((x) => (
                        <a
                          onClick={() => setMerchantFilter(x)}
                          className={
                            "dropdown-item" +
                            (x === merchantFilter ? " active" : "")
                          }>
                          {x}
                        </a>
                      ))}
                  </div>
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
                icon="akar-icons:tag"
                active={categoryFilter}
                classNameBtn="ms-1"
                text={categoryFilter || "Categories"}
                target="filter-categories">
                {categoryGroups.map((x) => (
                  <a
                    onClick={() => setCategoryFilter(x.category)}
                    className={
                      "dropdown-item" +
                      (x.category === categoryFilter ? " active" : "")
                    }>
                    {x.category}
                  </a>
                ))}
              </Dropdown>
              {categoryFilter && (
                <Button
                  icon="bi:x-lg"
                  onClick={() => setCategoryFilter(null)}
                  border={false}
                />
              )}
            </div>
          </div>
          <ResponsiveContainer height={250}>
            <BarChart
              margin={{ left: 20, top: 30 }}
              data={
                merchantFilter || categoryFilter || accountFilter
                  ? filteredCharges
                  : charges
              }>
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
          <div className="p-5">
            <div>
              <div className="h3">Monthly Average</div>
              <div className="h5">
                {expenseAverage().toLocaleString("en-US", {
                  style: "currency",
                  currency: "USD",
                })}
              </div>
            </div>
          </div>
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
          <div className="p-5">
            <div>
              <div className="h3">Monthly Average</div>
              <div className="h5">
                {incomeAverage().toLocaleString("en-US", {
                  style: "currency",
                  currency: "USD",
                })}
              </div>
            </div>
          </div>
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
