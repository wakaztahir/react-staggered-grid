import React from "react";
import { StaggeredItemSpan } from "./StaggeredGridModel";
export declare type StaggeredGridContextType = {
    gridWidth: number;
    gridHeight: number;
    colWidth: number;
    recalculate: () => void;
    itemAdded: (index: number, itemColumnSpan: StaggeredItemSpan, width: number | undefined, height: number | undefined, update: (width: number, x: number, y: number) => void) => void;
    itemUpdated: (index: number, itemColumnSpan: StaggeredItemSpan, width: number | undefined, height: number | undefined) => void;
    itemRemoved: (index: number) => void;
};
export declare const StaggeredGridContext: React.Context<StaggeredGridContextType>;
export declare function useStaggeredGrid(): StaggeredGridContextType;
