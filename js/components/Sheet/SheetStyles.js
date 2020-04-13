import { Platform, StyleSheet } from 'react-native';

export default StyleSheet.create({
  sheetContainer: {
    backgroundColor: '#ccc',
    padding: 10,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  sheetIconContainer: {
    alignItems: 'center',
    height: 10,
    marginBottom: 5,
  },
  sheetIconImage: {
    height: 10,
    width: 35,
  },
});
