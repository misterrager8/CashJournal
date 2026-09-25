import { useContext, useEffect } from "react";
import NewBudget from "../forms/NewBudget";
import { Context } from "../../Context";
import BudgetItem from "../items/BudgetItem";
import { AccountContext } from "../pages/Accounts";

export default function Budgets({ className = "" }) {
  const ctx = useContext(Context);
  const accountCtx = useContext(AccountContext);

  useEffect(() => {
    accountCtx.setTotal(
      ctx.budgets.reduce(
        (x, y) => x + y.txns.reduce((z, a) => z + Math.abs(a.amount), 0),
        0,
      ),
    );
  }, [ctx.budgets]);

  return (
    <div className={className}>
      <div className="mb-2 pe-1">
        <NewBudget />
      </div>
      <div className="budget-scroll">
        <div>
          {ctx.budgets
            .sort(
              (v, w) =>
                w?.txns.reduce((t, u) => t + Math.abs(u.amount), 0) -
                v?.txns.reduce((t, u) => t + Math.abs(u.amount), 0),
            )
            .map((x) => (
              <BudgetItem key={`budget-${x.id}`} item={x} />
            ))}
        </div>
      </div>
    </div>
  );
}
