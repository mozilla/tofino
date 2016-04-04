#!/usr/bin/env python

import os
import subprocess
import sys

SOURCE_ROOT = os.path.abspath(os.path.dirname(os.path.dirname(__file__)))

def spread_args(files):
    for f in files:
        yield "-F"
        yield f

def main():
    username = os.getenv("UPLOAD_USER")
    password = os.getenv("UPLOAD_PASS")
    url = os.getenv("UPLOAD_URL")

    files = os.listdir(os.path.join(SOURCE_ROOT, sys.argv[1]))
    files = filter(lambda f: f[-4:] == ".zip", files)
    files = map(lambda f: "%s=@%s" % (f, os.path.join(SOURCE_ROOT, sys.argv[1], f)), files)
    files = list(spread_args(files))

    run(["curl", "-L", "-v", "--user", "%s:%s" % (username, password)] + files + [url])

def run(args = []):
    sys.stderr.write("Running %s\n" % (args[0]))
    sys.stderr.flush()
    try:
        subprocess.check_call(args)
    except:
        sys.stderr.write("Exited with non-zero exit code.")
        sys.stderr.flush()

if __name__ == '__main__':
    sys.exit(main())
