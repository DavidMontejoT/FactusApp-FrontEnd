import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { COLORS, PAYMENT_METHODS } from '../utils/constants';
import api from '../utils/api';

const InvoiceCreateScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [clients, setClients] = useState([]);
  const [products, setProducts] = useState([]);

  // Invoice data
  const [clientId, setClientId] = useState('');
  const [issueDate, setIssueDate] = useState(new Date().toISOString().split('T')[0]);
  const [paymentMethod, setPaymentMethod] = useState('CASH');
  const [notes, setNotes] = useState('');

  // Line items
  const [lineItems, setLineItems] = useState([{ productId: '', quantity: 1, price: 0 }]);

  useEffect(() => {
    fetchClientsAndProducts();
  }, []);

  const fetchClientsAndProducts = async () => {
    try {
      const [clientsRes, productsRes] = await Promise.all([
        api.get('/clients'),
        api.get('/products'),
      ]);
      setClients(clientsRes.data);
      setProducts(productsRes.data);
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar clientes o productos');
    }
  };

  const addLineItem = () => {
    setLineItems([...lineItems, { productId: '', quantity: 1, price: 0 }]);
  };

  const removeLineItem = (index) => {
    const newItems = lineItems.filter((_, i) => i !== index);
    setLineItems(newItems);
  };

  const updateLineItem = (index, field, value) => {
    const newItems = [...lineItems];
    if (field === 'productId') {
      const product = products.find(p => p.id === value);
      newItems[index] = {
        ...newItems[index],
        productId: value,
        price: product ? product.price : 0,
      };
    } else {
      newItems[index][field] = field === 'quantity' ? parseInt(value) || 0 : value;
    }
    setLineItems(newItems);
  };

  const calculateSubtotal = () => {
    return lineItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const calculateTax = (subtotal) => {
    return subtotal * 0.19; // 19% IVA
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const tax = calculateTax(subtotal);
    return subtotal + tax;
  };

  const handleCreateInvoice = async () => {
    if (!clientId) {
      Alert.alert('Error', 'Debes seleccionar un cliente');
      return;
    }

    const validItems = lineItems.filter(item => item.productId && item.quantity > 0);
    if (validItems.length === 0) {
      Alert.alert('Error', 'Debes agregar al menos un producto');
      return;
    }

    setLoading(true);

    try {
      const invoiceData = {
        clientId,
        issueDate,
        paymentMethod,
        notes: notes.trim() || null,
        items: validItems.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
        })),
      };

      await api.post('/invoices', invoiceData);

      Alert.alert(
        'Éxito',
        'Factura creada correctamente',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      console.error('Error creating invoice:', error);
      Alert.alert('Error', error.response?.data?.message || 'No se pudo crear la factura');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backButton}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Nueva Factura</Text>
          <View style={styles.placeholder} />
        </View>

        <View style={styles.form}>
          {/* Cliente */}
          <Text style={styles.sectionTitle}>Cliente</Text>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Cliente *</Text>
            <ScrollView style={styles.pickerScroll} horizontal>
              {clients.map((client) => (
                <TouchableOpacity
                  key={client.id}
                  style={[
                    styles.clientOption,
                    clientId === client.id && styles.clientOptionActive,
                  ]}
                  onPress={() => setClientId(client.id)}
                >
                  <Text
                    style={[
                      styles.clientOptionText,
                      clientId === client.id && styles.clientOptionTextActive,
                    ]}
                  >
                    {client.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Fecha */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Fecha de Emisión</Text>
            <TextInput
              style={styles.input}
              value={issueDate}
              onChangeText={setIssueDate}
              placeholder="YYYY-MM-DD"
            />
          </View>

          {/* Método de Pago */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Método de Pago *</Text>
            <View style={styles.pickerContainer}>
              {PAYMENT_METHODS.map((method) => (
                <TouchableOpacity
                  key={method.value}
                  style={[
                    styles.pickerOption,
                    paymentMethod === method.value && styles.pickerOptionActive,
                  ]}
                  onPress={() => setPaymentMethod(method.value)}
                >
                  <Text
                    style={[
                      styles.pickerOptionText,
                      paymentMethod === method.value && styles.pickerOptionTextActive,
                    ]}
                  >
                    {method.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Items */}
          <Text style={styles.sectionTitle}>Productos</Text>

          {lineItems.map((item, index) => (
            <View key={index} style={styles.lineItemCard}>
              <View style={styles.lineItemHeader}>
                <Text style={styles.lineItemTitle}>Producto {index + 1}</Text>
                {lineItems.length > 1 && (
                  <TouchableOpacity onPress={() => removeLineItem(index)}>
                    <Text style={styles.removeButton}>✕</Text>
                  </TouchableOpacity>
                )}
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Producto</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Seleccionar producto"
                  value={products.find(p => p.id === item.productId)?.name || ''}
                  onTouchStart={() => {
                    // Show product picker modal (simplified)
                    Alert.alert(
                      'Seleccionar Producto',
                      'Elige un producto:',
                      products.map((p, i) => ({
                        text: `${p.name} - $${p.price}`,
                        onPress: () => updateLineItem(index, 'productId', p.id),
                      }))
                    );
                  }}
                />
              </View>

              <View style={styles.row}>
                <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                  <Text style={styles.label}>Cantidad</Text>
                  <TextInput
                    style={styles.input}
                    value={item.quantity.toString()}
                    onChangeText={(value) => updateLineItem(index, 'quantity', value)}
                    keyboardType="number-pad"
                  />
                </View>

                <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
                  <Text style={styles.label}>Precio</Text>
                  <TextInput
                    style={styles.input}
                    value={`$${item.price.toLocaleString()}`}
                    editable={false}
                  />
                </View>
              </View>

              <Text style={styles.itemTotal}>
                Total: ${(item.price * item.quantity).toLocaleString()}
              </Text>
            </View>
          ))}

          <TouchableOpacity style={styles.addButton} onPress={addLineItem}>
            <Text style={styles.addButtonText}>+ Agregar Producto</Text>
          </TouchableOpacity>

          {/* Notas */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Notas</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={notes}
              onChangeText={setNotes}
              placeholder="Notas adicionales..."
              multiline
              numberOfLines={3}
            />
          </View>

          {/* Totals */}
          <View style={styles.totalsCard}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Subtotal:</Text>
              <Text style={styles.totalValue}>${calculateSubtotal().toLocaleString()}</Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>IVA (19%):</Text>
              <Text style={styles.totalValue}>${calculateTax(calculateSubtotal()).toLocaleString()}</Text>
            </View>
            <View style={[styles.totalRow, styles.grandTotalRow]}>
              <Text style={styles.grandTotalLabel}>TOTAL:</Text>
              <Text style={styles.grandTotalValue}>${calculateTotal().toLocaleString()}</Text>
            </View>
          </View>

          {/* Botón Guardar */}
          <TouchableOpacity
            style={[styles.saveButton, loading && styles.saveButtonDisabled]}
            onPress={handleCreateInvoice}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={COLORS.white} />
            ) : (
              <Text style={styles.saveButtonText}>Crear Factura</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bgLight },
  scrollView: { flex: 1 },
  scrollContent: { paddingBottom: 40 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16, backgroundColor: COLORS.white, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  backButton: { fontSize: 28, color: COLORS.text, fontWeight: '300' },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.text },
  placeholder: { width: 40 },
  form: { padding: 20 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: COLORS.text, marginTop: 20, marginBottom: 16 },
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '500', color: COLORS.text, marginBottom: 8 },
  input: { backgroundColor: COLORS.white, borderWidth: 1, borderColor: COLORS.border, borderRadius: 8, paddingHorizontal: 16, paddingVertical: 12, fontSize: 16, color: COLORS.text },
  textArea: { height: 80, textAlignVertical: 'top' },
  pickerScroll: { maxHeight: 60 },
  pickerContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  pickerOption: { backgroundColor: COLORS.white, borderWidth: 1, borderColor: COLORS.border, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, marginRight: 8, marginBottom: 8 },
  pickerOptionActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  pickerOptionText: { fontSize: 14, color: COLORS.text },
  pickerOptionTextActive: { color: COLORS.white, fontWeight: '500' },
  clientOption: { backgroundColor: COLORS.white, borderWidth: 1, borderColor: COLORS.border, borderRadius: 8, paddingHorizontal: 16, paddingVertical: 12, marginRight: 8 },
  clientOptionActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  clientOptionText: { fontSize: 14, color: COLORS.text },
  clientOptionTextActive: { color: COLORS.white, fontWeight: '500' },
  lineItemCard: { backgroundColor: COLORS.white, borderWidth: 1, borderColor: COLORS.border, borderRadius: 8, padding: 16, marginBottom: 12 },
  lineItemHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  lineItemTitle: { fontSize: 14, fontWeight: 'bold', color: COLORS.text },
  removeButton: { fontSize: 20, color: COLORS.danger },
  row: { flexDirection: 'row' },
  itemTotal: { fontSize: 14, fontWeight: 'bold', color: COLORS.text, marginTop: 8, textAlign: 'right' },
  addButton: { backgroundColor: COLORS.primary, borderRadius: 8, paddingVertical: 12, alignItems: 'center', marginTop: 8 },
  addButtonText: { color: COLORS.white, fontSize: 14, fontWeight: '600' },
  totalsCard: { backgroundColor: COLORS.white, borderWidth: 1, borderColor: COLORS.border, borderRadius: 8, padding: 16, marginBottom: 20 },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  totalLabel: { fontSize: 14, color: COLORS.textLight },
  totalValue: { fontSize: 14, fontWeight: '500', color: COLORS.text },
  grandTotalRow: { borderTopWidth: 1, borderTopColor: COLORS.border, paddingTop: 8, marginTop: 4 },
  grandTotalLabel: { fontSize: 16, fontWeight: 'bold', color: COLORS.text },
  grandTotalValue: { fontSize: 16, fontWeight: 'bold', color: COLORS.primary },
  saveButton: { backgroundColor: COLORS.primary, borderRadius: 8, paddingVertical: 16, alignItems: 'center', marginTop: 20, shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 },
  saveButtonDisabled: { opacity: 0.6 },
  saveButtonText: { color: COLORS.white, fontSize: 16, fontWeight: '600' },
});

export default InvoiceCreateScreen;
