import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator, Alert, Share } from 'react-native';
import { COLORS } from '../utils/constants';
import api from '../utils/api';
import { formatCurrency, formatDate, getInvoiceStatusText, getInvoiceStatusColor } from '../utils/formatters';

const InvoiceDetailScreen = ({ route, navigation }) => {
  const { invoiceId } = route.params;
  const [loading, setLoading] = useState(true);
  const [invoice, setInvoice] = useState(null);
  const [emitting, setEmitting] = useState(false);

  useEffect(() => {
    fetchInvoice();
  }, []);

  const fetchInvoice = async () => {
    try {
      const response = await api.get(`/invoices/${invoiceId}`);
      setInvoice(response.data);
    } catch (error) {
      Alert.alert('Error', 'No se pudo cargar la factura');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const handleEmitToDIAN = async () => {
    setEmitting(true);
    try {
      await api.post(`/invoices/${invoiceId}/emit`);
      Alert.alert('Éxito', 'Factura emitida a DIAN correctamente');
      fetchInvoice(); // Reload to get updated status
    } catch (error) {
      Alert.alert('Error', 'No se pudo emitir la factura a DIAN');
    } finally {
      setEmitting(false);
    }
  };

  const handleShare = async () => {
    try {
      const response = await api.get(`/invoices/${invoiceId}/pdf`, { responseType: 'blob' });
      // In a real app, you would share the PDF file
      Alert.alert('Info', 'PDF generado (compartir pronto disponible)');
    } catch (error) {
      Alert.alert('Error', 'No se pudo generar el PDF');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (!invoice) return null;

  const subtotal = invoice.items?.reduce((sum, item) => sum + (item.price * item.quantity), 0) || 0;
  const tax = subtotal * 0.19;
  const total = subtotal + tax;

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Factura {invoice.invoiceNumber}</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.content}>
        {/* Status Badge */}
        <View style={[styles.statusBadge, { backgroundColor: getInvoiceStatusColor(invoice.status) }]}>
          <Text style={styles.statusText}>{getInvoiceStatusText(invoice.status)}</Text>
        </View>

        {/* Invoice Info */}
        <View style={styles.card}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Número:</Text>
            <Text style={styles.infoValue}>{invoice.invoiceNumber}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Fecha:</Text>
            <Text style={styles.infoValue}>{formatDate(invoice.issueDate)}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Cliente:</Text>
            <Text style={styles.infoValue}>{invoice.clientName}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Método de Pago:</Text>
            <Text style={styles.infoValue}>{invoice.paymentMethod}</Text>
          </View>
        </View>

        {/* Line Items */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Productos</Text>
          {invoice.items?.map((item, index) => (
            <View key={index} style={styles.itemRow}>
              <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{item.productName}</Text>
                <Text style={styles.itemDetails}>{item.quantity} x ${formatCurrency(item.price)}</Text>
              </View>
              <Text style={styles.itemTotal}>{formatCurrency(item.price * item.quantity)}</Text>
            </View>
          ))}
        </View>

        {/* Totals */}
        <View style={styles.card}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Subtotal:</Text>
            <Text style={styles.totalValue}>{formatCurrency(subtotal)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>IVA (19%):</Text>
            <Text style={styles.totalValue}>{formatCurrency(tax)}</Text>
          </View>
          <View style={[styles.totalRow, styles.grandTotal]}>
            <Text style={styles.grandTotalLabel}>TOTAL:</Text>
            <Text style={styles.grandTotalValue}>{formatCurrency(total)}</Text>
          </View>
        </View>

        {/* Notes */}
        {invoice.notes && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Notas</Text>
            <Text style={styles.notesText}>{invoice.notes}</Text>
          </View>
        )}

        {/* Actions */}
        <View style={styles.actions}>
          {invoice.status === 'DRAFT' && (
            <TouchableOpacity
              style={[styles.actionButton, styles.emitButton]}
              onPress={handleEmitToDIAN}
              disabled={emitting}
            >
              {emitting ? (
                <ActivityIndicator color={COLORS.white} />
              ) : (
                <Text style={styles.actionButtonText}>Emitir a DIAN</Text>
              )}
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[styles.actionButton, styles.shareButton]}
            onPress={handleShare}
          >
            <Text style={styles.actionButtonText}>Compartir PDF</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bgLight },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16, backgroundColor: COLORS.white, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  backButton: { fontSize: 28, color: COLORS.text, fontWeight: '300' },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.text },
  placeholder: { width: 40 },
  content: { padding: 20 },
  statusBadge: { alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, marginBottom: 20 },
  statusText: { fontSize: 14, fontWeight: '600', color: COLORS.white },
  card: { backgroundColor: COLORS.white, borderRadius: 12, padding: 20, marginBottom: 20, borderWidth: 1, borderColor: COLORS.border },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: COLORS.text, marginBottom: 16 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  infoLabel: { fontSize: 14, color: COLORS.textLight },
  infoValue: { fontSize: 14, fontWeight: '500', color: COLORS.text },
  itemRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  itemInfo: { flex: 1 },
  itemName: { fontSize: 14, fontWeight: '500', color: COLORS.text, marginBottom: 4 },
  itemDetails: { fontSize: 12, color: COLORS.textLight },
  itemTotal: { fontSize: 14, fontWeight: 'bold', color: COLORS.text },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  totalLabel: { fontSize: 14, color: COLORS.textLight },
  totalValue: { fontSize: 14, fontWeight: '500', color: COLORS.text },
  grandTotal: { borderTopWidth: 1, borderTopColor: COLORS.border, paddingTop: 8, marginTop: 4 },
  grandTotalLabel: { fontSize: 16, fontWeight: 'bold', color: COLORS.text },
  grandTotalValue: { fontSize: 16, fontWeight: 'bold', color: COLORS.primary },
  notesText: { fontSize: 14, color: COLORS.text, lineHeight: 20 },
  actions: { flexDirection: 'row', gap: 12, marginTop: 20 },
  actionButton: { flex: 1, paddingVertical: 14, borderRadius: 8, alignItems: 'center' },
  emitButton: { backgroundColor: COLORS.primary },
  shareButton: { backgroundColor: COLORS.bgDark },
  actionButtonText: { fontSize: 14, fontWeight: '600', color: COLORS.white },
});

export default InvoiceDetailScreen;
