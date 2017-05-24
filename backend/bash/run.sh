#!/usr/bin/env bash
BASEDIR=$(dirname $( cd $(dirname $0) ; pwd -P ))
cd $BASEDIR
export PYTHONPATH=$BASEDIR:$PYTHONPATH
python $BASEDIR/hello_webapp/app.py