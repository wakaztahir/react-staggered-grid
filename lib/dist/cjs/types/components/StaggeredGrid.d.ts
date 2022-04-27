import React from "react";
import { GridItemData, StaggeredAlignment, StaggeredDisplay, StaggeredGridProps, StaggeredGridState } from "./StaggeredGridModel";
export default class StaggeredGrid<ItemType> extends React.Component<StaggeredGridProps<ItemType> & typeof StaggeredGrid.defaultProps, StaggeredGridState> {
    static defaultProps: {
        display: StaggeredDisplay;
        alignment: StaggeredAlignment;
        columnWidth: number;
        className: string;
    };
    gridItems: Array<GridItemData>;
    state: {
        gridWidth: number;
        gridHeight: number;
    };
    gridElementRef: HTMLElement | null;
    getColsCount: () => number;
    reposition: () => void;
    /**
     * Updates Grid Width & Height
     */
    refresh: () => void;
    componentDidMount(): void;
    componentWillUnmount(): void;
    componentDidUpdate(prevProps: Readonly<{}>, prevState: Readonly<{}>, snapshot?: any): void;
    render(): JSX.Element;
}
