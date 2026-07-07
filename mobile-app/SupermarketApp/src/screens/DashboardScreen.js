import React, { useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet,
  TouchableOpacity, Dimensions
} from 'react-native';

const { width } = Dimensions.get('window');

const BRANCH_DATA = [
  { branch: 'A', city: 'Yangon',    income: 17651, transactions: 340,
    avgQty: 6.26, color: '#2196F3' },
  { branch: 'B', city: 'Mandalay',  income: 60579, transactions: 332,
    avgQty: 8.75, color: '#FF5722' },
  { branch: 'C', city: 'Naypyitaw', income: 36557, transactions: 328,
    avgQty: 7.47, color: '#4CAF50' },
];

const PRODUCT_DATA = [
  { name: 'Health & Beauty',    income: 32150, pct: 100, color: '#FF6B6B' },
  { name: 'Sports & Travel',    income: 24800, pct: 77,  color: '#4ECDC4' },
  { name: 'Fashion Access.',    income: 22300, pct: 69,  color: '#45B7D1' },
  { name: 'Home & Lifestyle',   income: 11200, pct: 35,  color: '#96CEB4' },
  { name: 'Food & Beverages',   income: 10800, pct: 34,  color: '#FFEAA7' },
  { name: 'Electronic Access.', income: 9500,  pct: 30,  color: '#DDA0DD' },
];

const INSIGHTS = [
  { icon: '🏆', text: 'Branch B (Mandalay) earns 3.4× more than Branch A' },
  { icon: '📦', text: 'Branch B customers buy avg 8.75 items vs A\'s 6.26' },
  { icon: '💊', text: 'Health & Beauty is the top-earning product line' },
  { icon: '🕐', text: 'Peak sales hours: 2 PM and 7 PM' },
  { icon: '📅', text: 'December has highest monthly gross income' },
  { icon: '🤖', text: 'Price × Quantity is the #1 AI predictor (55.97%)' },
];

export default function DashboardScreen() {
  const [activeTab, setActiveTab] = useState('branches');
  const maxBranchIncome = Math.max(...BRANCH_DATA.map(b => b.income));

  return (
    <ScrollView style={styles.container}>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>📈 Sales Dashboard</Text>
        <Text style={styles.headerSub}>
          AI insights — Supermarket Sales 2019
        </Text>
      </View>

      {/* KPI Cards */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}
        style={styles.kpiScroll} contentContainerStyle={{ paddingHorizontal: 16 }}>
        {[
          { label: 'Total Income',    value: '$114K',  icon: '💰', color: '#1E2761' },
          { label: 'Transactions',    value: '1,000',  icon: '🧾', color: '#FF5722' },
          { label: 'AI Accuracy',     value: '99.4%',  icon: '🤖', color: '#02C39A' },
          { label: 'Branches',        value: '3',      icon: '🏪', color: '#2196F3' },
          { label: 'Product Lines',   value: '6',      icon: '🛍️', color: '#9C27B0' },
          { label: 'Avg Income/Sale', value: '$114',   icon: '📊', color: '#FF6B6B' },
        ].map((k, i) => (
          <View key={i} style={[styles.kpiCard, { borderTopColor: k.color }]}>
            <Text style={styles.kpiIcon}>{k.icon}</Text>
            <Text style={[styles.kpiValue, { color: k.color }]}>{k.value}</Text>
            <Text style={styles.kpiLabel}>{k.label}</Text>
          </View>
        ))}
      </ScrollView>

      {/* Tab selector */}
      <View style={styles.tabRow}>
        {['branches', 'products', 'insights', 'model'].map(tab => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.tabActive]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
              {tab === 'branches' ? '🏪 Branches'
               : tab === 'products' ? '🛍️ Products'
               : tab === 'insights' ? '💡 Insights'
               : '🤖 Model'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* BRANCHES TAB */}
      {activeTab === 'branches' && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Branch Performance Comparison</Text>
          <Text style={styles.cardSub}>
            Why does Branch B earn so much more? Tap to find out.
          </Text>
          {BRANCH_DATA.map(b => (
            <View key={b.branch} style={styles.branchCard}>
              <View style={styles.branchHeader}>
                <View style={[styles.branchBadge, { backgroundColor: b.color }]}>
                  <Text style={styles.branchBadgeText}>{b.branch}</Text>
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.branchName}>Branch {b.branch} — {b.city}</Text>
                  <Text style={styles.branchIncome}>
                    ${b.income.toLocaleString()} total income
                  </Text>
                </View>
              </View>

              {/* Income bar */}
              <Text style={styles.barLabel}>Income</Text>
              <View style={styles.barBg}>
                <View style={[styles.barFill, {
                  width: `${(b.income / maxBranchIncome) * 100}%`,
                  backgroundColor: b.color
                }]} />
              </View>

              {/* Stats row */}
              <View style={styles.branchStats}>
                <View style={styles.statPill}>
                  <Text style={styles.statPillVal}>{b.transactions}</Text>
                  <Text style={styles.statPillLabel}>Transactions</Text>
                </View>
                <View style={styles.statPill}>
                  <Text style={styles.statPillVal}>{b.avgQty}</Text>
                  <Text style={styles.statPillLabel}>Avg Qty</Text>
                </View>
                <View style={styles.statPill}>
                  <Text style={styles.statPillVal}>
                    ${(b.income / b.transactions).toFixed(0)}
                  </Text>
                  <Text style={styles.statPillLabel}>Avg/Sale</Text>
                </View>
              </View>
            </View>
          ))}

          <View style={styles.findingBox}>
            <Text style={styles.findingText}>
              🔍 Key Finding: Branch B earns more because customers buy
              8.75 items per visit (vs A's 6.26). Unit prices are almost
              identical across branches — so quantity drives income.
            </Text>
          </View>
        </View>
      )}

      {/* PRODUCTS TAB */}
      {activeTab === 'products' && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Product Line Performance</Text>
          <Text style={styles.cardSub}>Total gross income by category</Text>
          {PRODUCT_DATA.map((p, i) => (
            <View key={i} style={styles.productRow}>
              <Text style={styles.productName}>{p.name}</Text>
              <View style={styles.productBarBg}>
                <View style={[styles.productBar,
                  { width: `${p.pct}%`, backgroundColor: p.color }]} />
              </View>
              <Text style={styles.productVal}>
                ${(p.income / 1000).toFixed(1)}K
              </Text>
            </View>
          ))}
          <View style={styles.findingBox}>
            <Text style={styles.findingText}>
              🔍 Health & Beauty leads at $32K. Electronic Accessories
              earns least at $9.5K — 3.4× difference between top and bottom.
            </Text>
          </View>
        </View>
      )}

      {/* INSIGHTS TAB */}
      {activeTab === 'insights' && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Key Business Insights</Text>
          <Text style={styles.cardSub}>
            Discovered through AI-powered data analysis
          </Text>
          {INSIGHTS.map((ins, i) => (
            <View key={i} style={styles.insightRow}>
              <Text style={styles.insightIcon}>{ins.icon}</Text>
              <Text style={styles.insightText}>{ins.text}</Text>
            </View>
          ))}
        </View>
      )}

      {/* MODEL TAB */}
      {activeTab === 'model' && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>🤖 AI Model Information</Text>
          <Text style={styles.cardSub}>
            XGBoost model trained on supermarket transaction data
          </Text>
          {[
            ['Algorithm'     , 'XGBoost (Gradient Boosting)'],
            ['Training rows' , '800 transactions'],
            ['Test rows'     , '200 transactions'],
            ['RMSE'          , '~10.55 USD'],
            ['MAE'           , '~6.86 USD'],
            ['R² Score'      , '0.994 (99.4% accuracy)'],
            ['Top feature'   , 'Price × Quantity (55.97%)'],
            ['2nd feature'   , 'Total amount (20.82%)'],
            ['3rd feature'   , 'Customer type (14.47%)'],
            ['Tuning method' , 'GridSearchCV + TimeSeriesSplit'],
          ].map(([k, v], i) => (
            <View key={i} style={[styles.modelRow,
              i % 2 === 0 && { backgroundColor: '#F0F4FF' }]}>
              <Text style={styles.modelKey}>{k}</Text>
              <Text style={styles.modelVal}>{v}</Text>
            </View>
          ))}

          <View style={styles.findingBox}>
            <Text style={styles.findingText}>
              🔍 The model explains 99.4% of variance in gross income.
              Price × Quantity interaction feature (engineered in Phase 3)
              is the strongest predictor — confirming our EDA finding.
            </Text>
          </View>
        </View>
      )}

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container      : { flex: 1, backgroundColor: '#F4F6FB' },
  header         : { backgroundColor: '#1E2761', padding: 24, paddingTop: 50 },
  headerTitle    : { fontSize: 24, fontWeight: 'bold', color: '#FFF' },
  headerSub      : { fontSize: 13, color: '#CADCFC', marginTop: 4 },

  kpiScroll      : { marginVertical: 16 },
  kpiCard        : { width: 110, backgroundColor: '#FFF', borderRadius: 12,
                      padding: 14, marginRight: 10, elevation: 3,
                      borderTopWidth: 3, alignItems: 'center' },
  kpiIcon        : { fontSize: 24, marginBottom: 6 },
  kpiValue       : { fontSize: 18, fontWeight: 'bold' },
  kpiLabel       : { fontSize: 10, color: '#888', marginTop: 4, textAlign: 'center' },

  tabRow         : { flexDirection: 'row', marginHorizontal: 16, marginBottom: 8,
                      backgroundColor: '#E8EDF8', borderRadius: 12, padding: 4 },
  tab            : { flex: 1, paddingVertical: 8, borderRadius: 10,
                      alignItems: 'center' },
  tabActive      : { backgroundColor: '#1E2761' },
  tabText        : { fontSize: 10, color: '#666', fontWeight: '600' },
  tabTextActive  : { color: '#FFF' },

  card           : { marginHorizontal: 16, marginBottom: 16, backgroundColor: '#FFF',
                      borderRadius: 16, padding: 16, elevation: 4 },
  cardTitle      : { fontSize: 16, fontWeight: 'bold', color: '#1E2761' },
  cardSub        : { fontSize: 12, color: '#888', marginTop: 2, marginBottom: 16 },

  branchCard     : { backgroundColor: '#F8FAFF', borderRadius: 12,
                      padding: 14, marginBottom: 12 },
  branchHeader   : { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  branchBadge    : { width: 40, height: 40, borderRadius: 20,
                      justifyContent: 'center', alignItems: 'center' },
  branchBadgeText: { color: '#FFF', fontWeight: 'bold', fontSize: 18 },
  branchName     : { fontSize: 14, fontWeight: 'bold', color: '#1E2761' },
  branchIncome   : { fontSize: 12, color: '#666' },
  barLabel       : { fontSize: 11, color: '#888', marginBottom: 4 },
  barBg          : { height: 12, backgroundColor: '#E0E8FF',
                      borderRadius: 6, marginBottom: 10 },
  barFill        : { height: 12, borderRadius: 6 },
  branchStats    : { flexDirection: 'row', gap: 8 },
  statPill       : { flex: 1, backgroundColor: '#FFF', borderRadius: 8,
                      padding: 8, alignItems: 'center', elevation: 1 },
  statPillVal    : { fontSize: 14, fontWeight: 'bold', color: '#1E2761' },
  statPillLabel  : { fontSize: 9, color: '#888' },

  productRow     : { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
  productName    : { width: 115, fontSize: 11, color: '#333', fontWeight: '500' },
  productBarBg   : { flex: 1, height: 14, backgroundColor: '#F0F4FF',
                      borderRadius: 7, marginHorizontal: 8 },
  productBar     : { height: 14, borderRadius: 7 },
  productVal     : { width: 45, fontSize: 11, fontWeight: 'bold',
                      color: '#1E2761', textAlign: 'right' },

  insightRow     : { flexDirection: 'row', alignItems: 'flex-start',
                      padding: 12, backgroundColor: '#F8FAFF',
                      borderRadius: 10, marginBottom: 8 },
  insightIcon    : { fontSize: 20, marginRight: 12, marginTop: 2 },
  insightText    : { flex: 1, fontSize: 13, color: '#333', lineHeight: 20 },

  modelRow       : { flexDirection: 'row', justifyContent: 'space-between',
                      padding: 10, borderRadius: 6, marginBottom: 2 },
  modelKey       : { fontSize: 12, color: '#555', fontWeight: '600' },
  modelVal       : { fontSize: 12, color: '#1E2761', fontWeight: 'bold',
                      flex: 1, textAlign: 'right' },

  findingBox     : { backgroundColor: '#EBF3FB', borderRadius: 10,
                      padding: 12, marginTop: 12 },
  findingText    : { fontSize: 12, color: '#1E2761', lineHeight: 18 },
});