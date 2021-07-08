import React from "react";
import {StaggeredGridContext} from "./StaggeredGridContext";
import {StaggeredGridItemProps, StaggeredGridItemState, StaggeredItemSpan} from "./StaggeredGridModel";

class StaggeredGridItem extends React.Component<StaggeredGridItemProps & typeof StaggeredGridItem.defaultProps, StaggeredGridItemState> {

    static contextType = StaggeredGridContext

    static defaultProps = {
        spans: StaggeredItemSpan.Single,
        position: -1,
        onUpdatePosition: (pos: number) => {
        },
        draggable: true,
    }

    //State Variables

    state = {
        translateX: 0,
        translateY: 0,
        itemWidth: 0
    }

    stateUpdating = false
    nextStateUpdate = () => {

    }

    itemElementRef: HTMLElement | null = null

    updateTranslate = (width: number, x: number, y: number) => {
        if (!this.stateUpdating) {
            if (this.state.itemWidth !== width || x !== this.state.translateX || y !== this.state.translateY) {
                this.nextStateUpdate = () => {
                }
                this.stateUpdating = true
                this.setState({
                    itemWidth: width,
                    translateX: x,
                    translateY: y,
                }, () => {
                    this.nextStateUpdate()
                    this.stateUpdating = false
                })
            }
        } else {
            this.nextStateUpdate = () => {
                this.updateTranslate(width, x, y)
            }
        }
    }

    /**
     * Reports height and width
     */
    reportData = () => {
        this.context.itemAdded(this.props.index, this.props.spans, this.itemElementRef?.clientWidth, this.itemElementRef?.clientHeight, this.updateTranslate)
    }

    componentDidMount() {
        this.reportData()
    }

    componentDidUpdate(prevProps: Readonly<StaggeredGridItemProps & typeof StaggeredGridItem.defaultProps>, prevState: Readonly<StaggeredGridItemState>, snapshot?: any) {
        this.reportData()
        this.context.itemUpdated(this.props.index, this.props.spans, this.itemElementRef?.clientWidth, this.itemElementRef?.clientHeight)
    }

    componentWillUnmount() {
        this.context.itemRemoved(this.props.index)
    }

    render() {
        return (
            <div
                ref={(element) => {
                    this.itemElementRef = element
                }}
                style={{
                    width: this.state.itemWidth + "px",
                    position: "absolute",
                    transform: `translate(${this.state.translateX}px,${this.state.translateY}px)`,
                    transition: "transform .3s ease-out",
                    overflowX: "hidden",
                }}
            >
                {this.props.children}
            </div>
        )
    }
}

export default StaggeredGridItem