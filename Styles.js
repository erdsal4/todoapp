import { StyleSheet } from 'react-native';

const globStyles = StyleSheet.create(
    {
        text: {
            color: '#36454F'
        },
        container: {
            padding: 20,
            flex: 1,
            justifyContent: 'space-around'
        },
        button: {
            backgroundColor: '#AA4A44',
            borderRadius: 50,
            height:75,
            width: 75,
            padding: 15,
            margin: 10,
            alignSelf: 'flex-end',
            justifyContent: 'center',
            alignItems: 'center',
            elevation: 3
        },
        buttonText: {
            color: '#FAF9F6', 
            fontSize: 15
        }
    }
);

export default globStyles;