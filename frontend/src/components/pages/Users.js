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
        <div className="row">
          <div className="col">
            <Login />
          </div>
          <div className="col">
            <Signup />
          </div>
        </div>
      ) : (
        <>
          <Button onClick={() => authCtx.logout()} text="Logout" />
          <div className="w-50 mt-4">
            <EditUser />
          </div>
        </>
      )}
    </div>
  );
}
