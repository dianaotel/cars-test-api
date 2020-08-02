#!/usr/bin/env bash

set -o errexit   # abort on nonzero exitstatus
set -o nounset   # abort on unbound variable
set -o pipefail  # don't hide errors within pipes

PORT=${PORT:-3000}

docker build -t cars-api .
docker run -p "$PORT:3000" --rm -it cars-api
