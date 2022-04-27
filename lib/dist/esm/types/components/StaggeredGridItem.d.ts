import React from "react";
import { StaggeredGridContextType } from "./StaggeredGridContext";
import { StaggeredGridItemProps, StaggeredGridItemState, StaggeredItemSpan } from "./StaggeredGridModel";
export default class StaggeredGridItem extends React.Component<StaggeredGridItemProps & typeof StaggeredGridItem.defaultProps, StaggeredGridItemState> {
    static contextType: React.Context<StaggeredGridContextType>;
    static defaultProps: {
        spans: StaggeredItemSpan;
        position: number;
        onUpdatePosition: (pos: number) => void;
        draggable: boolean;
    };
    state: {
        translateX: number;
        translateY: number;
        itemWidth: number;
    };
    stateUpdating: boolean;
    nextStateUpdate: () => void;
    itemElementRef: HTMLElement | null;
    updateTranslate: (width: number, x: number, y: number) => void;
    /**
     * Reports height and width
     */
    reportData(): void;
    componentDidMount(): void;
    componentDidUpdate(prevProps: Readonly<StaggeredGridItemProps & typeof StaggeredGridItem.defaultProps>, prevState: Readonly<StaggeredGridItemState>, snapshot?: any): void;
    componentWillUnmount(): void;
    render(): JSX.Element;
}
