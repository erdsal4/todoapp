import React, { useState, useContext } from 'react';
import { View, StyleSheet } from "react-native";
import CheckBox from '@react-native-community/checkbox';
import globStyles from '../Styles';
import { CheckedContext } from './Todos';

export const CustCheckBox = ({ todoId }) => {
    const [checked, setChecked] = useState(false);
    const {addChecked, deleteChecked} = useContext(CheckedContext);
    console.log("checkbox ", todoId, " rerenders");
    return (
        <View style={styles.checkboxContainer}>
            <CheckBox
                value={checked}
                tintColors={{ true: '#F15927' }}
                onValueChange={() => {
                    if(checked) {
                        deleteChecked(todoId);
                    } else {
                        addChecked(todoId);
                    }
                    setChecked(!checked);
                }}
                style={[globStyles.text]}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    checkboxContainer: {
        paddingRight: 10
    }
});