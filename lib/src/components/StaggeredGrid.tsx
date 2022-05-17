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

    getColumnWidth(gridWidth: number): number {
        if (this.props.columnWidth != null) {
            return this.props.columnWidth
        } else if (this.props.columns != null && this.props.columns > 0 && gridWidth > 0) {
            return gridWidth / this.props.columns
        } else {
            console.error("columnWidth is zero , columns || columnWidth prop not given to StaggeredGrid")
            return 260
        }
    }

    getColsCount(gridWidth: number): number {
        if (this.props.columns != null && this.props.columns! > 0) {
            return this.props.columns!
        }
        let count = Math.ceil(gridWidth / this.getColumnWidth(gridWidth)) - 1
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
            this.gridWidth = this.getGridWidth()
            let gridWidth = this.gridWidth
            let calculatedGridHeight = 0;
            let columnWidth = this.getColumnWidth(gridWidth)
            let rowWidth = 0;
            let colNumber = 0
            let columnCount = this.getColsCount(gridWidth)
            if (this.gridItems.length < columnCount) {
                columnCount = this.gridItems.length
            }
            let colsHeight: number[] = Array(columnCount).fill(0)
            let rowOffset = 0;

            //Calculating Row Offset
            if (this.props.alignment === StaggeredAlignment.Center) {
                rowOffset = (gridWidth - (columnCount * columnWidth)) / 2
            } else if (this.props.alignment === StaggeredAlignment.End) {
                rowOffset = gridWidth - (columnCount * columnWidth)
            }

            this.gridItems.forEach((item, index) => {
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
                    } else if (itemSpan > columnCount && this.props.limitSpan) {
                        itemSpan = columnCount
                    }

                    // Getting item width & height
                    let itemWidth = itemSpan * columnWidth
                    const itemHeight = item.itemHeight

                    let x = 0;
                    let y = 0;

                    if (itemHeight != null && itemHeight !== 0 && itemWidth != null && itemWidth !== 0) {
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
                            colsHeight[colNumber] += itemHeight!
                        } else if (itemSpan > 1) {
                            let largeHeight = 0
                            for (let i = colNumber; i < (colNumber + itemSpan); i++) {
                                if (colsHeight[i] > largeHeight) {
                                    largeHeight = colsHeight[i]
                                }
                            }
                            y = largeHeight
                            for (let i = colNumber; i < (colNumber + itemSpan); i++) {
                                colsHeight[i] = largeHeight + itemHeight!
                            }
                        }
                        rowWidth += itemWidth
                        colNumber += itemSpan
                        item.update(itemWidth, (rowOffset + x), y)
                    } else {
                        console.warn("item at index " + index + " has undefined width || height")
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

    updateItem(index: number, itemColumnSpan: StaggeredItemSpan | number, width: number | undefined, height: number | undefined, update: (width: number, x: number, y: number) => void) {
        if (this.gridItems[index] != null) {
            // Checking if repositioning is needed
            let reposition: boolean = false
            if (itemColumnSpan !== this.gridItems[index].itemColumnSpan) {
                reposition = true
            }
            // Updating Object
            this.gridItems[index].itemColumnSpan = itemColumnSpan
            this.gridItems[index].itemWidth = width
            this.gridItems[index].itemHeight = height
            this.gridItems[index].update = update

            // Repositioning Items
            if (reposition) this.reposition()
        } else {
            // Creating object because doesn't exist
            this.gridItems[index] = {
                itemColumnSpan,
                itemWidth: width,
                itemHeight: height,
                update
            }
        }
    }

    removeItem(index: number) {
        if (this.gridItems[index] != null) {
            this.gridItems.splice(index, 1)
        }
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
