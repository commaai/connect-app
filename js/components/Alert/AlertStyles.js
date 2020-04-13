import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  alertContainer: {
    backgroundColor: '#080808',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: '10%',
  },
  alertBox: {
    borderColor: 'rgba(255, 255, 255, .1)',
    borderWidth: 1,
    borderRadius: 5,
    padding: 30,
    flexDirection: 'column',
    width: '100%',
  },
  alertTitle: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  alertMessage: {
    textAlign: 'center',
    paddingBottom: 25,
  },
  alertButtons: {
    flexDirection: 'row',
  },
  alertButton: {
    // flexDirection: 'row',
    // width: '100%',
  },
});
