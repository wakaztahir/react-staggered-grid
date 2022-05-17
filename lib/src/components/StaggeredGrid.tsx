import React from "react";
import {
    GridItemData,
    StaggeredAlignment,
    StaggeredGridDefaultProps,
    StaggeredGridProps,
    StaggeredGridState,
    StaggeredItemSpan,
} from "./StaggeredGridModel";
import {StaggeredGridContext} from "./StaggeredGridContext";

export class StaggeredGrid<ItemType> extends React.Component<StaggeredGridProps & typeof StaggeredGrid.defaultProps, StaggeredGridState> {

    static defaultProps = StaggeredGridDefaultProps

    avoidRepositioning: boolean = false // when true , repositioning is avoided for one call !
    gridWidth: number = 0
    gridItems: Array<GridItemData> = []

    state = {
        calculatedGridHeight: 0
    }

    gridElementRef: HTMLElement | null = null
    getGridWidth(): number {
        if (this.props.gridWidth != null) {
            return this.props.gridWidth
        } else if (this.props.columns != null && this.props.columnWidth != null && !this.props.useElementWidth) {
            return this.props.columns * this.props.columnWidth
        } else if (this.gridElementRef != null) {
            let gw = this.gridElementRef.clientWidth
            if (gw == null || gw == 0) {
                console.error("gridWidth is zero , gridWidth prop || css width property should be given to StaggeredGrid")
            }
            return gw
        } else {
            return 0
        }
    }

    getColumnWidth(): number {
        if (this.props.columnWidth != null) {
            return this.props.columnWidth
        } else if (this.props.columns != null && this.props.columns > 0 && this.gridWidth > 0) {
            return this.gridWidth / this.props.columns
        } else {
            console.error("columnWidth is zero , columns || columnWidth prop not given to StaggeredGrid")
            return 260
        }
    }

    getColsCount(): number {
        if (this.props.columns != null && this.props.columns! > 0) {
            return this.props.columns!
        }
        let count = Math.ceil(this.gridWidth / this.getColumnWidth()) - 1
        if (count < 1 || count === Infinity) {
            return 1
        }
        return count
    }

    reposition = () => {
        try {
            if (this.avoidRepositioning) {
                this.avoidRepositioning = false
                return;
            }
            if (this.gridElementRef != null) {
                this.gridWidth = this.getGridWidth()
            }
            let calculatedGridHeight = 0;
            let columnWidth = this.getColumnWidth()
            let rowWidth = 0;
            let colNumber = 0
            let columnCount = this.getColsCount()
            if (this.gridItems.length < columnCount) {
                columnCount = this.gridItems.length
            }
            let gridWidth = this.gridWidth
            if (gridWidth == 0) {
                gridWidth = columnWidth * columnCount
            }
            let colsHeight: number[] = Array(columnCount).fill(0)
            let rowOffset = 0;

            //Calculating Row Offset
            if (this.props.alignment === StaggeredAlignment.Center) {
                rowOffset = (gridWidth - (columnCount * columnWidth)) / 2
            } else if (this.props.alignment === StaggeredAlignment.End) {
                rowOffset = gridWidth - (columnCount * columnWidth)
            }

            this.gridItems.forEach(item => {
                try {
                    let x = 0;
                    let y = 0;
                    let itemSpan: number = item.itemColumnSpan
                    if (itemSpan < 0) {
                        if (itemSpan === StaggeredItemSpan.Full) {
                            itemSpan = columnCount
                        } else {
                            console.error("column span out of bounds")
                        }
                    } else if (itemSpan > columnCount && this.props.limitSpan) {
                        itemSpan = columnCount
                    }
                    let itemWidth = itemSpan * columnWidth
                    const itemHeight = item.itemHeight

                    if (itemHeight != null || itemHeight !== 0 || itemWidth != null || itemWidth !== 0) {
                        //Calculating Item Offsets
                        if ((rowWidth + itemWidth) <= (columnCount * columnWidth) && itemSpan === 1) { //Item can be added to current row
                            x = rowWidth
                            rowWidth += itemWidth
                            y = colsHeight[colNumber]
                            colsHeight[colNumber] += itemHeight!
                            colNumber++
                        } else { //Item cannot be added to current row
                            colNumber = 0
                            x = 0
                            y = colsHeight[colNumber]
                            if (itemSpan > 1) {
                                let largeHeight = 0
                                for (let i = 0; i < itemSpan; i++) {
                                    if (colsHeight[i] > largeHeight) {
                                        largeHeight = colsHeight[i]
                                    }
                                }
                                for (let i = 0; i < itemSpan; i++) {
                                    colsHeight[i] = largeHeight + itemHeight!
                                }
                                y = largeHeight
                                rowWidth = 0
                            } else if (itemSpan === 1) {
                                colsHeight[colNumber] += itemHeight!
                                rowWidth = itemWidth
                                colNumber++
                            }
                        }

                        item.update(itemWidth, (rowOffset + x), y)
                    }
                } catch (e) {
                    console.warn(e)
                }
            })
            if (this.props.calculateHeight) {
                for (let i = 0; i < colsHeight.length; i++) {
                    if (colsHeight[i] > calculatedGridHeight) {
                        calculatedGridHeight = colsHeight[i]
                    }
                }
                if (this.state.calculatedGridHeight !== calculatedGridHeight) {
                    this.avoidRepositioning = true
                    this.setState({
                        calculatedGridHeight
                    })
                }
            }
        } catch (e) {
            console.error(e)
        }
    }

    componentDidMount() {
        this.reposition()
    }

    componentDidUpdate(prevProps: Readonly<{}>, prevState: Readonly<{}>, snapshot?: any) {
        this.reposition()
    }

    render() {
        let heightProp: React.CSSProperties
        if (this.props.calculateHeight) {
            heightProp = {height: this.state.calculatedGridHeight + "px"}
        } else {
            heightProp = {}
        }
        return (
            <StaggeredGridContext.Provider
                value={{
                    colWidth: this.getColumnWidth(),
                    itemAdded: (index: number, itemColumnSpan: StaggeredItemSpan, width: number | undefined, height: number | undefined, update: (width: number, x: number, y: number) => void) => {
                        this.gridItems[index] = {
                            itemColumnSpan,
                            itemWidth: width,
                            itemHeight: height,
                            update
                        }
                    },
                    itemUpdated: (index: number, itemColumnSpan: StaggeredItemSpan, width: number | undefined, height: number | undefined) => {
                        let item = this.gridItems[index]
                        if (item.itemColumnSpan !== itemColumnSpan || item.itemWidth !== width || item.itemHeight !== height) {
                            this.gridItems[index] = {
                                ...item,
                                itemColumnSpan,
                                itemWidth: width,
                                itemHeight: height,
                            }
                            this.reposition()
                        }
                    },
                    itemRemoved: (index: number) => {
                        if (this.gridItems[index] != null) {
                            this.gridItems.splice(index, 1)
                        }
                    },
                    recalculate: this.reposition
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
