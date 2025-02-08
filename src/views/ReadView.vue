<template>
  <div class="read-container">
    <!-- 左侧章节抽屉 -->
    <a-drawer
      :visible="showChapterList"
      @cancel="showChapterList = false"
      :width="300"
      :footer="false"
      unmountOnClose
      placement="left"
    >
      <template #title>
        <div class="drawer-header">
          <span>目录</span>
          <a-button type="text" size="small" @click="reverseChapterList">
            {{ isReverse ? '正序' : '倒序' }}
          </a-button>
        </div>
      </template>
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
    </a-drawer>

    <!-- 顶部控制栏 - 默认隐藏，鼠标移动时显示 -->
    <div class="control-bar" :class="{ 'show': showControls }">
      <div class="left-controls">
        <a-button type="text" @click="showChapterList = true">
          <template #icon>
            <icon-menu />
          </template>
          目录
        </a-button>
        <a-button type="text" @click="goBack">
          <template #icon>
            <icon-arrow-left />
          </template>
          返回
        </a-button>
      </div>
      <div class="right-controls">
        <a-button-group>
          <a-button type="text" @click="prevChapter">上一章</a-button>
          <a-button type="text" @click="nextChapter">下一章</a-button>
        </a-button-group>
      </div>
    </div>

    <!-- 修改内容区域的结构 -->
    <div class="content-wrapper" @mousemove="handleMouseMove">
      <div class="content-scroll">
        <div class="content-container">
          <div class="chapter-content">
            <h1>{{ currentChapterTitle }}</h1>
            <div class="text-content">
              {{ chapterContent }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.read-container {
  width: 100vw;
  height: 100vh;
  background: var(--color-bg-1);
  position: relative;
  display: flex;
  flex-direction: column;
  overflow: hidden; /* 防止整体滚动 */
}

.control-bar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 48px;
  background: var(--color-bg-2);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  transform: translateY(-100%);
  transition: transform 0.3s ease;
  z-index: 100;
  border-bottom: 1px solid var(--color-border);
}

.control-bar.show {
  transform: translateY(0);
}

.left-controls,
.right-controls {
  display: flex;
  gap: 12px;
  align-items: center;
}

/* 修改内容区域的样式 */
.content-wrapper {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 20px;
  overflow: hidden;
}

.content-scroll {
  width: 800px; /* 固定宽度 */
  height: 100%;
  overflow-y: auto; /* 只在这里启用滚动 */
  background: var(--color-bg-2);
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.content-container {
  padding: 40px 20px;
}

.chapter-content {
  /* 移除 max-width，因为父容器已经固定宽度 */
  background: transparent; /* 移除背景，因为已经在父容器设置 */
  box-shadow: none; /* 移除阴影，因为已经在父容器设置 */
}

.chapter-content h1 {
  text-align: center;
  margin-bottom: 30px;
  color: var(--color-text-1);
  font-size: 24px;
}

.text-content {
  font-size: 18px;
  line-height: 1.8;
  color: var(--color-text-1);
  text-align: justify;
  letter-spacing: 0.5px;
  white-space: pre-wrap;
}

/* 将滚动条样式应用到正确的元素 */
.content-scroll::-webkit-scrollbar {
  width: 8px;
}

.content-scroll::-webkit-scrollbar-track {
  background: transparent;
}

.content-scroll::-webkit-scrollbar-thumb {
  background: transparent;
  border-radius: 4px;
}

.content-scroll:hover::-webkit-scrollbar-thumb {
  background: var(--color-fill-4);
}

/* 抽屉样式覆盖 */
:deep(.arco-drawer-header) {
  border-bottom: 1px solid var(--color-border);
}

.drawer-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}
</style>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { IconMenu, IconArrowLeft } from '@arco-design/web-vue/es/icon';

const router = useRouter();
const route = useRoute();
const showChapterList = ref(false);
const showControls = ref(false);
const isReverse = ref(false);
const currentChapter = ref(Number(route.params.id) || 1);

// 控制栏自动隐藏
let hideTimeout: number;
const handleMouseMove = () => {
  showControls.value = true;
  clearTimeout(hideTimeout);
  hideTimeout = window.setTimeout(() => {
    showControls.value = false;
  }, 3000);
};

// 模拟章节数据
const chapters = Array.from({ length: 1986 }, (_, i) => ({
  id: i + 1,
  title: `第${i + 1}章 ${i + 1 === 1986 ? '大结局' : '章节名称'}`
}));

const originalChapters = [...chapters];
const displayChapters = ref([...chapters]);

// 模拟当前章节内容
const currentChapterTitle = ref(chapters[currentChapter.value - 1].title);
const chapterContent = ref('这是一个测试章节的内容...\n'.repeat(50));

const reverseChapterList = () => {
  isReverse.value = !isReverse.value;
  if (isReverse.value) {
    displayChapters.value = [...chapters].reverse();
  } else {
    displayChapters.value = [...originalChapters];
  }
};

const handleChapterClick = (key: string) => {
  currentChapter.value = Number(key);
  showChapterList.value = false;
  // TODO: 加载新章节内容
};

const goBack = () => {
  router.back();
};

const prevChapter = () => {
  if (currentChapter.value > 1) {
    currentChapter.value--;
    // TODO: 加载新章节内容
  }
};

const nextChapter = () => {
  if (currentChapter.value < chapters.length) {
    currentChapter.value++;
    // TODO: 加载新章节内容
  }
};

onMounted(() => {
  handleMouseMove();
});

onUnmounted(() => {
  clearTimeout(hideTimeout);
});
</script> 