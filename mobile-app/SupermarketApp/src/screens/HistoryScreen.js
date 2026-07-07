import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, StyleSheet,
  ActivityIndicator, TouchableOpacity, RefreshControl
} from 'react-native';
import axios from 'axios';

const API_URL = 'http://172.20.10.2:5000';

export default function HistoryScreen() {
  const [history,     setHistory]     = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [refreshing,  setRefreshing]  = useState(false);
  const [error,       setError]       = useState(false);

  useEffect(() => { fetchHistory(); }, []);

  const fetchHistory = async () => {
    try {
      setError(false);
      const response = await axios.get(`${API_URL}/history`);
      setHistory(response.data.history);
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => { setRefreshing(true); fetchHistory(); };

  const avgActual    = history.length
    ? (history.reduce((s, i) => s + i.actual, 0) / history.length).toFixed(2) : '0';
  const avgPredicted = history.length
    ? (history.reduce((s, i) => s + i.predicted, 0) / history.length).toFixed(2) : '0';
  const avgError     = history.length
    ? (history.reduce((s, i) =>
        s + Math.abs(i.actual - i.predicted) / i.actual * 100, 0
      ) / history.length).toFixed(1) : '0';

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#02C39A" />
        <Text style={styles.loadingText}>Loading history...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorIcon}>⚠️</Text>
        <Text style={styles.errorTitle}>Cannot connect to API</Text>
        <Text style={styles.errorSub}>Make sure Flask is running on your computer</Text>
        <TouchableOpacity style={styles.retryBtn} onPress={fetchHistory}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh}
          tintColor="#02C39A" />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>📊 Prediction History</Text>
        <Text style={styles.headerSub}>Actual vs AI-predicted gross income</Text>
      </View>

      {/* Summary stats */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>${avgActual}</Text>
          <Text style={styles.statLabel}>Avg Actual</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>${avgPredicted}</Text>
          <Text style={styles.statLabel}>Avg Predicted</Text>
        </View>
        <View style={[styles.statCard, { borderColor: '#02C39A', borderWidth: 2 }]}>
          <Text style={[styles.statValue, { color: '#02C39A' }]}>{avgError}%</Text>
          <Text style={styles.statLabel}>Avg Error</Text>
        </View>
        <View style={[styles.statCard, { borderColor: '#1E2761', borderWidth: 2 }]}>
          <Text style={[styles.statValue, { color: '#1E2761' }]}>99.4%</Text>
          <Text style={styles.statLabel}>R² Score</Text>
        </View>
      </View>

      {/* What this screen means */}
      <View style={styles.explainCard}>
        <Text style={styles.explainTitle}>📖 What is this?</Text>
        <Text style={styles.explainText}>
          This screen compares what the supermarket actually earned (Actual)
          versus what our XGBoost AI model predicted (Predicted).
          Green error % means highly accurate. Red means larger deviation.
          Pull down to refresh.
        </Text>
      </View>

      {/* History list */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Recent Transactions</Text>

        {/* Column headers */}
        <View style={styles.tableHeader}>
          <Text style={[styles.col, styles.headerCell, { flex: 1.8 }]}>Date</Text>
          <Text style={[styles.col, styles.headerCell]}>Branch</Text>
          <Text style={[styles.col, styles.headerCell]}>Actual</Text>
          <Text style={[styles.col, styles.headerCell]}>Predicted</Text>
          <Text style={[styles.col, styles.headerCell]}>Error</Text>
        </View>

        {history.map((item, idx) => {
          const errPct = Math.abs(
            ((item.actual - item.predicted) / item.actual) * 100
          ).toFixed(1);
          const isAccurate = parseFloat(errPct) < 10;

          return (
            <View key={idx}
              style={[styles.tableRow, idx % 2 === 0 && styles.rowEven]}>
              <Text style={[styles.col, { flex: 1.8, fontSize: 10 }]}>
                {item.date}
              </Text>
              <View style={[styles.col, { alignItems: 'center' }]}>
                <View style={[styles.badge,
                  { backgroundColor:
                      item.branch === 'A' ? '#2196F3'
                    : item.branch === 'B' ? '#FF5722' : '#4CAF50' }]}>
                  <Text style={styles.badgeText}>{item.branch}</Text>
                </View>
              </View>
              <Text style={[styles.col, { fontWeight: '600' }]}>
                ${item.actual.toFixed(1)}
              </Text>
              <Text style={[styles.col, { color: '#1E2761' }]}>
                ${item.predicted.toFixed(1)}
              </Text>
              <Text style={[styles.col,
                { color: isAccurate ? '#02C39A' : '#FF6B6B',
                  fontWeight: 'bold' }]}>
                {errPct}%
              </Text>
            </View>
          );
        })}
      </View>

      {/* Model accuracy explanation */}
      <View style={[styles.card, { marginBottom: 32 }]}>
        <Text style={styles.cardTitle}>🤖 About Our AI Model</Text>
        {[
          ['Algorithm'    , 'XGBoost (Gradient Boosting)'],
          ['Training data', '800 supermarket transactions'],
          ['R² Score'     , '0.994 — explains 99.4% of variance'],
          ['RMSE'         , '~10.55 (avg prediction error in USD)'],
          ['Top predictor', 'Price × Quantity (55.97% importance)'],
        ].map(([k, v], i) => (
          <View key={i} style={[styles.infoRow,
            i % 2 === 0 && { backgroundColor: '#F0F4FF' }]}>
            <Text style={styles.infoKey}>{k}</Text>
            <Text style={styles.infoVal}>{v}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container    : { flex: 1, backgroundColor: '#F4F6FB' },
  centered     : { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  loadingText  : { marginTop: 12, color: '#888', fontSize: 14 },
  errorIcon    : { fontSize: 48, marginBottom: 12 },
  errorTitle   : { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 8 },
  errorSub     : { fontSize: 13, color: '#888', textAlign: 'center', marginBottom: 16 },
  retryBtn     : { backgroundColor: '#02C39A', paddingHorizontal: 24,
                    paddingVertical: 12, borderRadius: 20 },
  retryText    : { color: '#FFF', fontWeight: 'bold' },

  header       : { backgroundColor: '#1E2761', padding: 24, paddingTop: 50 },
  headerTitle  : { fontSize: 24, fontWeight: 'bold', color: '#FFF' },
  headerSub    : { fontSize: 13, color: '#CADCFC', marginTop: 4 },

  statsRow     : { flexDirection: 'row', margin: 16, gap: 6 },
  statCard     : { flex: 1, backgroundColor: '#FFF', borderRadius: 12,
                    padding: 12, alignItems: 'center', elevation: 3 },
  statValue    : { fontSize: 15, fontWeight: 'bold', color: '#1E2761' },
  statLabel    : { fontSize: 9, color: '#888', marginTop: 4, textAlign: 'center' },

  explainCard  : { marginHorizontal: 16, marginBottom: 12, backgroundColor: '#EBF3FB',
                    borderRadius: 12, padding: 14 },
  explainTitle : { fontSize: 14, fontWeight: 'bold', color: '#1E2761', marginBottom: 6 },
  explainText  : { fontSize: 12, color: '#444', lineHeight: 18 },

  card         : { marginHorizontal: 16, marginBottom: 12, backgroundColor: '#FFF',
                    borderRadius: 12, padding: 16, elevation: 4 },
  cardTitle    : { fontSize: 15, fontWeight: 'bold', color: '#1E2761', marginBottom: 12 },

  tableHeader  : { flexDirection: 'row', backgroundColor: '#1E2761',
                    padding: 10, borderRadius: 8, marginBottom: 4 },
  headerCell   : { color: '#FFF', fontWeight: 'bold', fontSize: 11 },
  tableRow     : { flexDirection: 'row', paddingVertical: 10,
                    paddingHorizontal: 4, alignItems: 'center' },
  rowEven      : { backgroundColor: '#F8FAFF', borderRadius: 6 },
  col          : { flex: 1, fontSize: 12, color: '#333', textAlign: 'center' },
  badge        : { width: 24, height: 24, borderRadius: 12,
                    justifyContent: 'center', alignItems: 'center' },
  badgeText    : { color: '#FFF', fontSize: 10, fontWeight: 'bold' },

  infoRow      : { flexDirection: 'row', justifyContent: 'space-between',
                    padding: 10, borderRadius: 6, marginBottom: 2 },
  infoKey      : { fontSize: 12, color: '#555', fontWeight: '600' },
  infoVal      : { fontSize: 12, color: '#1E2761', fontWeight: 'bold',
                    flex: 1, textAlign: 'right' },
});