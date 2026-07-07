import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

export default function ResultScreen({ route, navigation }) {
  const { prediction, inputs } = route.params || {};

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Prediction Result</Text>
      </View>

      <View style={styles.resultCard}>
        <Text style={styles.resultLabel}>Predicted Gross Income</Text>
        <Text style={styles.resultValue}>${prediction?.toFixed(2) || '0.00'}</Text>
        <Text style={styles.resultSub}>USD</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Input Summary</Text>
        {inputs && Object.entries(inputs).map(([key, val], i) => (
          <View key={i} style={styles.row}>
            <Text style={styles.rowKey}>{key}</Text>
            <Text style={styles.rowVal}>{val}</Text>
          </View>
        ))}
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Predict')}
      >
        <Text style={styles.buttonText}>← New Prediction</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container  : { flex: 1, backgroundColor: '#F4F6FB' },
  header     : { backgroundColor: '#1E2761', padding: 24, paddingTop: 40 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#FFFFFF' },
  resultCard : { margin: 16, backgroundColor: '#02C39A', borderRadius: 16,
                  padding: 32, alignItems: 'center' },
  resultLabel: { color: '#FFFFFF', fontSize: 14, opacity: 0.9 },
  resultValue: { color: '#FFFFFF', fontSize: 48, fontWeight: 'bold', marginVertical: 8 },
  resultSub  : { color: '#FFFFFF', fontSize: 14, opacity: 0.8 },
  card       : { marginHorizontal: 16, backgroundColor: '#FFFFFF',
                  borderRadius: 12, padding: 16, elevation: 4 },
  cardTitle  : { fontSize: 16, fontWeight: 'bold', color: '#1E2761', marginBottom: 12 },
  row        : { flexDirection: 'row', justifyContent: 'space-between',
                  paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#F0F4FF' },
  rowKey     : { fontSize: 14, color: '#555', textTransform: 'capitalize' },
  rowVal     : { fontSize: 14, fontWeight: 'bold', color: '#1E2761' },
  button     : { margin: 16, backgroundColor: '#1E2761', padding: 16,
                  borderRadius: 12, alignItems: 'center' },
  buttonText : { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
});