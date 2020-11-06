import api from "@scripts/common/api";
import {url} from "@root/src/config/config.constant";

const {Random, mock} = require('mockjs');
const {capitalize, natural} = Random;
const {isArray} = require('util')
const moment = require('moment')
const {
    toDataGoPagination,
    sortAndFilterDate,
    createImage,
    findItemIndex,
} = require('./utils')


export default [
    {
        url: RegExp((url + '/' + api.getMemberList)),
        type: 'get',
        response: config => {
            const rs = RegExp(`${url}/${api.getMemberList}\\?(.*)`).exec(config.url)
            const query = {};
            for (let item of rs[1].split("&")) {
                query[item.split("=")[0]] = item.split("=")[1];
            }
            let data = filterMemberData(query, memberData)
            let rsData = toDataGoPagination({query, data});
            return {
                code: 200,
                msg: '成功',
                success: true,
                result: {...rsData}
            }
        },
    },
    {
        url: `${url}/${api.addMember}`,
        type: 'post',
        response: config => {
            let obj = JSON.parse(config.body);
            const {address} = obj
            const success = Random.boolean()
            let data = {};
            if (success) {
                data = {
                    ...obj,
                    userId: Random.guid(),
                    address: address.join(' '),
                    avatar: createImage(),
                    registerTime: Random.now()
                }
            }
            data.userId && memberData.unshift(data)
            return {
                code: 200,
                msg: '成功',
                success: success,
                result: data,
            }
        }
    },
    {
        url: RegExp(`${url}/${api.updateMember}/.*`),
        type: 'post',
        response: config => {
            const rs = RegExp(`${url}/${api.updateMember}/(.*)`).exec(config.url)
            const userId = rs[1];
            const index = findItemIndex(memberData, userId, 'userId')
            if (index > -1) {
                let obj = JSON.parse(config.body);
                const address = obj.address
                memberData[index] = {
                    ...memberData[index],
                    ...obj,
                    address: address.join(' ')
                }
                return {
                    code: 200,
                    msg: '成功',
                    success: true,
                    result: memberData[index],
                }
            }
        }
    }, {
        url: RegExp(`${url}/${api.deleteMember}/.*`),
        type: 'post',
        response: config => {
            const rs = RegExp(`${url}/${api.deleteMember}/(.*)`).exec(config.url)
            const userId = rs[1];
            const index = findItemIndex(memberData, userId, 'userId')
            if (index > -1) {
                memberData = memberData.filter(item => !Object.is(item.userId, userId));
                return {
                    code: 200,
                    msg: '成功',
                    success: true,
                    result: {},
                }
            }
        }
    },
]
/**
 * 生成会员列表数据
 */
const generateMemberData = (query = {}) => {
    const data = mock({
        'info|10-60': [
            {
                userId: '@guid',
                name: '@cname',
                nickname: function () {
                    return Random.name()
                },
                email: '@email',
                address: '@county(true)',
                sex: () => {
                    return Random.boolean() ? 1 : 0
                },
                'grade|1-100': 1,
                // registerTime: () => {
                //   return begetDateTime()
                // },
                registerTime: '@datetime',
                avatar: function () {
                    return createImage()
                }
            }
        ]
    }).info
    const sortData = sortAndFilterDate(data, 'registerTime')
    return sortData
}
let memberData = generateMemberData()

const timeLimitData = ({startTime, endTime}, refTime) => {
    if (startTime && endTime) {
        const isEqual = Object.is(startTime, endTime)
        const turnRegisterTime = moment(refTime)
        if (
            isEqual
                ? turnRegisterTime.isBefore(startTime)
                : !(
                    turnRegisterTime.isBefore(endTime) &&
                    turnRegisterTime.isAfter(startTime)
                )
        ) {
            return false
        }
    }
    return true
}

const filterMemberData = (query = {}, data = []) => {
    const {startTime, endTime, name: qName = '', address: qAddress} = query
    const flag = isArray(qAddress)
    const strAddress = flag
        ? qAddress.filter(v => !Object.is(v, '市辖区')).join(' ')
        : ''
    return data.filter(item => {
        const {name, address, registerTime} = item
        if (!name.includes(qName) || (flag && !address.includes(strAddress)))
            return false
        return timeLimitData(query, registerTime)
    })
}