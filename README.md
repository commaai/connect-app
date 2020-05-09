## comma connect

This is a React Native App to connect your phone to your vehicles equipped with [comma two](https://comma.ai/shop/products/comma-two-devkit) or [EON](https://comma.ai/shop/products/eon-gold-dashcam-devkit).

Pair your `comma two` for:

- Real-time vehicle location on the map
- Live snapshot from device cameras
- Drive videos replay with GPS path
- 24/7 device connectivity when subscribed to `comma prime` (free 3-month trial, can be activated without the data plan if you have a third-party SIM)

Live location available for devices connected to internet with software version 0.5.10 or newer.
Snapshots available for devices with software version 0.7 or newer.

See also: [Frequently Asked Questions](https://comma.ai/faq)

### Install
- `git clone https://github.com/commaai/connect.git`
- `cd connect`
- `bundle install`
- `yarn`

### Run

#### Run iOS Debug (Simulator)
- `cd ios && bundle install && pod install`
- `cd ..`
- `yarn ios`

#### Run Android Debug (Device/Simulator)
- `yarn android`

### Release

#### Android beta release
- `KEYSTORE_PASSWORD=*** bundle exec fastlane android internal_beta`
- visit [Play Store releases dashboard](https://play.google.com/apps/publish/) to finalize release (only if gradle versionName changes)

#### iOS beta release
- `bundle exec fastlane ios beta`

#### Android production release
- `KEYSTORE_PASSWORD=*** bundle exec fastlane android production`
- visit [Play Store releases dashboard](https://play.google.com/apps/publish/) to finalize release

#### iOS production release
- `bundle exec fastlane ios production`
- visit [App Store Connect](https://appstoreconnect.apple.com/) to finalize release
