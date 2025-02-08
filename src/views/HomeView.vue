<template>
  <div class="layout-demo">
    <a-layout style="min-height: 100vh;">
      <the-header />
      <a-layout>
        <a-layout-sider :width="280">
          <div class="sider-search">
            <a-input-search
              :style="{ width: '90%' }"
              placeholder="搜索书籍..."
              search-button
            />
          </div>
          <a-menu
            :style="{ width: '100%' }"
            :default-selected-keys="['1']"
          >
            <a-menu-item key="1">我的书架</a-menu-item>
            <a-menu-item key="2">分类浏览</a-menu-item>
            <a-menu-item key="3">排行榜</a-menu-item>
            <a-menu-item key="4">完本小说</a-menu-item>
          </a-menu>
        </a-layout-sider>
        <a-layout-content class="content">
          <div class="content-header">
            <h2>我的书架</h2>
            <div class="header-actions">
              <a-button v-if="isManaging"
                        type="primary" 
                        status="danger" 
                        @click="removeSelected">
                移除选中书籍
              </a-button>
              <a-button @click="isManaging = !isManaging">
                {{ isManaging ? '完成' : '管理书架' }}
              </a-button>
            </div>
          </div>
          <a-row :gutter="[16, 16]" class="book-grid">
            <a-col :span="8" v-for="i in 6" :key="i">
              <a-card 
                class="book-card" 
                :bordered="false" 
                :class="{ 'book-card-selected': isManaging && selectedBooks[i] }"
                hover
                @click="!isManaging && goToDetail(i)"
              >
                <div class="book-content">
                  <div class="book-cover">
                    <a-image
                      width="140"
                      src="https://www.bqgl.cc/bookimg/113/113680.jpg"
                      :preview="false"
                    />
                  </div>
                  <div class="book-info">
                    <h4 class="book-title">诡秘之主</h4>
                    <div class="info-item">
                      <span class="label">作者：</span>
                      <span class="value">爱潜水的乌贼</span>
                    </div>
                    <div class="info-item">
                      <span class="label">已读：</span>
                      <span class="value">第23章 初入歧路</span>
                    </div>
                    <div class="info-item">
                      <span class="label">最新：</span>
                      <span class="value">第1986章 大结局</span>
                    </div>
                  </div>
                  <div v-if="isManaging" class="checkbox-wrapper">
                    <a-checkbox v-model="selectedBooks[i]" />
                  </div>
                </div>
              </a-card>
            </a-col>
          </a-row>
        </a-layout-content>
      </a-layout>
      <a-layout-footer>
        <p>© 2024 在线阅读平台 - 让阅读更轻松</p>
      </a-layout-footer>
    </a-layout>
  </div>
</template>

<style scoped>
.layout-demo {
  width: 100%;
  min-height: 100vh;
  background: var(--color-fill-2);
}

.layout-demo :deep(.arco-layout) {
  min-height: 100vh;
}

.layout-demo :deep(.arco-layout-sider) {
  background: var(--color-bg-2);
  border-right: 1px solid var(--color-border);
}

.layout-demo :deep(.arco-layout-footer) {
  background: var(--color-bg-2);
  color: var(--color-text-2);
  text-align: center;
  padding: 16px;
  border-top: 1px solid var(--color-border);
}

.sider-search {
  padding: 16px;
  text-align: center;
  border-bottom: 1px solid var(--color-border);
}

.content {
  padding: 20px;
  background: var(--color-bg-2);
}

.content-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.book-grid {
  margin-top: 16px;
}

.book-card {
  display: block;
  padding: 16px;
  transition: all 0.3s;
  height: 220px;
  position: relative;
}

.book-card-selected {
  border: 2px solid var(--color-primary);
  border-radius: 4px;
}

.book-content {
  display: flex;
  height: 100%;
  position: relative;
}

.book-cover {
  margin-right: 16px;
  flex-shrink: 0;
}

.book-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}

.book-title {
  margin: 0 0 12px 0;
  color: var(--color-text-1);
  font-size: 18px;
  font-weight: bold;
}

.info-item {
  margin-bottom: 8px;
  font-size: 14px;
  line-height: 1.5;
}

.info-item .label {
  color: var(--color-text-3);
  margin-right: 4px;
}

.info-item .value {
  color: var(--color-text-1);
}

.header-actions {
  display: flex;
  gap: 12px;
  align-items: center;
}

.checkbox-wrapper {
  position: absolute;
  right: 0;
  top: 0;
  padding: 8px;
}
</style>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import TheHeader from '@/components/TheHeader.vue';

const router = useRouter();
const isManaging = ref(false);
const selectedBooks = reactive({});

const removeSelected = () => {
  // 这里添加移除选中书籍的逻辑
  console.log('要移除的书籍：', selectedBooks);
  // 重置选中状态
  Object.keys(selectedBooks).forEach(key => {
    selectedBooks[key] = false;
  });
  isManaging.value = false;
};

const goToDetail = (bookId: number) => {
  router.push(`/book/${bookId}`);
};
</script>