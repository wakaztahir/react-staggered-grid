export declare enum StaggeredItemSpan {
    Zero = 0,
    Single = 1,
    Full = 2
}
export declare enum StaggeredDisplay {
    Linear = 0,
    Grid = 1
}
export declare enum StaggeredAlignment {
    Start = 0,
    Center = 1,
    End = 2
}
export interface StaggeredGridProps<Type> {
    display?: StaggeredDisplay;
    columnWidth?: number;
    alignment?: StaggeredAlignment;
    className?: string;
    items: Array<Type>;
    render: (item: Type, index: number) => any;
}
export declare const StaggeredGridDefaultProps: {
    display: StaggeredDisplay;
    alignment: StaggeredAlignment;
    columnWidth: number;
    className: string;
};
export interface StaggeredGridState {
    gridWidth: number;
    gridHeight: number;
}
export interface GridItemData {
    itemWidth: number | undefined;
    itemHeight: number | undefined;
    itemColumnSpan: StaggeredItemSpan;
    update: (width: number, x: number, y: number) => void;
}
export interface StaggeredGridItemProps {
    spans?: StaggeredItemSpan;
    index: number;
    position?: number;
    onUpdatePosition?: (pos: number) => void;
    draggable?: boolean;
    children?: any;
}
export interface StaggeredGridItemState {
    translateX: number;
    translateY: number;
    itemWidth: number;
}
