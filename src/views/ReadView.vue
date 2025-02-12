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
        <a-menu :style="{ width: '100%' }">
          <a-menu-item 
            v-for="(chapter, index) in displayChapters" 
            :key="index"
            :class="{ 'reading': chapter === currentChapter }"
            @click="handleChapterClick(chapter)"
          >
            {{ chapter.name }}
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
      <div class="menu-item" @click="prevChapter">
        <icon-up />
        <span>上一章</span>
      </div>
      <div class="menu-item" @click="nextChapter">
        <icon-down />
        <span>下一章</span>
      </div>
      <div class="menu-item" @click="goBack">
        <icon-arrow-left />
        <span>返回</span>
      </div>
    </div>

    <!-- 主内容区 -->
    <div class="main-content">
      <div class="content-wrapper">
        <div class="chapter-content">
          <h1>{{ currentChapter?.name || '加载中...' }}</h1>
          <div class="text-content" v-html="formattedContent"></div>
        </div>
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
  margin-right: 60px;
  height: 100vh;
  overflow-y: auto;
  padding: 40px 0;
  display: flex;
  justify-content: center;
}

.content-wrapper {
  width: 800px;
}

.chapter-content {
  width: 100%;
  padding: 0 40px;
  background: v-bind('containerStyle.background');
}

.chapter-content h1 {
  text-align: center;
  margin-bottom: 30px;
  color: #333;
  font-size: 24px;
}

.text-content {
  width: 100%;
  font-size: v-bind('contentStyle.fontSize + "px"');
  line-height: v-bind('contentStyle.lineHeight');
  color: v-bind('containerStyle.color');
  text-align: justify;
  letter-spacing: 0.5px;
  white-space: pre-line; /* 保留换行符 */
}

.text-content :deep(br) {
  display: block;
  margin: 0.5em 0;
  content: "";
}

/* 修改滚动条样式，确保紧贴内容 */
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
import { ref, reactive, onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { getChapterContent } from '@/api/novel';
import { Message } from '@arco-design/web-vue';
import { 
  IconMenu, 
  IconArrowLeft, 
  IconSettings, 
  IconBook,
  IconUp,
  IconDown
} from '@arco-design/web-vue/es/icon';
import ReadSettings from '@/components/ReadSettings.vue';

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

const router = useRouter();
const route = useRoute();
const showChapterList = ref(false);
const showControls = ref(false);
const isReverse = ref(false);
const currentChapter = ref<Chapter | null>(null);
const novelInfo = ref<NovelDetail | null>(null);
const displayChapters = ref<Chapter[]>([]);
const originalChapters = ref<Chapter[]>([]);
const chapterContent = ref('');

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

const formattedContent = computed(() => {
  return chapterContent.value
    .replace(/\r\n/g, '<br>')
    .replace(/\n/g, '<br>')
    .replace(/\s\s/g, '&nbsp;&nbsp;');
});

// 加载章节内容
const loadChapterContent = async (novel: NovelDetail, chapter: Chapter) => {
  try {
    const { data } = await getChapterContent(novel, chapter);
    chapterContent.value = data.content;
    currentChapter.value = chapter;
  } catch (error) {
    console.error('获取章节内容失败：', error);
    Message.error('获取章节内容失败，请稍后重试');
  }
};

// 处理章节点击
const handleChapterClick = async (chapter: Chapter) => {
  if (novelInfo.value) {
    showChapterList.value = false;
    await loadChapterContent(novelInfo.value, chapter);
  }
};

// 上一章
const prevChapter = async () => {
  if (currentChapter.value && novelInfo.value) {
    const currentIndex = displayChapters.value.findIndex(c => c.url === currentChapter.value?.url);
    if (currentIndex > 0) {
      const prevChapter = displayChapters.value[currentIndex - 1];
      await loadChapterContent(novelInfo.value, prevChapter);
    }
  }
};

// 下一章
const nextChapter = async () => {
  if (currentChapter.value && novelInfo.value) {
    const currentIndex = displayChapters.value.findIndex(c => c.url === currentChapter.value?.url);
    if (currentIndex < displayChapters.value.length - 1) {
      const nextChapter = displayChapters.value[currentIndex + 1];
      await loadChapterContent(novelInfo.value, nextChapter);
    }
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

const goBack = () => {
  router.back();
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

onMounted(async () => {
  const { query } = route;
  if (query.novel && query.chapter) {
    try {
      const novel = JSON.parse(query.novel as string);
      const chapter = JSON.parse(query.chapter as string);
      novelInfo.value = novel;
      
      // 从 localStorage 获取章节列表
      const chaptersData = localStorage.getItem(`chapters_${novel.source_id}`);
      if (chaptersData) {
        const chapters = JSON.parse(chaptersData);
        originalChapters.value = chapters;
        displayChapters.value = [...chapters];
      }
      
      // 加载章节内容
      await loadChapterContent(novel, chapter);
    } catch (error) {
      console.error('初始化失败：', error);
      Message.error('加载失败，请稍后重试');
    }
  }
});
</script> 