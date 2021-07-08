import React from "react";
import {StaggeredGridItemProps, StaggeredGridItemState, StaggeredGridProps, StaggeredGridState} from "./src";

declare class StaggeredGrid<ItemType> extends React.Component<StaggeredGridProps<ItemType> & typeof StaggeredGrid.defaultProps, StaggeredGridState> {

}

export declare class StaggeredGridItem extends React.Component<StaggeredGridItemProps & typeof StaggeredGridItem.defaultProps, StaggeredGridItemState> {

}

export default StaggeredGrid