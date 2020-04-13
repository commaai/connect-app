import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  spinnerContainer: {
    backgroundColor: '#080808',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: '10%',
  },
  spinnerCircle: {
    height: 100,
    width: 100,
    top: 300,
    position: 'absolute',
  },
  spinnerComma: {
    height: 48,
    width: 48,
    top: 326,
    position: 'absolute',
  },
  spinnerMessage: {
    top: 426,
    position: 'absolute',
  },
});
