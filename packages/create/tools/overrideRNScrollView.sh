#!/bin/bash

set -euo pipefail

CREATE_DIR=$(cd -P "$(dirname "$(readlink "${BASH_SOURCE[0]}" || echo "${BASH_SOURCE[0]}")")" && pwd)
RN_DIR="${CREATE_DIR}/../../../react-native/Libraries/Components/ScrollView"

if [ -e $RN_DIR ]; then
    cp "${CREATE_DIR}/ScrollViewNativeComponent.js" "${RN_DIR}/ScrollViewNativeComponent.js"
    echo "Overriding done."
else
    echo "React native directory does not exists."
fi