import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { act } from "react-dom/test-utils";

const data = {
  code: 1,
  name: "testName",
  qq: "111111",
  qlogo: "qlogo",
  msg: "",
};
let getQQInfo = () => data;
jest.mock("../../../api", () => {
  return {
    __esModule: true,
    default: {},
    getQQInfo,
  };
});
describe("QQInfo => 查询qq用户头像信息页面测试", () => {
  test("模拟用户输入qq长度为小于5非法qq校验 查询不执行", async () => {
    const QQInfo = require("../index").default;
    jest.useFakeTimers();
    const { container } = render(<QQInfo />);
    const input = container.querySelector<HTMLInputElement>("input");
    if (!input) return;
    userEvent.type(input, "1234");
    act(() => {
      jest.runAllTimers();
    });
    await waitFor(() => {
      // qq好长度为4不请求数据直接 loading状态值没有变化 依旧为空
      const loading = container.querySelector<HTMLInputElement>(".loading");
      // 断言loading组件为null
      expect(loading).toBeNull();
    });
  });
  test("模拟用户输入qq长度为12 输入只能为12为", async () => {
    const QQInfo = require("../index").default;
    jest.useFakeTimers();
    const { container } = render(<QQInfo />);
    const input = container.querySelector<HTMLInputElement>("input");
    if (!input) return;
    userEvent.type(input, "012345678912345");
    act(() => {
      jest.runAllTimers();
    });
    await waitFor(() => {
      // 断言输入长度只能为12
      expect(input.value).toBe("012345678912");
    });
  });
  test("用户输入合法qq号 校验显示结果是否正常", async () => {
    const QQInfo = require("../index").default;
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
      // 断言数据正常 信息正常显示
      expect(screen.getByText("testName")).not.toBeEmptyDOMElement();
      expect(screen.getByText("qlogo")).not.toBeEmptyDOMElement();
      expect(screen.getByText("111111")).not.toBeEmptyDOMElement();
    });
  });
  test("模拟用户输入错误，返回错误信息是否展示", async () => {
    data.code = 201702;
    data.msg = "信息错误";
    const QQInfo = require("../index").default;
    jest.useFakeTimers();
    const { container } = render(<QQInfo />);
    const input = container.querySelector<HTMLInputElement>("input");
    if (!input) return;
    userEvent.type(input, "1234567");
    act(() => {
      jest.runAllTimers();
    });
    await waitFor(() => {
      // 断言后台返回信息正确展示
      expect(screen.getByText("信息错误")).not.toBeEmptyDOMElement();
    });
  });
});
