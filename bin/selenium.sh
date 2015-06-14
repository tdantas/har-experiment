#!/bin/sh

DIRECTORY='./deps';
if [ ! -d $DIRECTORY ]; then
  echo "you need install all dependencies first. 'npm run deps' will install all dependencies"
  exit 0;
fi

java -jar deps/selenium.jar
