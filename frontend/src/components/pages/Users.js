import { useContext } from "react";
import Button from "../Button";
import Login from "../forms/Login";
import Signup from "../forms/Signup";
import { AuthContext } from "../../AuthContext";
import EditUser from "../forms/EditUser";

export default function Users() {
  const authCtx = useContext(AuthContext);

  return (
    <div>
      {!authCtx.username && !authCtx.email ? (
        <div className="row" style={{ height: "90vh" }}>
          <div className="col d-flex">
            <Login className="m-auto w-50" />
          </div>
          <div className="col d-flex">
            <Signup className="m-auto w-50" />
          </div>
        </div>
      ) : (
        <div className="d-flex " style={{ height: "93vh" }}>
          <div className="m-auto w-50">
            <Button onClick={() => authCtx.logout()} text="Logout" />
            <div className="mt-4">
              <EditUser />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
