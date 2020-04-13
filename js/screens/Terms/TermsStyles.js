import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    tosText: {
        opacity: 0.75,
    },
    scrollViewContent: {
        paddingTop: 20,
        paddingBottom: 20,
    },
    scrollBorder: {
        borderTopColor: 'rgba(255,255,255,0.08)',
        borderTopWidth: 2,
        width: '100%',
        height: 1,
        position: 'absolute',
        bottom: 0,
    },
    footerStyle: {
        alignItems: 'center',
        paddingBottom: 0,
        justifyContent: 'space-between',
        flexDirection: 'row',
    },
    primaryButtonStyle: {
        width: '32%',
    },
    secondaryButtonStyle: {
        width: '65%',
    },
});
