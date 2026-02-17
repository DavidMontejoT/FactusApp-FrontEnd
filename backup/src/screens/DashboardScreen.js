import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { COLORS } from '../utils/constants';
import api from '../utils/api'; // Importar api configurado con interceptor
import { formatCurrency } from '../utils/formatters';
import MetricCard from '../components/MetricCard';
import InvoiceListItem from '../components/InvoiceListItem';
import StatusBadge from '../components/StatusBadge';

const DashboardScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);
  const [recentInvoices, setRecentInvoices] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch dashboard statistics
      const statsResponse = await api.get('/dashboard/stats');

      // Fetch recent invoices
      const invoicesResponse = await api.get('/dashboard/recent-invoices?limit=5');

      setDashboardData(statsResponse.data);
      setRecentInvoices(invoicesResponse.data);
    } catch (error) {
      console.error('Error fetching dashboard:', error);
      // Si hay error de autenticación, dejar que el interceptor lo maneje
      // No hacer nada aquí - el interceptor en api.js maneja el refresh
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchDashboardData();
    setRefreshing(false);
  };

  const navigateToInvoice = (invoiceId) => {
    navigation.navigate('InvoiceDetail', { invoiceId });
  };

  const navigateToCreateInvoice = () => {
    navigation.navigate('CreateInvoice');
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Dashboard</Text>
        <TouchableOpacity
          style={styles.notificationButton}
          onPress={() => navigation.navigate('Notifications')}
        >
          <Text style={styles.notificationIcon}>🔔</Text>
        </TouchableOpacity>
      </View>

      {/* Metrics Row - 4 tarjetas en grid 2x2 como en el diseño original */}
      <View style={styles.metricsRow}>
        <View style={styles.metricCardWrapper}>
          <MetricCard
            title="Ventas"
            value={dashboardData?.totalSales || 0}
            change={`${dashboardData?.salesChange || 0}%`}
            isPositive={(dashboardData?.salesChange || 0) >= 0}
          />
        </View>
        <View style={styles.metricCardWrapper}>
          <MetricCard
            title="Facturas"
            value={dashboardData?.invoiceCount || 0}
            change={`${dashboardData?.invoicesRemaining || 0} restantes`}
            isPositive={true}
          />
        </View>
        <View style={styles.metricCardWrapper}>
          <MetricCard
            title="Productos"
            value={dashboardData?.productCount || 0}
            change="Inventario"
            isPositive={true}
          />
        </View>
        <View style={styles.metricCardWrapper}>
          <MetricCard
            title="Clientes"
            value={dashboardData?.clientCount || 0}
            change="Total"
            isPositive={true}
          />
        </View>
      </View>

      {/* Create Invoice Button */}
      <TouchableOpacity
        style={styles.createButton}
        onPress={navigateToCreateInvoice}
      >
        <Text style={styles.createButtonText}>+ Nueva Factura</Text>
      </TouchableOpacity>

      {/* Chart Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Ventas del Mes</Text>
        <View style={styles.chartCard}>
          <Text style={styles.chartPlaceholder}>
            📊 Gráfico de ventas
          </Text>
          <Text style={styles.chartSubtext}>
            $45,280,000 COP en ventas este mes
          </Text>
        </View>
      </View>

      {/* Recent Invoices */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Facturas Recientes</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Invoices')}>
            <Text style={styles.viewAllText}>Ver todas</Text>
          </TouchableOpacity>
        </View>

        {recentInvoices.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No hay facturas aún</Text>
            <TouchableOpacity
              style={styles.createButton}
              onPress={navigateToCreateInvoice}
            >
              <Text style={styles.createButtonText}>Crear primera factura</Text>
            </TouchableOpacity>
          </View>
        ) : (
          recentInvoices.map((invoice) => (
            <InvoiceListItem
              key={invoice.id}
              invoice={invoice}
              onPress={() => navigateToInvoice(invoice.id)}
            />
          ))
        )}
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
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  notificationIcon: {
    fontSize: 20,
  },
  metricsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  metricCardWrapper: {
    width: '48%',
    marginBottom: 12,
  },
  createButton: {
    backgroundColor: COLORS.primary,
    marginHorizontal: 20,
    marginBottom: 24,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  createButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
  },
  viewAllText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '500',
  },
  chartCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 24,
    marginHorizontal: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 200,
  },
  chartPlaceholder: {
    fontSize: 48,
    marginBottom: 8,
  },
  chartSubtext: {
    fontSize: 14,
    color: COLORS.textLight,
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
  },
  emptyStateText: {
    fontSize: 16,
    color: COLORS.textLight,
    marginBottom: 16,
  },
});

export default DashboardScreen;
