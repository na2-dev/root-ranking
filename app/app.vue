<template>
  <div>
    <NuxtRouteAnnouncer />
    <div class="app-container">
      <!-- <div class="debug-info">
        <h2>デバッグ情報</h2>
        <p>現在日付: {{ currentDate }}</p>
        <p>前日日付: {{ previousDate }}</p>
        <p>現在データ読み込み状況: {{ currentDataLoaded ? '成功' : '失敗' }}</p>
        <p>前日データ読み込み状況: {{ previousDataLoaded ? '成功' : '失敗' }}</p>
        <p>ランキング件数: {{ rankings.length }}</p>
        <div v-if="errorMessage" class="error">
          エラー: {{ errorMessage }}
        </div>
      </div> -->
      
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
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import RankingTable from '../components/RankingTable.vue';

interface RankingData {
  address: string;
  amount: string; // 文字列型に変更
}

interface RankingItem extends RankingData {
  rank: number;
  previousRank?: number;
  movement?: string;
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

// JSONファイルからデータを読み込み
async function loadRankingData(dateString: string): Promise<RankingData[] | null> {
  try {
    console.log(`Loading data for ${dateString}`);
    const response = await fetch(`/${dateString}.json`);
    
    if (!response.ok) {
      console.error(`Failed to fetch ${dateString}.json:`, response.status);
      return null;
    }
    
    const apiResponse = await response.json();
    console.log(`Loaded data for ${dateString}:`, apiResponse);
    
    // APIレスポンスをRankingDataに変換
    return apiResponse.data.map((item: any) => ({
      address: item.address,
      amount: item.balance.freeFormatted // freeFormattedを使用
    }));
  } catch (error) {
    console.error(`Failed to load data for ${dateString}:`, error);
    return null;
  }
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
  const previousRankMap = new Map<string, number>();
  
  previousRanking.forEach(item => {
    previousRankMap.set(item.address, item.rank);
  });

  return currentRanking.map(currentItem => {
    const previousRank = previousRankMap.get(currentItem.address);
    
    if (previousRank === undefined) {
      return {
        ...currentItem,
        movement: 'NEW'
      };
    }

    const movementValue = previousRank - currentItem.rank;
    
    let movement: string;
    if (movementValue > 0) {
      movement = `↑${movementValue}`;
    } else if (movementValue < 0) {
      movement = `↓${Math.abs(movementValue)}`;
    } else {
      movement = '-';
    }

    return {
      ...currentItem,
      previousRank,
      movement
    };
  });
}

onMounted(async () => {
  currentDate.value = getCurrentDateString();
  previousDate.value = getPreviousDateString();
  
  try {
    console.log('Starting data load...');
    
    // 当日のデータを読み込み
    const currentData = await loadRankingData(currentDate.value);
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

<style>
body {
  margin: 0;
  padding: 0;
  background-color: #f5f6fa;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

.app-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.debug-info {
  background: white;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.debug-info h2 {
  margin-top: 0;
  color: #2c3e50;
}

.error {
  color: #e74c3c;
  font-weight: bold;
}

.loading {
  text-align: center;
  padding: 40px;
  color: #7f8c8d;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>

<style>
body {
  margin: 0;
  padding: 0;
  background-color: #f5f6fa;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

.app-container {
  min-height: 100vh;
  padding: 20px 0;
}

.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 50vh;
  font-size: 1.2rem;
  color: #7f8c8d;
}
</style>
