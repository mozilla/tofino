scripts/bootstrap.py

if [ "$TRAVIS_OS_NAME" == "osx" ]; then
  export NVM_DIR=~/.nvm
  . $(brew --prefix nvm)/nvm.sh
fi
