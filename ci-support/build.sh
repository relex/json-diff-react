#! /usr/bin/env bash

set -o errexit || exit
set -o nounset
set -o pipefail

SCRIPT_DIR=$(dirname -- "${BASH_SOURCE[0]}")
cd -- "$SCRIPT_DIR/.." # Go to project root

echo 'Running the main build...'
(set -o xtrace; nix-shell --run 'npm run build')

EXIT_CODE=0

echo 'Checking that the build run produced no changes...'
# See https://stackoverflow.com/questions/3878624/how-do-i-programmatically-determine-if-there-are-uncommitted-changes#3879077
(set -o xtrace; nix-shell --run 'git update-index --refresh && git diff-index --quiet HEAD --') || EXIT_CODE=$?
if (( EXIT_CODE != 0 )); then
  >&2 echo 'Oh no! There seem to be some changes that were not rebuilt!'
  >&2 echo 'Run "npm run build && npm run build-examples-bundle" and commit the changes!'
  exit "$EXIT_CODE"
fi

echo 'Running the examples bundle build...'
(set -o xtrace; nix-shell --run 'npm run build-examples-bundle')

echo 'Checking that the bundle build run produced no changes...'
# See https://stackoverflow.com/questions/3878624/how-do-i-programmatically-determine-if-there-are-uncommitted-changes#3879077
(set -o xtrace; nix-shell --run 'git update-index --refresh && git diff-index --quiet HEAD --') || EXIT_CODE=$?
if (( EXIT_CODE != 0 )); then
  >&2 echo 'Oh no! There seem to be some changes that were not rebuilt!'
  >&2 echo 'Run "npm run build && npm run build-examples-bundle" and commit the changes!'
  exit "$EXIT_CODE"
fi
