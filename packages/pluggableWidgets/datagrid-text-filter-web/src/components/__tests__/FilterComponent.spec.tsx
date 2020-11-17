import { shallow } from "enzyme";
import { createElement } from "react";
import { FilterComponent } from "../FilterComponent";

jest.useFakeTimers();

describe("Filter selector", () => {
    it("renders correctly", () => {
        const component = shallow(<FilterComponent defaultFilter="contains" filterDispatcher={jest.fn()} />);

        expect(component).toMatchSnapshot();
    });

    it("calls filterDispatcher when value changes", () => {
        const filterDispatcher = jest.fn();
        const component = shallow(<FilterComponent defaultFilter="contains" filterDispatcher={filterDispatcher} />);

        const input = component.find("input");
        input.simulate("change", { target: { value: "test" } });

        expect(filterDispatcher).toBeCalled();
    });
});
