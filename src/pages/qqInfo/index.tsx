import Axios from "axios";
import { useEffect } from "react";

/**
 * 查询qq信息头像
 */
function QQInfo() {
  const getUserInfo = async () => {
    const res = await Axios.get("");
  };
  useEffect(() => {}, []);
  return (
    <div>
      <h3>QQ号查询</h3>
    </div>
  );
}

export default QQInfo;
