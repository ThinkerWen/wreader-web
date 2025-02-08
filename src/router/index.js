import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/HomeView.vue'; // 引入 Home 组件
import BookDetail from '../views/BookDetail.vue'; // 引入 Home 组件

const routes = [
  {
    path: '/',       // 根路径
    name: 'Home',
    component: Home, // 对应的组件
  },{
    path: '/book/:id',
    name: 'BookDetail',
    component: BookDetail
  }
];

const router = createRouter({
  history: createWebHistory(),  // 使用 HTML5 History 模式
  routes,
});

export default router;
