import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/HomeView.vue'; // 引入 Home 组件

const routes = [
  {
    path: '/',       // 根路径
    name: 'Home',
    component: Home, // 对应的组件
  },
  // 可以在这里添加更多路由
];

const router = createRouter({
  history: createWebHistory(),  // 使用 HTML5 History 模式
  routes,
});

export default router;
