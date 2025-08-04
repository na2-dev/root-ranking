<template>
  <div class="ranking-table-container">
    <div class="table-header">
      <h2>ROOT Wallet Ranking</h2>
      <p class="date-info">
        当日: {{ currentDate }} | 前日: {{ previousDate }}
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
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in rankings" :key="item.address" class="ranking-row">
            <td class="rank">{{ item.rank }}</td>
            <td class="movement" :class="getMovementClass(item.movement)">
              {{ item.movement }}
            </td>
            <td class="address">
              <span class="address-full">{{ item.address }}</span>
              <span class="address-short">{{ formatAddress(item.address) }}</span>
            </td>
            <td class="amount">{{ formatNumber(item.amount) }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="rankings.length === 0" class="no-data">
      <p>データがありません</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { RankingItem } from '../utils/ranking';
import { formatNumber, formatAddress } from '../utils/ranking';

interface Props {
  rankings: RankingItem[];
  currentDate: string;
  previousDate: string;
}

defineProps<Props>();

function getMovementClass(movement: string | undefined): string {
  if (!movement) return '';
  
  if (movement.startsWith('↑')) {
    return 'movement-up';
  } else if (movement.startsWith('↓')) {
    return 'movement-down';
  } else if (movement === 'NEW') {
    return 'movement-new';
  }
  
  return 'movement-neutral';
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
  margin: 0;
}

.table-wrapper {
  overflow-x: auto;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.ranking-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  min-width: 600px;
}

.ranking-table th {
  background: #34495e;
  color: white;
  padding: 15px 10px;
  text-align: left;
  font-weight: 600;
  font-size: 0.9rem;
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
  color: #27ae60;
}

.movement-down {
  color: #e74c3c;
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

.address-short {
  display: none;
}

.amount {
  text-align: right;
  font-weight: 600;
  color: #2c3e50;
  min-width: 120px;
}

.no-data {
  text-align: center;
  padding: 40px;
  color: #7f8c8d;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
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
    padding: 8px 5px;
    font-size: 0.8rem;
  }
  
  .address-full {
    display: none;
  }
  
  .address-short {
    display: inline;
  }
  
  .rank,
  .movement {
    width: 60px;
  }
  
  .amount {
    min-width: 80px;
  }
}

@media (max-width: 480px) {
  .ranking-table th,
  .ranking-table td {
    padding: 6px 3px;
    font-size: 0.75rem;
  }
  
  .table-header h2 {
    font-size: 1.3rem;
  }
}
</style>
