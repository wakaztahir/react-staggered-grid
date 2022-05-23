import {PositionedItem, StaggeredGridItemProps} from "./StaggeredGridModel";
import React, {MutableRefObject, RefObject, useContext, useEffect, useRef, useState} from "react";
import {StaggeredGridContext} from "./StaggeredGridContext";

export function useStaggeredItemPosition<T extends HTMLElement>(index: number, spans: number, itemHeight?: number, ref?: RefObject<T>, initialPosition ?: PositionedItem): PositionedItem {

    const [itemPos, setItemPos] = useState<PositionedItem>(initialPosition || {
        width: 0,
        left: 0,
        top: 0
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
    }, [index, spans, ref?.current])

    return itemPos
}

export function StaggeredGridItemFunctional(props: StaggeredGridItemProps & typeof StaggeredGridItemFunctional.defaultProps) {

    let elementRef: MutableRefObject<HTMLElement | null> | undefined = undefined
    if (props.itemHeight == null) {
        elementRef = useRef<HTMLElement | null>(null)
    }

    const itemPos = useStaggeredItemPosition(props.index, props.spans, props.itemHeight, elementRef, props.initialPosition)

    function transform(itemPos: PositionedItem): React.HTMLProps<HTMLElement> {
        const elemProps: any = {...props}
        delete elemProps.elementType
        delete elemProps.initialPosition
        delete elemProps.itemHeight
        delete elemProps.spans
        delete elemProps.index
        delete elemProps.style
        delete elemProps.children
        delete elemProps.transform
        if (props.transform != null) {
            return {
                ...elemProps,
                ...props.transform(itemPos)
            }
        }
        return {
            ...elemProps,
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
        <div
            {...transform(itemPos)}
            ref={(e) => {
                if (elementRef != null) {
                    elementRef.current = e
                }
            }}
        >
            {props.children}
        </div>
    )
}

StaggeredGridItemFunctional.defaultProps = {
    spans: 1,
}