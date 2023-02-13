function Navbar() {
    const [theme, setTheme] = React.useState(localStorage.getItem('CashJournal'));

    const changeTheme = (theme_) => {
        localStorage.setItem('CashJournal', theme_);
        document.documentElement.setAttribute('data-theme', theme_);
        setTheme(theme_);
    }

    React.useEffect(() => {
        changeTheme(theme);
    }, []);

    return (
        <nav className="sticky-top text-capitalize py-3">
            <div className="btn-group btn-group-sm">
                <a className="btn btn-outline-secondary dropdown-toggle" data-bs-target="#themes" data-bs-toggle="dropdown"><i className="bi bi-paint-bucket"></i> {theme}</a>
                <div id="themes" className="dropdown-menu text-center">
                    {theme !== 'light' && <a onClick={() => changeTheme('light')} className="dropdown-item small">light</a>}
                    {theme !== 'dark' && <a onClick={() => changeTheme('dark')} className="dropdown-item small">dark</a>}
                </div>
                <a target="_blank" href="https://github.com/misterrager8/CashJournal/" className="btn btn-outline-secondary"><i className="bi bi-info-circle"></i> About</a>
            </div>
        </nav>
        );
}

function CreateAccountForm(props) {
	const createAccount = (e) => {
		e.preventDefault();
		$.post('/create_account', {
			name: $('#new-account-name').val()
		}, function(data) {
			props.callback();
		});
	}

	return (
		<form className="input-group input-group-sm my-2" onSubmit={(e) => createAccount(e)}>
			<input autoComplete="off" className="form-control" placeholder="New Account" id="new-account-name" required/>
			<button type="submit" className="btn btn-outline-success"><i className="bi bi-plus"></i></button>
		</form>
		);
}

function CreateTxnForm(props) {
	const createTxn = (e) => {
		e.preventDefault();
		$.post('/create_txn', {
			account_id: props.account.id,
			merchant: $('#merchant').val(),
			amount: $('#amount').val(),
			timestamp: $('#timestamp').val(),
			memo: $('#memo').val()
		}, function(data) {
			props.callback(props.account.id);
			document.querySelector('form').reset();
		});
	}

	return (
		<form className="input-group input-group-sm my-2" onSubmit={(e) => createTxn(e)}>
			<input autoComplete="off" className="form-control" placeholder="Merchant" id="merchant" required/>
			<input type="number" step="0.01" autoComplete="off" className="form-control" id="amount" defaultValue="0.00" required/>
			<input type="date" autoComplete="off" className="form-control" id="timestamp" required/>
			<input autoComplete="off" className="form-control" placeholder="Memo" id="memo"/>
			<button type="submit" className="btn btn-outline-success"><i className="bi bi-plus"></i></button>
		</form>
		);
}

function AccountItem(props) {
	const [deleting, setDeleting] = React.useState(false);

	const deleteAccount = () => {
		$.get('/delete_account', {
			id: props.item.id
		}, function(data) {
			props.callback();
		});
	}

	return (
		<div className="col-4 p-1 text-center heading">
			<a className="" onClick={() => props.select(props.item.id)}>
				<div className="fs-5 fw-bold">{props.item.name}</div>
				<div className="fs-1">${props.item.balance}</div>
			</a>
			<div className="my-2">
				<a onClick={() => setDeleting(!deleting)} className="btn btn-sm text-danger w-100"><i className="bi bi-x-circle"></i></a>
				{deleting && <a onClick={() => deleteAccount()} className="btn btn-sm text-danger w-100">Delete?</a>}
			</div>
		</div>
		);
}

function TxnItem(props) {
	const [deleting, setDeleting] = React.useState(false);

	const deleteTxn = () => {
		$.get('/delete_txn', {
			id: props.item.id
		}, function(data) {
			props.callback(props.account.id);
		});
	}

	return (
		<div className="row hover p-0 mb-1">
			<div className={'col text-' + (props.item.amount < 0.00 ? 'danger' : 'success')}>${props.item.amount}</div>
			<div className="col">{props.item.merchant}</div>
			<div className="col">{props.item.timestamp}</div>
			<div className="col">{props.item.memo}</div>
			<div className="col">
				<a onClick={() => setDeleting(!deleting)} className="btn btn-sm text-danger float-end"><i className="bi bi-x-circle"></i></a>
				{deleting && <a onClick={() => deleteTxn()} className="btn btn-sm text-danger float-end">Delete?</a>}
			</div>
		</div>
		);
}

function App() {
	const [page, setPage] = React.useState('accounts');
	const [accounts, setAccounts] = React.useState([]);
	const [txns, setTxns] = React.useState([]);
	const [editing, setEditing] = React.useState(false);
	const [selectedAccount, setSelectedAccount] = React.useState([]);

	const getAccounts = () => {
		$.get('/get_accounts', function(data) {
			setAccounts(data.accounts);
		});
	}

	const getTxns = () => {
		$.get('/get_txns', function(data) {
			setTxns(data.txns);
		});
	}

	const getAccount = (id) => {
		$.get('/get_account', {
			id: id
		}, function(data) {
			setSelectedAccount(data);
			setPage('account');
		});
	}

	const editAccount = (e) => {
		e.preventDefault();
		$.post('/edit_account', {
			id: selectedAccount.id,
			name: $('#curr-name').val(),
			balance: $('#curr-balance').val()
		}, function(data) {
			getAccount(selectedAccount.id);
		});
	}

	React.useEffect(() => {
		getAccounts();
		getTxns();
	}, []);

	return (
		<div className="p-5">
			<Navbar/>
			{page === 'accounts' ? (
				<div>
					<CreateAccountForm callback={getAccounts}/>
					<div className="row mt-4">
						{accounts.map((x, id) => <AccountItem select={getAccount} callback={getAccounts} item={x} key={id}/> )}
					</div>
					<div className="row mt-4">
						{txns.map((x, id) => <TxnItem account={selectedAccount} callback={getAccount} item={x} key={id}/> )}
					</div>
				</div>
			) : page === 'account' ? (
				<div>
					<a className="btn btn-sm text-secondary my-2" onClick={() => setPage('accounts')}><i className="bi bi-arrow-left"></i> Accounts</a>
					<div className="p-1 text-center heading">
						<div>
							<div className="fs-5 fw-bold">{selectedAccount.name}</div>
							<div style={{ fontSize:'5em' }} >${selectedAccount.balance}</div>
							<a className="btn btn-sm btn-outline-secondary" onClick={() => setEditing(!editing)}><i className="bi bi-pen"></i> Edit</a>
							{editing && (
								<form className="input-group input-group-sm my-2" onSubmit={(e) => editAccount(e)}>
									<input autoComplete="off" className="form-control" id="curr-name" defaultValue={selectedAccount.name}/>
									<input type="number" step="0.01" autoComplete="off" className="form-control" id="curr-balance" defaultValue={selectedAccount.balance}/>
									<button type="submit" className="btn btn-outline-secondary">Save</button>
								</form>
							)}
						</div>
					</div>
					<CreateTxnForm callback={getAccount} account={selectedAccount} />
					<div className="mt-4">
						<div className="row heading small mb-3 fst-italic">
							<div className="col">Amount</div>
							<div className="col">Merchant</div>
							<div className="col">Timestamp</div>
							<div className="col">Memo</div>
							<div className="col"></div>
						</div>
						{selectedAccount.txns.map((x, id) => <TxnItem account={selectedAccount} callback={getAccount} item={x} key={id}/> )}
					</div>
				</div>
			) : ''}
		</div>
		);
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App/>);
