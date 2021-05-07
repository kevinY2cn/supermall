import Vue from 'vue'
import VueRouter from 'vue-router'

//懒加载组件
const Home = () => import('../views/Home')
const Login = () => import('../views/Login')
const Register = () => import('../views/Register')
const Shop = () => import('../views/Shop')
const Authority = () => import('../views/Authority')

//1.安装VueRouter
Vue.use(VueRouter)

const routes = [
  {
    path: '',
    redirect: '/home'
  },
  {
    path: '/home',
    component: Home
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/register',
    component: Register
  },
  {
    path: '/shop',
    component: Shop
  },
  {
    path: '/authority',
    component: Authority
  }
]

//2.构造router
const router = new VueRouter({
  routes,
  mode: "history"
})

export default router
