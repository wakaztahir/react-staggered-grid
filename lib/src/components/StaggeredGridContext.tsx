import React, {useContext} from "react";
import {StaggeredItemSpan} from "./StaggeredGridModel";

export type StaggeredGridContextType = {
    colWidth: number,
    recalculate: () => void,
    updateItem: (index: number, itemColumnSpan: StaggeredItemSpan, width: number | undefined, height: number | undefined, update: (width: number, x: number, y: number) => void) => void,
    removeItem: (index: number) => void,
}

const defaultValue = {
    colWidth: 400,
    recalculate: () => {
    },
    updateItem: (index: number, itemColumnSpan: StaggeredItemSpan, width: number | undefined, height: number | undefined, update: (width: number, x: number, y: number) => void) => {
    },
    removeItem: (index: number) => {
    },
}

export const StaggeredGridContext = React.createContext<StaggeredGridContextType>(defaultValue)

export function useStaggeredGrid() {
    return useContext(StaggeredGridContext)
}

