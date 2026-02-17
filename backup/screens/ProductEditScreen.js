import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, ActivityIndicator, Alert } from 'react-native';
import { COLORS, UNIT_MEASURES, PRODUCT_CATEGORIES } from '../utils/constants';
import api from '../utils/api';

const ProductEditScreen = ({ route, navigation }) => {
  const { productId } = route.params;
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [sku, setSku] = useState('');
  const [price, setPrice] = useState('');
  const [currentStock, setCurrentStock] = useState('0');
  const [minStock, setMinStock] = useState('5');
  const [category, setCategory] = useState('');
  const [unit, setUnit] = useState('UNIDAD');

  useEffect(() => {
    fetchProduct();
  }, []);

  const fetchProduct = async () => {
    try {
      const response = await api.get(`/products/${productId}`);
      const product = response.data;
      setName(product.name || '');
      setDescription(product.description || '');
      setSku(product.sku || '');
      setPrice(product.price ? product.price.toString() : '');
      setCurrentStock(product.currentStock ? product.currentStock.toString() : '0');
      setMinStock(product.minStock ? product.minStock.toString() : '5');
      setCategory(product.category || '');
      setUnit(product.unit || 'UNIDAD');
    } catch (error) {
      Alert.alert('Error', 'No se pudo cargar el producto');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProduct = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'El nombre es obligatorio');
      return;
    }
    setSaving(true);
    try {
      await api.put(`/products/${productId}`, {
        name: name.trim(),
        description: description.trim() || null,
        sku: sku.trim() || null,
        price: parseFloat(price),
        currentStock: parseInt(currentStock) || 0,
        minStock: parseInt(minStock) || 5,
        category: category || null,
        unit,
      });
      Alert.alert('Éxito', 'Producto actualizado');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'No se pudo actualizar el producto');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}><Text style={styles.backButton}>←</Text></TouchableOpacity>
          <Text style={styles.headerTitle}>Editar Producto</Text>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.form}>
          <Text style={styles.sectionTitle}>Información Básica</Text>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nombre *</Text>
            <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Nombre del producto" />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Descripción</Text>
            <TextInput style={[styles.input, styles.textArea]} value={description} onChangeText={setDescription} placeholder="Descripción" multiline numberOfLines={3} />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>SKU</Text>
            <TextInput style={styles.input} value={sku} onChangeText={setSku} placeholder="Código" autoCapitalize="characters" />
          </View>
          <Text style={styles.sectionTitle}>Precio</Text>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Precio (COP) *</Text>
            <TextInput style={styles.input} value={price} onChangeText={setPrice} keyboardType="decimal-pad" placeholder="0" />
          </View>
          <Text style={styles.sectionTitle}>Inventario</Text>
          <View style={styles.row}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
              <Text style={styles.label}>Stock Actual</Text>
              <TextInput style={styles.input} value={currentStock} onChangeText={setCurrentStock} keyboardType="number-pad" />
            </View>
            <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
              <Text style={styles.label}>Stock Mínimo</Text>
              <TextInput style={styles.input} value={minStock} onChangeText={setMinStock} keyboardType="number-pad" />
            </View>
          </View>
          <Text style={styles.sectionTitle}>Categorización</Text>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Categoría</Text>
            <View style={styles.pickerContainer}>
              {PRODUCT_CATEGORIES.map((cat) => (
                <TouchableOpacity key={cat} style={[styles.pickerOption, category === cat && styles.pickerOptionActive]} onPress={() => setCategory(cat)}>
                  <Text style={[styles.pickerOptionText, category === cat && styles.pickerOptionTextActive]}>{cat}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Unidad de Medida *</Text>
            <View style={styles.pickerContainer}>
              {UNIT_MEASURES.map((unitItem) => (
                <TouchableOpacity key={unitItem.value} style={[styles.pickerOption, unit === unitItem.value && styles.pickerOptionActive]} onPress={() => setUnit(unitItem.value)}>
                  <Text style={[styles.pickerOptionText, unit === unitItem.value && styles.pickerOptionTextActive]}>{unitItem.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          <TouchableOpacity style={[styles.saveButton, saving && styles.saveButtonDisabled]} onPress={handleUpdateProduct} disabled={saving}>
            {saving ? <ActivityIndicator color={COLORS.white} /> : <Text style={styles.saveButtonText}>Guardar Cambios</Text>}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bgLight },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scrollView: { flex: 1 },
  scrollContent: { paddingBottom: 40 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16, backgroundColor: COLORS.white, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  backButton: { fontSize: 28, color: COLORS.text, fontWeight: '300' },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.text },
  placeholder: { width: 40 },
  form: { padding: 20 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: COLORS.text, marginTop: 20, marginBottom: 16 },
  inputGroup: { marginBottom: 20 },
  input: { backgroundColor: COLORS.white, borderWidth: 1, borderColor: COLORS.border, borderRadius: 8, paddingHorizontal: 16, paddingVertical: 12, fontSize: 16, color: COLORS.text },
  textArea: { height: 80, textAlignVertical: 'top' },
  row: { flexDirection: 'row' },
  pickerContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  pickerOption: { backgroundColor: COLORS.white, borderWidth: 1, borderColor: COLORS.border, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, marginRight: 8, marginBottom: 8 },
  pickerOptionActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  pickerOptionText: { fontSize: 14, color: COLORS.text },
  pickerOptionTextActive: { color: COLORS.white, fontWeight: '500' },
  saveButton: { backgroundColor: COLORS.primary, borderRadius: 8, paddingVertical: 16, alignItems: 'center', marginTop: 20 },
  saveButtonDisabled: { opacity: 0.6 },
  saveButtonText: { color: COLORS.white, fontSize: 16, fontWeight: '600' },
});

export default ProductEditScreen;
