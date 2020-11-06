import Mock from 'mockjs'
import ranking from './ranking'

const Random = Mock.Random;

const mocks = [...ranking];

for (const i of mocks) {
    Mock.mock(i.url, i.type, i.response);
}
