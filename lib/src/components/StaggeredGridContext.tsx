import React, {useContext} from "react";
import {StaggeredItemSpan} from "./StaggeredGridModel";

export type StaggeredGridContextType = {
    gridWidth: number,
    gridHeight: number,
    colWidth: number,
    recalculate: () => void,
    itemAdded: (index: number, itemColumnSpan: StaggeredItemSpan, width: number | undefined, height: number | undefined, update: (width: number, x: number, y: number) => void) => void,
    itemUpdated: (index: number, itemColumnSpan: StaggeredItemSpan, width: number | undefined, height: number | undefined,) => void,
    itemRemoved: (index: number) => void,
}

const defaultValue = {
    gridWidth: 0,
    gridHeight: 0,
    colWidth: 400,
    recalculate: () => {
    },
    itemAdded: (index: number, itemColumnSpan: StaggeredItemSpan, width: number | undefined, height: number | undefined, update: (width: number, x: number, y: number) => void) => {
    },
    itemUpdated: (index: number, itemColumnSpan: StaggeredItemSpan, width: number | undefined, height: number | undefined,) => {
    },
    itemRemoved: (index: number) => {
    },
}

export const StaggeredGridContext = React.createContext<StaggeredGridContextType>(defaultValue)

export function useStaggeredGrid() {
    return useContext(StaggeredGridContext)
}

