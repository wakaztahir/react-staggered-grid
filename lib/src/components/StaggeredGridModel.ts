import React, {ReactNode} from "react";

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

export interface StaggeredGridProps {
    columnWidth?: number,
    columns?: number;
    alignment?: StaggeredAlignment
    className?: string | undefined,
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

export interface StaggeredGridItemProps {
    initialPosition?: PositionedItem,
    itemHeight?: number,
    spans?: StaggeredItemSpan | number,
    index: number,
    style?: React.CSSProperties | undefined,
    className?: string | undefined,
    children?: ReactNode | undefined,
    isLoading?: boolean,

    transform?(itemPos: PositionedItem): React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>
}