#!/usr/bin/env bash

set -euo pipefail

CREATE_DIR=$(cd -P "$(dirname "$(readlink "${BASH_SOURCE[0]}" || echo "${BASH_SOURCE[0]}")")" && pwd)
RN_DIR="${CREATE_DIR}/../../../react-native"
RN_SCROLLVIEW_DIR="${RN_DIR}/Libraries/Components/ScrollView"
MIN_RN_VERSION="68"

echo "${RN_DIR}/package.json"

if [ -e "${RN_DIR}/package.json" ] ; then 
  PACKAGE_VERSION=$(cat "${RN_DIR}"/package.json \
    | grep version \
    | head -1 \
    | awk -F: '{print $2 }' \
    | sed 's/[",]//g')

  if [ -e "$RN_SCROLLVIEW_DIR" ] && [ "${PACKAGE_VERSION:3:2}" -ge "${MIN_RN_VERSION}" ] ; then
      sed -i '' "s|'RCTScrollView'|Platform.isTV \&\& Platform.OS === 'android' ? 'RCTScrollViewTV' : 'RCTScrollView'|" "${RN_SCROLLVIEW_DIR}/ScrollViewNativeComponent.js"
      echo "Overriding done."
  else
      echo "React native directory does not exists or react-native version is lover than 0.68"
  fi
else
        echo "React native directory does not exists"
fi