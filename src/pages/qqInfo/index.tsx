import React, { useState } from "react";
import "./index.css";
import Loading from "./components/Loading";
import { debounce } from "lodash";
import { getQQInfo } from "../../api";
/**
 * 简单测试demo 这里就不配置别名和less了, 看着有点难受~~
 */
type Info = {
  name: string;
  qq: string;
  qlogo: string;
};
/**
 * 查询qq信息头像
 */
function QQInfo() {
  const [info, setInfo] = useState<Info | null>();
  const [loading, setLoading] = useState<boolean>(false);
  const [err, setErr] = useState<string>("");
  /**
   * 查询qq信息
   * @param e
   * @returns
   */
  const getUserInfo = async (e) => {
    setErr("");
    /**
     * 合法的QQ号 为长度为5-12的数字
     */
    if (e.target.value.length < 5) {
      setErr("请输入合法的QQ号，长度在5到12区间");
      return;
    }
    setLoading(true);
    try {
      const res = await getQQInfo(e.target.value);
      setLoading(false);
      if (res.code === 1) {
        setErr("");
        setInfo(res);
      }
      /**
       * 异常抛出msg信息
       */
      if (res.code === 201702) {
        setErr(res.msg);
      }
    } catch (e) {
      setLoading(false);
    }
  };

  return (
    <div className="qq-info">
      <h3>QQ号查询</h3>
      <div className="input-info">
        qq:
        <input
          type="number"
          placeholder="请输入合法的qq号"
          onKeyUp={debounce(getUserInfo, 400)}
          onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
            if (e.target.value.length > 12)
              e.target.value = e.target.value.slice(0, 12);
          }}
        />
      </div>
      {loading && <Loading />}
      {err.length ? <div>{err}</div> : null}
      {info && !err.length && !loading && (
        <div className="avatar">
          <img src={info.qlogo} alt="" />
          <ul>
            <li>
              <h4>{info.name}</h4>
            </li>
            <li>
              <h5>{info.qq}</h5>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}

export default QQInfo;
