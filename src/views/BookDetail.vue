<template>
  <div class="layout-demo">
    <a-layout style="min-height: 100vh;">
      <the-header />
      <a-layout>
        <a-layout-sider :width="280">
          <div class="chapter-list">
            <div class="chapter-header">
              <span>目录</span>
              <a-button type="text" size="small" @click="reverseChapterList">
                {{ isReverse ? '正序' : '倒序' }}
              </a-button>
            </div>
            <a-scrollbar>
              <a-menu :style="{ width: '100%' }" @click="handleChapterClick">
                <a-menu-item 
                  v-for="chapter in displayChapters" 
                  :key="chapter.id"
                  :class="{ 'reading': chapter.id === currentChapter }"
                >
                  {{ chapter.title }}
                </a-menu-item>
              </a-menu>
            </a-scrollbar>
          </div>
        </a-layout-sider>
        <a-layout-content class="content">
          <div class="book-detail">
            <div class="book-header">
              <div class="book-cover">
                <a-image
                  :width="200"
                  src="https://www.bqgl.cc/bookimg/113/113680.jpg"
                  :preview="false"
                />
              </div>
              <div class="book-info">
                <h1 class="book-title">诡秘之主</h1>
                <div class="info-row">
                  <span class="label">作者：</span>
                  <span class="value">爱潜水的乌贼</span>
                </div>
                <div class="info-row">
                  <span class="label">分类：</span>
                  <span class="value">玄幻奇幻</span>
                </div>
                <div class="info-row">
                  <span class="label">状态：</span>
                  <span class="value">已完结</span>
                </div>
                <div class="info-row">
                  <span class="label">字数：</span>
                  <span class="value">584万字</span>
                </div>
                <div class="info-row">
                  <span class="label">最新：</span>
                  <span class="value">第1986章 大结局</span>
                </div>
                <div class="action-buttons">
                  <a-button type="primary" size="large" @click="startReading">
                    立即阅读
                  </a-button>
                  <a-button 
                    :type="isInShelf ? 'outline' : 'secondary'"
                    size="large"
                    @click="toggleShelf"
                  >
                    {{ isInShelf ? '移出书架' : '加入书架' }}
                  </a-button>
                </div>
              </div>
            </div>
            <div class="book-intro">
              <h2>作品简介</h2>
              <p>这是一个诡秘的世界，这是一个当代人穿越的故事......这里有超凡的能力，危险的怪物，神秘的组织......但是，一切的一切都是诡秘的。</p>
            </div>
          </div>
        </a-layout-content>
      </a-layout>
    </a-layout>
  </div>
</template>

<style scoped>
/* 复用 HomeView 的 header 相关样式 */

.chapter-list {
  height: calc(100vh - 64px);
  display: flex;
  flex-direction: column;
  background: var(--color-bg-2);
}

.chapter-header {
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--color-border);
  font-size: 16px;
  font-weight: bold;
  background: var(--color-bg-2);
}

.book-detail {
  padding: 24px;
  background: var(--color-bg-2);
}

.book-header {
  display: flex;
  gap: 24px;
  margin-bottom: 32px;
  background: var(--color-bg-2);
}

.book-cover {
  flex-shrink: 0;
}

.book-info {
  flex: 1;
}

.book-title {
  font-size: 28px;
  margin-bottom: 16px;
  color: var(--color-text-1);
}

.info-row {
  margin-bottom: 12px;
  font-size: 16px;
}

.info-row .label {
  color: var(--color-text-3);
  margin-right: 8px;
}

.info-row .value {
  color: var(--color-text-1);
}

.action-buttons {
  margin-top: 24px;
  display: flex;
  gap: 16px;
}

.book-intro {
  padding: 24px;
  background: var(--color-fill-2);
  border-radius: 4px;
  border: 1px solid var(--color-border);
}

.book-intro h2 {
  font-size: 20px;
  margin-bottom: 16px;
  color: var(--color-text-1);
}

.book-intro p {
  font-size: 16px;
  line-height: 1.6;
  color: var(--color-text-2);
}

:deep(.reading) {
  color: var(--color-primary);
}

:deep(.arco-scrollbar) {
  height: calc(100vh - 120px);
  background: var(--color-bg-2);
}

:deep(.arco-menu) {
  background: var(--color-bg-2);
}

:deep(.arco-menu-item) {
  color: var(--color-text-1);
}

:deep(.arco-menu-item:hover) {
  background-color: var(--color-fill-2);
}

.layout-demo {
  width: 100%;
  min-height: 100vh;
  background: var(--color-fill-2);
}

.content {
  background: var(--color-bg-2);
}
</style>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import TheHeader from '@/components/TheHeader.vue';

const router = useRouter();
const isInShelf = ref(true);
const isReverse = ref(false);
const currentChapter = ref(1);

// 模拟章节数据
const chapters = Array.from({ length: 1986 }, (_, i) => ({
  id: i + 1,
  title: `第${i + 1}章 ${i + 1 === 1986 ? '大结局' : '章节名称'}`
}));

const displayChapters = ref(chapters);

const toggleShelf = () => {
  isInShelf.value = !isInShelf.value;
  // TODO: 实现加入/移出书架的逻辑
};

const startReading = () => {
  // TODO: 跳转到阅读页面
  router.push(`/read/${currentChapter.value}`);
};

const handleChapterClick = (key: string) => {
  currentChapter.value = Number(key);
  // TODO: 跳转到对应章节
};

const reverseChapterList = () => {
  isReverse.value = !isReverse.value;
  displayChapters.value = [...chapters].reverse();
};
</script> 