import React from 'react';
import { View } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

const TabBarIcon = ({ name, color, size }) => {
  return (
    <View style={styles.container}>
      <Icon name={name} color={color} size={size} />
    </View>
  );
};

const styles = {
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
};

export default TabBarIcon;
