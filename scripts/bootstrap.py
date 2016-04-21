#!/usr/bin/env python

import os
import subprocess
import sys

SOURCE_ROOT = os.path.abspath(os.path.dirname(os.path.dirname(__file__)))

def main():
    is_appveyor = (os.getenv("APPVEYOR") == "True")
    is_travis = (os.getenv("TRAVIS") == "true")

    platform = "win32"
    if is_travis:
        platform = os.getenv("TRAVIS_OS_NAME")

    if platform == "osx":
        run(["brew", "update"])
        run(["brew", "install", "nvm"])
    elif platform == "linux":
        run(["sh", "-e", "/etc/init.d/xvfb", "start"])

def run(args = []):
    sys.stderr.write("Running %s\n" % (" ".join(args)))
    sys.stderr.flush()
    try:
        subprocess.check_call(args)
    except:
        sys.stderr.write("Exited with non-zero exit code.")
        sys.stderr.flush()

if __name__ == '__main__':
    sys.exit(main())
