import React from 'react';
import { View, Text } from 'react-native';
import Modal from 'react-native-modal';
import Calender from '../../Member/Calender';

function DrawerModal({ visible, setVisible }) {
    return (
        <Modal
            isVisible={visible}
            animationIn="slideInRight"
            animationOut="slideOutLeft"
            onBackdropPress={() => setVisible(false)}
            onBackButtonPress={() => setVisible(false)}
            style={{ margin: 0, justifyContent: 'flex-end' }} // Ensures modal covers the height and aligns properly
        >
            <View
                style={{
                    backgroundColor: "#fff",
                    height: "80%",
                    width: "100%",
                    position: "absolute",
                    right: 0,
                }}
            >
                <Calender />
            </View>
        </Modal>
    );
}

export default DrawerModal;
