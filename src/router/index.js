import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/HomeView.vue';
import BookDetail from '../views/BookDetail.vue';
import ReadView from '../views/ReadView.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },{
    path: '/book/:id',
    name: 'BookDetail',
    component: BookDetail
  },{
    path: '/read/:id',
    name: 'Read',
    component: ReadView
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
