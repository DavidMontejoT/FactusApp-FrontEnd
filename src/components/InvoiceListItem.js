import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS } from '../utils/constants';
import StatusBadge from './StatusBadge';
import { formatCurrency } from '../utils/formatters';

const InvoiceListItem = ({ invoice, onPress }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      {/* Icon */}
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>📄</Text>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.invoiceNumber}>{invoice.invoiceNumber || 'INV-2024-001'}</Text>
        <Text style={styles.clientName}>{invoice.clientName || 'Cliente'}</Text>
      </View>

      {/* Amount & Status */}
      <View style={styles.rightContent}>
        <Text style={styles.amount}>{formatCurrency(invoice.total)}</Text>
        <StatusBadge status={invoice.status || 'DRAFT'} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    marginHorizontal: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: COLORS.bgDark,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  icon: {
    fontSize: 20,
  },
  content: {
    flex: 1,
  },
  invoiceNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 2,
  },
  clientName: {
    fontSize: 14,
    color: COLORS.textLight,
  },
  rightContent: {
    alignItems: 'flex-end',
  },
  amount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
});

export default InvoiceListItem;
