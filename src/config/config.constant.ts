export const isMock: boolean = true; // 是否mock数据
const devUrl = 'http://192.168.2.221:8021'; // 开发用api地址
const proUrl = 'http://192.168.2.221:8021/api'; // 线上用api地址
export const url = process.env.NODE_ENV === 'development' ? devUrl : proUrl;
