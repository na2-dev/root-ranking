<template>
  <footer class="app-footer">
    <div class="footer-container">
      <div class="footer-content">
        <div class="footer-section">
          <h4 class="section-title">外部リンク</h4>
          <ul class="footer-links">
            <li>
              <a href="https://rootscan.io" target="_blank" rel="noopener noreferrer" class="footer-link">
                Root Scan
              </a>
            </li>
          </ul>
        </div>
        
        <div class="footer-section">
          <h4 class="section-title">データについて</h4>
          <ul class="footer-info">
            <li>🔄 データは毎日自動更新されます</li>
            <li>📊 ランキングは残高の多い順に表示</li>
            <li>📈 前日からの変動を表示</li>
          </ul>
        </div>
      </div>
      
      <div class="footer-bottom">
        <div class="footer-bottom-content">
          <p class="copyright">
            © {{ currentYear }} ROOT Wallet Ranking.
          </p>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { computed } from 'vue';

// 現在の年を取得
const currentYear = computed(() => new Date().getFullYear());

</script>

<style scoped>
.app-footer {
  background: #2c3e50;
  color: #ecf0f1;
  margin-top: auto;
}

.footer-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.footer-content {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 40px;
  padding: 40px 0 30px 0;
}

.footer-section {
  display: flex;
  flex-direction: column;
}

.footer-title {
  color: #3498db;
  font-size: 1.3rem;
  font-weight: 700;
  margin: 0 0 10px 0;
}

.footer-description {
  color: #bdc3c7;
  margin: 0;
  line-height: 1.6;
  font-size: 0.9rem;
}

.section-title {
  color: #e74c3c;
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 15px 0;
}

.footer-links {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.footer-link {
  color: #95a5a6;
  text-decoration: none;
  transition: color 0.3s ease;
  font-size: 0.9rem;
}

.footer-link:hover {
  color: #3498db;
}

.footer-info {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.footer-info li {
  color: #95a5a6;
  font-size: 0.9rem;
  line-height: 1.5;
}

.footer-bottom {
  border-top: 1px solid #34495e;
  padding: 20px 0;
}

.footer-bottom-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
}

.copyright {
  color: #7f8c8d;
  margin: 0;
  font-size: 0.8rem;
}

.last-updated {
  color: #7f8c8d;
  margin: 0;
  font-size: 0.8rem;
}

/* レスポンシブデザイン */
@media (max-width: 768px) {
  .footer-content {
    grid-template-columns: 1fr;
    gap: 30px;
    padding: 30px 0 25px 0;
    text-align: center;
  }
  
  .footer-title {
    font-size: 1.2rem;
  }
  
  .section-title {
    font-size: 0.95rem;
  }
  
  .footer-description,
  .footer-link,
  .footer-info li {
    font-size: 0.85rem;
  }
  
  .footer-bottom-content {
    flex-direction: column;
    text-align: center;
    gap: 5px;
  }
  
  .copyright,
  .last-updated {
    font-size: 0.75rem;
  }
}

@media (max-width: 480px) {
  .footer-container {
    padding: 0 15px;
  }
  
  .footer-content {
    gap: 25px;
    padding: 25px 0 20px 0;
  }
  
  .footer-title {
    font-size: 1.1rem;
  }
  
  .section-title {
    font-size: 0.9rem;
  }
  
  .footer-description,
  .footer-link,
  .footer-info li {
    font-size: 0.8rem;
  }
  
  .footer-bottom {
    padding: 15px 0;
  }
  
  .copyright,
  .last-updated {
    font-size: 0.7rem;
  }
}
</style>
