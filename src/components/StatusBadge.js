import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, INVOICE_STATUSES } from '../utils/constants';

const StatusBadge = ({ status }) => {
  const statusConfig = INVOICE_STATUSES.find(s => s.value === status) || INVOICE_STATUSES[0];

  return (
    <View style={[styles.container, { backgroundColor: statusConfig.color }]}>
      <Text style={styles.text}>{statusConfig.label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  text: {
    fontSize: 12,
    fontWeight: '500',
    color: COLORS.white,
  },
});

export default StatusBadge;
