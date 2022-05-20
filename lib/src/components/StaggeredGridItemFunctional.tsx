import {PositionedItem, StaggeredGridItemProps} from "./StaggeredGridModel";
import React, {RefObject, useContext, useEffect, useRef, useState} from "react";
import {StaggeredGridContext} from "./StaggeredGridContext";

export function useStaggeredItemPosition<T extends HTMLElement>(index: number, spans: number, itemHeight?: number, ref?: RefObject<T>, isLoading: boolean = false, initialWidth: number = 0, initialTranslateX: number = 0, initialTranslateY: number = 0): PositionedItem {

    const [itemPos, setItemPos] = useState<PositionedItem>({
        width: initialWidth,
        left: initialTranslateX,
        top: initialTranslateY
    })
    const context = useContext(StaggeredGridContext)

    useEffect(() => {
        if (itemHeight == null && ref?.current == null) return
        context.updateItem(index, spans, itemHeight || ref!.current!.clientHeight, (width, x, y) => {
            setItemPos({width, left: x, top: y})
        })
        return () => {
            context.removeItem(index)
        }
    }, [index, spans, ref?.current, isLoading])

    return itemPos
}

export function StaggeredGridItemFunctional(props: StaggeredGridItemProps & typeof StaggeredGridItemFunctional.defaultProps) {

    let elementRef: RefObject<HTMLDivElement> | undefined = undefined
    if (props.itemHeight == null) {
        elementRef = useRef<HTMLDivElement>(null)
    }
    const itemPos = useStaggeredItemPosition(props.index, props.spans, props.itemHeight, elementRef, props.isLoading, props.initialWidth, props.initialTranslateX, props.initialTranslateY)

    function transform(itemPos: PositionedItem): React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> {
        if (props.transform != null) {
            return props.transform(itemPos)
        }
        return {
            style: {
                position: "absolute",
                width: itemPos.width + "px",
                left: itemPos.left + "px",
                top: itemPos.top + "px",
                ...props.style
            }
        }
    }

    return (
        <div {...transform(itemPos)} ref={elementRef} className={props.className}>
            {props.children}
        </div>
    )
}

StaggeredGridItemFunctional.defaultProps = {
    initialWidth: 0,
    initialTranslateX: 0,
    initialTranslateY: 0,
    spans: 1,
    isLoading: false,
}