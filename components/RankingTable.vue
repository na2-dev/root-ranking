<template>
  <div class="ranking-table-container">
    <div class="table-header">
      <h2>ROOT Wallet Ranking</h2>
      <p class="date-info">
        最新更新日時: {{ formatDate(currentDate) }}
      </p>
      <p class="total-count">
        総件数: {{ rankings.length }}件 
        <span v-if="!showAll && rankings.length > 100">
          ({{ displayedRankings.length }}件表示中)
        </span>
      </p>
    </div>
    
    <div class="table-wrapper">
      <table class="ranking-table">
        <thead>
          <tr>
            <th>順位</th>
            <th>変動順位</th>
            <th>アドレス</th>
            <th>保有量</th>
            <th>備考</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in displayedRankings" :key="item.address" 
              class="ranking-row">
            <td class="rank">{{ item.rank }}</td>
            <td class="movement" :class="getMovementClass(item.movement)">
              {{ item.movement }}
            </td>
            <td class="address">
              <div class="address-container">
                <a 
                  :href="`https://rootscan.io/addresses/${item.address}`" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  class="address-link"
                  :title="`Root Scanで詳細を見る: ${item.address}`"
                >
                  <span class="address-full">{{ item.address }}</span>
                  <span class="address-short">{{ formatAddress(item.address) }}</span>
                </a>
                <button 
                  @click="copyAddress(item.address)" 
                  class="copy-button"
                  :title="`アドレスをコピー: ${item.address}`"
                >
                  📋
                </button>
              </div>
            </td>
            <td class="amount">
              <div class="amount-container">
                <div class="current-amount">{{ formatNumber(item.amount) }}</div>
                <div v-if="item.amountChange" class="amount-change" :class="getAmountChangeClass(item.amountChange)">
                  {{ item.amountChange }}
                </div>
              </div>
            </td>
            <td class="remarks">
              {{ getAddressRemark(item.address) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 展開/折りたたみボタン -->
    <div v-if="rankings.length > 100" class="expand-controls">
      <button 
        @click="toggleShowAll" 
        class="expand-button"
        :class="{ 'expanded': showAll }"
      >
        <span v-if="!showAll">
          ▼ さらに {{ rankings.length - 100 }}件を表示
        </span>
        <span v-else>
          ▲ 上位100件のみ表示
        </span>
      </button>
    </div>

    <div v-if="rankings.length === 0" class="no-data">
      <p>データがありません</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import type { RankingItem } from '../utils/ranking';
import { formatNumber, formatAddress } from '../utils/ranking';

interface Props {
  rankings: RankingItem[];
  currentDate: string;
  previousDate: string;
}

const props = defineProps<Props>();

// 展開状態を管理
const showAll = ref(false);

// アドレス備考の対応表
const addressRemarks = ref<Record<string, string>>({});

// アドレス備考対応表を読み込み
async function loadAddressRemarks() {
  try {
    const config = useRuntimeConfig();
    const baseURL = config.app.baseURL.replace(/\/$/, '');
    const response = await fetch(`${baseURL}/address-remarks.json`);
    
    if (response.ok) {
      addressRemarks.value = await response.json();
    } else {
      console.warn('Address remarks file not found');
    }
  } catch (error) {
    console.error('Failed to load address remarks:', error);
  }
}

// コンポーネントマウント時に対応表を読み込み
onMounted(() => {
  loadAddressRemarks();
});

// アドレスの備考を取得
function getAddressRemark(address: string): string {
  return addressRemarks.value[address] || '';
}

// 表示するランキング（100件または全件）
const displayedRankings = computed(() => {
  if (showAll.value || props.rankings.length <= 100) {
    return props.rankings;
  }
  return props.rankings.slice(0, 100);
});

// 展開/折りたたみの切り替え
function toggleShowAll() {
  showAll.value = !showAll.value;
}

// アドレスをクリップボードにコピー
async function copyAddress(address: string) {
  try {
    await navigator.clipboard.writeText(address);
    // 成功時の視覚的フィードバック（オプション）
    console.log('Address copied to clipboard:', address);
  } catch (err) {
    // fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = address;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
    console.log('Address copied to clipboard (fallback):', address);
  }
}

// 日付をYYYYMMDD形式からYYYY-MM-DD形式に変換
function formatDate(dateString: string): string {
  if (dateString.length !== 8) return dateString;
  
  const year = dateString.substring(0, 4);
  const month = dateString.substring(4, 6);
  const day = dateString.substring(6, 8);
  
  return `${year}-${month}-${day}`;
}

function getMovementClass(movement: string | undefined): string {
  if (!movement) return '';
  
  if (movement.startsWith('▲')) {
    return 'movement-up';
  } else if (movement.startsWith('▼')) {
    return 'movement-down';
  } else if (movement === 'NEW') {
    return 'movement-new';
  }
  
  return 'movement-neutral';
}

function getAmountChangeClass(amountChange: string): string {
  if (amountChange.startsWith('+')) {
    return 'amount-increase';
  } else if (amountChange.startsWith('-')) {
    return 'amount-decrease';
  }
  return '';
}
</script>

<style scoped>
.ranking-table-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.table-header {
  text-align: center;
  margin-bottom: 30px;
}

.table-header h2 {
  color: #2c3e50;
  font-size: 2rem;
  margin-bottom: 10px;
}

.date-info {
  color: #7f8c8d;
  font-size: 1rem;
  margin: 0 0 5px 0;
}

.total-count {
  color: #95a5a6;
  font-size: 0.9rem;
  margin: 0;
}

.table-wrapper {
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-height: 85vh;
  overflow-y: auto;
  overflow-x: auto;
}

.ranking-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  min-width: 800px;
  position: relative;
}

@media (max-width: 768px) {
  .ranking-table {
    min-width: 100%;
  }
  
  .table-wrapper {
    max-height: 75vh;
  }
}

.ranking-table th {
  background: #34495e;
  color: white;
  padding: 15px 10px;
  text-align: center;
  font-weight: 600;
  font-size: 0.9rem;
  position: sticky;
  top: 0;
  z-index: 10;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.ranking-table th:first-child {
  border-radius: 8px 0 0 0;
}

.ranking-table th:last-child {
  border-radius: 0 8px 0 0;
}

.ranking-row {
  border-bottom: 1px solid #ecf0f1;
  transition: background-color 0.2s ease;
}

.ranking-row:hover {
  background-color: #f8f9fa;
}

.ranking-row:last-child {
  border-bottom: none;
}

.ranking-table td {
  padding: 12px 10px;
  font-size: 0.9rem;
}

.rank {
  font-weight: 600;
  text-align: center;
  color: #2c3e50;
  width: 80px;
}

.movement {
  text-align: center;
  font-weight: 600;
  width: 100px;
}

.movement-up {
  color: #22c55e; /* より鮮明な緑色 */
  font-weight: bold;
}

.movement-down {
  color: #ef4444; /* より鮮明な赤色 */
  font-weight: bold;
}

.movement-new {
  color: #3498db;
}

.movement-neutral {
  color: #95a5a6;
}

.address {
  font-family: 'Courier New', monospace;
  word-break: break-all;
}

.address-container {
  display: flex;
  align-items: center;
  gap: 8px;
}

.address-link {
  color: #3498db;
  text-decoration: none;
  transition: color 0.2s ease;
}

.address-link:hover {
  color: #2980b9;
  text-decoration: underline;
}

.address-short {
  display: none;
}

.copy-button {
  background: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  padding: 4px 6px;
  cursor: pointer;
  font-size: 0.8rem;
  transition: all 0.2s ease;
  min-width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.copy-button:hover {
  background: #e9ecef;
  border-color: #adb5bd;
  transform: scale(1.05);
}

.copy-button:active {
  transform: scale(0.95);
  background: #dee2e6;
}

.amount {
  text-align: right;
  font-weight: 600;
  color: #2c3e50;
  min-width: 120px;
}

.amount-container {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.current-amount {
  font-weight: 600;
  color: #2c3e50;
}

.amount-change {
  font-size: 0.7rem;
  font-weight: 500;
  margin-top: 2px;
}

.amount-increase {
  color: #22c55e;
}

.amount-decrease {
  color: #ef4444;
}

.remarks {
  min-width: 60px;
  max-width: 80px;
  padding: 8px 4px;
  text-align: center;
  color: #2c3e50;
  font-size: 0.8rem;
  font-weight: 500;
}

.no-data {
  text-align: center;
  padding: 40px;
  color: #7f8c8d;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.expand-controls {
  text-align: center;
  margin-top: 20px;
}

.expand-button {
  background: #3498db;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(52, 152, 219, 0.3);
}

.expand-button:hover {
  background: #2980b9;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(52, 152, 219, 0.4);
}

.expand-button:active {
  transform: translateY(0);
}

.expand-button.expanded {
  background: #95a5a6;
}

.expand-button.expanded:hover {
  background: #7f8c8d;
}

/* レスポンシブデザイン */
@media (max-width: 768px) {
  .ranking-table-container {
    padding: 10px;
  }
  
  .table-header h2 {
    font-size: 1.5rem;
  }
  
  .date-info {
    font-size: 0.9rem;
  }
  
  .ranking-table th,
  .ranking-table td {
    padding: 8px 4px;
    font-size: 0.8rem;
  }
  
  .address-full {
    display: none;
  }
  
  .address-short {
    display: inline;
  }
  
  .rank {
    width: 50px;
  }
  
  .movement {
    width: 70px;
  }
  
  .address {
    width: 40%;
    min-width: 120px;
  }
  
  .copy-button {
    min-width: 24px;
    height: 24px;
    padding: 2px 4px;
    font-size: 0.7rem;
  }
  
  .amount {
    width: 30%;
    min-width: 100px;
    font-size: 0.75rem;
  }
  
  .amount-change {
    font-size: 0.65rem;
  }
  
  .remarks {
    width: 15%;
    min-width: 50px;
    max-width: 70px;
  }
  
  .expand-button {
    padding: 10px 20px;
    font-size: 0.8rem;
  }
}

@media (max-width: 480px) {
  .ranking-table th,
  .ranking-table td {
    padding: 6px 2px;
    font-size: 0.7rem;
  }
  
  .table-header h2 {
    font-size: 1.3rem;
  }
  
  .rank {
    width: 40px;
  }
  
  .movement {
    width: 60px;
  }
  
  .address {
    width: 35%;
    min-width: 100px;
  }
  
  .copy-button {
    min-width: 20px;
    height: 20px;
    padding: 1px 2px;
    font-size: 0.6rem;
  }
  
  .amount {
    width: 25%;
    min-width: 80px;
    font-size: 0.7rem;
  }
  
  .amount-change {
    font-size: 0.6rem;
  }
  
  .remarks {
    width: 20%;
    min-width: 40px;
    max-width: 60px;
  }
  
  .expand-button {
    padding: 8px 16px;
    font-size: 0.75rem;
  }
}
</style>
