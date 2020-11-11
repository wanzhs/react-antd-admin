export const HOME = '/'

export default [
    {
        path: HOME,
        component: 'dashboard',
        icon: 'home',
        title: '首页'
    },
    // {
    //   path: '/message',
    //   icon: 'message',
    //   title: '信息中心',
    //   component: 'message/Inbox',
    //   models: ['inbox']
    // },
    // {
    //     path: '/order-count',
    //     component: 'order/OrderCount',
    //     icon: 'heat-map',
    //     title: '订单统计'
    // },
    {
        path: '/station',
        icon: 'solution',
        title: '场站管理',
        routes:[
            {
                path: '/station/list',
                component: 'station/StationList',
                title: '场站列表'
            },
        ]
    },
    {
        path: '/order',
        icon: 'shop',
        title: '订单管理',
        routes: [
            {
                path: '/order/chargingOrder',
                component: 'order/ConsumeOrderList',
                title: '充电订单'
            },
            // {
            //     path: '/order/chargingPay',
            //     component: 'order/PayOrderList',
            //     title: '充值订单'
            // },
            // {
            //     path: '/order/refundOrder',
            //     component: 'order/RefundOrderList',
            //     title: '退款记录'
            // },
        ]
    },
    {
        path: '/*',
        title: '404',
        navHide: true,
        component: 'common/NotFound',
        component_from: 'components'
    }
] as IRouteItemMinor[]
