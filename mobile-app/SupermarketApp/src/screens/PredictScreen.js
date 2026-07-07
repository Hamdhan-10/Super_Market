import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, Alert, ActivityIndicator, TextInput,
  KeyboardAvoidingView, Platform
} from 'react-native';
import axios from 'axios';

const API_URL = 'http://172.20.10.2:5000';

const BRANCHES = ['A', 'B', 'C'];
const BRANCH_CITIES = { 'A': 'Yangon', 'B': 'Mandalay', 'C': 'Naypyitaw' };

const PRODUCT_LINES = [
  'Health and beauty',
  'Electronic accessories',
  'Food and beverages',
  'Fashion accessories',
  'Home and lifestyle',
  'Sports and travel'
];

const PRODUCT_ICONS = {
  'Health and beauty'     : '💊',
  'Electronic accessories': '💻',
  'Food and beverages'    : '🍔',
  'Fashion accessories'   : '👗',
  'Home and lifestyle'    : '🏠',
  'Sports and travel'     : '⚽'
};

const PAYMENTS       = ['Ewallet', 'Cash', 'Credit card'];
const PAYMENT_ICONS  = { 'Ewallet': '📱', 'Cash': '💵', 'Credit card': '💳' };
const GENDERS        = ['Female', 'Male'];
const CUSTOMER_TYPES = ['Normal', 'Member'];

export default function PredictScreen() {
  const [branch,       setBranch]       = useState('A');
  const [productLine,  setProductLine]  = useState('Health and beauty');
  const [payment,      setPayment]      = useState('Ewallet');
  const [gender,       setGender]       = useState('Female');
  const [customerType, setCustomerType] = useState('Normal');
  const [unitPrice,    setUnitPrice]    = useState('50');
  const [quantity,     setQuantity]     = useState('5');
  const [hour,         setHour]         = useState('14');
  const [loading,      setLoading]      = useState(false);
  const [result,       setResult]       = useState(null);
  const [error,        setError]        = useState('');

  // Calculate estimated total for preview
  const estimatedTotal = (parseFloat(unitPrice || 0) * parseInt(quantity || 0) * 1.05).toFixed(2);

  const handlePredict = async () => {
    // Validation
    if (!unitPrice || parseFloat(unitPrice) <= 0) {
      setError('Please enter a valid unit price'); return;
    }
    if (!quantity || parseInt(quantity) <= 0) {
      setError('Please enter a valid quantity'); return;
    }
    if (!hour || parseInt(hour) < 10 || parseInt(hour) > 20) {
      setError('Hour must be between 10 and 20'); return;
    }
    setError('');
    setResult(null);
    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/predict`, {
        branch,
        product_line : productLine,
        payment,
        gender,
        customer_type: customerType,
        unit_price   : parseFloat(unitPrice),
        quantity     : parseInt(quantity),
        hour         : parseInt(hour),
        rating       : 7.0,
        is_weekend   : 0,
        day_num      : 2,
        month_num    : 6,
      });

      setResult(response.data.predicted_gross_income);

    } catch (err) {
      Alert.alert(
        '⚠️ Connection Error',
        'Cannot reach the AI server.\nMake sure Flask API is running.',
        [{ text: 'OK' }]
      );
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setError('');
    setUnitPrice('50');
    setQuantity('5');
    setHour('14');
  };

  const SelectorRow = ({ label, options, selected, onSelect, icons }) => (
    <View style={styles.selectorContainer}>
      <Text style={styles.label}>{label}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {options.map(opt => (
          <TouchableOpacity
            key={opt}
            style={[styles.chip, selected === opt && styles.chipSelected]}
            onPress={() => onSelect(opt)}
          >
            <Text style={[styles.chipText, selected === opt && styles.chipTextSelected]}>
              {icons ? icons[opt] + ' ' : ''}{opt}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>🔮 Sales Predictor</Text>
          <Text style={styles.headerSub}>
            AI-powered gross income forecasting
          </Text>
        </View>

        {/* Result Card — shows after prediction */}
        {result !== null && (
          <View style={styles.resultCard}>
            <Text style={styles.resultLabel}>✅ Predicted Gross Income</Text>
            <Text style={styles.resultValue}>${result.toFixed(2)}</Text>
            <Text style={styles.resultSub}>
              Branch {branch} · {productLine}
            </Text>
            <Text style={styles.resultSub}>
              {quantity} items × ${unitPrice} = ${estimatedTotal} total
            </Text>
            <TouchableOpacity style={styles.resetBtn} onPress={handleReset}>
              <Text style={styles.resetBtnText}>← New Prediction</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Input Form */}
        {result === null && (
          <View style={styles.card}>

            {/* Branch selector */}
            <Text style={styles.label}>🏪 Branch</Text>
            <View style={styles.branchRow}>
              {BRANCHES.map(b => (
                <TouchableOpacity
                  key={b}
                  style={[styles.branchBtn, branch === b && styles.branchBtnSelected]}
                  onPress={() => setBranch(b)}
                >
                  <Text style={[styles.branchBtnText, branch === b && { color: '#FFF' }]}>
                    {b}
                  </Text>
                  <Text style={[styles.branchCity, branch === b && { color: '#CADCFC' }]}>
                    {BRANCH_CITIES[b]}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <SelectorRow
              label="🛍️ Product Line"
              options={PRODUCT_LINES}
              selected={productLine}
              onSelect={setProductLine}
              icons={PRODUCT_ICONS}
            />

            <SelectorRow
              label="💳 Payment Method"
              options={PAYMENTS}
              selected={payment}
              onSelect={setPayment}
              icons={PAYMENT_ICONS}
            />

            <View style={styles.rowInputs}>
              <View style={styles.rowInputs}>
                <TouchableOpacity
                  style={[styles.genderBtn, gender === 'Female' && styles.genderSelected]}
                  onPress={() => setGender('Female')}
                >
                  <Text style={styles.genderText}>👩 Female</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.genderBtn, gender === 'Male' && styles.genderSelected]}
                  onPress={() => setGender('Male')}
                >
                  <Text style={styles.genderText}>👨 Male</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.rowInputs}>
                <TouchableOpacity
                  style={[styles.genderBtn, customerType === 'Normal' && styles.genderSelected]}
                  onPress={() => setCustomerType('Normal')}
                >
                  <Text style={styles.genderText}>Normal</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.genderBtn, customerType === 'Member' && styles.genderSelected]}
                  onPress={() => setCustomerType('Member')}
                >
                  <Text style={styles.genderText}>⭐ Member</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Numeric inputs */}
            <View style={styles.numericRow}>
              <View style={styles.numericField}>
                <Text style={styles.label}>💰 Unit Price</Text>
                <TextInput
                  style={styles.input}
                  value={unitPrice}
                  onChangeText={setUnitPrice}
                  keyboardType="numeric"
                  placeholder="50.00"
                  placeholderTextColor="#AAA"
                />
              </View>
              <View style={styles.numericField}>
                <Text style={styles.label}>📦 Quantity</Text>
                <TextInput
                  style={styles.input}
                  value={quantity}
                  onChangeText={setQuantity}
                  keyboardType="numeric"
                  placeholder="5"
                  placeholderTextColor="#AAA"
                />
              </View>
              <View style={styles.numericField}>
                <Text style={styles.label}>🕐 Hour</Text>
                <TextInput
                  style={styles.input}
                  value={hour}
                  onChangeText={setHour}
                  keyboardType="numeric"
                  placeholder="14"
                  placeholderTextColor="#AAA"
                />
              </View>
            </View>

            {/* Live preview */}
            <View style={styles.previewBox}>
              <Text style={styles.previewText}>
                💡 Estimated Total: ${estimatedTotal} (inc. 5% tax)
              </Text>
            </View>

            {/* Error message */}
            {error !== '' && (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>⚠️ {error}</Text>
              </View>
            )}

            {/* Predict button */}
            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handlePredict}
              disabled={loading}
            >
              {loading ? (
                <View style={styles.loadingRow}>
                  <ActivityIndicator color="#FFF" size="small" />
                  <Text style={styles.buttonText}>  🤖 AI is calculating...</Text>
                </View>
              ) : (
                <Text style={styles.buttonText}>🔮 Predict Gross Income</Text>
              )}
            </TouchableOpacity>

          </View>
        )}

        {/* How it works section */}
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>ℹ️ How it works</Text>
          <Text style={styles.infoText}>
            1. Select your branch, product line and payment method{'\n'}
            2. Enter unit price, quantity and hour of sale{'\n'}
            3. Tap Predict — our XGBoost AI model (R²=99.4%) calculates{'\n'}
               the expected gross income instantly
          </Text>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container        : { flex: 1, backgroundColor: '#F4F6FB' },
  header           : { backgroundColor: '#1E2761', padding: 24, paddingTop: 50 },
  headerTitle      : { fontSize: 26, fontWeight: 'bold', color: '#FFFFFF' },
  headerSub        : { fontSize: 13, color: '#CADCFC', marginTop: 4 },

  resultCard       : { margin: 16, backgroundColor: '#02C39A', borderRadius: 16,
                        padding: 24, alignItems: 'center', elevation: 6 },
  resultLabel      : { color: '#FFF', fontSize: 14, opacity: 0.9, marginBottom: 8 },
  resultValue      : { color: '#FFF', fontSize: 52, fontWeight: 'bold' },
  resultSub        : { color: '#FFF', fontSize: 12, opacity: 0.85, marginTop: 4 },
  resetBtn         : { marginTop: 16, backgroundColor: 'rgba(255,255,255,0.25)',
                        paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20 },
  resetBtnText     : { color: '#FFF', fontWeight: 'bold' },

  card             : { margin: 16, backgroundColor: '#FFF', borderRadius: 16,
                        padding: 16, elevation: 4 },
  label            : { fontSize: 13, fontWeight: '700', color: '#1E2761', marginBottom: 8 },

  branchRow        : { flexDirection: 'row', gap: 8, marginBottom: 16 },
  branchBtn        : { flex: 1, borderWidth: 2, borderColor: '#CADCFC', borderRadius: 12,
                        padding: 12, alignItems: 'center', backgroundColor: '#F0F4FF' },
  branchBtnSelected: { backgroundColor: '#1E2761', borderColor: '#1E2761' },
  branchBtnText    : { fontSize: 20, fontWeight: 'bold', color: '#1E2761' },
  branchCity       : { fontSize: 10, color: '#666', marginTop: 2 },

  selectorContainer: { marginBottom: 16 },
  chip             : { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20,
                        backgroundColor: '#F0F4FF', marginRight: 8, borderWidth: 1,
                        borderColor: '#CADCFC' },
  chipSelected     : { backgroundColor: '#1E2761', borderColor: '#1E2761' },
  chipText         : { fontSize: 12, color: '#1E2761' },
  chipTextSelected : { color: '#FFF', fontWeight: '600' },

  rowInputs        : { flexDirection: 'row', gap: 8, marginBottom: 8 },
  genderBtn        : { flex: 1, padding: 10, borderRadius: 10, borderWidth: 1,
                        borderColor: '#CADCFC', alignItems: 'center',
                        backgroundColor: '#F0F4FF' },
  genderSelected   : { backgroundColor: '#1E2761', borderColor: '#1E2761' },
  genderText       : { fontSize: 12, color: '#1E2761', fontWeight: '600' },

  numericRow       : { flexDirection: 'row', gap: 8, marginTop: 8 },
  numericField     : { flex: 1 },
  input            : { borderWidth: 1, borderColor: '#CADCFC', borderRadius: 10,
                        padding: 12, fontSize: 16, color: '#1E2761',
                        backgroundColor: '#F8FAFF', textAlign: 'center' },

  previewBox       : { backgroundColor: '#EBF3FB', borderRadius: 10,
                        padding: 12, marginTop: 12, alignItems: 'center' },
  previewText      : { color: '#1E2761', fontSize: 13, fontWeight: '600' },

  errorBox         : { backgroundColor: '#FFE5E5', borderRadius: 10,
                        padding: 12, marginTop: 8 },
  errorText        : { color: '#CC0000', fontSize: 13, textAlign: 'center' },

  button           : { backgroundColor: '#02C39A', padding: 18, borderRadius: 14,
                        alignItems: 'center', marginTop: 16 },
  buttonDisabled   : { backgroundColor: '#888' },
  buttonText       : { color: '#FFF', fontSize: 17, fontWeight: 'bold' },
  loadingRow       : { flexDirection: 'row', alignItems: 'center' },

  infoCard         : { marginHorizontal: 16, backgroundColor: '#FFF',
                        borderRadius: 12, padding: 16, elevation: 2 },
  infoTitle        : { fontSize: 14, fontWeight: 'bold', color: '#1E2761', marginBottom: 8 },
  infoText         : { fontSize: 12, color: '#555', lineHeight: 20 },
});