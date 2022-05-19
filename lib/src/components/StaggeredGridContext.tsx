import React, {useContext} from "react";
import {StaggeredItemSpan} from "./StaggeredGridModel";

export type StaggeredGridContextType = {
    colWidth: number,
    updateItem: (index: number, itemColumnSpan: StaggeredItemSpan | number, height: number, update: (width: number, x: number, y: number) => void) => void,
    removeItem: (index: number) => void,
}

const defaultValue = {
    colWidth: 400,
    updateItem: (index: number, itemColumnSpan: StaggeredItemSpan | number, height: number, update: (width: number, x: number, y: number) => void) => {
    },
    removeItem: (index: number) => {
    },
}

export const StaggeredGridContext = React.createContext<StaggeredGridContextType>(defaultValue)

export function useStaggeredGrid() {
    return useContext(StaggeredGridContext)
}

