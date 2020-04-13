import { Dimensions, StyleSheet } from 'react-native';

var {height, width} = Dimensions.get('window');

console.log(height)
export default StyleSheet.create({
  primeManageContainer: {
    flex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  primeManageHeader: {
    justifyContent: 'flex-end',
  },
  primeManageTitle: {
    textAlign: 'center',
  },
  primeManageSub: {
    minHeight: 135,
    width: '100%',
    alignItems: 'center',
  },
  primeManageSubRow: {
    flexDirection: 'row',
    width: '100%',
  },
  primeManageSubInfo: {
    marginTop: 10,
    marginRight: 40,
  },
  primeManageSpinnerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
    width: '100%',
    flex: 1,
  },
  primeManagePaymentContainer: {
    backgroundColor: 'white',
    width: '120%',
    left: '-10%',
    height: '100%',
    alignItems: 'center',
  },
  primeManagePaymentSuccessIcon: {
    width: 25,
    height: 25,
    padding: 5,
    borderRadius: 12.5,
    borderColor: 'rgba(0,0,0,0.23)',
    borderWidth: 1,
    backgroundColor: '#178644',
  },
  primeManagePaymentError: {
    alignItems: 'center',
  },
  primeManagePaymentErrorIcon: {
    width: 25,
    height: 25,
  },
  primePaymentInfoDetailsSubmit: {
    backgroundColor: 'black',
    width: '80%',
  },
  primeManagePageHeader: {
    paddingTop: 15,
  },
});