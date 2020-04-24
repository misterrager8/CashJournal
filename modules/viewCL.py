import sys

main_options = ["Option 0", "Option 1", "Option 2", "Option 3", "Exit"]


class Mainmenu:
    def __init__(self):
        while True:
            self.print_options(main_options)
            choice = input("Please select: ")

            if main_options[choice] == "Exit":
                sys.exit()
            elif main_options[choice] == "Option 0":
                print("Option 0")
            elif main_options[choice] == "Option 1":
                print("Option 1")
            elif main_options[choice] == "Option 2":
                print("Option 2")
            elif main_options[choice] == "Option 3":
                print("Option 3")

    @classmethod
    def print_options(cls, ls):
        for idx, item in enumerate(ls):
            print(str(idx) + " - " + item)
