import os
import subprocess
import sys

from modules import viewCL

if __name__ == "__main__":
    if sys.argv[1] == "cl":
        viewCL.Mainmenu()
    elif sys.argv[1] == "dt":
        path = os.getcwd() + "/modules"
        os.chdir(path)
        subprocess.call("/Users/chemlleijoseph/jython2.7.1/bin/jython viewDT.py", shell=True)
