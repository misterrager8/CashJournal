import sys

from modules.ctrla import Ctrla
from modules.model import Transx

main_options = ["View All", "Add", "Monthly Statement", "Option 3", "Exit"]
tc = Ctrla()


class Mainmenu:
    def __init__(self):
        while True:
            self.print_options(main_options)
            choice = input("Please select: ")

            if main_options[choice] == "Exit":
                sys.exit()
            elif main_options[choice] == "View All":
                tc.view_all_items()
            elif main_options[choice] == "Add":
                desc = raw_input("Description? ")
                amount = raw_input("Amount? ")
                date_approved = raw_input("Date? ")
                transx_type = raw_input("Type? ")

                x = Transx(None, desc, amount, date_approved, transx_type)
                tc.add_item(x)
            elif main_options[choice] == "Monthly Statement":
                print("Option 2")
            elif main_options[choice] == "Option 3":
                print("Option 3")

    @classmethod
    def print_options(cls, ls):
        for idx, item in enumerate(ls):
            print(str(idx) + " - " + item)
