import { useContext, useState } from "react";
import Button from "../Button";
import Input from "../Input";
import { MultiContext } from "../../MultiContext";
import { AuthContext } from "../../AuthContext";

export default function Signup({ className = "" }) {
  const authCtx = useContext(AuthContext);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [email, setEmail] = useState("");

  const onChangeUsername = (e) => setUsername(e.target.value);
  const onChangePassword = (e) => setPassword(e.target.value);
  const onChangePasswordConfirm = (e) => setPasswordConfirm(e.target.value);
  const onChangeEmail = (e) => setEmail(e.target.value);

  return (
    <form
      onSubmit={(e) =>
        authCtx.signup(e, username, email, password, passwordConfirm)
      }
      className={className}>
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
        placeholder="Password Confirmed"
      />
      <Button
        className="w-100"
        border={false}
        text="Sign Up"
        icon="record"
        type_="submit"
      />
    </form>
  );
}
