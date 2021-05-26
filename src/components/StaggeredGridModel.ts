export enum StaggeredItemSpan {
    Zero,
    Single,
    Full,
}

export enum StaggeredAlignment {
    Start,
    Center,
    End,
}

export interface StaggeredGridProps<Type> {
    columnWidth?: number,
    alignment?: StaggeredAlignment
    className?: string,
    items: Array<Type>,
    render: (item: Type, index: number) => any
}

export interface StaggeredGridState {
    gridWidth: number,
    gridHeight: number,
}

export interface GridItemData {
    getItemWidth: () => number | null,
    getItemHeight: () => number | null,
    itemColumnSpan: StaggeredItemSpan
    update: (width: number, x: number, y: number) => void
}


//Staggered Grid Item Model

export interface StaggeredGridItemProps {
    spans?: StaggeredItemSpan,
    index: number,
}


export interface StaggeredGridItemState {
    translateX: number,
    translateY: number,
    itemWidth: number
}