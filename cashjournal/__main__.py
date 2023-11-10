import webbrowser

import click

from . import config, create_app, db


@click.group()
def cli():
    pass


@cli.command()
@click.option("-d", "--debug", is_flag=True)
def web(debug):
    app = create_app(config)
    if not debug:
        webbrowser.open(f"http://localhost:{config.PORT}")
    app.run(debug=debug, port=config.PORT)
