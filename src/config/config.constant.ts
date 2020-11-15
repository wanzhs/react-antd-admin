export const isMock: boolean = false; // 是否mock数据
const devUrl = 'http://localhost:8012'; // 开发用api地址
const proUrl = 'http://localhost:8012'; // 线上用api地址
export const url = process.env.NODE_ENV === 'development' ? devUrl : proUrl;
export const userCacheAccountKey = "_charging_web_shop_account_detail";