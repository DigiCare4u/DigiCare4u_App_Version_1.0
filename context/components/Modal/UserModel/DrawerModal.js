import React from 'react';
import { View, Text } from 'react-native';
import Modal from 'react-native-modal';

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
          height: "100%",
          width: "60%",
          position: "absolute",
          right: 0, // Aligns the modal to the right
        }}
      >
        <Text style={{color:"black"}}>Modal Box</Text>
      </View>
    </Modal>
  );
}

export default DrawerModal;
