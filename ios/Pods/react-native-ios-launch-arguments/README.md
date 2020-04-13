# react-native-ios-launch-arguments

## Getting started

`$ npm install react-native-ios-launch-arguments --save`

### Mostly automatic installation

`$ react-native link react-native-ios-launch-arguments`

### Manual installation

#### iOS

1. In XCode, in the project navigator, right click `Libraries` ➜ `Add Files to [your project's name]`
2. Go to `node_modules` ➜ `react-native-ios-launch-arguments` and add `RNAppLaunchArguments.xcodeproj`
3. In XCode, in the project navigator, select your project. Add `libRNAppLaunchArguments.a` to your project's `Build Phases` ➜ `Link Binary With Libraries`
4. Run your project (`Cmd+R`)<

## Usage

```javascript
import getLaunchArguments from 'react-native-ios-launch-arguments';

console.warn(getLaunchArguments()); // Array of app launch arguments
```