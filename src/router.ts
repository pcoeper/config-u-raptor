import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';
import ConfigList from './views/ConfigList.vue';
import Settings from './views/Settings.vue';
import SetupList from './views/SetupList.vue';
import SetupDetail from './views/SetupDetail.vue';

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
      path: '/setups',
      name: 'setups',
      component: SetupList
    },
    {
      path: 'setups/:id',
      name: 'setup-detail',
      component: SetupDetail
    },
    {
      path: '/settings',
      name: 'settings',
      component: Settings
    }
  ]
});
