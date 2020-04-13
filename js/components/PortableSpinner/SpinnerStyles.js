import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  spinnerContainer: {
    backgroundColor: '#080808',
    flex: 1,
    minHeight: 180,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: '10%',
    position: 'relative',
  },
  spinnerCircle: {
    height: 100,
    width: 100,
    top: -28,
    position: 'absolute',
  },
  spinnerComma: {
    height: 48,
    width: 48,
    top: 0,
    position: 'absolute',
    // top: 326,
    // position: 'absolute',
  },
  spinnerMessage: {
    // top: 426,
    top: 90,
    position: 'absolute',
  },
});
