import React, {useContext} from "react";
import {StaggeredItemSpan} from "./StaggeredGridModel";

const defaultValue = {
    gridWidth: 0,
    gridHeight: 0,
    colWidth: 400,
    recalculate: () => {
    },
    itemAdded: (index: number, itemColumnSpan: StaggeredItemSpan, getWidth: () => number | null, getHeight: () => number | null, update: (width: number, x: number, y: number) => void) => {
    },
    itemRemoved: (index: number) => {
    },
    itemUpdated: (index: number) => {

    }
}

export const StaggeredGridContext = React.createContext(defaultValue)

// export const StaggeredGridProvider : FunctionComponent = (props) => {
//     return (
//         <StaggeredGridContext.Provider value={props.value}>
//             {props.children}
//         </StaggeredGridContext.Provider>
//     )
// }

export function useStaggeredGrid() {
    return useContext(StaggeredGridContext)
}

