import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';
import ConfigList from './views/ConfigList.vue';
import Setting from './views/Setting.vue';
import SetupList from './views/SetupList.vue';
import SetupDetail from './views/SetupDetail.vue';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            redirect: '/setup-list'
        },
        {
            path: '/config-list',
            name: 'config-list',
            component: ConfigList
        },
        {
            path: '/setup-list',
            name: 'setup-list',
            component: SetupList
        },
        {
            path: '/setups/:id',
            name: 'setup-detail',
            component: SetupDetail
        },
        {
            path: '/settings',
            name: 'settings',
            component: Setting
        }
    ]
});
