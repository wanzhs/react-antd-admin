import Mock from 'mockjs';
import api from "@scripts/common/api";
import {url} from "@root/src/config/config.constant";

const moment = require('moment')
const {GOOD_LIST, COMPANY_TYPE} = require('./constant');
const {
    sortAndFilterDate,
    addFromNow,
    getFixedNumMonth,
    begetDateTime,
    createImage,
    toDataGoPagination
} = require('./utils')

const {Random, mock} = require('mockjs');
const {capitalize, natural} = Random;

export default [
    {
        url: url + '/' + api.loginAccount,
        type: 'post',
        response: config => {
            return {
                code: 200,
                msg: '成功',
                success: true,
                result: {
                    userName: "admin",
                    userId: "3f4FA265-9b35-eBAD-1396-7E6A9B2fF2B6",
                    authority: "admin"
                }
            }
        },
    }, {
        url: url + '/' + api.verifyIsLogin,
        type: 'get',
        response: config => {
            if ((Math.random() % 2) === 0) {
                return {
                    code: 401,
                    msg: '未登录',
                    success: false,
                    result: {}
                }
            } else {
                return {
                    code: 200,
                    msg: '成功',
                    success: true,
                    result: {
                        authority: 'admin',
                        userId: "3f4FA265-9b35-eBAD-1396-7E6A9B2fF2B6",
                        userName: 'admin',
                    }
                }
            }
        },
    },
    {
        url: url + '/' + api.countDiffTypeQuantity,
        type: 'get',
        response: config => {
            return {
                code: 200,
                msg: '成功',
                success: true,
                result: Mock.mock({
                    'info|4': [
                        {
                            num: '@natural(46000,90000)',
                            'name|+1': ['商品总数', '销售总数', '用户总数', '访问量']
                        }
                    ]
                }).info

            }
        },
    },
    {
        url: url + '/' + api.countGoodssales,
        type: 'get',
        response: config => {
            return {
                code: 200,
                msg: '成功',
                success: true,
                result: Mock.mock({
                    'info|5': [
                        {
                            'name|+1': ['进口商品', '美容洗护', '家具家电', '食品饮料', '其它'],
                            value: '@natural(100,10000)'
                        }
                    ]
                }).info
            }
        },
    },
    {
        // type 0=>月 1=>年
        // url:RegExp('http://192.168.2.221:8021/count/performance/[0-1]{1}'),
        url: RegExp((`${url}/${api.countPerformance}/[0-1]{1}`)),
        type: 'get',
        response: config => {
            return {
                code: 200,
                msg: '成功',
                success: true,
                result: [...Array(12).keys()].map(i =>
                    Mock.mock({
                        month: `${++i}月`,
                        amount: '@natural(10,100)',
                        'profit|1-10': 10
                    }))
            }
        },
    },
    {
        url: url + '/' + api.getGeoWorld,
        type: 'get',
        response: config => {
            return {
                code: 200,
                msg: '成功',
                success: true,
                result: [
                    {
                        name: '美国',
                        code3: 'USA',
                        code: 'US'
                    },
                    {
                        name: '中国',
                        code3: 'CHN',
                        code: 'CN'
                    },
                    {
                        name: '日本',
                        code3: 'JPN',
                        code: 'JP'
                    },
                    {
                        name: '德国',
                        code3: 'DEU',
                        code: 'DE'
                    },
                    {
                        name: '印度',
                        code3: 'IND',
                        z: 1324171,
                        code: 'IN'
                    },
                    {
                        name: '法国',
                        code3: 'FRA',
                        code: 'FR'
                    },
                    {
                        name: '英国',
                        code3: 'GBR',
                        code: 'GB'
                    },
                    {
                        name: '巴西',
                        code3: 'BRA',
                        code: 'BR'
                    },
                    {
                        name: '意大利',
                        code3: 'ITA',
                        code: 'IT'
                    },
                    {
                        name: '加拿大',
                        code3: 'CAN',
                        code: 'CA'
                    }
                ].map(v => {
                    v.z = Random.natural(1e4, 1e5)
                    return v
                })
            }
        },
    },
    {
        url: RegExp((`${url}/${api.rankingSales}/[0-4]{1}`)),
        type: 'get',
        response: (config) => {
            const rs = RegExp(`${url}/${api.rankingSales}/([0-4]{1})\\?(.*)`).exec(config.url)
            const type = rs[1];
            const data = salesData[type];
            const query = {};
            for (let item of rs[2].split("&")) {
                query[item.split("=")[0]] = item.split("=")[1];
            }
            const info = toDataGoPagination({query: query, data: data});
            return {
                code: 200,
                msg: '成功',
                success: true,
                result: info
            }
        }
    },
    {
        url: url + '/' + api.rankingCommentList,
        type: 'get',
        response: config => {
            const commentData = mock({
                'info|5-10': [
                    {
                        author: '@cname',
                        avatar: function () {
                            return createImage()
                        },
                        content: '@cparagraph(2)',
                        datetime: function () {
                            return begetDateTime()
                        }
                    }
                ]
            }).info;
            return {
                code: 200,
                msg: '成功',
                success: true,
                result: addFromNow(sortAndFilterDate(commentData))
            }
        }
    },
    {
        url: url + '/' + api.rankingHotProduct,
        type: 'get',
        response: config => {
            const hotProductData = mock({
                'info|5': [
                    {
                        name: function () {
                            return GOOD_LIST[natural(0, GOOD_LIST.length - 1)]
                        }
                    }
                ]
            }).info;
            return {
                code: 200,
                msg: '成功',
                success: true,
                result: {
                    info: hotProductData.map(r => ({
                        ...r,
                        ...begetProductAmount()
                    })),
                    dateList: fixedDateList
                }
            }
        }
    },
    {
        url: RegExp((url + '/' + api.rankingPactRecord)),
        type: 'get',
        response: config => {
            const pactRecordData = generatePactRecord();
            const rs = RegExp(`${url}/${api.rankingPactRecord}\\?(.*)`).exec(config.url)
            const query = {};
            for (let item of rs[1].split("&")) {
                query[item.split("=")[0]] = item.split("=")[1];
            }
            return {
                code: 200,
                msg: '成功',
                success: true,
                result: toDataGoPagination({query: query, data: pactRecordData})
            }
        }
    },
    {
        url: RegExp((url + '/' + api.rankingBuyProductList)),
        type: 'get',
        response: config => {
            /**
             * 生成产品购买趋势数据
             */
            const buyProductData = mock({
                'info|5-40': [
                    {
                        productImage: function () {
                            return createImage()
                        },
                        productName: `@cword(5)`,
                        quantity: '@natural(10000,100000)',
                        trend: '@float(10, 30, 2,2)',
                        isIncrease: '@boolean(2,5)',
                        lastQuantity: '@natural(20, 300)'
                    }
                ]
            }).info;

            const rs = RegExp(`${url}/${api.rankingBuyProductList}\\?(.*)`).exec(config.url)
            const query = {};
            for (let item of rs[1].split("&")) {
                query[item.split("=")[0]] = item.split("=")[1];
            }
            return {
                code: 200,
                msg: '成功',
                success: true,
                result: toDataGoPagination({query:query,data:buyProductData}),
            }
        }
    },
    {
        url: url + '/' + api.rankingSalesReport,
        type: 'get',
        response: config => {
            const [lastEye, lastSecond, lastOne] = lastSalesReportData.slice(-LIMIT_DAY)
            const limitLastSalesReportData = lastSalesReportData.slice(
                0,
                lastSalesReportData.length - LIMIT_DAY
            );
            return {
                code: 200,
                msg: '成功',
                success: true,
                result: {
                    yesterDayMoney: lastSecond.totalMoney,
                    todayMoney: lastOne.totalMoney,
                    eyeMoney: lastEye.totalMoney,
                    lastSalesReportData: limitLastSalesReportData
                },
            }
        }
    }
]
/**
 * 生成销售榜单数据
 */
const randomGenerateInfo = (value, type) => {
    return [...Array(Mock.mock('@natural(0,60)')).keys()].map(i => {
        const info =
            {
                0: {
                    goodsName: `${Random.now('yyyy')}新款${
                        GOOD_LIST[natural(0, GOOD_LIST.length - 1)]
                    }`
                },
                3: {
                    type: `${COMPANY_TYPE[natural(0, COMPANY_TYPE.length - 1)]}企业`
                }
            }[type] || {}
        return mock({
            id: '@guid',
            ranking: `${capitalize('top')}${++i}`,
            ...value,
            ...info
        })
    })
};

/**
 * 生成热销产品排行数据
 */
const fixedDateList = getFixedNumMonth(6)
const begetProductAmount = () => {
    return fixedDateList.reduce((info, v) => {
        return {
            ...info,
            [v]: Random.float(70, 120, 2, 2)
        }
    }, {})
}

/**
 * 生成用户交易记录数据
 */
const generatePactRecord = () => {
    const data = mock({
        'info|5-40': [
            {
                avatar: function () {
                    return createImage()
                },
                userName: `@cname`,
                type: '@natural(0,4)',
                datetime: function () {
                    return begetDateTime()
                }
                // device：1
            }
        ]
    }).info
    const sortDateList = sortAndFilterDate(data)
    return sortDateList.map(v => {
        const index = v.datetime.indexOf(' ')
        if (index > -1) {
            v.datetime = v.datetime.substr(index)
        }
        return {
            ...v,
            datetime: v.datetime
                .replace(' ', Random.now('A'))
                .replace('AM', '早上 ')
                .replace('PM', '下午 ')
        }
    })
};

/**
 * 生成销售报告数据
 */
const LIMIT_DAY = 3
const generateSalesReportData = () => {
    const salesReportData = mock({
        'info|60': [
            {
                totalMoney: '@natural(80000,100000)'
            }
        ]
    }).info
    const reportDataLength = salesReportData.length
    return salesReportData.map((v, i) => {
        return {
            ...v,
            time: moment()
                .subtract(reportDataLength - 1 - i, 'days')
                .format('YYYY-MM-DD')
        }
    })
}
const lastSalesReportData = generateSalesReportData()

const salesData = {
    0: randomGenerateInfo(
        {
            'price|10-200.2': 10,
            'quantity|100-1000': 100,
            sales: function () {
                return (this.price * this.quantity).toFixed(2)
            }
        },
        0
    ),
    1: randomGenerateInfo({
        clientName: `@cname`,
        'price|10-200.2': 10,
        'orderQuantity|100-1000': 100,
        sales: function () {
            return (this.price * this.orderQuantity).toFixed(2)
        }
    }),
    2: randomGenerateInfo({
        areaName: `@county(true)`,
        'price|10-200.2': 10,
        'orderQuantity|100-1000': 100,
        sales: function () {
            return (this.price * this.orderQuantity).toFixed(2)
        }
    }),
    3: randomGenerateInfo(
        {
            supplierName: '@city()@cword(2)有限公司',
            'price|10-200.2': 10,
            'salesVolume|100-1000': 100,
            sales: function () {
                return (this.price * this.salesVolume).toFixed(2)
            }
        },
        3
    ),
    4: randomGenerateInfo({
        salesManName: `@cname`,
        'price|10-200.2': 10,
        'orderQuantity|100-1000': 100,
        sales: function () {
            return (this.price * this.orderQuantity).toFixed(2)
        }
    })
};