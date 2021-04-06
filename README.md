## comma Connect - React Native App

### Install
- `git clone https://github.com/commaai/connect.git`
- `cd connect`
- `bundle install`
- `yarn`

#### Run local bundler
- `yarn start`

#### Run iOS Debug (Device/Simulator)
- `cd ios && bundle exec pod install`
- `cd ..`
- `yarn ios` or `yarn ios-device`

#### Run Android Debug (Device/Simulator)
- `yarn android`

#### Release Android beta
- place `release.keystore` file in `android/app/`
- `KEYSTORE_PASSWORD=*** KEY_PASSWORD=*** bundle exec fastlane android internal_beta`
- visit play store releases dashboard to finalize release (only if gradle versionName changes)

#### Release iOS beta
- `bundle exec fastlane ios beta`

#### Relase to production
- beta builds can be released to production in the store dashboards
