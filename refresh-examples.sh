#! /usr/bin/env bash

# Copy and patch the latest HTML examples from the repo to use them with
# GitHub Pages.

set -o errexit || exit
set -o nounset
set -o pipefail
set -o xtrace

# Guard dependencies
>/dev/null type curl
>/dev/null type tar
>/dev/null type gzip
>/dev/null type git
>/dev/null type sed
>/dev/null type grep

SCRIPT_DIR=$(dirname -- "${BASH_SOURCE[0]}")
DIR=${DIR:-$SCRIPT_DIR}
cd -- "$DIR"

SRC_BRANCH=${SRC_BRANCH:-main}
SRC_FILE=${SRC_FILE:-src.tar.gz}
INSIDE_DIR_WRAP=${INSIDE_DIR:-json-diff-react-$SRC_BRANCH}

# Fetch latest branch archive
# curl -L --fail -- "https://github.com/relex/json-diff-react/archive/$SRC_BRANCH.tar.gz" > "$SRC_FILE"

mkdir -p examples

(
	cd examples

	# Unpack only examples
	tar -xzv \
		--file="../$SRC_FILE" \
		--strip-components=2 \
		--wildcards \
		-- \
		"$INSIDE_DIR_WRAP/examples/*.html" \
		"$INSIDE_DIR_WRAP/examples/*.bundle.js"
)

all_examples="$(ls -- examples/*.html)"
readarray -t all_examples_a <<< "$all_examples" # Read as array

# Use assoc array to remove duplicates.
# Key is URL and value is only the file name from that URL.
declare -A all_dependencies

# Extract and download dependencies locally.
# CORS limitations of GitHub Actions do not allow to use them by direct URLs.
for example_file_path in "${all_examples_a[@]}"; do
	dependencies=$(<"$example_file_path" grep -oP 'http.*/unpkg.com/.*\.js')
	readarray -t dependencies_a <<< "$dependencies"
	
	for dep_url in "${dependencies_a[@]}"; do
		dep_file_name=$(basename -- "$dep_url")
		all_dependencies["$dep_url"]=$dep_file_name
		sed -i "s|${dep_url}|./${dep_file_name}|g" -- "$example_file_path"
		sed -i "s|<script crossorigin |<script |g" -- "$example_file_path"
	done
done

# Fetch all dependencies
for url in "${!all_dependencies[@]}"; do
	curl -L --fail -- "$url" > "examples/${all_dependencies["$url"]}"
done

# Prepare to commit them
git add .
git status
