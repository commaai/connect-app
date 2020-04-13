#!/usr/bin/env bash
set -ex

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" >/dev/null && pwd)"

curl -o $DIR/../ios_dev_cert.p12 https://commadataci.blob.core.windows.net/build/ios_dev_cert.p12$STORAGE_TOKEN

curl -o $DIR/../connect_dev.mobileprovision https://commadataci.blob.core.windows.net/build/connect_dev.mobileprovision$STORAGE_TOKEN
uuid=$(/usr/libexec/PlistBuddy -c "Print UUID" /dev/stdin <<< $(/usr/bin/security cms -D -i $DIR/../connect_dev.mobileprovision))
mkdir -p ~/Library/MobileDevice/Provisioning\ Profiles/
mv $DIR/../connect_dev.mobileprovision ~/Library/MobileDevice/Provisioning\ Profiles/$uuid.mobileprovision
