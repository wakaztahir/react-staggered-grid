import React from "react";
import {
    GridItemData,
    StaggeredAlignment,
    StaggeredDisplay,
    StaggeredGridDefaultProps,
    StaggeredGridProps,
    StaggeredGridState,
    StaggeredItemSpan,
} from "./StaggeredGridModel";
import {StaggeredGridContext} from "./StaggeredGridContext";

export class StaggeredGrid<ItemType> extends React.Component<StaggeredGridProps & typeof StaggeredGrid.defaultProps, StaggeredGridState> {

    static defaultProps = StaggeredGridDefaultProps

    gridItems: Array<GridItemData> = []

    state = {
        gridWidth: 0,
        gridHeight: 0,
    }

    gridElementRef: HTMLElement | null = null

    getColsCount = () => {
        if (this.props.display === StaggeredDisplay.Linear) {
            return 1
        }
        let count = Math.ceil(this.state.gridWidth / this.props.columnWidth) - 1
        if (count < 1 || count === Infinity) {
            return 1
        }
        return count
    }

    reposition = () => {
        try {
            let rowWidth = 0;
            let colNumber = 0
            let columnCount = this.getColsCount()
            if (this.gridItems.length < columnCount) {
                columnCount = this.gridItems.length
            }
            let colsHeight: number[] = Array(columnCount).fill(0)
            let rowOffset = 0;

            //Calculating Row Offset
            if (this.props.alignment === StaggeredAlignment.Center) {
                rowOffset = (this.state.gridWidth - (columnCount * this.props.columnWidth)) / 2
            } else if (this.props.alignment === StaggeredAlignment.End) {
                rowOffset = this.state.gridWidth - (columnCount * this.props.columnWidth)
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
                    }
                    let itemWidth = itemSpan * this.props.columnWidth
                    const itemHeight = item.itemHeight

                    if (itemHeight != null || itemHeight !== 0 || itemWidth != null || itemWidth !== 0) {
                        //Calculating Item Offsets
                        if ((rowWidth + itemWidth) < this.state.gridWidth && item.itemColumnSpan === StaggeredItemSpan.Single && this.props.display === StaggeredDisplay.Grid) { //Item can be added to current row
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
                                for(let i=0;i<itemSpan;i++){
                                    colsHeight[i] = largeHeight + itemHeight!
                                }
                                y = largeHeight
                                rowWidth = 0
                            } else if (item.itemColumnSpan === StaggeredItemSpan.Single || this.props.display === StaggeredDisplay.Linear) {
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
        } catch (e) {
            console.error(e)
        }
    }

    /**
     * Updates Grid Width & Height
     */
    refresh = () => {
        if (this.gridElementRef != null) {
            if (this.state.gridWidth !== this.gridElementRef.clientWidth || this.state.gridHeight !== this.gridElementRef.clientHeight) {
                this.setState({
                    gridWidth: this.gridElementRef.clientWidth,
                    gridHeight: this.gridElementRef.clientHeight
                })
            }
        }
    }

    componentDidMount() {
        window.addEventListener("resize", this.refresh)
        this.refresh()
        this.reposition()
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.refresh)
    }

    componentDidUpdate(prevProps: Readonly<{}>, prevState: Readonly<{}>, snapshot?: any) {
        this.refresh()
        this.reposition()
    }

    render() {
        return (
            <StaggeredGridContext.Provider
                value={{
                    colWidth: this.props.columnWidth,
                    gridWidth: this.state.gridWidth,
                    gridHeight: this.state.gridHeight,
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
                            this.refresh()
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
                    }}
                    className={this.props.className}
                >
                    {this.props.children}
                </div>
            </StaggeredGridContext.Provider>
        )
    }
}
