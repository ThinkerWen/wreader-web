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

    <!-- 左侧固定按钮 -->
    <div class="side-menu">
      <div class="menu-item" @click="showChapterList = true">
        <icon-menu />
        <span>目录</span>
      </div>
      <div class="menu-item" @click="showSettings = true">
        <icon-settings />
        <span>设置</span>
      </div>
      <div class="menu-item">
        <icon-book />
        <span>书架</span>
      </div>
      <div class="menu-item" @click="goBack">
        <icon-arrow-left />
        <span>返回</span>
      </div>
    </div>

    <!-- 主内容区 -->
    <div class="main-content">
      <div class="chapter-content">
        <h1>{{ currentChapterTitle }}</h1>
        <div class="text-content">
          {{ chapterContent }}
        </div>
      </div>
    </div>

    <!-- 右侧翻页按钮 -->
    <div class="page-controls">
      <div class="page-btn prev" @click="prevChapter">
        <icon-up />
      </div>
      <div class="page-btn next" @click="nextChapter">
        <icon-down />
      </div>
    </div>

    <!-- 添加设置抽屉 -->
    <read-settings
      v-model:visible="showSettings"
      @change-theme="handleThemeChange"
      @change-font-size="handleFontSizeChange"
      @change-line-spacing="handleLineSpacingChange"
    />
  </div>
</template>

<style scoped>
.read-container {
  width: 100vw;
  height: 100vh;
  background: v-bind('containerStyle.background');
  display: flex;
  position: relative;
}

.side-menu {
  position: fixed;
  left: 0;
  top: 0;
  width: 60px;
  height: 100vh;
  background: v-bind('containerStyle.background');
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 20px;
  gap: 20px;
  border-right: 1px solid rgba(0, 0, 0, 0.1);
}

.menu-item {
  width: 100%;
  height: 60px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #666;
  font-size: 12px;
  gap: 4px;
}

.menu-item:hover {
  color: #333;
  background: rgba(0, 0, 0, 0.05);
}

.menu-item :deep(svg) {
  font-size: 24px;
}

.main-content {
  flex: 1;
  margin-left: 60px; /* 为左侧菜单留出空间 */
  margin-right: 60px; /* 为右侧按钮留出空间 */
  height: 100vh;
  overflow-y: auto;
  padding: 40px 0;
}

.chapter-content {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 40px;
}

.chapter-content h1 {
  text-align: center;
  margin-bottom: 30px;
  color: #333;
  font-size: 24px;
}

.text-content {
  font-size: v-bind('contentStyle.fontSize + "px"');
  line-height: v-bind('contentStyle.lineHeight');
  color: v-bind('containerStyle.color');
  text-align: justify;
  letter-spacing: 0.5px;
}

.page-controls {
  position: fixed;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 60px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;
}

.page-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(244, 233, 213, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #666;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.page-btn:hover {
  background: rgba(0, 0, 0, 0.05);
  color: #333;
}

/* 自定义滚动条 */
.main-content::-webkit-scrollbar {
  width: 8px;
}

.main-content::-webkit-scrollbar-track {
  background: transparent;
}

.main-content::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 4px;
}

.main-content:hover::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.2);
}
</style>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { 
  IconMenu, 
  IconArrowLeft, 
  IconSettings, 
  IconBook,
  IconUp,
  IconDown
} from '@arco-design/web-vue/es/icon';
import ReadSettings from '@/components/ReadSettings.vue';

const router = useRouter();
const route = useRoute();
const showChapterList = ref(false);
const showControls = ref(false);
const isReverse = ref(false);
const currentChapter = ref(Number(route.params.id) || 1);

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

const showSettings = ref(false);

// 阅读设置相关的状态
const containerStyle = reactive({
  background: 'var(--color-bg-2)',
  color: 'var(--color-text-1)'
});

const contentStyle = reactive({
  fontSize: 18,
  lineHeight: 1.8
});

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

// 处理设置变更
const handleThemeChange = (theme: any) => {
  containerStyle.background = theme.background;
  containerStyle.color = theme.color;
};

const handleFontSizeChange = (size: number) => {
  contentStyle.fontSize = size;
};

const handleLineSpacingChange = (spacing: number) => {
  contentStyle.lineHeight = spacing;
};
</script> 