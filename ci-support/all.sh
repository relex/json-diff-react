#! /usr/bin/env bash

# You are supposed to run this script from the project root like this:
# nix-shell --pure --run ci-support/all.sh

set -o errexit || exit
set -o nounset
set -o pipefail

SCRIPT_DIR=$(dirname -- "${BASH_SOURCE[0]}")
cd -- "$SCRIPT_DIR/.." # Go to project root

echo 'Running all CI scripts...'

# Log helpers
success() { echo; echo '[ SUCCESS ]'; echo; }
failure() { >&2 echo; >&2 echo '[ FAILURE ]'; >&2 echo; }

(
  echo 'Installing NPM dependencies first...'
  npm_install_exit_code=0
  (set -o xtrace; npm install) || npm_install_exit_code=$?
  if (( npm_install_exit_code != 0 )); then
    >&2 printf '\nFailed with exit code: %d\n' "$npm_install_exit_code"
    failure
    exit "$npm_install_exit_code"
  fi
)

# Key-value set aka associative array
declare -A exit_codes

exit_codes['test']=0
ci-support/test.sh || exit_codes['test']=$?
if (( exit_codes['test'] == 0 )); then success; else failure; fi

exit_codes['lint']=0
ci-support/lint.sh || exit_codes['lint']=$?
if (( exit_codes['lint'] == 0 )); then success; else failure; fi

exit_codes['prettify']=0
ci-support/prettify.sh || exit_codes['prettify']=$?
if (( exit_codes['prettify'] == 0 )); then success; else failure; fi

exit_codes['build']=0
ci-support/build.sh || exit_codes['build']=$?
if (( exit_codes['build'] == 0 )); then success; else failure; fi

echo
echo 'Final report (exit codes):'
echo

final_exit_code=0

for name in "${!exit_codes[@]}"; do
  printf '  * %s: %d\n' "$name" "${exit_codes[$name]}"
  if (( "${exit_codes[$name]}" != 0 )); then final_exit_code=${exit_codes[$name]}; fi
done

if (( final_exit_code == 0 )); then
  success
else
  failure
  exit "$final_exit_code"
fi
