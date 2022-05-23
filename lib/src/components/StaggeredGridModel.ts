import React, {ReactHTML, ReactNode} from "react";

export enum StaggeredItemSpan {
    Single = 1,
    Full = 99999,
}

export enum StaggeredAlignment {
    Start,
    Center,
    End,
}

export interface PositionedItem {
    width: number,
    left: number,
    top: number,
}

export interface StaggeredGridProps extends React.HTMLProps<HTMLElement> {
    elementType: keyof ReactHTML,
    columnWidth?: number,
    columns?: number;
    alignment?: StaggeredAlignment
    children?: ReactNode | undefined,
    style?: React.CSSProperties | undefined,
    useElementWidth: boolean,
    gridWidth?: number,
    calculateHeight: boolean,
    verticalGap?: number,
    horizontalGap?: number,
    fitHorizontalGap?: boolean,
    repositionOnResize?: boolean,
    requestAppend?: () => void;
    requestAppendScrollTolerance?: number,
}

export interface StaggeredGridState {
    calculatedGridHeight: number | undefined,
}

//Staggered Grid Item Model

export interface StaggeredGridItemProps extends React.HTMLProps<HTMLElement> {
    elementType: keyof ReactHTML,
    initialPosition?: PositionedItem,
    itemHeight?: number,
    spans?: StaggeredItemSpan | number,
    index: number,
    style?: React.CSSProperties | undefined,
    children?: ReactNode | undefined,

    transform?(itemPos: PositionedItem): React.HTMLProps<HTMLElement>
}