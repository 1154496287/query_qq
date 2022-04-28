/**
 * 定制化配置TS
 */
type Configs = {
  throttleOff?: boolean;
  isNeedAllData?: boolean;
  timer?: number;
};
/**
 * 处理系统异常code
 * @param res 接口返回数据
 * @param configs
 */
export function handleResponse(res: any, configs?: Configs) {
  /**
   * 配置是否需要返回data内容
   */
  let isNeedAllData: boolean = false;
  if (configs?.isNeedAllData) {
    isNeedAllData = configs.isNeedAllData;
  }
  /**
   * code不为200 处理
   */
  if (res.status) {
    // 401 502 ...
  }
  /**
   * 全局统一业务内容code处理 这里用不到
   */
  switch (res.data.code) {
    case 1:
      return isNeedAllData ? res : res.data;
    default:
      break;
  }
}
