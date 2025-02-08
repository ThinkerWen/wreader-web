<template>
  <a-drawer
    :visible="visible"
    @cancel="onClose"
    :width="300"
    :footer="false"
    placement="right"
  >
    <template #title>阅读设置</template>
    
    <div class="settings-section">
      <h3>主题颜色</h3>
      <div class="theme-list">
        <div
          v-for="theme in themes"
          :key="theme.name"
          class="theme-item"
          :class="{ active: currentTheme === theme.name }"
          :style="{ background: theme.background }"
          @click="changeTheme(theme)"
        >
          <icon-check v-if="currentTheme === theme.name"/>
        </div>
      </div>
    </div>

    <div class="settings-section">
      <h3>字体大小</h3>
      <div class="font-size-control">
        <span class="size-label">Aa</span>
        <a-slider
          :model-value="fontSize"
          :min="12"
          :max="24"
          :step="1"
          @change="changeFontSize"
        />
        <span class="size-label large">Aa</span>
      </div>
    </div>

    <div class="settings-section">
      <h3>段落间距</h3>
      <div class="spacing-control">
        <icon-minus />
        <a-slider
          :model-value="lineSpacing"
          :min="1.5"
          :max="3"
          :step="0.1"
          @change="changeLineSpacing"
        />
        <icon-plus />
      </div>
    </div>
  </a-drawer>
</template>

<style scoped>
.settings-section {
  margin-bottom: 24px;
}

.settings-section h3 {
  margin-bottom: 16px;
  color: var(--color-text-1);
  font-size: 16px;
}

.theme-list {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}

.theme-item {
  aspect-ratio: 1;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid transparent;
}

.theme-item.active {
  border-color: var(--color-primary);
}

.theme-item :deep(svg) {
  color: var(--color-primary);
  font-size: 20px;
}

.font-size-control,
.spacing-control {
  display: flex;
  align-items: center;
  gap: 12px;
}

.size-label {
  color: var(--color-text-2);
}

.size-label.large {
  font-size: 20px;
}

:deep(.arco-slider) {
  flex: 1;
}
</style>

<script setup lang="ts">
import { ref } from 'vue';
import { IconCheck, IconMinus, IconPlus } from '@arco-design/web-vue/es/icon';

const props = defineProps<{
  visible: boolean
}>();

const emit = defineEmits<{
  (e: 'update:visible', visible: boolean): void
  (e: 'change-theme', theme: any): void
  (e: 'change-font-size', size: number): void
  (e: 'change-line-spacing', spacing: number): void
}>();

const themes = [
  { name: 'default', background: 'var(--color-bg-2)', color: 'var(--color-text-1)' },
  { name: 'sepia', background: '#f4e9d5', color: '#333333' },
  { name: 'dark', background: '#333333', color: '#cccccc' },
  { name: 'green', background: '#e6f3ec', color: '#333333' },
  { name: 'blue', background: '#e8f4f8', color: '#333333' },
  { name: 'pink', background: '#f8e8f0', color: '#333333' },
];

const currentTheme = ref('default');
const fontSize = ref(18);
const lineSpacing = ref(1.8);

const onClose = () => {
  emit('update:visible', false);
};

const changeTheme = (theme: any) => {
  currentTheme.value = theme.name;
  emit('change-theme', theme);
};

const changeFontSize = (size: number) => {
  fontSize.value = size;
  emit('change-font-size', size);
};

const changeLineSpacing = (spacing: number) => {
  lineSpacing.value = spacing;
  emit('change-line-spacing', spacing);
};
</script> 