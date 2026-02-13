import setuptools


setuptools.setup(
    name="cashjournal",
    version="2026.02.13",
    py_modules=["cashjournal"],
    long_description=open("README.md").read(),
    license=open("LICENSE.md").read(),
    entry_points={"console_scripts": ["cashjournal=cashjournal.__main__:cli"]},
)
