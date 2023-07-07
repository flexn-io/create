#!/bin/bash

set -euo pipefail

CREATE_DIR=$(cd -P "$(dirname "$(readlink "${BASH_SOURCE[0]}" || echo "${BASH_SOURCE[0]}")")" && pwd)
RN_DIR="${CREATE_DIR}/../../../react-native/Libraries/Components/ScrollView"

cp "${CREATE_DIR}/ScrollViewNativeComponent.js" "${RN_DIR}/ScrollViewNativeComponent.js" 2>/dev/null

echo "Overriding done."
