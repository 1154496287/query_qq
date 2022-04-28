import Axios from "axios";
import { handleResponse } from "./error";
/**
 * 定制化配置TS
 */
type Configs = {
  throttleOff?: boolean;
  timer?: number;
};
/**
 * 标准的base接口 这里一般使用env动态配置 如线上多后台接口域名可通过path和初始化接口baseURL定制设置
 */
const _baseURL = "https://api.uomg.com";
/**
 * 默认接口节流时间
 */
const TIMER = 400;
/**
 * 缓存节流节流url
 */
const httpMap = new Map();
/**
 * 创建Axios实例
 */

let timerObj: { [key: string]: NodeJS.Timeout } = {};
const AxiosInstance = Axios.create({
  baseURL: _baseURL,
});
/**
 * 点击节流处理
 * @param path 请求路径
 * @param configs 定制化配置 如设置返回体 接口是否需要设置节流
 * @param callBack
 */
async function throttleInterceptors(
  path: string,
  callBack: () => void,
  configs?: Configs
) {
  /**
   * path 处理节流和接口白名单
   */
  if (!configs?.throttleOff) {
    /**
     * 默认配置接口节流
     */
    if (!httpMap.has(path)) {
      /**
       * 请求缓存不包含当前接口
       */
      try {
        const res = await callBack();
        httpMap.set(path, configs?.timer || TIMER);
        return handleResponse(res, configs);
      } catch (e) {
        /**
         * 接口错误和白名单处理
         */
      }
    }
  } else {
    try {
      console.log(2);
      return await callBack();
    } catch (e) {
      /**
       * 接口错误和白名单处理
       */
    }
  }
}
/**
 * 请求类 这里可以封装请求baseURL
 * 可以根据ENV 处理多环境请求配置
 * 可以分层处理接口白名单 例如不重要接口请求报错 不影响主体业务流程
 *
 */
class Send {
  /**
   * GET 请求函数
   * @param path 请求路径
   * @param params  请求参数
   * @param configs 请求配置文件 这里测试题比较简单不做其他配置
   * @returns response
   */
  async get(path: string, params?: any, configs?: Configs) {
    return throttleInterceptors(
      path,
      async () => {
        return await AxiosInstance.get(path, {
          params,
        });
      },
      configs
    );
  }
}
/**
 * 请求拦截器
 */
AxiosInstance.interceptors.request.use(
  (config) => {
    /**
     * 这里可以处理baseURL
     */
    return config;
  },
  (err) => {
    return Promise.reject(err);
  }
);
/**
 * 响应拦截器
 */
AxiosInstance.interceptors.response.use(
  (response) => {
    const url = response.config.url;
    timerObj[`${url}1`] = setTimeout(() => {
      if (httpMap.get(url)) {
        timerObj[`${url}2`] = setTimeout(() => {
          httpMap.delete(url);
          // 清除定时器
          clearTimeout(timerObj[`${url}1`]);
          clearTimeout(timerObj[`${url}2`]);
          delete timerObj[`${url}1`];
          delete timerObj[`${url}2`];
        }, httpMap.get(url));
      }
    });

    return response;
  },
  (err) => {
    /**
     * 清空节流接口
     */
    httpMap.clear();
    /**
     * 重置
     */
    timerObj = {};
    return Promise.reject(err);
  }
);

/**
 * 单例设计
 * @returns 返回配置的请求体
 */
const request = () => {
  const _instance = window.WORKER_AXIOS_INSTANCE;
  // 有配置参数且或者没有实例 去实例
  try {
    if (_instance) {
      return _instance;
    } else {
      // 有配置参数且或者没有实例 去实例
      window.WORKER_AXIOS_INSTANCE = new Send();
      return window.WORKER_AXIOS_INSTANCE;
    }
  } catch (e) {
    console.log(e);
  }
};

export default request();
