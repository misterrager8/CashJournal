const AuthContext = React.createContext();

function AccountItem({ item }) {
  const [user, setUser, getUser] = React.useContext(AuthContext);
  const [deleting, setDeleting] = React.useState(false);
  const [editing, setEditing] = React.useState(false);
  const [adding, setAdding] = React.useState(false);

  const deleteAccount = () => {
    fetch("/delete_account", {
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: item.id }),
      method: "POST",
    })
      .then((response) => response.json())
      .then((data) => getUser());
  };

  return (
    <div className="col-4 mb-5">
      <div className="rounded shadow p-4">
        <div className="text-center">
          <div className="h3 font-custom">{item.name}</div>
          <div
            className={
              "h1 font-monospace " +
              (item.balance < 0 ? "negative" : "positive")
            }>
            {parseFloat(item.balance).toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            })}
          </div>
        </div>
        <div className="d-flex mt-3">
          <div className="btn-group mx-auto">
            <button onClick={() => setAdding(!adding)} className="btn border-0">
              <i className="bi bi-calculator"></i>
            </button>
            <button
              onClick={() => setEditing(!editing)}
              className="btn border-0">
              <i className="bi bi-pen"></i>
            </button>
            {deleting && (
              <button className="btn border-0" onClick={() => deleteAccount()}>
                <i className="bi bi-question-lg"></i>
              </button>
            )}
            <button
              onClick={() => setDeleting(!deleting)}
              className="btn border-0">
              <i className="bi bi-trash2"></i>
            </button>
          </div>
        </div>
        {editing && <AccountEditForm item={item} />}
        {adding && <CalcForm account={item} />}
      </div>
    </div>
  );
}

function Nav() {
  const [user, setUser] = React.useContext(AuthContext);
  const [theme, setTheme] = React.useState(
    localStorage.getItem("cashjournal-theme") || "light"
  );

  React.useEffect(() => {
    localStorage.setItem("cashjournal-theme", theme);
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const logout = () => {
    fetch("/logout", {
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
      method: "POST",
    })
      .then((response) => response.json())
      .then((data) => setUser([]));
  };

  return (
    <div className="btn-group px-5">
      {user.length !== 0 && (
        <>
          <button className="btn border-0">
            <img width={28} height={28} src="static/favicon.svg"></img>
          </button>
          <button
            className="btn border-0 dropdown-toggle"
            data-bs-toggle="dropdown"
            data-bs-target="#auth">
            <i className="me-2 bi bi-person-fill"></i>
            {user.username}
          </button>
          <div className="dropdown-menu text-center" id="auth">
            <button onClick={() => logout()} className="dropdown-item">
              Log Out
            </button>
          </div>
        </>
      )}
      <button
        onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        className="btn border-0 text-capitalize">
        <i
          className={
            "me-2 bi bi-" + (theme === "light" ? "sun" : "moon") + "-fill"
          }></i>
        {theme}
      </button>
    </div>
  );
}

function LoginForm() {
  const [user, setUser] = React.useContext(AuthContext);
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState(false);

  const onChangeUsername = (e) => setUsername(e.target.value);
  const onChangePassword = (e) => setPassword(e.target.value);

  const login = (e) => {
    e.preventDefault();
    fetch("/login", {
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username: username, password: password }),
      method: "POST",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.user) {
          setUser(data.user);
        } else {
          setError(true);
          setTimeout(() => setError(false), 1500);
        }
      });
  };

  return (
    <>
      <form onSubmit={(e) => login(e)} className="col-4">
        <input
          autoComplete="off"
          required
          onChange={onChangeUsername}
          placeholder="Username"
          className="form-control mb-3"
          defaultValue={username}
        />
        <input
          autoComplete="off"
          required
          onChange={onChangePassword}
          placeholder="Password"
          type="password"
          className="form-control mb-3"
          defaultValue={password}
        />
        <button type="submit" className="btn w-100">
          {error ? "Invalid username / password" : "Log In"}
        </button>
      </form>
    </>
  );
}

function SignupForm() {
  const [user, setUser] = React.useContext(AuthContext);
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirm, setConfirm] = React.useState("");
  const [error, setError] = React.useState(false);

  const onChangeUsername = (e) => setUsername(e.target.value);
  const onChangePassword = (e) => setPassword(e.target.value);
  const onChangeConfirm = (e) => setConfirm(e.target.value);

  const signup = (e) => {
    e.preventDefault();
    fetch("/signup", {
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        password: password,
        confirm: confirm,
      }),
      method: "POST",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.user) {
          setUser(data.user);
        } else {
          setError(true);
          setTimeout(() => setError(false), 1500);
        }
      });
  };

  return (
    <>
      <form onSubmit={(e) => signup(e)} className="col-4">
        <input
          autoComplete="off"
          required
          onChange={onChangeUsername}
          placeholder="Username"
          className="form-control mb-3"
          defaultValue={username}
        />
        <input
          autoComplete="off"
          required
          onChange={onChangePassword}
          placeholder="Password"
          type="password"
          className="form-control mb-3"
          defaultValue={password}
        />
        <input
          autoComplete="off"
          required
          onChange={onChangeConfirm}
          placeholder="Confirm Password"
          type="password"
          className="form-control mb-3"
          defaultValue={confirm}
        />
        <button type="submit" className="btn w-100">
          {error ? "Password mismatch. Try again" : "Sign Up"}
        </button>
      </form>
    </>
  );
}

function AccountEditForm({ item }) {
  const [name, setName] = React.useState(item.name);
  const [balance, setBalance] = React.useState(item.balance);
  const [user, setUser, getUser] = React.useContext(AuthContext);

  const onChangeName = (e) => setName(e.target.value);
  const onChangeBalance = (e) => setBalance(e.target.value);

  const editAccount = (e) => {
    e.preventDefault();
    fetch("/edit_account", {
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: item.id,
        name: name,
        balance: balance,
      }),
      method: "POST",
    })
      .then((response) => response.json())
      .then((data) => getUser());
  };

  return (
    <>
      <form onSubmit={(e) => editAccount(e)} className="input-group my-4">
        <input
          autoComplete="off"
          required
          onChange={onChangeName}
          placeholder="Name"
          className="form-control"
          defaultValue={name}
        />
        <input
          autoComplete="off"
          required
          onChange={onChangeBalance}
          type="number"
          step={0.01}
          className="form-control"
          defaultValue={balance}
        />
        <button type="submit" className="btn">
          <i className="bi bi-pen"></i>
        </button>
      </form>
    </>
  );
}

function AccountAddForm() {
  const [name, setName] = React.useState("");
  const [balance, setBalance] = React.useState(0.00);
  const [user, setUser, getUser] = React.useContext(AuthContext);

  const onChangeName = (e) => setName(e.target.value);
  const onChangeBalance = (e) => setBalance(e.target.value);

  const addAccount = (e) => {
    e.preventDefault();
    fetch("/add_account", {
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name,
        balance: balance,
      }),
      method: "POST",
    })
      .then((response) => response.json())
      .then((data) => {
        if (!data.account) {
          alert(JSON.stringify(data));
        } else {
          getUser();
        }
      });
  };

  return (
    <>
      <form
        onSubmit={(e) => addAccount(e)}
        className="input-group my-5 w-50 mx-auto">
        <input
          autoComplete="off"
          required
          onChange={onChangeName}
          placeholder="Name"
          className="form-control"
          defaultValue={name}
        />
        <input
          autoComplete="off"
          required
          onChange={onChangeBalance}
          type="number"
          step={0.01}
          className="form-control"
          defaultValue={balance}
        />
        <button type="submit" className="btn">
          Add Account
        </button>
      </form>
    </>
  );
}

function CalcForm({ account }) {
  const [amount, setAmount] = React.useState(0.0);
  const [user, setUser, getUser] = React.useContext(AuthContext);

  const onChangeAmount = (e) => setAmount(e.target.value);

  const calcAccount = (e) => {
    e.preventDefault();
    fetch("/calculate_account", {
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: account.id,
        amount: amount,
      }),
      method: "POST",
    })
      .then((response) => response.json())
      .then((data) => getUser());
  };

  return (
    <>
      <form onSubmit={(e) => calcAccount(e)} className="input-group my-4">
        <input
          autoComplete="off"
          required
          onChange={onChangeAmount}
          type="number"
          step={0.01}
          className="form-control"
          defaultValue={amount}
        />
        <button type="submit" className="btn">
          <i className="bi bi-calculator"></i>
        </button>
      </form>
    </>
  );
}

function App() {
  const [user, setUser] = React.useState(
    localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : []
  );

  React.useEffect(() => {
    user.length !== 0
      ? localStorage.setItem("user", JSON.stringify(user))
      : localStorage.removeItem("user");
  }, [user]);

  const getUser = () => {
    fetch("/get_user", {
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: user.id,
      }),
      method: "POST",
    })
      .then((response) => response.json())
      .then((data) => setUser(data.user));
  };

  return (
    <>
      <AuthContext.Provider value={[user, setUser, getUser]}>
        <div className="p-5">
          <Nav />
          {user.length === 0 ? (
            <div className="d-flex mt-5">
              <LoginForm />
              <div className="vr mx-5"></div>
              <SignupForm />
            </div>
          ) : (
            <div className="px-5">
              <AccountAddForm />
              <div className="row">
                {user?.accounts?.map((x) => (
                  <AccountItem key={x.id} item={x} />
                ))}
              </div>
              <span className="small opacity-50">
                Total:{" "}
                <span className="font-monospace">
                  {user.accounts
                    .reduce((x, y) => x + parseFloat(y.balance), 0)
                    .toLocaleString("en-US", {
                      style: "currency",
                      currency: "USD",
                    })}
                </span>
              </span>
            </div>
          )}
        </div>
      </AuthContext.Provider>
    </>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
