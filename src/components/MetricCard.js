import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../utils/constants';

const MetricCard = ({ title, value, change, isPositive }) => {
  const iconBgColor = isPositive ? '#DCFCE7' : '#FEE2E2';

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <View style={[styles.iconContainer, { backgroundColor: iconBgColor }]}>
          <Text style={styles.icon}>{isPositive ? '📈' : '📉'}</Text>
        </View>
      </View>
      <Text style={styles.value}>{formatCurrency(value)}</Text>
      <Text style={[styles.change, isPositive ? styles.changePositive : styles.changeNegative]}>
        {change}
      </Text>
    </View>
  );
};

const formatCurrency = (value) => {
  if (typeof value === 'number') {
    return `$${value.toLocaleString()}`;
  }
  return value;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    // Use web-compatible box shadow
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 14,
    color: COLORS.textLight,
    fontWeight: '500',
  },
  iconContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    fontSize: 12,
  },
  value: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  change: {
    fontSize: 12,
    fontWeight: '500',
  },
  changePositive: {
    color: COLORS.success,
  },
  changeNegative: {
    color: COLORS.danger,
  },
});

export default MetricCard;
