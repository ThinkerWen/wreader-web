<template>
  <div class="layout-demo">
    <a-layout>
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
              <a-menu :style="{ width: '100%' }">
                <a-menu-item 
                  v-for="(chapter, index) in displayChapters" 
                  :key="index"
                  :class="{ 'reading': index === currentChapter }"
                  @click="handleMenuClick(index)"
                >
                  {{ chapter.name }}
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
                <h1 class="book-title">{{ bookDetail?.name }}</h1>
                <div class="info-row">
                  <span class="label">作者：</span>
                  <span class="value">{{ bookDetail?.author }}</span>
                </div>
                <div class="info-row">
                  <span class="label">分类：</span>
                  <span class="value">{{ bookDetail?.classify || '未知' }}</span>
                </div>
                <div class="info-row">
                  <span class="label">状态：</span>
                  <span class="value">{{ bookDetail?.status }}</span>
                </div>
                <div class="info-row">
                  <span class="label">字数：</span>
                  <span class="value">{{ bookDetail?.size || '未知' }}</span>
                </div>
                <div class="info-row">
                  <span class="label">最新：</span>
                  <span class="value">{{ bookDetail?.last_chapter_name }}</span>
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
  height: 100%;
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
  height: calc(100% - 56px);
  background: var(--color-bg-2);
}

:deep(.arco-scrollbar-track) {
  background-color: var(--color-fill-2) !important;
}

:deep(.arco-scrollbar-thumb) {
  background-color: var(--color-fill-4) !important;
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
  height: 100vh;
  display: flex;
  overflow: hidden;
}

.layout-demo :deep(.arco-layout) {
  height: 100%;
}

.content {
  background: var(--color-bg-2);
}
</style>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import TheHeader from '@/components/TheHeader.vue';
import { getNovelChapters } from '@/api/novel';
import { Message } from '@arco-design/web-vue';

const router = useRouter();
const route = useRoute();
const isInShelf = ref(true);
const isReverse = ref(false);
const currentChapter = ref(1);

interface Chapter {
  name: string;
  url: string;
}

interface NovelDetail {
  name: string;
  url: string;
  source_id: string;
  size: string;
  author: string;
  status: string;
  cover_url: string;
  classify: string;
  introduce: string | null;
  last_update_time: string;
  last_chapter_name: string;
}

const displayChapters = ref<Chapter[]>([]);
const originalChapters = ref<Chapter[]>([]);
const bookDetail = ref<NovelDetail | null>(null);

onMounted(async () => {
  const bookId = route.params.id as string;
  
  // 从 localStorage 获取章节列表和书籍信息
  const chaptersData = localStorage.getItem(`chapters_${bookId}`);
  const bookData = localStorage.getItem(`book_${bookId}`);
  
  if (chaptersData && bookData) {
    const chapters = JSON.parse(chaptersData);
    const book = JSON.parse(bookData);
    originalChapters.value = chapters;
    displayChapters.value = [...chapters];
    bookDetail.value = book;
  } else {
    // 如果 localStorage 中没有数据，则重新请求
    try {
      // 这里应该从某处获取书籍详情，暂时使用模拟数据
      const novelDetail: NovelDetail = {
        name: '诡秘之主',
        url: '',
        source_id: bookId,
        size: '',
        author: '爱潜水的乌贼',
        status: '已完结',
        cover_url: 'https://www.bqgl.cc/bookimg/113/113680.jpg',
        classify: '',
        introduce: null,
        last_update_time: '',
        last_chapter_name: '第1986章 大结局'
      };
      
      const { data } = await getNovelChapters(novelDetail);
      originalChapters.value = data.chapter_list;
      displayChapters.value = [...data.chapter_list];
      bookDetail.value = novelDetail;
      
      // 存储到 localStorage
      localStorage.setItem(`chapters_${bookId}`, JSON.stringify(data.chapter_list));
      localStorage.setItem(`book_${bookId}`, JSON.stringify(novelDetail));
    } catch (error) {
      console.error('获取章节列表失败：', error);
      Message.error('获取章节列表失败，请稍后重试');
    }
  }
});

const toggleShelf = () => {
  isInShelf.value = !isInShelf.value;
  // TODO: 实现加入/移出书架的逻辑
};

const startReading = () => {
  if (displayChapters.value.length > 0 && bookDetail.value) {
    // 获取第一章
    const firstChapter = displayChapters.value[0];
    router.push({
      path: `/read/${currentChapter.value}`,
      query: {
        url: firstChapter.url,
        chapter: JSON.stringify(firstChapter),
        novel: JSON.stringify(bookDetail.value)
      }
    });
  }
};

const handleMenuClick = (index: number) => {
  const chapter = displayChapters.value[index];
  if (chapter && bookDetail.value) {
    currentChapter.value = index;
    router.push({
      path: `/read/${currentChapter.value}`,
      query: {
        url: chapter.url,
        chapter: JSON.stringify(chapter),
        novel: JSON.stringify(bookDetail.value)
      }
    });
  }
};

const reverseChapterList = () => {
  isReverse.value = !isReverse.value;
  if (isReverse.value) {
    displayChapters.value = [...originalChapters.value].reverse();
  } else {
    displayChapters.value = [...originalChapters.value];
  }
};
</script> 