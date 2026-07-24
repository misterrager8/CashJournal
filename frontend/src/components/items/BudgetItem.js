import { Fragment, useContext, useEffect, useState } from "react";
import Button from "../atoms/Button";
import { Context } from "../../Context";
import moment from "moment";
import { AccountContext } from "../pages/Accounts";
import Input from "../atoms/Input";
import { Icon } from "@iconify/react";

export default function BudgetItem({ item, className = "" }) {
  const multiCtx = useContext(Context);
  const accountCtx = useContext(AccountContext);
  const [deleting, setDeleting] = useState(false);
  const [editing, setEditing] = useState(false);
  const [showTxns, setShowTxns] = useState(false);

  const [name, setName] = useState(item.name);
  const onChangeName = (e) => setName(e.target.value);

  const [color, setColor] = useState(item.color);
  const onChangeColor = (e) => setColor(e.target.value);

  const [icon, setIcon] = useState(item.icon);
  const onChangeIcon = (e) => setIcon(e.target.value);

  const [maximum, setMaximum] = useState(0.01);
  const onChangeMaximum = (e) => setMaximum(e.target.value);

  const isChanged = () =>
    name !== item.name ||
    color !== item.color ||
    icon !== item.icon ||
    maximum !== item.maximum;

  const toggleSelect = () => {
    let selectedBudgets_ = [...accountCtx.selectedBudgets];
    if (selectedBudgets_.includes(item)) {
      selectedBudgets_ = selectedBudgets_.filter((x) => x !== item);
    } else {
      selectedBudgets_.push(item);
    }
    accountCtx.setSelectedBudgets(selectedBudgets_);
  };

  useEffect(() => {
    setName(item.name);
    setColor(item.color);
    setIcon(item.icon);
    setMaximum(item.maximum || 0.01);
  }, []);

  return (
    <>
      <div
        className={
          "between budget-item " +
          (accountCtx.selectedBudgets.includes(item) ? "active" : "")
        }>
        <div className="d-flex text-truncate">
          <span
            onClick={() => toggleSelect()}
            className="my-auto me-2"
            style={{ cursor: "pointer" }}>
            <Icon
              inline
              icon={
                accountCtx.selectedBudgets.includes(item)
                  ? "bi:check-square"
                  : "bi:square"
              }
            />
          </span>
          <Button
            className="me-2"
            active={editing}
            icon="tdesign:edit-2-filled"
            border={false}
            onClick={() => setEditing(!editing)}
          />
          <Icon
            style={{ color: item.color }}
            inline
            icon={item.icon || "uis:graph-bar"}
            className="my-auto me-3"
          />
          {editing ? (
            <form
              onSubmit={(e) =>
                multiCtx.editBudget(e, item.id, name, color, icon, maximum)
              }
              className="d-flex">
              <Input value={name} onChange={onChangeName} />
              <input
                onFocus={(e) => e.target.select()}
                placeholder="0.01"
                min={0.01}
                type="number"
                step={0.01}
                autoComplete="off"
                value={maximum}
                onChange={onChangeMaximum}
                className={"form-control form-control-sm border-0 p-0 "}
              />
              <Input type_="color" value={color} onChange={onChangeColor} />
              <Input value={icon} placeholder="Icon" onChange={onChangeIcon} />
              {isChanged() && (
                <Button
                  border={false}
                  type_="submit"
                  icon="bi:save2"
                  className=""
                />
              )}
            </form>
          ) : (
            <div
              className="text-truncate"
              onClick={() =>
                accountCtx.setSelectedBudget(
                  accountCtx.selectedBudget?.id === item.id ? null : item,
                )
              }
              style={{
                fontSize: "1.5rem",
                cursor: item.txns.length > 0 ? "pointer" : null,
              }}>
              {item.name}
            </div>
          )}
        </div>
        <div className="d-flex my-auto">
          {item.maximum && (
            <div
              className={
                "mx-2" +
                (item.maximum <
                item.txns?.reduce((y, z) => y + Math.abs(z.amount), 0)
                  ? " red"
                  : "")
              }>
              <Icon
                inline
                icon={
                  item.maximum <
                  item.txns?.reduce((y, z) => y + Math.abs(z.amount), 0)
                    ? "material-symbols:warning-rounded"
                    : "mdi:piggy-bank"
                }
              />
            </div>
          )}
          <div>
            {parseFloat(
              item.txns?.reduce((y, z) => y + Math.abs(z.amount), 0),
            ).toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            })}
          </div>
          <div className="d-flex ms-2">
            {deleting && (
              <Button
                className="red"
                icon="bi:question-lg"
                border={false}
                onClick={() => multiCtx.deleteBudget(item.id)}
              />
            )}
            <Button
              className="red"
              icon="bi:trash2"
              border={false}
              onClick={() => setDeleting(!deleting)}
            />
          </div>
        </div>
      </div>
      {item.id === accountCtx.selectedBudget?.id && item.txns.length > 0 && (
        <>
          {Math.round(
            (item.txns?.reduce((y, z) => y + Math.abs(z.amount), 0) /
              item.maximum) *
              100,
          ) > 0 &&
            item.maximum && (
              <>
                {/* <div className="show-on-mobile">
                <Icon
                  inline
                  icon={item.icon || "uis:graph-bar"}
                  className="me-2"
                />
                <span>{item.name}</span>
              </div> */}
                <div
                  className="progress-div my-3"
                  style={{
                    width: `${Math.round(
                      (item.txns?.reduce((y, z) => y + Math.abs(z.amount), 0) /
                        item.maximum) *
                        100,
                    )}%`,
                    backgroundColor: item.color,
                  }}>
                  <div className="text-center small">
                    {`${Math.round(
                      item.txns?.reduce((y, z) => y + Math.abs(z.amount), 0),
                    )} / ${Math.round(item.maximum)}  (${
                      Math.round(
                        (item.txns?.reduce(
                          (y, z) => y + Math.abs(z.amount),
                          0,
                        ) /
                          item.maximum) *
                          100,
                      ) > 5
                        ? `${Math.round(
                            (item.txns?.reduce(
                              (y, z) => y + Math.abs(z.amount),
                              0,
                            ) /
                              item.maximum) *
                              100,
                          )}%`
                        : "\u00A0"
                    })`}
                  </div>
                </div>
              </>
            )}
          <div className="px-5 py-2 small">
            {item.txns.toReversed().map((x) => (
              <div className="row py-1" style={{ borderBottom: ".5px solid" }}>
                <div className="col-3">
                  {parseFloat(x.amount).toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD",
                  })}
                </div>
                <div className="col-8">{x.merchant}</div>
                <div className="col-1">{moment(x.timestamp).format("M/D")}</div>
              </div>
            ))}
          </div>
        </>
      )}
    </>
  );
}
