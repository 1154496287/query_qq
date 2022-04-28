import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { act } from "react-dom/test-utils";
import QQInfo from "../index";
describe("QQInfo => 查询qq用户头像信息页面测试", () => {
  test("模拟用户输入qq长度为小于5非法qq校验 查询不执行", () => {
    jest.useFakeTimers();
    const { container } = render(<QQInfo />);
    const input = container.querySelector<HTMLInputElement>("input");
    if (!input) return;
    userEvent.type(input, "1234");
    act(() => {
      jest.runAllTimers();
    });
    // qq好长度为4不请求数据直接 loading状态值没有变化 依旧为空
    const loading = container.querySelector<HTMLInputElement>(".loading");
    // 断言loading组件为null
    expect(loading).toBeNull();
  });
  test("模拟用户输入qq长度为12 输入只能为12为", () => {
    jest.useFakeTimers();
    const { container } = render(<QQInfo />);
    const input = container.querySelector<HTMLInputElement>("input");
    if (!input) return;
    userEvent.type(input, "012345678912345");
    act(() => {
      jest.runAllTimers();
    });
    // 断言输入长度只能为12
    expect(input.value).toBe("012345678912");
  });
  test("用户输入合法qq号 校验显示结果是否正常", async () => {
    jest.doMock("../../../api", () => {
      return {
        getQQInfo: Promise.resolve({
          code: 1,
          name: "111",
          qlogo: "https://www.jd.com",
          qq: "111111",
        }),
      };
    });
    jest.useFakeTimers();
    const { container } = render(<QQInfo />);
    const input = container.querySelector<HTMLInputElement>("input");
    if (!input) return;
    userEvent.type(input, "1234567");
    act(() => {
      jest.runAllTimers();
    });
    await waitFor(() => {
      const avatar = container.querySelector<HTMLDivElement>(".loading");
      if (!avatar) return;
      // expect(avatar).toBeEmptyDOMElement();
    });
  });
});
