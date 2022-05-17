import {StaggeredGridItemProps, StaggeredItemSpan} from "./StaggeredGridModel";
import React, {useContext, useEffect, useRef, useState} from "react";
import {StaggeredGridContext} from "./StaggeredGridContext";

type PositionedItem = {
    width: number,
    translateX: number,
    translateY: number,
}

export function StaggeredGridItemFunctional(props: StaggeredGridItemProps & typeof StaggeredGridItemFunctional.defaultProps) {

    const elementRef = useRef<HTMLDivElement>(null)
    const [itemPos, setItemPos] = useState<PositionedItem>({
        width: props.initialWidth,
        translateX: props.initialTranslateX,
        translateY: props.initialTranslateY
    })
    const context = useContext(StaggeredGridContext)

    function updateTranslate(width: number, translateX: number, translateY: number) {
        setItemPos({width, translateX, translateY})
    }

    function transform(itemPos: PositionedItem): React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> {
        return {
            style: {
                position: "absolute",
                width: itemPos.width + "px",
                transform: `translate(${itemPos.translateX}px,${itemPos.translateY}px)`,
                overflowX: "hidden",
                ...props.style
            }
        }
    }

    useEffect(() => {
        context.updateItem(props.index, props.spans, elementRef.current?.clientWidth, elementRef.current?.clientHeight, updateTranslate)
    }, [props, props.index, props.spans, elementRef.current])

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
    spans: StaggeredItemSpan.Single,
}