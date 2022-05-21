import React from "react";
import {
    GridItemData,
    StaggeredAlignment,
    StaggeredGridProps,
    StaggeredGridState,
    StaggeredItemSpan,
} from "./StaggeredGridModel";
import {StaggeredGridContext} from "./StaggeredGridContext";

export class StaggeredGrid<ItemType> extends React.Component<StaggeredGridProps & typeof StaggeredGrid.defaultProps, StaggeredGridState> {

    static defaultProps = {
        alignment: StaggeredAlignment.Center,
        limitSpan: true,
        calculateHeight: true,
        useElementWidth: false,
        horizontalGap: 0,
        verticalGap: 0,
        repositionOnResize: false,
        fitHorizontalGap: false,
        requestAppendScrollTolerance: 20,
    }

    repositionedOnce: boolean = false
    gridWidth: number = 0
    gridItems: Array<GridItemData> = []
    requestRepositioningId: number | undefined = undefined

    state = {
        calculatedGridHeight: undefined
    }

    gridElementRef: HTMLElement | null = null

    getGridWidth(): number {
        if (this.props.gridWidth != null) {
            return this.props.gridWidth
        } else {
            let count = this.getDefinedColsCount()
            if (count != null && this.props.columnWidth != null && !this.props.useElementWidth) {
                return count * this.props.columnWidth
            } else if (this.gridElementRef != null) {
                const gw = this.gridElementRef.clientWidth
                if (gw == null || gw == 0) {
                    console.error("gridWidth is zero , gridWidth prop || css width property should be given to StaggeredGrid")
                    return 0
                }
                return gw
            } else {
                return 0
            }

        }
    }

    getColumnWidth(gridWidth: number): number {
        if (this.props.columnWidth != null) {
            return this.props.columnWidth
        } else {
            let count = this.getDefinedColsCount()
            if (count != undefined) {
                return gridWidth / count
            } else {
                console.error("columnWidth is zero , columns || columnWidth prop not given to StaggeredGrid")
                return 260
            }
        }
    }

    getDefinedColsCount(): number | undefined {
        if (this.props.columns != null && this.props.columns > 0) {
            return Math.max(1, Math.min(this.gridItems.length, this.props.columns))
        } else {
            return undefined
        }
    }

    getColsCount(gridWidth: number): number {
        return this.getDefinedColsCount() || Math.max(1, Math.min(this.gridItems.length, Math.ceil(gridWidth / this.getColumnWidth(gridWidth)) - 1))
    }

    reposition = () => {
        try {
            if (this.gridItems.length === 0) return
            this.gridWidth = this.getGridWidth()
            const gridWidth = this.gridWidth
            const columnCount = this.getColsCount(gridWidth)
            if (columnCount < 1) return;
            const horizontalGap = this.props.horizontalGap
            const verticalGap = this.props.verticalGap
            const limitSpan = this.props.limitSpan
            let columnWidth = this.getColumnWidth(gridWidth)
            if (this.props.fitHorizontalGap) {
                columnWidth -= (((columnCount - 1) * horizontalGap) / columnCount)
            }
            const calculatedGridWidth = (columnCount * columnWidth) + (columnCount - 1) * horizontalGap
            let rowWidth = 0;
            let colNumber = 0;
            const colsHeight: number[] = Array(columnCount).fill(0)
            let rowOffset = 0;

            //Calculating Row Offset
            if (this.props.alignment === StaggeredAlignment.Center) {
                rowOffset = (gridWidth - calculatedGridWidth) / 2
            } else if (this.props.alignment === StaggeredAlignment.End) {
                rowOffset = gridWidth - calculatedGridWidth
            }
            for (let i = 0; i < this.gridItems.length; i++) {
                let item = this.gridItems[i]
                if (!item.mounted) continue;
                try {
                    // Getting item span
                    let itemSpan: number = item.itemColumnSpan
                    if (itemSpan < 1) {
                        if (itemSpan === StaggeredItemSpan.Full) {
                            itemSpan = columnCount
                        } else {
                            itemSpan = 1
                            console.warn("column span out of bounds")
                        }
                    } else if (itemSpan > columnCount && limitSpan) {
                        itemSpan = columnCount
                    }

                    // Getting item width & height
                    let itemWidth = itemSpan * columnWidth + (Math.max(itemSpan - 1, 0) * horizontalGap)
                    const itemHeight = item.itemHeight

                    let x: number;
                    let y = 0;

                    //Calculating Item Offsets
                    if (colNumber + itemSpan <= columnCount) { //Item can be added to current row
                        x = rowWidth
                    } else { //Item cannot be added to current row
                        colNumber = 0
                        x = 0
                        rowWidth = 0
                    }
                    if (itemSpan === 1) {
                        y = colsHeight[colNumber]
                        colsHeight[colNumber] += itemHeight + verticalGap
                    } else if (itemSpan > 1) {
                        let largeHeight = 0
                        for (let i = colNumber; i < (colNumber + itemSpan); i++) {
                            if (colsHeight[i] > largeHeight) {
                                largeHeight = colsHeight[i]
                            }
                        }
                        y = largeHeight
                        for (let i = colNumber; i < (colNumber + itemSpan); i++) {
                            colsHeight[i] = largeHeight + itemHeight + verticalGap
                        }
                    }
                    rowWidth += itemWidth + horizontalGap
                    colNumber += itemSpan
                    item.update(itemWidth, (rowOffset + x), y)
                } catch (e) {
                    console.warn(e)
                }
            }
            if (this.props.calculateHeight) {
                let calculatedGridHeight = 0;
                for (let i = 0; i < colsHeight.length; i++) {
                    if (colsHeight[i] > calculatedGridHeight) {
                        calculatedGridHeight = colsHeight[i]
                    }
                }
                if (this.state.calculatedGridHeight !== calculatedGridHeight) {
                    this.setState({calculatedGridHeight})
                }
            }
            this.repositionedOnce = true
        } catch (e) {
            console.error(e)
        }
    }

    requestReposition = () => {
        if (this.requestRepositioningId == null) {
            this.requestRepositioningId = window.requestAnimationFrame(() => {
                this.requestRepositioningId = undefined
                this.reposition()
            })
        }
    }

    onResize = () => {
        this.requestReposition()
    }

    onScroll = () => {
        if (this.gridElementRef == null || this.state.calculatedGridHeight == null) {
            if (!this.props.calculateHeight) {
                console.warn("calculateHeight must be true for requestAppend to work !")
            }
            return
        }
        const offset = this.gridElementRef.getBoundingClientRect().top - (this.gridElementRef.offsetParent?.getBoundingClientRect().top || 0);
        const top = window.pageYOffset + window.innerHeight - offset;
        if (top >= this.gridElementRef.scrollHeight - this.props.requestAppendScrollTolerance) {
            if (this.props.requestAppend != null) {
                this.props.requestAppend()
            }
        }
    }

    componentDidMount() {
        this.requestReposition()
        if (this.props.repositionOnResize) {
            window.addEventListener("resize", this.onResize)
        }
        if (this.props.requestAppend != null) {
            document.addEventListener("scroll", this.onScroll)
        }
    }

    componentWillUnmount() {
        if (this.props.repositionOnResize) {
            window.removeEventListener("resize", this.onResize)
        }
        if (this.props.requestAppend != null) {
            document.removeEventListener("scroll", this.onScroll)
        }
    }

    componentDidUpdate(prevProps: Readonly<StaggeredGridProps & typeof StaggeredGrid.defaultProps>, prevState: Readonly<StaggeredGridState>, snapshot?: any) {
        if (prevProps.columns !== this.props.columns ||
            prevProps.columnWidth !== this.props.columnWidth ||
            prevProps.gridWidth !== this.props.gridWidth ||
            prevProps.calculateHeight !== this.props.calculateHeight ||
            prevProps.horizontalGap !== this.props.horizontalGap ||
            prevProps.fitHorizontalGap !== this.props.fitHorizontalGap ||
            prevProps.limitSpan !== this.props.limitSpan ||
            prevProps.alignment !== this.props.alignment ||
            prevProps.children !== this.props.children
        ) {
            this.requestReposition()
        }
        if (prevProps.requestAppend == null && this.props.requestAppend != null) {
            document.addEventListener("scroll", this.onScroll)
        } else if (prevProps.requestAppend != null && this.props.requestAppend == null) {
            document.removeEventListener("scroll", this.onScroll)
        }
        if (!prevProps.repositionOnResize && this.props.repositionOnResize) {
            window.addEventListener("resize", this.onResize)
        } else if (prevProps.repositionOnResize && !this.props.repositionOnResize) {
            window.removeEventListener("resize", this.onResize)
        }
    }

    updateItem(index: number, itemColumnSpan: StaggeredItemSpan | number, height: number, update: (width: number, x: number, y: number) => void) {
        let reposition: boolean = false
        if (this.gridItems[index] != null) {
            if (itemColumnSpan !== this.gridItems[index].itemColumnSpan || height !== this.gridItems[index].itemHeight) {
                reposition = true
            }
            this.gridItems[index].itemColumnSpan = itemColumnSpan
            this.gridItems[index].itemHeight = height
            this.gridItems[index].update = update
            this.gridItems[index].mounted = true
        } else {
            this.gridItems[index] = {
                itemColumnSpan,
                itemHeight: height,
                update,
                mounted: true
            }
        }
        if (reposition && this.repositionedOnce) {
            this.requestReposition()
        }
    }

    removeItem(index: number) {
        if (this.gridItems[index] != null) {
            this.gridItems[index].mounted = false
            this.requestReposition()
        }
    }

    render() {
        let heightProp: React.CSSProperties
        if (this.props.calculateHeight && this.state.calculatedGridHeight != null) {
            heightProp = {height: this.state.calculatedGridHeight + "px"}
        } else {
            heightProp = {}
        }
        return (
            <StaggeredGridContext.Provider
                value={{
                    colWidth: this.getColumnWidth(this.getGridWidth()),
                    updateItem: this.updateItem.bind(this),
                    removeItem: this.removeItem.bind(this),
                }}>
                <div
                    ref={(element) => {
                        this.gridElementRef = element
                    }}
                    style={{
                        position: "relative",
                        ...heightProp,
                        ...this.props.style
                    }}
                    className={this.props.className}
                >
                    {this.props.children}
                </div>
            </StaggeredGridContext.Provider>
        )
    }
}
