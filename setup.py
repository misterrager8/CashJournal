import setuptools

setuptools.setup(
    name="cashjournal",
    version="2023.11.10",
    entry_points={"console_scripts": ["cashjournal=cashjournal.__main__:cli"]},
    long_description=open("README.md").read(),
    license=open("LICENSE.md").read(),
)
