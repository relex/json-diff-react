#! /usr/bin/env bash

set -o errexit || exit
set -o nounset
set -o pipefail

SCRIPT_DIR=$(dirname -- "${BASH_SOURCE[0]}")
cd -- "$SCRIPT_DIR/.." # Go to project root

echo 'Running the prettifier...'
(set -o xtrace; nix-shell --run 'npm run prettier')

EXIT_CODE=0

echo 'Checking that prettifier did not change anything...'
# See https://stackoverflow.com/questions/3878624/how-do-i-programmatically-determine-if-there-are-uncommitted-changes#3879077
(set -o xtrace; nix-shell --run 'git update-index --refresh && git diff-index --quiet HEAD --') || EXIT_CODE=$?
if (( EXIT_CODE != 0 )); then
  >&2 echo 'Oh no! There seem to be some pieces in the code that are not pretty!'
  exit "$EXIT_CODE"
fi
