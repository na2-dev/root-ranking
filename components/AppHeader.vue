<template>
  <header class="app-header">
    <div class="header-container">
      <div class="header-content">
        <div class="logo-section">
          <h1 class="site-title">
            <span class="title-icon">🏆</span>
            ROOT Wallet Ranking
          </h1>
          <p class="site-subtitle">The Root Network Blockchain</p>
        </div>
        
        <nav class="header-nav">
          <ul class="nav-list">
            <li class="nav-item">
              <NuxtLink to="/" class="nav-link" :class="{ active: $route.path === '/' }">
                ランキング
              </NuxtLink>
            </li>
            <li class="nav-item">
              <NuxtLink to="/supply-analysis" class="nav-link" :class="{ active: $route.path === '/supply-analysis' }">
                供給量分析
              </NuxtLink>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
// ヘッダーコンポーネントのロジック（必要に応じて追加）
</script>

<style scoped>
.app-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 0;
}

.logo-section {
  flex: 1;
}

.site-title {
  margin: 0;
  font-size: 1.8rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 10px;
}

.title-icon {
  font-size: 1.6rem;
}

.site-subtitle {
  margin: 5px 0 0 0;
  font-size: 0.9rem;
  opacity: 0.9;
  font-weight: 400;
}

.header-nav {
  flex-shrink: 0;
}

.nav-list {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
  gap: 20px;
}

.nav-item {
  position: relative;
}

.nav-link {
  color: white;
  text-decoration: none;
  padding: 8px 16px;
  border-radius: 6px;
  transition: all 0.3s ease;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 4px;
}

.nav-link:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-1px);
}

.nav-link.active {
  background: rgba(255, 255, 255, 0.2);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.external-icon {
  font-size: 0.8rem;
  opacity: 0.8;
}

/* レスポンシブデザイン */
@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    text-align: center;
    gap: 15px;
    padding: 15px 0;
  }
  
  .site-title {
    font-size: 1.5rem;
    justify-content: center;
  }
  
  .site-subtitle {
    font-size: 0.8rem;
  }
  
  .nav-list {
    gap: 15px;
    flex-wrap: wrap;
    justify-content: center;
  }
  
  .nav-link {
    padding: 6px 12px;
    font-size: 0.9rem;
  }
}

@media (max-width: 480px) {
  .header-container {
    padding: 0 15px;
  }
  
  .site-title {
    font-size: 1.3rem;
  }
  
  .site-subtitle {
    font-size: 0.75rem;
  }
  
  .nav-list {
    gap: 10px;
  }
  
  .nav-link {
    padding: 5px 10px;
    font-size: 0.8rem;
  }
}
</style>
