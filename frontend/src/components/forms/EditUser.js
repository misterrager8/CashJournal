import { useContext, useState } from "react";
import Button from "../Button";
import Input from "../Input";
import { AuthContext } from "../../AuthContext";
import { api } from "../../util";

export default function EditUser({ className = "" }) {
  const authCtx = useContext(AuthContext);

  const [username, setUsername] = useState(authCtx.username);
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [email, setEmail] = useState(authCtx.email);

  const onChangeUsername = (e) => setUsername(e.target.value);
  const onChangePassword = (e) => setPassword(e.target.value);
  const onChangePasswordConfirm = (e) => setPasswordConfirm(e.target.value);
  const onChangeEmail = (e) => setEmail(e.target.value);

  const editUser = (e) => {
    e.preventDefault();
    if (password === passwordConfirm) {
      api(
        "edit_user",
        { username: username, password: password, email: email },
        (data) => {
          authCtx.setUsername(data.user?.username);
          authCtx.setEmail(data.user?.email);
        }
      );
    } else {
      alert("Passwords don't match");
    }
  };

  return (
    <form onSubmit={(e) => editUser(e)} className={className}>
      <Input
        className="mb-3"
        onChange={onChangeUsername}
        value={username}
        placeholder="Username"
      />
      <Input
        className="mb-3"
        onChange={onChangeEmail}
        value={email}
        placeholder="E-mail"
      />
      <Input
        className="mb-3"
        type_="password"
        onChange={onChangePassword}
        value={password}
        placeholder="Password"
      />
      <Input
        className="mb-3"
        type_="password"
        onChange={onChangePasswordConfirm}
        value={passwordConfirm}
        placeholder="Password Confirm"
      />
      <Button
        className="w-100"
        text="Save Changes"
        icon="save2"
        type_="submit"
      />
    </form>
  );
}
