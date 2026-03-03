import { createContext, useContext, useEffect, useState } from "react";
import AccountItem from "../items/AccountItem";
import TxnItem from "../items/TxnItem";
import NewAccount from "../forms/NewAccount";
import NewTxn from "../forms/NewTxn";
import { Context } from "../../Context";
import { api, moment_ as moment } from "../../util";
import Button from "../atoms/Button";
import Input from "../atoms/Input";
import EditTxn from "../forms/EditTxn";
import Dropdown from "../atoms/Dropdown";
import Icon from "../atoms/Icon";
import Budgets from "../sections/Budgets";

export const AccountContext = createContext();

export default function Accounts({ className = "" }) {
  const ctx = useContext(Context);

  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);

  const [selectedTxn, setSelectedTxn] = useState(null);
  const [selectedTxns, setSelectedTxns] = useState([]);
  const [selectedBudget, setSelectedBudget] = useState(null);

  const [selectedBudgets, setSelectedBudgets] = useState([]);

  const [txns, setTxns] = useState([]);
  const [sort, setSort] = useState("date-desc");

  const [editing, setEditing] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [accountName, setAccountName] = useState("");
  const onChangeAccountName = (e) => setAccountName(e.target.value);

  const [accountBalance, setAccountBalance] = useState(0.0);
  const onChangeAccountBalance = (e) => setAccountBalance(e.target.value);

  const [filter, setFilter] = useState(null);
  const [showBudgets, setShowBudgets] = useState(false);
  const [total, setTotal] = useState(0);

  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

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

  const getAccounts = () => {
    ctx.setLoading(true);
    api("get_accounts", {}, (data) => {
      setAccounts(data.accounts);
      ctx.setLoading(false);
    });
  };

  const getTxns = (id) => {
    ctx.setLoading(true);
    api(
      "get_txns",
      { id: id, month: currentMonth, year: currentYear },
      (data) => {
        setTxns(data.txns);
        ctx.setBudgets(data.budgets);
        ctx.setLoading(false);
      },
    );
  };

  const editAccount = (e) => {
    e.preventDefault();
    api(
      "edit_account",
      {
        id: selectedAccount?.id,
        name: accountName,
        balance: accountBalance,
      },
      (data) => {
        setSelectedAccount(data.account);
        setAccounts(data.accounts);
      },
    );
  };

  const switchBudget = (budgetId) => {
    api(
      "switch_budget",
      {
        id: selectedTxn?.id,
        budgetId: budgetId,
        month: currentMonth,
        year: currentYear,
      },
      (data) => {
        setTxns(data.txns);
        setSelectedTxn(data.txn);
      },
    );
  };

  const currentMonthSelected = () => {
    let today = new Date();
    return (
      currentMonth === today.getMonth() + 1 &&
      currentYear === today.getFullYear()
    );
  };

  const toggleSelect = (item_) => {
    if (selectedTxns.includes(item_)) {
      setSelectedTxns([...selectedTxns].filter((x) => x !== item_));
    } else {
      let selectedTxns_ = [...selectedTxns];
      selectedTxns_.push(item_);
      setSelectedTxns(selectedTxns_);
    }
  };

  const selectAll = () => {
    setSelectedTxns([...txns]);
  };

  const deselectAll = () => {
    setSelectedTxns([]);
  };

  useEffect(() => {
    let merchants_ = txns.map((x) => x.merchant);
    let merchants__ = [...new Set(merchants_)];
    ctx.setMerchants(merchants__);
  }, [txns]);

  useEffect(() => {
    setAccountName(selectedAccount?.name);
    setAccountBalance(selectedAccount?.balance);
    setSelectedTxn(null);
    // getTxns(selectedAccount?.id);
  }, [selectedAccount]);

  useEffect(() => {
    ctx.currentUser && getAccounts();
    getTxns();
  }, [ctx.currentUser, currentMonth, currentYear, selectedAccount]);

  useEffect(() => {
    setEditing(false);
  }, [selectedAccount]);

  useEffect(() => {
    setSelectedBudgets([]);
  }, [showBudgets, currentMonth]);

  const contextValue = {
    selectedAccount: selectedAccount,
    setSelectedAccount: setSelectedAccount,
    accounts: accounts,
    setAccounts: setAccounts,
    selectedTxn: selectedTxn,
    setSelectedTxn: setSelectedTxn,
    selectedTxns: selectedTxns,
    setSelectedTxns: setSelectedTxns,
    selectedBudgets: selectedBudgets,
    setSelectedBudgets: setSelectedBudgets,
    txns: txns,
    setTxns: setTxns,
    switchBudget: switchBudget,
    currentMonth: currentMonth,
    setCurrentMonth: setCurrentMonth,
    currentYear: currentYear,
    setCurrentYear: setCurrentYear,
    total: total,
    setTotal: setTotal,
    selectedBudget: selectedBudget,
    setSelectedBudget: setSelectedBudget,
    toggleSelect: toggleSelect,
  };

  const sorts = [
    {
      value: "date-desc",
      label: "Newest",
    },
    {
      value: "merchant",
      label: "Merchant",
    },
    {
      value: "amount",
      label: "Amount (Desc)",
    },
    {
      value: "category",
      label: "Category",
    },
  ];

  const getSort = () => sorts.find((x) => x.value === sort);

  useEffect(() => {
    let txns_ = [...txns];
    if (sort === "amount") {
      txns_.sort((x, y) => Math.abs(y.amount) - Math.abs(x.amount));
    } else if (sort === "date-desc") {
      txns_.sort(
        (x, y) => moment(y.timestamp).valueOf() - moment(x.timestamp).valueOf(),
      );
    } else if (sort === "merchant") {
      txns_.sort((x, y) =>
        x.merchant.toLowerCase()?.localeCompare(y.merchant.toLowerCase()),
      );
    } else if (sort === "category") {
      txns_.sort((x, y) =>
        x.category?.name
          .toLowerCase()
          ?.localeCompare(y.category?.name.toLowerCase()),
      );
    }
    setTxns(txns_);
  }, [sort]);

  return (
    <AccountContext.Provider value={contextValue}>
      <div className={className + " flex"}>
        <div className="col-33 hide-on-mobile">
          <NewAccount className="mb-3" />
          {accounts.map((item) => (
            <AccountItem item={item} />
          ))}
          <div
            onClick={() => setSelectedAccount(null)}
            className={
              className + " account-item" + (!selectedAccount ? " active" : "")
            }>
            <div className="fw-bold">
              <Icon className="me-3" name="fluent-mdl2:total" />
              All Accounts
            </div>
            <div className="font-monospace">
              {parseFloat(
                accounts.reduce((x, y) => x + parseFloat(y.balance), 0),
              ).toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
              })}
            </div>
          </div>
        </div>
        <div className="divider hide-on-mobile"></div>
        <div className="col-67">
          <div>
            {selectedTxn ? (
              <EditTxn />
            ) : (
              <>
                <div className="text-center">
                  <div className="show-on-mobile">
                    <Dropdown
                      active={selectedAccount}
                      classNameMenu="w-95"
                      icon="bi:credit-card-fill"
                      border={false}>
                      {accounts.map((x) => (
                        <a
                          onClick={() => setSelectedAccount(x)}
                          style={{ fontSize: "1rem" }}
                          className={
                            "dropdown-item between" +
                            (selectedAccount?.id === x.id ? " active" : "")
                          }>
                          <span className="fw-bold">{x.name}</span>
                          <span className="font-monospace">
                            {parseFloat(x.balance).toLocaleString("en-US", {
                              style: "currency",
                              currency: "USD",
                            })}
                          </span>
                        </a>
                      ))}

                      <a
                        onClick={() => setSelectedAccount(null)}
                        style={{ fontSize: "1rem" }}
                        className={
                          "dropdown-item between" +
                          (!selectedAccount ? " active" : "")
                        }>
                        <span className="fw-bold">All Accounts</span>
                        <span className="font-monospace">
                          {parseFloat(
                            accounts.reduce(
                              (x, y) => x + parseFloat(y.balance),
                              0,
                            ),
                          ).toLocaleString("en-US", {
                            style: "currency",
                            currency: "USD",
                          })}
                        </span>
                      </a>
                    </Dropdown>
                  </div>
                  {!editing ? (
                    <>
                      <div style={{ fontSize: "1.5rem" }}>
                        {selectedAccount
                          ? selectedAccount?.name
                          : "All Accounts"}
                      </div>
                      <div style={{ fontSize: "3.5rem" }}>
                        {parseFloat(
                          selectedAccount
                            ? selectedAccount?.balance
                            : accounts.reduce(
                                (x, y) => x + parseFloat(y.balance),
                                0,
                              ),
                        ).toLocaleString("en-US", {
                          style: "currency",
                          currency: "USD",
                        })}
                      </div>
                    </>
                  ) : (
                    <form onSubmit={(e) => editAccount(e)}>
                      <Input
                        className="border-0"
                        style={{ fontSize: "1.5rem", textAlign: "center" }}
                        value={accountName}
                        onChange={onChangeAccountName}
                      />
                      <input
                        style={{ fontSize: "3.5rem", textAlign: "center" }}
                        type="number"
                        step={0.01}
                        autoComplete="off"
                        className="form-control border-0 opacity-50 fst-italic"
                        value={accountBalance}
                        onChange={onChangeAccountBalance}
                      />
                      <Button type_="submit" className="d-none" />
                    </form>
                  )}
                </div>
                <div
                  className={"d-flex" + (selectedAccount ? "" : " invisible")}>
                  <div className="mx-auto">
                    <Button
                      border={false}
                      active={editing}
                      icon="tdesign:edit-2-filled"
                      onClick={() => setEditing(!editing)}
                    />
                    {deleting && (
                      <Button
                        border={false}
                        className="red"
                        icon="bi:question-lg"
                        // onClick={() => setEditing(!editing)}
                      />
                    )}
                    <Button
                      border={false}
                      className="red"
                      icon="bi:x-lg"
                      onClick={() => setDeleting(!deleting)}
                    />
                  </div>
                </div>
                <NewTxn className="my-2" />
                <div className="between txn-menu">
                  <div className="d-flex ">
                    <Button
                      border={false}
                      className="abbreviate"
                      icon={
                        !showBudgets
                          ? "uis:graph-bar"
                          : "streamline-plump:credit-card-5-solid"
                      }
                      active={showBudgets}
                      onClick={() => setShowBudgets(!showBudgets)}
                      text={showBudgets ? "Transactions" : "Budgets"}
                    />
                    <Dropdown
                      classNameBtn="abbreviate"
                      border={false}
                      target="sort"
                      icon="bi:sort-down"
                      text={`Sort: ${getSort()?.label}`}>
                      {sorts.map((x) => (
                        <a
                          onClick={() => setSort(x.value)}
                          className={
                            "dropdown-item" +
                            (sort === x.value ? " active" : "")
                          }>
                          {x.label}
                        </a>
                      ))}
                    </Dropdown>
                    {filter && (
                      <Button
                        border={false}
                        icon="bi:x-lg"
                        onClick={() => setFilter(null)}
                      />
                    )}
                    <Dropdown
                      active={filter}
                      classNameBtn="abbreviate"
                      border={false}
                      target="merchants"
                      icon="tdesign:store-filled"
                      text={filter ? filter : "Merchants"}>
                      <div style={{ height: "300px", overflowY: "auto" }}>
                        {ctx.merchants.map((x) => (
                          <a
                            onClick={() => setFilter(x)}
                            className={
                              "dropdown-item" + (filter === x ? " active" : "")
                            }>
                            {x}
                          </a>
                        ))}
                      </div>
                    </Dropdown>
                  </div>
                  <div className="d-flex text-truncate">
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
                  </div>
                </div>
                <div className="txn-scroll mt-3">
                  {!showBudgets ? (
                    <>
                      {txns
                        .filter((x) => {
                          if (filter) {
                            return x.merchant === filter;
                          } else {
                            return x;
                          }
                        })
                        .map((item) => (
                          <TxnItem key={item.id} item={item} />
                        ))}
                    </>
                  ) : (
                    <Budgets />
                  )}
                </div>

                <div className="between mt-2 small">
                  {!showBudgets ? (
                    <div className="between w-75">
                      <div className="green my-auto">
                        <Icon name="bi:plus-lg" className="me-2" />
                        {(selectedTxns.length > 0 ? selectedTxns : txns)
                          .filter((x) => {
                            if (filter) {
                              return x.merchant === filter && x.amount > 0;
                            } else {
                              return x.amount > 0 ? x : null;
                            }
                          })
                          .reduce((y, z) => y + parseFloat(z.amount), 0)
                          .toLocaleString("en-US", {
                            style: "currency",
                            currency: "USD",
                          })}
                      </div>
                      <div className="red my-auto">
                        <Icon name="bi:dash-lg" className="me-2" />
                        {(selectedTxns.length > 0 ? selectedTxns : txns)
                          .filter((x) => {
                            if (filter) {
                              return x.merchant === filter && x.amount < 0;
                            } else {
                              return x.amount < 0 ? x : null;
                            }
                          })
                          .reduce(
                            (y, z) => y + parseFloat(Math.abs(z.amount)),
                            0,
                          )
                          .toLocaleString("en-US", {
                            style: "currency",
                            currency: "USD",
                          })}
                      </div>
                      <div className="orange my-auto">
                        <Icon name="fluent-mdl2:total" className="me-2" />
                        {(selectedTxns.length > 0 ? selectedTxns : txns)
                          .filter((x) => {
                            if (filter) {
                              return x.merchant === filter;
                            } else {
                              return x;
                            }
                          })
                          .reduce((y, z) => y + parseFloat(z.amount), 0)
                          .toLocaleString("en-US", {
                            style: "currency",
                            currency: "USD",
                          })}
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="orange my-auto">
                        <Icon name="fluent-mdl2:total" className="me-2" />
                        {selectedBudgets
                          .reduce(
                            (x, y) =>
                              x +
                              y.txns.reduce(
                                (z, a) => z + Math.abs(a.amount),
                                0,
                              ),
                            0,
                          )
                          .toLocaleString("en-US", {
                            style: "currency",
                            currency: "USD",
                          })}
                      </div>
                    </div>
                  )}
                  {!showBudgets && (
                    <div className="d-flex flex-row-reverse w-25">
                      {selectedTxns.length > 0 && (
                        <Button
                          border={false}
                          icon="bi:square"
                          onClick={() => deselectAll()}
                        />
                      )}
                      <Button
                        border={false}
                        icon="bi:check-square"
                        onClick={() => selectAll()}
                      />
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </AccountContext.Provider>
  );
}
