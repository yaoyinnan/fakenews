import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/register',
    component: () => import('@/views/login/register'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  /**
   * 首页
   */
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/detect/index'),
      meta: { title: '虚假新闻检测系统', icon: 'dashboard' }
    }]
  },

  /**
   * 假新闻检测
   */
  {
    path: '/detect',
    component: Layout,
    redirect: '/detect/detect',
    name: 'Detect',
    meta: { title: '人工检测', icon: 'el-icon-aim' },
    children: [
      {
        path: 'detect',
        name: 'Detect',
        component: () => import('@/views/detect/index'),
        meta: { title: '检测新闻', icon: 'form' }
      },
      {
        path: 'recent',
        name: 'Recent',
        component: () => import('@/views/detect/recent'),
        meta: { title: '近日新闻', icon: 'el-icon-receiving' }
      },
      {
        path: 'favorite',
        name: 'Favorite',
        component: () => import('@/views/detect/favorite'),
        meta: { title: '收藏新闻', icon: 'el-icon-star-off' }
      },
      {
        path: 'doubtful',
        name: 'Doubtful',
        component: () => import('@/views/detect/doubtful'),
        meta: { title: '存疑新闻', icon: 'el-icon-warning-outline' }
      }
    ]
  },

  /**
   * 自动检测
   */
  {
    path: '/autoDetect',
    component: Layout,
    children: [{
      path: 'autoDetect',
      name: 'AutoDetect',
      component: () => import('@/views/autoDetect/index'),
      meta: { title: '自动检测', icon: 'el-icon-s-help' }
    },
      /**
       * 自动检测详情页
       */
      {
        path: '/autoDetectItem',
        component: () => import('@/views/autoDetect/item'),
        hidden: true
      }]
  },

  /**
   * 新闻辟谣
   */
  {
    path: '/review',
    component: Layout,
    redirect: '/review/review',
    name: 'Review',
    meta: { title: '新闻审核', icon: 'el-icon-aim' },
    children: [
      {
        path: 'review',
        name: 'Review',
        component: () => import('@/views/review/index'),
        meta: { title: '新闻辟谣', icon: 'link' }
      },
      {
        path: 'reviewFavorite',
        name: 'ReviewFavorite',
        component: () => import('@/views/review/favorite'),
        meta: { title: '收藏辟谣', icon: 'el-icon-star-off' }
      },
      /**
       * 证据页
       */
      {
        path: '/evidence',
        component: () => import('@/views/review/evidence'),
        hidden: true
      }
    ]
  },

  // 测试
  {
    path: '/test',
    component: Layout,
    children: [{
      path: 'test',
      name: 'Test',
      component: () => import('@/views/test/index'),
      meta: { title: '测试', icon: 'link' }
    }]
  },

  //
  // {
  //   path: '/example',
  //   component: Layout,
  //   redirect: '/example/table',
  //   name: 'Example',
  //   meta: { title: 'Example', icon: 'el-icon-s-help' },
  //   children: [
  //     {
  //       path: 'table',
  //       name: 'Table',
  //       component: () => import('@/views/table/index'),
  //       meta: { title: 'Table', icon: 'table' }
  //     },
  //     {
  //       path: 'tree',
  //       name: 'Tree',
  //       component: () => import('@/views/tree/index'),
  //       meta: { title: 'Tree', icon: 'tree' }
  //     }
  //   ]
  // },
  //
  // {
  //   path: '/form',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       name: 'Form',
  //       component: () => import('@/views/form/index'),
  //       meta: { title: 'Form', icon: 'form' }
  //     }
  //   ]
  // },
  //
  // {
  //   path: '/nested',
  //   component: Layout,
  //   redirect: '/nested/menu1',
  //   name: 'Nested',
  //   meta: {
  //     title: 'Nested',
  //     icon: 'nested'
  //   },
  //   children: [
  //     {
  //       path: 'menu1',
  //       component: () => import('@/views/nested/menu1/index'), // Parent router-view
  //       name: 'Menu1',
  //       meta: { title: 'Menu1' },
  //       children: [
  //         {
  //           path: 'menu1-1',
  //           component: () => import('@/views/nested/menu1/menu1-1'),
  //           name: 'Menu1-1',
  //           meta: { title: 'Menu1-1' }
  //         },
  //         {
  //           path: 'menu1-2',
  //           component: () => import('@/views/nested/menu1/menu1-2'),
  //           name: 'Menu1-2',
  //           meta: { title: 'Menu1-2' },
  //           children: [
  //             {
  //               path: 'menu1-2-1',
  //               component: () => import('@/views/nested/menu1/menu1-2/menu1-2-1'),
  //               name: 'Menu1-2-1',
  //               meta: { title: 'Menu1-2-1' }
  //             },
  //             {
  //               path: 'menu1-2-2',
  //               component: () => import('@/views/nested/menu1/menu1-2/menu1-2-2'),
  //               name: 'Menu1-2-2',
  //               meta: { title: 'Menu1-2-2' }
  //             }
  //           ]
  //         },
  //         {
  //           path: 'menu1-3',
  //           component: () => import('@/views/nested/menu1/menu1-3'),
  //           name: 'Menu1-3',
  //           meta: { title: 'Menu1-3' }
  //         }
  //       ]
  //     },
  //     {
  //       path: 'menu2',
  //       component: () => import('@/views/nested/menu2/index'),
  //       name: 'Menu2',
  //       meta: { title: 'menu2' }
  //     }
  //   ]
  // },
  //
  // {
  //   path: 'external-link',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'https://panjiachen.github.io/vue-element-admin-site/#/',
  //       meta: { title: 'External Link', icon: 'link' }
  //     }
  //   ]
  // },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  base: '/dist/',
  // mode: 'history',
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
