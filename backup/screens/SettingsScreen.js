import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { COLORS } from '../utils/constants';
import { useAuth } from '../context/AuthContext';

const SettingsScreen = ({ navigation }) => {
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleLogout = () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro de que quieres cerrar tu sesión?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Cerrar Sesión',
          style: 'destructive',
          onPress: async () => {
            setLoading(true);
            try {
              await logout();
              navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
              });
            } catch (error) {
              console.error('Error during logout:', error);
              Alert.alert('Error', 'No se pudo cerrar la sesión');
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  const getPlanInfo = (plan) => {
    const plans = {
      FREE: {
        name: 'Plan Gratuito',
        price: '$0 COP/mes',
        color: '#6B7280',
        features: ['15 facturas/mes', '20 productos', '30 clientes'],
      },
      BASIC: {
        name: 'Plan Basic',
        price: '$45.000 COP/mes',
        color: '#3B82F6',
        features: ['50 facturas/mes', '100 productos', '200 clientes', 'Integración DIAN'],
      },
      FULL: {
        name: 'Plan Full',
        price: '$99.000 COP/mes',
        color: '#10B981',
        features: ['Facturas ilimitadas', 'Productos ilimitados', 'Clientes ilimitados', 'Integración DIAN', 'Reportes avanzados'],
      },
    };
    return plans[plan] || plans.FREE;
  };

  const planInfo = user ? getPlanInfo(user.plan) : getPlanInfo('FREE');

  const handleUpgrade = () => {
    // TODO: Implementar pantalla de upgrade de plan
    Alert.alert('Próximamente', 'La funcionalidad de upgrade de plan estará disponible pronto');
  };

  const navigateToProfile = () => {
    Alert.alert('Próximamente', 'La edición de perfil estará disponible pronto');
  };

  const navigateToCompany = () => {
    Alert.alert('Próximamente', 'La configuración de la empresa estará disponible pronto');
  };

  const navigateToNotifications = () => {
    Alert.alert('Próximamente', 'La configuración de notificaciones estará disponible pronto');
  };

  const navigateToSecurity = () => {
    Alert.alert('Próximamente', 'La configuración de seguridad estará disponible pronto');
  };

  if (!user) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header con info del usuario */}
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>
            {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </Text>
        </View>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{user.name || 'Usuario'}</Text>
          <Text style={styles.userEmail}>{user.email}</Text>
        </View>
      </View>

      {/* Plan actual */}
      <View style={[styles.planCard, { borderLeftColor: planInfo.color }]}>
        <View style={styles.planHeader}>
          <Text style={styles.planTitle}>Plan Actual</Text>
          <View style={[styles.planBadge, { backgroundColor: planInfo.color + '20' }]}>
            <Text style={[styles.planBadgeText, { color: planInfo.color }]}>
              {user.plan || 'FREE'}
            </Text>
          </View>
        </View>
        <Text style={styles.planName}>{planInfo.name}</Text>
        <Text style={styles.planPrice}>{planInfo.price}</Text>
        {user.plan !== 'FULL' && (
          <TouchableOpacity style={styles.upgradeButton} onPress={handleUpgrade}>
            <Text style={styles.upgradeButtonText}>Hacer Upgrade →</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Sección: Cuenta */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>CUENTA</Text>

        <TouchableOpacity style={styles.settingItem} onPress={navigateToProfile}>
          <View style={styles.settingLeft}>
            <Text style={styles.settingIcon}>👤</Text>
            <Text style={styles.settingLabel}>Perfil</Text>
          </View>
          <Text style={styles.settingArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem} onPress={navigateToCompany}>
          <View style={styles.settingLeft}>
            <Text style={styles.settingIcon}>🏢</Text>
            <Text style={styles.settingLabel}>Información de la Empresa</Text>
          </View>
          <Text style={styles.settingArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem} onPress={navigateToSecurity}>
          <View style={styles.settingLeft}>
            <Text style={styles.settingIcon}>🔒</Text>
            <Text style={styles.settingLabel}>Seguridad</Text>
          </View>
          <Text style={styles.settingArrow}>›</Text>
        </TouchableOpacity>
      </View>

      {/* Sección: Preferencias */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>PREFERENCIAS</Text>

        <TouchableOpacity style={styles.settingItem} onPress={navigateToNotifications}>
          <View style={styles.settingLeft}>
            <Text style={styles.settingIcon}>🔔</Text>
            <Text style={styles.settingLabel}>Notificaciones</Text>
          </View>
          <Text style={styles.settingArrow}>›</Text>
        </TouchableOpacity>
      </View>

      {/* Sección: Info */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>INFORMACIÓN</Text>

        <TouchableOpacity style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <Text style={styles.settingIcon}>📄</Text>
            <Text style={styles.settingLabel}>Términos y Condiciones</Text>
          </View>
          <Text style={styles.settingArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <Text style={styles.settingIcon}>🔐</Text>
            <Text style={styles.settingLabel}>Política de Privacidad</Text>
          </View>
          <Text style={styles.settingArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <Text style={styles.settingIcon}>ℹ️</Text>
            <Text style={styles.settingLabel}>Acerca de</Text>
          </View>
          <Text style={styles.settingValue}>v1.0.0</Text>
        </TouchableOpacity>
      </View>

      {/* Botón de logout */}
      <TouchableOpacity
        style={[styles.logoutButton, loading && styles.logoutButtonDisabled]}
        onPress={handleLogout}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color={COLORS.danger} />
        ) : (
          <>
            <Text style={styles.logoutIcon}>🚪</Text>
            <Text style={styles.logoutText}>Cerrar Sesión</Text>
          </>
        )}
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={styles.footerText}>FactusApp v1.0.0</Text>
        <Text style={styles.footerText}>© 2024 FactusApp</Text>
      </View>
    </ScrollView>
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
    backgroundColor: COLORS.bgLight,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: COLORS.textLight,
  },
  planCard: {
    backgroundColor: COLORS.white,
    margin: 20,
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderLeftWidth: 4,
    borderColor: COLORS.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  planTitle: {
    fontSize: 12,
    color: COLORS.textLight,
    fontWeight: '500',
  },
  planBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  planBadgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  planName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  planPrice: {
    fontSize: 16,
    color: COLORS.textLight,
    marginBottom: 16,
  },
  upgradeButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  upgradeButtonText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '600',
  },
  section: {
    backgroundColor: COLORS.white,
    marginTop: 20,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: COLORS.border,
  },
  sectionTitle: {
    fontSize: 12,
    color: COLORS.textLight,
    fontWeight: '600',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  settingLabel: {
    fontSize: 15,
    color: COLORS.text,
  },
  settingArrow: {
    fontSize: 24,
    color: COLORS.textLight,
    fontWeight: '300',
  },
  settingValue: {
    fontSize: 14,
    color: COLORS.textLight,
  },
  logoutButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 20,
    paddingVertical: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.danger,
  },
  logoutButtonDisabled: {
    opacity: 0.6,
  },
  logoutIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  logoutText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.danger,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  footerText: {
    fontSize: 12,
    color: COLORS.textLight,
    marginBottom: 4,
  },
});

export default SettingsScreen;
