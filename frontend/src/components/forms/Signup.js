import { useContext, useState } from "react";
import Button from "../atoms/Button";
import Input from "../atoms/Input";
import { Context } from "../../Context";

export default function Signup({ className = "" }) {
  const ctx = useContext(Context);

  const [username, setUsername] = useState("");
  const onChangeUsername = (e) => setUsername(e.target.value);

  const [password, setPassword] = useState("");
  const onChangePassword = (e) => setPassword(e.target.value);

  const [passwordConfirm, setPasswordConfirm] = useState("");
  const onChangePasswordConfirm = (e) => setPasswordConfirm(e.target.value);

  const [email, setEmail] = useState("");
  const onChangeEmail = (e) => setEmail(e.target.value);

  return (
    <form
      className={className}
      onSubmit={(e) =>
        ctx.signup(e, username, email, password, passwordConfirm)
      }>
      <Input
        className="mb-2"
        value={username}
        onChange={onChangeUsername}
        placeholder="Username"
      />
      <Input
        className="mb-2"
        value={email}
        onChange={onChangeEmail}
        placeholder="Username"
      />
      <Input
        className="mb-2"
        type_="password"
        value={password}
        onChange={onChangePassword}
        placeholder="Password"
      />
      <Input
        className="mb-2"
        type_="password"
        value={passwordConfirm}
        onChange={onChangePasswordConfirm}
        placeholder="Confirm Password"
      />
      <Button className="mt-3 w-100" text="Sign Up" type_="submit" />
    </form>
  );
}
