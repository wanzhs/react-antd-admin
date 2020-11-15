import api from "@scripts/common/api";
import {url} from "@root/src/config/config.constant";

const {addFromNow, begetDateTime, createImage, sortAndFilterDate, toDataGoPagination} = require("@scripts/mock/utils");

const {Random, mock} = require('mockjs');
const {capitalize, natural} = Random;

export default [
    {
        url: RegExp((url + '/' + api.getMessgeInbox)),
        type: 'get',
        response: config => {
            const rs = RegExp(`${url}/${api.getMessgeInbox}\\?(.*)`).exec(config.url)
            const query = {};
            for (let item of rs[1].split("&")) {
                query[item.split("=")[0]] = item.split("=")[1];
            }
            const {inboxData, ...rest} = generateInboxData()
            let obj = toDataGoPagination({query: query, data: inboxData})
            return {
                code: 200,
                msg: '成功',
                success: true,
                result: {
                    ...obj,
                    ...rest
                }
            }
        },
    },
    {
        url: RegExp(`${url}/${api.getInfiniteList}`),
        type: 'get',
        response: config => {
            const rs = RegExp(`${url}/${api.getInfiniteList}\\?(.*)`).exec(config.url)
            const query = {};
            for (let item of rs[1].split("&")) {
                query[item.split("=")[0]] = item.split("=")[1];
            }
            const data = generateListData()
            return {
                code: 200,
                msg: '成功',
                success: true,
                result: toDataGoPagination({query, data})
            }
        },
    }, {
        url: `${url}/${api.getPDFFile}`,
        type: 'get',
        response: config => {
            return {
                code: 200,
                msg: '成功',
                success: true,
                result: {}
            }
        },
    },
]


/**
 * 生成信息邮件数据
 */
const generateInboxData = () => {
    const data = mock({
        'info|10-60': [
            {
                id: '@guid',
                sender: '@cname',
                subject: '@cparagraph(2)',
                datetime: () => {
                    return begetDateTime()
                },
                isStar: '@boolean(2,5)'
            }
        ]
    }).info
    const limitNum = Random.natural(2, 6)
    const sortData = sortAndFilterDate(data)
    const inboxData = sortData.map((item, index) => {
        return {
            ...item,
            isUnread: !(index > limitNum)
        }
    })
    const info = inboxData.reduce(
        (info, {isStar, isUnread}) => {
            if (isUnread) {
                info.totalUnreadNum += 1
            }
            if (isStar) {
                info.totalStarNum += 1
            }
            return info
        },
        {
            totalStarNum: 0,
            totalUnreadNum: 0
        }
    )
    return {
        inboxData,
        ...info
    }
}


/**
 * 生成列表数据
 */
const generateListData = () => {
    const data = mock({
        'info|20-80': [
            {
                id: '@id',
                title: '@ctitle',
                pic: function () {
                    return createImage({width: 400, height: 400})
                },
                content: '@cparagraph(2)',
                datetime: function () {
                    return begetDateTime()
                }
            }
        ]
    }).info
    return addFromNow(sortAndFilterDate(data))
}