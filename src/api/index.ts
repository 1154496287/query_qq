import { get } from "./http";

/**
 * 根据qq号获取用户信息
 * @param qq
 * @returns qq头像列表信息
 */
export const getQQInfo = (qq: string) => get("/api/qq.info", { qq });
/**
 * 这里可以配置baseURL，实现不同后台域名配置
 * 可以配置定制参数， 这里暂时用不到封装
 */
