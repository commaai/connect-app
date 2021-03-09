## comma Connect - React Native App

### Install
- `git clone https://github.com/commaai/connect.git`
- `cd connect`
- `bundle install`
- `yarn`

#### Run local bundler
- `yarn start`

#### Run iOS Debug (Device/Simulator)
- `cd ios && bundle install && pod install`
- `cd ..`
- `yarn ios` or `yarn ios-device`

#### Run Android Debug (Device/Simulator)
- `yarn android`

#### Release Android beta
- `KEYSTORE_PASSWORD=*** bundle exec fastlane android internal_beta`
- visit play store releases dashboard to finalize release (only if gradle versionName changes)

#### Release iOS beta
- `bundle exec fastlane ios beta`

#### Android production release
- `KEYSTORE_PASSWORD=*** bundle exec fastlane android production`
- visit play store releases dashboard to finalize release

#### iOS production release
- `bundle exec fastlane ios production`
- visit https://appstoreconnect.apple.com/ to finalize release

