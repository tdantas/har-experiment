#!/bin/sh

DIRECTORY='./deps';
if [ ! -d $DIRECTORY ]; then
  echo "you need install all dependencies first. 'npm run deps' will install all dependencies"
  exit 0;
fi

JAVA_HOME="`/usr/libexec/java_home -v '1.7*'`"
./deps/bmp/bin/browsermob-proxy --port=9090 --use-littleproxy true

