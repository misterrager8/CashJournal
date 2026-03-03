import { useContext, useEffect, useState } from "react";
import Button from "../atoms/Button";
import Input from "../atoms/Input";
import { Context } from "../../Context";

export default function EditUser({ className = "" }) {
  const ctx = useContext(Context);

  const [username, setUsername] = useState("");
  const onChangeUsername = (e) => setUsername(e.target.value);

  const [password, setPassword] = useState("");
  const onChangePassword = (e) => setPassword(e.target.value);

  const [passwordConfirm, setPasswordConfirm] = useState("");
  const onChangePasswordConfirm = (e) => setPasswordConfirm(e.target.value);

  const [email, setEmail] = useState("");
  const onChangeEmail = (e) => setEmail(e.target.value);

  useEffect(() => {
    setUsername(ctx.currentUser?.username);
    setEmail(ctx.currentUser?.email);
  }, [ctx.setCurrentUser]);

  return (
    <form className={className}>
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
        placeholder="Email"
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
      <Button
        icon="tdesign:edit-2-filled"
        className="mt-3 w-100"
        text="Save Changes"
        onClick={() =>
          ctx.setCurrentUser({
            username: "chemllei",
            email: "chemllei0304@gmail.com",
          })
        }
      />
    </form>
  );
}
