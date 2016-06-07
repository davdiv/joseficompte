#!/bin/bash

# This script extracts data from the given database in the current folder
# Supports the following parameters:
# --db
# --host
# --port
# --username
# --password

function exportCollection() {
	local COLLECTION_NAME="$1"
	shift
	echo "Collection: $COLLECTION_NAME"
	mongoexport "$@" -c "$COLLECTION_NAME" -o "$COLLECTION_NAME".json
	echo ""
}

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
COLLECTIONS=$(node "$DIR/listCollections.js" "$@")

for i in $COLLECTIONS ; do
	exportCollection "$i" "$@"
done
