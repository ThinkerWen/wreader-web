<template>
  <a-row :gutter="[16, 16]" class="book-grid">
    <a-col :span="8" v-for="book in books" :key="book.source_id">
      <a-card 
        class="book-card" 
        :bordered="false" 
        :class="{ 'book-card-selected': showManage && selectedBooks[book.source_id] }"
        hover
        @click="handleCardClick(book)"
      >
        <div class="book-content">
          <div class="book-cover">
            <a-image
              width="140"
              :src="book.cover_url"
              :preview="false"
            />
          </div>
          <div class="book-info">
            <h4 class="book-title">{{ book.name }}</h4>
            <div class="info-item">
              <span class="label">作者：</span>
              <span class="value">{{ book.author }}</span>
            </div>
            <div class="info-item">
              <span class="label">状态：</span>
              <span class="value">{{ book.status }}</span>
            </div>
            <div class="info-item">
              <span class="label">最新：</span>
              <span class="value">{{ book.last_chapter_name }}</span>
            </div>
            <div v-if="book.progress" class="info-item">
              <span class="label">已读：</span>
              <span class="value">{{ book.progress }}</span>
            </div>
          </div>
          <div v-if="showManage" class="checkbox-wrapper" @click.stop>
            <a-checkbox v-model="selectedBooks[book.source_id]" />
          </div>
        </div>
      </a-card>
    </a-col>
    <a-col :span="24" v-if="books.length === 0">
      <div class="empty-result">
        <a-empty :description="emptyText" />
      </div>
    </a-col>
  </a-row>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue';

interface Book {
  source_id: string;
  name: string;
  author: string;
  status: string;
  cover_url: string;
  last_chapter_name: string;
  progress?: string;
  url?: string;
}

const props = defineProps<{
  books: Book[];
  showManage?: boolean;
  emptyText?: string;
}>();

const emit = defineEmits<{
  'select-books': [selectedBooks: Record<string, boolean>];
  'book-click': [book: Book];
}>();

const selectedBooks = reactive<Record<string, boolean>>({});

const handleCardClick = (book: Book) => {
  if (!props.showManage) {
    emit('book-click', book);
  }
};

// 监听选中状态变化
watch(selectedBooks, (newValue) => {
  emit('select-books', newValue);
});
</script>

<style scoped>
.book-grid {
  margin-top: 16px;
}

.book-card {
  display: block;
  padding: 16px;
  transition: all 0.3s;
  height: 220px;
  position: relative;
  cursor: pointer;
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

.checkbox-wrapper {
  position: absolute;
  right: 0;
  top: 0;
  padding: 8px;
  cursor: default;
}

.empty-result {
  padding: 40px 0;
  text-align: center;
}
</style> 