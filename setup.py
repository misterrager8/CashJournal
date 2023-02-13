import setuptools

setuptools.setup(
    name="CashJournal",
    version="3.0.0",
    entry_points={"console_scripts": ["cash=cash_journal.__main__:cli"]},
    long_description=open("README.md").read(),
    license=open("LICENSE.md").read(),
)
