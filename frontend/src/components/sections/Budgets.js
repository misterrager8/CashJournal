import { Fragment, useContext, useEffect } from "react";
import NewBudget from "../forms/NewBudget";
import { Context } from "../../Context";
import BudgetItem from "../items/BudgetItem";
import { AccountContext } from "../pages/Accounts";

export default function Budgets() {
  const ctx = useContext(Context);
  const accountCtx = useContext(AccountContext);
  //   const [total, setTotal] = useState(0);

  const getTotals = (item) =>
    Math.round(
      (item.txns.reduce((y, z) => y + Math.abs(z.amount), 0) /
        accountCtx.total) *
        100,
    );

  useEffect(() => {
    accountCtx.setTotal(
      ctx.budgets.reduce(
        (x, y) => x + y.txns.reduce((z, a) => z + Math.abs(a.amount), 0),
        0,
      ),
    );
  }, [ctx.budgets]);

  return (
    <div>
      <div className="mb-2">
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
              <BudgetItem item={x} />
            ))}
        </div>
        <div className="progress-bar-custom my-3">
          {ctx.budgets.map((x) => (
            <Fragment key={x.id}>
              {getTotals(x) > 0 && (
                <div
                  className="progress-div"
                  onClick={() =>
                    accountCtx.setSelectedBudget(
                      accountCtx.selectedBudget?.id === x.id ? null : x,
                    )
                  }
                  style={{
                    width: `${getTotals(x)}%`,
                    backgroundColor: x.color,
                  }}>
                  <div className="text-center small">
                    {getTotals(x) > 5 ? `${getTotals(x)}%` : "\u00A0"}
                  </div>
                </div>
              )}
            </Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
