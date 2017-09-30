#!/bin/Bash
basepath=$(dirname $0)
if [ "${basepath}" == "." ]; then
	basepath=$PWD
fi

chromium --allow-file-access-from-files ${basepath}/index_new.html
