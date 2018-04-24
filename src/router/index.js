import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import Dashboard from '@/components/Dashboard'

import AccountList from '@/components/account/list'

import MemberList from '@/components/member/list'

import GradeList from '@/components/grade/list'

import ContentList from '@/components/content/list'

import TrainList from '@/components/train/list'
import EnrollList from '@/components/train/enrollList'

import UserChangePwd from '@/components/user/changepwd'
import UserProfile from '@/components/user/profile'

// 懒加载方式，当路由被访问的时候才加载对应组件
const Login = resolve => require(['@/components/Login'], resolve)

Vue.use(Router)

let router = new Router({
// mode: 'history',
  routes: [
    {
      path: '/login',
      name: '登录',
      component: Login
    },
    {
      path: '/',
      name: 'home',
      component: Home,
      redirect: '/dashboard',
      leaf: true, // 只有一个节点
      menuShow: true,
      iconCls: 'iconfont icon-home', // 图标样式class
      children: [
        {path: '/dashboard', component: Dashboard, name: '首页', menuShow: true}
      ]
    },
    {
      path: '/',
      component: Home,
      name: '账号管理',
      menuShow: true,
      leaf: true, // 只有一个节点
      iconCls: 'iconfont icon-users', // 图标样式class
      children: [
        {path: '/account/account', component: AccountList, name: '账号管理', menuShow: true}
      ]
    },
    {
      path: '/',
      component: Home,
      name: '会员管理',
      menuShow: true,
      leaf: true, // 只有一个节点
      iconCls: 'iconfont icon-users', // 图标样式class
      children: [
        {path: '/member/member', component: MemberList, name: '会员管理', menuShow: true}
      ]
    },
    {
      path: '/',
      component: Home,
      name: '等级管理',
      menuShow: true,
      leaf: true, // 只有一个节点
      iconCls: 'iconfont icon-users', // 图标样式class
      children: [
        {path: '/grade/grade', component: GradeList, name: '等级管理', menuShow: true}
      ]
    },
    {
      path: '/',
      component: Home,
      name: '内容管理',
      menuShow: true,
      leaf: true, // 只有一个节点
      iconCls: 'iconfont icon-users', // 图标样式class
      children: [
        {path: '/content/content', component: ContentList, name: '内容管理', menuShow: true}
      ]
    },
    
    {
      path: '/',
      component: Home,
      name: '培训管理',
      menuShow: true,
      leaf: false, // 只有一个节点
      iconCls: 'iconfont icon-users', // 图标样式class
      children: [
        {path: '/train/train', component: TrainList, name: '培训管理', menuShow: true},
        {path: '/train/enrollList', component: EnrollList, name: '报名信息', menuShow: true}
      ]
    },
    {
      path: '/',
      component: Home,
      name: '设置',
      menuShow: true,
      iconCls: 'iconfont icon-setting1',
      children: [
        {path: '/user/profile', component: UserProfile, name: '个人信息', menuShow: true},
        {path: '/user/changepwd', component: UserChangePwd, name: '修改密码', menuShow: true}
      ]
    }
  ]
})

router.beforeEach((to, from, next) => {
  // console.log('to:' + to.path)
  if (to.path.startsWith('/login')) {
    window.localStorage.removeItem('access-user')
    next()
  } else {
    let user = JSON.parse(window.localStorage.getItem('access-user'))
    if (!user) {
      next({path: '/login'})
    } else {
      next()
    }
  }
})

export default router
