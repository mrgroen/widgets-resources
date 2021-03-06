import { createElement, ReactElement } from "react";
import { DatagridNumberFilterContainerProps } from "../typings/DatagridNumberFilterProps";

import { FilterComponent } from "./components/FilterComponent";
import { getFilterDispatcher } from "./utils/provider";
import { Alert } from "@mendix/piw-utils-internal";

export default function DatagridNumberFilter(props: DatagridNumberFilterContainerProps): ReactElement {
    const FilterContext = getFilterDispatcher();
    const alertMessage = (
        <Alert bootstrapStyle="danger">
            The data grid number filter widget must be placed inside the header of the Data grid 2.0 widget.
        </Alert>
    );
    return FilterContext?.Consumer ? (
        <FilterContext.Consumer>
            {filterDispatcher =>
                filterDispatcher ? (
                    <FilterComponent
                        adjustable={props.adjustable}
                        defaultFilter={props.defaultFilter}
                        delay={props.delay}
                        filterDispatcher={filterDispatcher}
                        name={props.name}
                        placeholder={props.placeholder?.value}
                        screenReaderButtonCaption={props.screenReaderButtonCaption?.value}
                        screenReaderInputCaption={props.screenReaderInputCaption?.value}
                        tabIndex={props.tabIndex}
                        value={props.defaultValue?.value}
                    />
                ) : (
                    alertMessage
                )
            }
        </FilterContext.Consumer>
    ) : (
        alertMessage
    );
}
