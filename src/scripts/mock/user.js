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

let logged = false;

export default [
    {
        url: url + '/' + api.loginAccount,
        type: 'post',
        response: config => {
            logged = true;
            return {
                code: 200,
                msg: '成功',
                success: true,
                result: {
                    userName: "admin",
                    userId: Random.guid(),
                    authority: "admin"
                }
            }
        },
    }, {
        url: url + '/' + api.logoutAccount,
        type: 'post',
        response: config => {
            logged = false;
            return {
                code: 200,
                msg: '成功',
                success: true,
                result: {}
            }
        },
    }, {
        url: url + '/' + api.registerAccount,
        type: 'post',
        response: config => {
            logged = false;
            return {
                code: 200,
                msg: '成功',
                success: true,
                result: {
                    userName: "admin",
                    userId: Random.guid(),
                    authority: "admin"
                }
            }
        },
    }, {
        url: url + '/' + api.verifyIsLogin,
        type: 'get',
        response: config => {
            if (!logged) {
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
                        userId: Random.guid(),
                        userName: 'admin',
                    }
                }
            }
        },
    },
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