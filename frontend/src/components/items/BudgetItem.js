import { useContext, useEffect, useState } from "react";
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

  const isChanged = () =>
    name !== item.name || color !== item.color || icon !== item.icon;

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
  }, []);

  return (
    <>
      <div
        className={
          "between budget-item " +
          (accountCtx.selectedBudgets.includes(item) ? "active" : "")
        }>
        <div className="d-flex">
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
                multiCtx.editBudget(e, item.id, name, color, icon)
              }
              className="d-flex">
              <Input value={name} onChange={onChangeName} />
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
        <div className="px-5 py-2 small">
          {item.txns.map((x) => (
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
      )}
    </>
  );
}
