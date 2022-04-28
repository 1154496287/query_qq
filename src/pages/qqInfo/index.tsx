import Axios from "axios";
import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import "./index.css";
import { debounce, set } from "lodash";
type Info = {
  name: string;
  qq: string;
  qlogo: string;
};
/**
 * 查询qq信息头像
 */
function QQInfo() {
  const [info, setInfo] = useState<Info>({
    name: "MOOD",
    qq: "1154496287",
    qlogo: "https://q2.qlogo.cn/headimg_dl?spec=100&dst_uin=1154496287",
  });

  const [err, setErr] = useState<string>("");
  const rg = /[1-9][0-9]{4,10}$/;

  const getUserInfo = async (e: any) => {
    if (e.target.value.length < 5) {
      return;
    }
    console.log(e.target.value);
    const res = await Axios.get("https://api.uomg.com/api/qq.info", {
      params: {
        qq: e.target.value,
      },
    });
    if (res.status === 200 && res.data.code === 1) {
      setInfo(res.data);
    }
    if (res.status === 200 && res.data.code === 1) {
      setErr(res.data);
    }
  };

  return (
    <div className="qq-info">
      {/* <button onClick={getUserInfo}>click</button> */}
      <h3>QQ号查询</h3>
      <div className="input-info">
        qq
        <input
          type="number"
          placeholder="请输入合法的qq号"
          onKeyUp={debounce(getUserInfo, 200)}
          // onChange={setInputQQ}
        />
      </div>
      {err.length ? (
        <div>{err}</div>
      ) : (
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
