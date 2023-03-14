#! /usr/bin/env bash

set -o errexit || exit
set -o nounset
set -o pipefail
set -o xtrace

# Guard dependencies
>/dev/null type curl
>/dev/null type tar
>/dev/null type gzip
>/dev/null type git

SCRIPT_DIR=$(dirname -- "${BASH_SOURCE[0]}")
DIR=${DIR:-$SCRIPT_DIR}
cd -- "$DIR"

SRC_BRANCH=${SRC_BRANCH:-main}
SRC_FILE=${SRC_FILE:-src.tar.gz}
INSIDE_DIR_WRAP=${INSIDE_DIR:-json-diff-react-$SRC_BRANCH}

curl -L --fail -- "https://github.com/relex/json-diff-react/archive/$SRC_BRANCH.tar.gz" > "$SRC_FILE"

mkdir -p examples

(
	cd examples
	tar -xzv \
		--file="../$SRC_FILE" \
		--strip-components=2 \
		--wildcards \
		-- \
		"$INSIDE_DIR_WRAP/examples/*.html" \
		"$INSIDE_DIR_WRAP/examples/*.bundle.js"
)

cp -f examples/example-06.html index.html
cp -f examples/json-diff-react.bundle.js .
