import setuptools

setuptools.setup(
    name="cashjournal",
    entry_points={"console_scripts": ["cashjournal=cashjournal.__main__:cli"]},
    py_modules=["cashjournal"],
)
