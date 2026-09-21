import {createRouter, createWebHistory} from 'vue-router'

export const routes = createRouter({
    history: createWebHistory(),
    routes:[
        {
            path:"/",
            name:"Home",
            component:()=>import("../views/Home.vue")
        },
        {
            path:"/login",
            name:"login",
            component:()=>import("../views/auth/login.vue")
        },
        {
            path:"/register",
            name:"register",
            component:()=>import("../views/auth/register.vue")
        },
        {
            path:"/preview",
            name:"preview",
            component:()=>import("../views/managerDashboard/OrderDetailsColorsTab.vue")
        }
    ]
})