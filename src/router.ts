import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';
import Favorites from './views/Favorites.vue';
import ConfigList from './views/ConfigList.vue';
import Settings from './views/Settings.vue';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/config-list',
      name: 'config-list',
      component: ConfigList
    },
    {
      path: '/favorites',
      name: 'favorites',
      component: Favorites
    },
    {
      path: '/settings',
      name: 'settings',
      component: Settings
    }
  ]
});
