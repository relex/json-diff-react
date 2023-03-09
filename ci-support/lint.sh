#! /usr/bin/env bash

set -o errexit || exit
set -o nounset
set -o pipefail

SCRIPT_DIR=$(dirname -- "${BASH_SOURCE[0]}")
cd -- "$SCRIPT_DIR/.." # Go to project root

echo 'Running the code linter...'
(set -o xtrace; nix-shell --run 'npm run lint')
