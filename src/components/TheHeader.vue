<template>
  <a-layout-header class="header">
    <div class="header-content">
      <div class="logo">
        <img src="https://www.hive-net.cn/Assets/SiteGlobal/Hive_color.png" class="logo-img" alt="icon"/>
        <span class="logo-text">悦读</span>
      </div>
      <div class="header-right">
        <a-button 
          class="theme-btn"
          shape="circle"
          @click="toggleTheme"
        >
          <template #icon>
            <icon-moon-fill v-if="isDark" />
            <icon-sun-fill v-else />
          </template>
        </a-button>
      </div>
    </div>
  </a-layout-header>
</template>

<style scoped>
.header {
  padding: 0 20px;
  background: var(--color-bg-2);
  border-bottom: 1px solid var(--color-border);
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
}

.logo {
  display: flex;
  align-items: center;
  gap: 16px;
}

.logo-img {
  width: 50px;
  height: 70px;
  object-fit: contain;
}

.logo-text {
  font-size: 45px;
  font-weight: bold;
  color: var(--color-text-1);
  line-height: 40px;
  font-family: serif;
}

.header-right {
  display: flex;
  align-items: center;
}

.theme-btn {
  font-size: 18px;
  color: var(--color-text-2);
}
</style>

<script setup lang="ts">
import { ref } from 'vue';
import { IconMoonFill, IconSunFill } from '@arco-design/web-vue/es/icon';

const isDark = ref(false);

const toggleTheme = () => {
  isDark.value = !isDark.value;
  const body = document.body;
  if (isDark.value) {
    body.setAttribute('arco-theme', 'dark');
  } else {
    body.removeAttribute('arco-theme');
  }
};

// 初始化主题
const initTheme = () => {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  isDark.value = prefersDark;
  if (prefersDark) {
    document.body.setAttribute('arco-theme', 'dark');
  }
};

// 在组件挂载时初始化主题
initTheme();
</script>