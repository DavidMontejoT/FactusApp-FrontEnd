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
import { COLORS, DOCUMENT_TYPES, UNIT_MEASURES, PRODUCT_CATEGORIES } from '../utils/constants';
import api from '../utils/api';

const ClientEditScreen = ({ route, navigation }) => {
  const { clientId } = route.params;
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [identificationType, setIdentificationType] = useState('NIT');
  const [identificationNumber, setIdentificationNumber] = useState('');
  const [clientType, setClientType] = useState('INDIVIDUAL');

  useEffect(() => {
    fetchClient();
  }, []);

  const fetchClient = async () => {
    try {
      const response = await api.get(`/clients/${clientId}`);
      const client = response.data;

      setName(client.name || '');
      setEmail(client.email || '');
      setPhone(client.phone || '');
      setAddress(client.address || '');
      setIdentificationType(client.identificationType || 'NIT');
      setIdentificationNumber(client.identificationNumber || '');
      setClientType(client.type || 'INDIVIDUAL');
    } catch (error) {
      console.error('Error fetching client:', error);
      Alert.alert('Error', 'No se pudo cargar el cliente');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateClient = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'El nombre es obligatorio');
      return;
    }

    if (!email.trim()) {
      Alert.alert('Error', 'El email es obligatorio');
      return;
    }

    if (!identificationNumber.trim()) {
      Alert.alert('Error', 'El número de identificación es obligatorio');
      return;
    }

    setSaving(true);

    try {
      const clientData = {
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim() || null,
        address: address.trim() || null,
        identificationType,
        identificationNumber: identificationNumber.trim(),
        type: clientType,
      };

      await api.put(`/clients/${clientId}`, clientData);

      Alert.alert('Éxito', 'Cliente actualizado correctamente');
      navigation.goBack();
    } catch (error) {
      console.error('Error updating client:', error);
      const message = error.response?.data?.message || 'No se pudo actualizar el cliente';
      Alert.alert('Error', message);
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
          <Text style={styles.headerTitle}>Editar Cliente</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Form */}
        <View style={styles.form}>
          {/* Información Básica */}
          <Text style={styles.sectionTitle}>Información Básica</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Tipo de Persona *</Text>
            <View style={styles.typeButtons}>
              <TouchableOpacity
                style={[
                  styles.typeButton,
                  clientType === 'INDIVIDUAL' && styles.typeButtonActive,
                ]}
                onPress={() => setClientType('INDIVIDUAL')}
              >
                <Text
                  style={[
                    styles.typeButtonText,
                    clientType === 'INDIVIDUAL' && styles.typeButtonTextActive,
                  ]}
                >
                  Persona Natural
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.typeButton,
                  clientType === 'COMPANY' && styles.typeButtonActive,
                ]}
                onPress={() => setClientType('COMPANY')}
              >
                <Text
                  style={[
                    styles.typeButtonText,
                    clientType === 'COMPANY' && styles.typeButtonTextActive,
                  ]}
                >
                  Persona Jurídica
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nombre Completo *</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email *</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          {/* Identificación */}
          <Text style={styles.sectionTitle}>Identificación</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Tipo de Documento *</Text>
            <View style={styles.pickerContainer}>
              {DOCUMENT_TYPES.map((doc) => (
                <TouchableOpacity
                  key={doc.value}
                  style={[
                    styles.pickerOption,
                    identificationType === doc.value && styles.pickerOptionActive,
                  ]}
                  onPress={() => setIdentificationType(doc.value)}
                >
                  <Text
                    style={[
                      styles.pickerOptionText,
                      identificationType === doc.value && styles.pickerOptionTextActive,
                    ]}
                  >
                    {doc.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Número de Documento *</Text>
            <TextInput
              style={styles.input}
              value={identificationNumber}
              onChangeText={setIdentificationNumber}
              keyboardType="number-pad"
            />
          </View>

          {/* Contacto */}
          <Text style={styles.sectionTitle}>Contacto</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Teléfono</Text>
            <TextInput
              style={styles.input}
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Dirección</Text>
            <TextInput
              style={styles.input}
              value={address}
              onChangeText={setAddress}
            />
          </View>

          {/* Botón Guardar */}
          <TouchableOpacity
            style={[styles.saveButton, saving && styles.saveButtonDisabled]}
            onPress={handleUpdateClient}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator color={COLORS.white} />
            ) : (
              <Text style={styles.saveButtonText}>Guardar Cambios</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bgLight,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backButton: {
    fontSize: 28,
    color: COLORS.text,
    fontWeight: '300',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  placeholder: {
    width: 40,
  },
  form: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    marginTop: 20,
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: COLORS.text,
  },
  typeButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  typeButton: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  typeButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  typeButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.text,
  },
  typeButtonTextActive: {
    color: COLORS.white,
  },
  pickerContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  pickerOption: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginRight: 8,
    marginBottom: 8,
  },
  pickerOptionActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  pickerOptionText: {
    fontSize: 14,
    color: COLORS.text,
  },
  pickerOptionTextActive: {
    color: COLORS.white,
    fontWeight: '500',
  },
  saveButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ClientEditScreen;
