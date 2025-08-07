<template>
  <div>
    <AppHeader />
    
    <main class="main-content">
      <div class="app-container">
        <RankingTable 
          v-if="rankings.length > 0"
          :rankings="rankings"
          :current-date="currentDate"
          :previous-date="previousDate"
        />
        
        <div v-else class="loading">
          <p>データを読み込み中...</p>
        </div>
      </div>
    </main>
    
    <AppFooter />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import {loadRankingData } from '../utils/ranking';

interface RankingData {
  address: string;
  amount: string; // 文字列型に変更
}

interface RankingItem extends RankingData {
  rank: number;
  previousRank?: number;
  movement?: string;
  previousAmount?: string;
  amountChange?: string;
}

const rankings = ref<RankingItem[]>([]);
const currentDate = ref<string>('');
const previousDate = ref<string>('');
const currentDataLoaded = ref<boolean>(false);
const previousDataLoaded = ref<boolean>(false);
const errorMessage = ref<string>('');

// 現在の日付をYYYYMMDD形式で取得
function getCurrentDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}${month}${day}`;
}

// 前日の日付をYYYYMMDD形式で取得
function getPreviousDateString(): string {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const year = yesterday.getFullYear();
  const month = String(yesterday.getMonth() + 1).padStart(2, '0');
  const day = String(yesterday.getDate()).padStart(2, '0');
  return `${year}${month}${day}`;
}

// 現在の日付-numをYYYYMMDD形式で取得
function getMinusDateString(num: number): string {
  const now = new Date();
  now.setDate(now.getDate() - num);
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}${month}${day}`;
}

// データをamount順でソートしてランキングを作成
function createRanking(data: RankingData[]): RankingItem[] {
  return data
    .sort((a, b) => parseFloat(b.amount) - parseFloat(a.amount)) // 文字列を数値に変換してソート
    .map((item, index) => ({
      ...item,
      rank: index + 1
    }));
}

// 前日と当日のランキングを比較して変動情報を計算
function calculateMovement(
  currentRanking: RankingItem[],
  previousRanking: RankingItem[]
): RankingItem[] {
  const previousRankMap = new Map<string, { rank: number; amount: string }>();
  
  previousRanking.forEach(item => {
    previousRankMap.set(item.address, { rank: item.rank, amount: item.amount });
  });

  return currentRanking.map(currentItem => {
    const previousData = previousRankMap.get(currentItem.address);
    
    if (previousData === undefined) {
      return {
        ...currentItem,
        movement: 'NEW'
      };
    }

    const movementValue = previousData.rank - currentItem.rank;
    
    let movement: string;
    if (movementValue > 0) {
      movement = `▲${movementValue}`;
    } else if (movementValue < 0) {
      movement = `▼${Math.abs(movementValue)}`;
    } else {
      movement = '-';
    }

    // 保有量の変動を計算
    const currentAmount = parseFloat(currentItem.amount);
    const previousAmount = parseFloat(previousData.amount);
    const amountDiff = currentAmount - previousAmount;
    
    let amountChange: string = '';
    if (amountDiff > 0) {
      amountChange = `+${amountDiff.toLocaleString()}`;
    } else if (amountDiff < 0) {
      amountChange = `${amountDiff.toLocaleString()}`;
    }

    return {
      ...currentItem,
      previousRank: previousData.rank,
      movement,
      previousAmount: previousData.amount,
      amountChange
    };
  });
}

onMounted(async () => {
  currentDate.value = getCurrentDateString();
  previousDate.value = getPreviousDateString();

  try {
    console.log('Starting data load...');
    
    // 当日のデータを読み込み
    let currentData = await loadRankingData(currentDate.value);
    if (!currentData) {
      currentDate.value = getMinusDateString(1) // 当日データがない場合は前日データを使用
      previousDate.value = getMinusDateString(2); // 前日データも1日前に設定
      currentData = await loadRankingData(currentDate.value);
    }
    if (currentData) {
      currentDataLoaded.value = true;
      console.log('Current data loaded successfully');
      
      // 前日のデータを読み込み
      const previousData = await loadRankingData(previousDate.value);
      if (previousData) {
        previousDataLoaded.value = true;
        console.log('Previous data loaded successfully');
        
        // ランキングを計算
        const currentRanking = createRanking(currentData);
        const previousRanking = createRanking(previousData);
        rankings.value = calculateMovement(currentRanking, previousRanking);
      } else {
        console.log('Previous data not found, using current data only');
        // 前日データがない場合は当日データのみでランキング作成（全て新規扱い）
        const currentRanking = createRanking(currentData);
        rankings.value = currentRanking.map(item => ({
          ...item,
          movement: 'NEW'
        }));
      }
    } else {
      errorMessage.value = '当日のデータが見つかりません';
    }
  } catch (error) {
    console.error('Error loading ranking data:', error);
    errorMessage.value = `エラーが発生しました: ${error}`;
  }
});
</script>

<style scoped>
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.app-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  flex: 1;
}

.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 50vh;
  font-size: 1.2rem;
  color: #7f8c8d;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

@media (max-width: 768px) {
  .app-container {
    padding: 15px;
  }
  
  .loading {
    font-size: 1rem;
    min-height: 40vh;
  }
}
</style>