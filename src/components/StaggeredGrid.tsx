import React from "react";
import {
    GridItemData,
    StaggeredAlignment,
    StaggeredGridProps,
    StaggeredGridState,
    StaggeredItemSpan,
} from "./StaggeredGridModel";
import {StaggeredGridContext} from "./StaggeredGridContext";

export default class StaggeredGrid<ItemType> extends React.Component<StaggeredGridProps<ItemType> & typeof StaggeredGrid.defaultProps, StaggeredGridState> {

    static defaultProps = {
        alignment: StaggeredAlignment.Center,
        columnWidth: 260,
        className: ""
    }

    gridItems: Array<GridItemData> = []

    state = {
        gridWidth: 0,
        gridHeight: 0
    }

    gridElementRef: HTMLElement | null = null


    getColsCount = () => {
        let count = Math.ceil(this.state.gridWidth / this.props.columnWidth) - 1
        if (count < 1 || count === Infinity) {
            return 1
        }
        return count
    }

    reposition = () => {
        if (document.readyState === 'complete') {
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

                        let itemWidth = item.itemColumnSpan === StaggeredItemSpan.Single ? this.props.columnWidth : item.itemColumnSpan === StaggeredItemSpan.Full ? (this.state.gridWidth - rowOffset - rowOffset) : 0
                        const itemHeight = item.getItemHeight()

                        if (itemHeight != null || itemHeight !== 0 || itemWidth != null || itemWidth !== 0) {

                            //Constraining Item Width
                            if (itemWidth > this.state.gridWidth) {
                                itemWidth = this.state.gridWidth
                            }

                            //Calculating Item Offsets
                            if ((rowWidth + itemWidth) < this.state.gridWidth && item.itemColumnSpan === StaggeredItemSpan.Single) { //Item can be added to current row
                                x = rowWidth
                                rowWidth += itemWidth
                                y = colsHeight[colNumber]
                                colsHeight[colNumber] += itemHeight!
                                colNumber++
                            } else { //Item cannot be added to current row
                                colNumber = 0
                                x = 0
                                y = colsHeight[colNumber]
                                if (item.itemColumnSpan === StaggeredItemSpan.Full) {
                                    let largeHeight = 0
                                    colsHeight.forEach((height) => {
                                        if (height > largeHeight) {
                                            largeHeight = height
                                        }
                                    })
                                    colsHeight.forEach((height, index) => {
                                        colsHeight[index] = largeHeight + itemHeight!
                                    })
                                    y = largeHeight
                                    rowWidth = 0
                                } else if (item.itemColumnSpan === StaggeredItemSpan.Single) {
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
        console.log("Grid Mounted")
        window.addEventListener("resize", this.refresh)
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
                    itemAdded: (index: number, itemColumnSpan: StaggeredItemSpan, getWidth: () => number | null, getHeight: () => number | null, update: (width: number, x: number, y: number) => void) => {
                        this.gridItems[index] = {
                            getItemWidth: getWidth,
                            getItemHeight: getHeight,
                            itemColumnSpan,
                            update
                        }
                    },
                    itemUpdated: (index: number) => {
                        //todo item updated only
                        this.refresh()
                        this.reposition()
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
                    {this.props.items.map((item, index) => {
                        return this.props.render(item, index)
                    })}
                </div>
            </StaggeredGridContext.Provider>
        )
    }
}
