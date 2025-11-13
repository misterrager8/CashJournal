import { useContext } from "react";
import { Context } from "../../Context";
import Button from "../atoms/Button";
import Login from "../forms/Login";
import Signup from "../forms/Signup";
import EditUser from "../forms/EditUser";

export default function Auth({ className = "" }) {
  const ctx = useContext(Context);

  return (
    <div className={className}>
      {ctx.currentUser ? (
        <div className="col-50">
          <Button text="Log Out" onClick={() => ctx.logout()} />
          <EditUser className="mt-3" />
        </div>
      ) : (
        <div className="flex">
          <div className="col-50">
            <Login />
          </div>
          <div className="divider"></div>
          <div className="col-50">
            <Signup />
          </div>
        </div>
      )}
    </div>
  );
}
