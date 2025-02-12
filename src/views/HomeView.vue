<template>
  <div class="layout-demo">
    <a-layout>
      <the-header />
      <a-layout>
        <a-layout-sider :width="280">
          <div class="sider-search">
            <a-input-search
              :style="{ width: '90%' }"
              placeholder="搜索书籍..."
              search-button
              :loading="isSearching"
              @search="handleSearch"
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
            <h2>{{ isSearchMode ? '搜索结果' : '我的书架' }}</h2>
            <div class="header-actions">
              <a-button v-if="isSearchMode" @click="backToBookshelf">
                返回书架
              </a-button>
              <template v-else>
                <a-button v-if="isManaging"
                          type="primary" 
                          status="danger" 
                          @click="removeSelected">
                  移除选中书籍
                </a-button>
                <a-button @click="isManaging = !isManaging">
                  {{ isManaging ? '完成' : '管理书架' }}
                </a-button>
              </template>
            </div>
          </div>
          
          <book-list
            :books="currentBooks"
            :show-manage="!isSearchMode && isManaging"
            :empty-text="isSearchMode ? '暂无搜索结果' : '书架空空如也'"
            @select-books="handleSelectBooks"
            @book-click="handleBookClick"
          />
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
  height: 100vh;
  display: flex;
  overflow: hidden;
}

.layout-demo :deep(.arco-layout) {
  height: 100%;
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
  overflow-y: auto;
  height: 100%;
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

.content::-webkit-scrollbar {
  width: 8px;
}

.content::-webkit-scrollbar-track {
  background: var(--color-fill-2);
}

.content::-webkit-scrollbar-thumb {
  background: var(--color-fill-4);
  border-radius: 4px;
}
</style>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import TheHeader from '@/components/TheHeader.vue';
import BookList from '@/components/BookList.vue';
import { Message } from '@arco-design/web-vue';
import { searchNovels, getNovelChapters } from '@/api/novel';

const router = useRouter();
const isManaging = ref(false);
const isSearching = ref(false);
const isSearchMode = ref(false);
const searchResults = ref([]);
const selectedBooks = ref({});

interface Book {
  source_id: string;
  name: string;
  author: string;
  status: string;
  cover_url: string;
  last_chapter_name: string;
  progress?: string;
  url?: string;
  size?: string;
  classify?: string;
  introduce?: string | null;
  last_update_time?: string;
}

// 修改模拟数据，添加更多书籍
const bookshelfBooks = ref<Book[]>([
  {
    source_id: '1',
    name: '诡秘之主',
    author: '爱潜水的乌贼',
    status: '已完结',
    cover_url: 'https://www.bqgl.cc/bookimg/113/113680.jpg',
    last_chapter_name: '第1986章 大结局',
    progress: '第23章 初入歧路'
  },
  {
    source_id: '2',
    name: '我的治愈系游戏',
    author: '我会修空调',
    status: '连载中',
    cover_url: 'https://www.bqgl.cc/bookimg/113/113680.jpg',
    last_chapter_name: '第1024章',
    progress: '第156章'
  },
  {
    source_id: '3',
    name: '大奉打更人',
    author: '卖报小郎君',
    status: '已完结',
    cover_url: 'https://www.bqgl.cc/bookimg/113/113680.jpg',
    last_chapter_name: '第1614章 终章',
    progress: '第45章'
  }
]);

const currentBooks = computed(() => {
  return isSearchMode.value ? searchResults.value : bookshelfBooks.value;
});

const handleSearch = async (searchValue: string) => {
  if (!searchValue.trim()) {
    Message.warning('请输入搜索关键词');
    return;
  }
  
  isSearching.value = true;
  try {
    const { data } = await searchNovels(searchValue);
    searchResults.value = data;
    isSearchMode.value = true;
  } catch (error) {
    console.error('搜索失败：', error);
    Message.error('搜索失败，请稍后重试');
  } finally {
    isSearching.value = false;
  }
};

const backToBookshelf = () => {
  isSearchMode.value = false;
  searchResults.value = [];
};

const handleSelectBooks = (books: Record<string, boolean>) => {
  selectedBooks.value = books;
};

const handleBookClick = async (book: Book) => {
  if (isSearchMode.value) {
    try {
      // 获取章节列表
      const novelDetail = {
        name: book.name,
        url: book.url || '',
        source_id: book.source_id,
        size: book.size || '',
        author: book.author,
        status: book.status,
        cover_url: book.cover_url,
        classify: book.classify || '',
        introduce: book.introduce || null,
        last_update_time: book.last_update_time || '',
        last_chapter_name: book.last_chapter_name
      };
      
      const { data } = await getNovelChapters(novelDetail);
      
      // 将章节列表和书籍信息存储到 localStorage
      localStorage.setItem(`chapters_${book.source_id}`, JSON.stringify(data.chapter_list));
      localStorage.setItem(`book_${book.source_id}`, JSON.stringify(novelDetail));
      
      // 跳转到详情页
      router.push(`/book/${book.source_id}`);
    } catch (error) {
      console.error('获取章节列表失败：', error);
      Message.error('获取章节列表失败，请稍后重试');
    }
  } else {
    // 直接跳转到书架中的书籍详情页
    router.push(`/book/${book.source_id}`);
  }
};

const removeSelected = () => {
  // 处理移除选中书籍的逻辑
  console.log('要移除的书籍：', selectedBooks.value);
  // 重置选中状态
  selectedBooks.value = {};
  isManaging.value = false;
};
</script>