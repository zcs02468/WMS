/**
 * @file 路由配置
 * @author
 */
import Vue from 'vue';
import VueRouter from 'vue-router';
import axios from 'axios';
import API from '../api/index'
import store from '../store/index'

import Management from '../pages/management.vue';
import Inspection from '../pages/inspection.vue';
import Survey from '../pages/survey.vue';
import Lease from '../pages/lease.vue';
import Site from '../pages/site.vue';
import AddActivity from '../pages/addActivity.vue';
import Href from '../pages/href.vue';

Vue.use(VueRouter);

// export default new Router({
const router = new VueRouter({
    routes: [
        {
            path: '/',
            name: 'Management',
            component: Management,
            meta: {
                title: '倉儲管理系統'
            }
        },
        {
            path: '/href',
            name: 'Href',
            component: Href
        },
        {
            path: '/inspection',
            name: 'Inspection',
            component: Inspection,
            meta: {
                title: '巡檢系統'
            }
        },
        {
            path: '/survey',
            name: 'Survey',
            component: Survey,
            meta: {
                title: '巡檢系統'
            }
        },
        {
            path: '/lease',
            name: 'Lease',
            component: Lease,
            meta: {
                title: '場地租借管理系統'
            }
        },
        {
            path: '/site',
            name: 'Site',
            component: Site,
            meta: {
                title: '場地借用一覽'
            }
        },
        {
            path: '/addActivity',
            name: 'AddActivity',
            component: AddActivity,
            meta: {
                title: '場地預約'
            }
        }
    ]
});


router.beforeEach(function(to, from, next ) {
    // let System,Ticket;
    // if (to.meta.title) {
    //     document.title = to.meta.title
    // }
    // console.log( to,from)
    // console.log( to.query.System == undefined,'%%%%%%%%%%%%%%%')
    // if( to.name == 'Href' ) {
    //     next();
    //     return;
    // }
    // if(to.query.System == undefined && to.query.Ticket == undefined && to.name == 'Site') {
    //     next();
    //     return;
    // }
    // if( to.name == 'AddActivity' && to.query.id == undefined ) {
    //     next();
    //     return;
    // }
    // if( to.query.qrcode == undefined ) {
    //     System = to.query.System
    //     Ticket = to.query.Ticket
    //     System = 1
    //     Ticket = 'this_is_a_pass_test_ticket'
    //     let data = {
    //         "System": System,
    //         "Ticket": Ticket
    //     }
    //     axios.post(API.login2,data).then(res =>{
    //         store.state.userData = res.data
    //         store.state.userData.DeptType = 1
    //         next()
    //     }).catch( err => { 
    //         next('/href')
    //     })
    // }else {
        next()
    // }
})

export default router;
