import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  primePaymentInfo: {
    width: '100%',
    minHeight: 100,
  },
  primePaymentInfoMethods: {
    minHeight: 100,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E4E4E4',
    paddingTop: 10,
    paddingBottom: 10,
  },
  primePaymentInfoDetails: {
    backgroundColor: 'white',
  },
  primePaymentInfoOptions: {
    flexDirection: 'row',
  },
  primePaymentInfoOption: {
    alignItems: 'center',
    height: 100,
  },
  primePaymentInfoOptionLogo: {
    margin: 10,
    width: 112,
    height: 51,
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 11,
    borderColor: 'rgba(0,0,0,0.15)',
    borderWidth: 1,
  },
  primePaymentInfoOptionSelection: {
    width: 25,
    height: 25,
    padding: 5,
    borderRadius: 12.5,
    borderColor: 'rgba(0,0,0,0.23)',
    borderWidth: 1,
    backgroundColor: 'white',
  },
  primePaymentInfoOptionSelected: {
    backgroundColor: '#178644'
  },
  primePaymentInfoDetails: {
    padding: 20,
  },
  primePaymentInfoDetailsSubmit: {
    marginTop: 15,
    backgroundColor: 'black',
  },
  cardInput: {
    color: 'black',
  },
  primePaymentInfoDetailsCard: {
    marginRight: -25,
  },
});