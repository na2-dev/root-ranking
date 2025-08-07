<template>
  <div>
    <AppHeader />
    
    <main class="main-content">
      <div class="app-container">
        <div class="coming-soon-container">
          <div class="coming-soon-content">
            <div class="icon-section">
              <span class="supply-icon">📊</span>
            </div>
            <h1 class="page-title">供給量分析</h1>
            <p class="page-subtitle">ROOT Network Supply Analysis</p>
            
            <div class="coming-soon-box">
              <h2 class="coming-soon-title">Coming Soon</h2>
              <p class="coming-soon-description">
                近日中にリリース予定です。
              </p>
              
              <div class="back-link">
                <NuxtLink to="/" class="back-button">
                  ← ランキングに戻る
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
    
    <AppFooter />
  </div>
</template>

<script setup lang="ts">
import AppHeader from '../components/AppHeader.vue';
import AppFooter from '../components/AppFooter.vue';
</script>

<style scoped>
.main-content {
  min-height: calc(100vh - 200px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 0;
}

.app-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.coming-soon-container {
  text-align: center;
}

.coming-soon-content {
  background: white;
  border-radius: 16px;
  padding: 60px 40px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid #e1e8ed;
}

.icon-section {
  margin-bottom: 20px;
}

.supply-icon {
  font-size: 4rem;
  display: inline-block;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #2c3e50;
  margin: 0 0 10px 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.page-subtitle {
  font-size: 1.1rem;
  color: #7f8c8d;
  margin: 0 0 40px 0;
  font-weight: 400;
}

.coming-soon-box {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 12px;
  padding: 40px 30px;
  margin: 30px 0;
  border: 2px dashed #dee2e6;
}

.coming-soon-title {
  font-size: 2rem;
  font-weight: 600;
  color: #495057;
  margin: 0 0 15px 0;
}

.coming-soon-description {
  font-size: 1.1rem;
  color: #6c757d;
  margin: 0 0 30px 0;
  line-height: 1.6;
}

.features-preview {
  margin: 30px 0;
  padding: 20px 0;
  border-top: 1px solid #dee2e6;
}

.features-preview h3 {
  font-size: 1.3rem;
  color: #495057;
  margin: 0 0 20px 0;
  font-weight: 600;
}

.features-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 10px;
  max-width: 400px;
  margin: 0 auto;
}

.features-list li {
  background: white;
  padding: 12px 16px;
  border-radius: 8px;
  color: #495057;
  font-weight: 500;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  border: 1px solid #e9ecef;
}

.back-link {
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #dee2e6;
}

.back-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  text-decoration: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 500;
  font-size: 1rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.back-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

/* レスポンシブデザイン */
@media (max-width: 768px) {
  .coming-soon-content {
    padding: 40px 30px;
  }
  
  .page-title {
    font-size: 2rem;
  }
  
  .supply-icon {
    font-size: 3rem;
  }
  
  .coming-soon-title {
    font-size: 1.6rem;
  }
  
  .coming-soon-description {
    font-size: 1rem;
  }
  
  .features-list {
    grid-template-columns: 1fr;
    max-width: 300px;
  }
}

@media (max-width: 480px) {
  .app-container {
    padding: 15px;
  }
  
  .coming-soon-content {
    padding: 30px 20px;
  }
  
  .page-title {
    font-size: 1.8rem;
  }
  
  .supply-icon {
    font-size: 2.5rem;
  }
  
  .coming-soon-box {
    padding: 30px 20px;
  }
  
  .coming-soon-title {
    font-size: 1.4rem;
  }
  
  .back-button {
    padding: 10px 20px;
    font-size: 0.9rem;
  }
}
</style>
