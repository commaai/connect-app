/** @format */
import * as Sentry from '@sentry/react-native';

global.XMLHttpRequest = global.originalXMLHttpRequest ?
    global.originalXMLHttpRequest :
    global.XMLHttpRequest;
global.FormData = global.originalFormData ?
    global.originalFormData :
    global.FormData;
global.Blob = global.originalBlob ?
    global.originalBlob :
    global.Blob;
global.FileReader = global.originalFileReader ?
    global.originalFileReader :
    global.FileReader;
if (!__DEV__) {
  Sentry.init({dsn: 'https://c30d980f5b434994b1a56245aabbf802@sentry.io/1414160'});
}

var open = XMLHttpRequest.prototype.open;
var reqs = [];
XMLHttpRequest.prototype.open = function(method, url) {
  open.apply(this, arguments);
  reqs.push(this);
}

XMLHttpRequest.prototype.nukeAll = function() {
  reqs.forEach(req => req.abort());
}

import Segment from '@segment/analytics-react-native';
import Mixpanel from '@segment/analytics-react-native-mixpanel';
// import GoogleAnalytics from '@segment/analytics-react-native-google-analytics';
if (!__DEV__) {
  Segment.setup('vFKrJqkkGXPv4Dy1pgC0cU1jgivYo10B', {
    using: [Mixpanel],
    recordScreenViews: false,
    trackAppLifecycleEvents: true,
    trackAttributionData: true,

    android: {
      flushInterval: 60,
      collectDeviceId: true,
    },
    ios: {
      trackDeepLinks: true,
    },
  }).then(() => console.log('Segment installed'))
    .catch(err => console.error(err));
}

import { AppRegistry } from 'react-native';
import App from './js/App';

AppRegistry.registerComponent("connect", () => App);

