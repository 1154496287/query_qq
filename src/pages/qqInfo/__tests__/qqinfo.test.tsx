import { render, screen } from "@testing-library/react";
import QQInfo from "../index";
describe("", () => {
  test("", () => {
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
    const { container } = render(<QQInfo />);
    expect(
      container.querySelector(".loading") as HTMLDivElement
    ).toBeEmptyDOMElement();
  });
});
