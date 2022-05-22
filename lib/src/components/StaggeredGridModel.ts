import React, {ReactNode, RefCallback} from "react";

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

export type StaggeredCustomComponentProps = {
    ref: RefCallback<HTMLElement> | undefined,
    style?: React.CSSProperties,
    children?: React.ReactNode
}

export interface StaggeredGridProps extends React.HTMLProps<HTMLElement> {
    columnWidth?: number,
    columns?: number;
    alignment?: StaggeredAlignment
    children?: ReactNode | undefined,
    style?: React.CSSProperties | undefined,
    useElementWidth: boolean,
    fitHorizontalGap?: boolean,
    gridWidth?: number,
    limitSpan: boolean,
    calculateHeight: boolean,
    verticalGap?: number,
    horizontalGap?: number,
    repositionOnResize?: boolean,
    requestAppendScrollTolerance?: number,
    requestAppend?: () => void;
}

export interface StaggeredGridState {
    calculatedGridHeight: number | undefined,
}

//Staggered Grid Item Model

export interface StaggeredGridItemProps extends React.HTMLProps<HTMLElement> {
    initialPosition?: PositionedItem,
    itemHeight?: number,
    spans?: StaggeredItemSpan | number,
    index: number,
    style?: React.CSSProperties | undefined,
    children?: ReactNode | undefined,
    transform?(itemPos: PositionedItem): React.HTMLProps<HTMLElement>
}