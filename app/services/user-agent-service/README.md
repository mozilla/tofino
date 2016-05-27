```
Usage: bin/user-agent-service [options]

Options:
  -p, --port
    The port that the UserAgentService will run on. [number] [required]
  -d, --db
    The path to the directory containing the browser.db. [string] [required]
  -v, --version
    The version of API to use. [string] [choices: "v1"] [default: "v1"]
  -c, --content-service
    The origin of the Content Service so that CORS can be enabled. [string] [default: "http://localhost:9191"]
  -r, --repl
    If provided, start a REPL after launching the user agent service. [boolean]
```
