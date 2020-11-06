import Mock from 'mockjs'
import ranking from './ranking'
import member from "./member";
import message from "./message"
import user from "./user";

const Random = Mock.Random;

const mocks = [...ranking, ...message, ...member, ...user];

for (const i of mocks) {
    Mock.mock(i.url, i.type, i.response);
}
