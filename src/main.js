/**
 * @file
 * @author
 */
import Vue from 'vue';
// import Axios from 'axios';
import Axios from './api/axios';
import App from './App';
import router from './router';
import store from './store';

import {Table, TableColumn, DatePicker, Pagination, Button, MessageBox, Input, TimeSelect} from 'element-ui';

import './style/reset.css';
import './style/reset-element.less';

Vue.use(Table).use(TableColumn).use(DatePicker).use(Pagination).use(Button).use(Input).use(TimeSelect);

Vue.prototype.$alert = MessageBox.alert;
Axios.defaults.withCredentials = true;
Vue.prototype.$axios = Axios;
Vue.config.productionTip = false;

new Vue({
    el: '#app',
    router,
    store,
    components: {App},
    template: '<App/>'
});
