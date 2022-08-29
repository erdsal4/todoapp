import { StyleSheet } from 'react-native';

const globStyles = StyleSheet.create(
    {
        mainContainer: {
            padding: 20,
            flex: 1,
            justifyContent: 'space-around'
        },
        todoListContainer: {
            flex: 9
        },
        todoRow: {
            flexDirection: 'row',
            padding: 15,
            alignItems: 'center'
        },
        todoTitle: {
            fontSize: 15,
        },
        sectionHeader: {
            borderBottomColor: 'black',
            borderBottomWidth: StyleSheet.hairlineWidth,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-end'
        },
        sectionHeaderText: {
            fontSize: 20
        },
        icon: {
            width: 24,
            height: 24
        },
        addButton: {
            backgroundColor: '#AA4A44',
            borderRadius: 50,
            height: 75,
            width: 75,
            padding: 15,
            margin: 10,
            alignSelf: 'flex-end',
            justifyContent: 'center',
            alignItems: 'center',
            elevation: 3
        },
        addButtonText: {
            color: '#FAF9F6',
            fontSize: 15
        },
        text: {
            color: '#36454F'
        }
    }
);

export default globStyles;