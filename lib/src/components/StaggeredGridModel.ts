import React, {ReactHTML, ReactNode} from "react";

export enum StaggeredItemSpan {
    /** Occupy one column */
    Single = 1,
    /** Occupy total columnCount as span */
    Full = 99999,
}

export enum StaggeredAlignment {
    /** Align items in the left*/
    Start,
    /** Align items in the center */
    Center,
    /** Align items to the right */
    End,
}

export interface PositionedItem {
    /** width of the item calculated using itemSpan * columnWidth */
    width: number,
    /** translateX of the item */
    left: number,
    /** translateY of the item */
    top: number,
}

export interface StaggeredGridController {
    /** Swap item at index with item at withIndex , after swapping you must update items state or call reposition */
    swap: (index: number, withIndex: number) => void;
    /** This will request reposition on the next animation frame , useful for multiple calls */
    requestReposition: () => void;
    /** Force reposition all the items */
    reposition: () => void;
}

export interface StaggeredGridProps extends React.HTMLProps<HTMLElement> {
    /** type of html element for the grid , by default 'div' is used */
    elementType: keyof ReactHTML,
    /** width of each column , if not given , calculated using gridWidth / columns */
    columnWidth?: number,
    /** total columns of the grid , if not given , calculated using gridWidth / columnWidth */
    columns?: number;
    /** horizontal alignment of the items on the grid 0 = left,1 = center,2 = right */
    alignment?: StaggeredAlignment
    /** children of the grid , must be StaggeredGridItem */
    children?: ReactNode | undefined,
    /** css properties */
    style?: React.CSSProperties | undefined,
    /** grid controller used to swap items or reposition forcibly , can be obtained using useStaggeredGridController */
    gridController?: StaggeredGridController | undefined,
    /** when true gridWidth  width of the html element is used even if columns & columnWidth are given */
    useElementWidth: boolean,
    /** total width of the grid , if not given calculated using a ref on html element */
    gridWidth?: number,
    /** set calculated height of the grid to the html element default true*/
    calculateHeight: boolean,
    /** vertical gap between items on the grid */
    verticalGap?: number,
    /** horizontal gap between items on the grid */
    horizontalGap?: number,
    /** when true horizontal gap is fitted with columnWidth , useful when extra horizontal gap must not cause overflow */
    fitHorizontalGap?: boolean,
    /** when window is resized grid items are repositioned again, default true */
    repositionOnResize?: boolean,
    /** if given , when user reaches the end of the grid , it's fired to allow adding more items to grid to make it infinite */
    requestAppend?: () => void;
    /** scroll tolerance for request append function , default 20px , more tolerance = fired earlier than the end */
    requestAppendScrollTolerance?: number,
}

//Staggered Grid Item Model

export interface StaggeredGridItemProps extends React.HTMLProps<HTMLElement> {
    /** type of html element used , by default 'div' */
    elementType: keyof ReactHTML,
    /** initial position of the item on the grid , default 0 for everything */
    initialPosition?: PositionedItem,
    /** item height , calculated using a ref when not given */
    itemHeight?: number,
    /** span of the item on the grid , column span for vertical grid */
    spans?: StaggeredItemSpan | number,
    /** index of the item in the items */
    index: number,
    /** CSS Properties */
    style?: React.CSSProperties | undefined,
    /** children of the item */
    children?: ReactNode | undefined,

    /** transform the positioned item to html props for the StaggeredGridItem , by default uses css properties like left,top & position:absolute */
    transform?(itemPos: PositionedItem): React.HTMLProps<HTMLElement>
}