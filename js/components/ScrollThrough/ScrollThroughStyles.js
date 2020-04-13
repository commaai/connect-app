import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    root: {
        width: '100%', height: '100%',
    },
    tosText: {
        opacity: 0.75,
    },
    scrollContainer: {
        position: 'relative',
    },
    buttons: {
        flex: 0.3,
        flexDirection: 'row',
        marginTop: 15,
    },
    declineButton: {
        flex: 0.25,
        marginRight: 20,
        minHeight: 40,
    },
    acceptButton: {
        flex: 0.75,
        minHeight: 40,
    },
    scrollBorder: {
        borderTopColor: 'rgba(255,255,255,0.08)',
        borderTopWidth: 2,
        width: '100%',
        height: 1,
        position: 'absolute',
        bottom: 0,
    },
});
