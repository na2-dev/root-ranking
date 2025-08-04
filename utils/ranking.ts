export interface ApiBalance {
  free: number;
  freeFormatted: string;
  reserved: number;
  reservedFormatted: string;
  frozen: number;
  frozenFormatted: string | null;
  miscFrozen: number | null;
  miscFrozenFormatted: string | null;
  feeFrozen: number | null;
  feeFrozenFormatted: string | null;
}

export interface ApiResponseItem {
  address: string;
  balance: ApiBalance;
}

export interface ApiResponse {
  data: ApiResponseItem[];
}

export interface RankingData {
  address: string;
  amount: string; // 文字列型に変更
}

export interface RankingItem extends RankingData {
  rank: number;
  previousRank?: number;
  movement?: string;
}

/**
 * 現在の日付をYYYYMMDD形式で取得
 */
export function getCurrentDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}${month}${day}`;
}

/**
 * 前日の日付をYYYYMMDD形式で取得
 */
export function getPreviousDateString(): string {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const year = yesterday.getFullYear();
  const month = String(yesterday.getMonth() + 1).padStart(2, '0');
  const day = String(yesterday.getDate()).padStart(2, '0');
  return `${year}${month}${day}`;
}

/**
 * データをamount順でソートしてランキングを作成
 */
export function createRanking(data: RankingData[]): RankingItem[] {
  return data
    .sort((a, b) => parseFloat(b.amount) - parseFloat(a.amount)) // 文字列を数値に変換してソート
    .map((item, index) => ({
      ...item,
      rank: index + 1
    }));
}

/**
 * 前日と当日のランキングを比較して変動情報を計算
 */
export function calculateMovement(
  currentRanking: RankingItem[],
  previousRanking: RankingItem[]
): RankingItem[] {
  const previousRankMap = new Map<string, number>();
  
  // 前日のランキングマップを作成
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

/**
 * APIレスポンスからRankingDataに変換
 */
export function parseApiResponse(apiResponse: ApiResponse): RankingData[] {
  return apiResponse.data.map(item => ({
    address: item.address,
    amount: item.balance.freeFormatted // 文字列のまま保持
  }));
}

/**
 * JSONファイルからデータを読み込み
 */
export async function loadRankingData(dateString: string): Promise<RankingData[] | null> {
  try {
    const response = await fetch(`/${dateString}.json`);
    if (!response.ok) {
      return null;
    }
    const apiResponse: ApiResponse = await response.json();
    return parseApiResponse(apiResponse);
  } catch (error) {
    console.error(`Failed to load data for ${dateString}:`, error);
    return null;
  }
}

/**
 * 数値文字列をカンマ区切り形式でフォーマット
 * 小数点以下は必要に応じて表示
 */
export function formatNumber(numStr: string): string {

  console.log(`Received number string: ${numStr}`); // デバッグ用ログ
  // 文字列を数値に変換
  const num = parseFloat(numStr);
  console.log(`Formatting number: ${num}`); // デバッグ用ログ
  
  // 整数部分と小数部分を分離
  const integerPart = Math.floor(num);
  const decimalPart = num - integerPart;
  
  // 整数部分をカンマ区切りでフォーマット（英語ロケールを使用して小数点を「.」にする）
  let formatted = integerPart.toLocaleString('en-US');
  
  // 小数部分がある場合は追加（最大4桁まで）
  if (decimalPart > 0) {
    const decimalStr = decimalPart.toFixed(4).substring(1); // "0.1234" -> ".1234"
    // 末尾の0を削除
    const trimmedDecimal = decimalStr.replace(/0+$/, '');
    if (trimmedDecimal !== '.') {
      formatted += trimmedDecimal;
    }
  }
  
  return formatted;
}

/**
 * アドレスを短縮表示用にフォーマット
 */
export function formatAddress(address: string): string {
  if (address.length <= 10) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}
