import React, {useContext} from "react";
import {StaggeredItemSpan} from "./StaggeredGridModel";

const defaultValue = {
    gridWidth: 0,
    gridHeight: 0,
    colWidth: 400,
    recalculate: () => {
    },
    itemAdded: (index: number, itemColumnSpan: StaggeredItemSpan, width: number | null, height: number | null, update: (width: number, x: number, y: number) => void) => {
    },
    itemUpdated: (index: number, itemColumnSpan: StaggeredItemSpan, width: number | null, height: number | null,) => {
    },
    itemRemoved: (index: number) => {
    },
}

export const StaggeredGridContext = React.createContext(defaultValue)

export function useStaggeredGrid() {
    return useContext(StaggeredGridContext)
}

