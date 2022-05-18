import React, {ReactNode} from "react";

export enum StaggeredItemSpan {
    Single = 1,
    Full = -1,
}

export enum StaggeredAlignment {
    Start,
    Center,
    End,
}

export interface PositionedItem {
    width: number,
    translateX: number,
    translateY: number,
}

export interface StaggeredGridProps {
    columnWidth?: number,
    columns?: number;
    alignment?: StaggeredAlignment
    className?: string | undefined,
    children?: ReactNode | undefined,
    style?: React.CSSProperties | undefined,
    useElementWidth: boolean,
    gridWidth?: number,
    limitSpan: boolean,
    calculateHeight: boolean,
}

export const StaggeredGridDefaultProps = {
    alignment: StaggeredAlignment.Center,
    limitSpan: true,
    calculateHeight: true,
    useElementWidth: false,
}

export interface StaggeredGridState {
    calculatedGridHeight: number,
}

export interface GridItemData {
    itemHeight: number | undefined,
    itemColumnSpan: StaggeredItemSpan | number
    update: (width: number, x: number, y: number) => void
}


//Staggered Grid Item Model

export interface StaggeredGridItemProps {
    initialWidth?: number,
    initialTranslateX?: number,
    initialTranslateY?: number,
    itemHeight ?: number,
    spans?: StaggeredItemSpan | number,
    index: number,
    style?: React.CSSProperties | undefined,
    className?: string | undefined,
    children?: ReactNode | undefined,
    transform?(itemPos: PositionedItem): React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>
}