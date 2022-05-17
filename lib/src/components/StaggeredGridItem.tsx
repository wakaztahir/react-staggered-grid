import React from "react";
import {StaggeredGridContext} from "./StaggeredGridContext";
import {StaggeredGridItemProps, StaggeredGridItemState, StaggeredItemSpan} from "./StaggeredGridModel";

export class StaggeredGridItem extends React.Component<StaggeredGridItemProps & typeof StaggeredGridItem.defaultProps, StaggeredGridItemState> {

    static contextType = StaggeredGridContext

    context!: React.ContextType<typeof StaggeredGridContext>

    static defaultProps = {
        initialWidth: 0,
        initialTranslateX: 0,
        initialTranslateY: 0,
        spans: StaggeredItemSpan.Single,
    }

    //State Variables

    state = {
        translateX: this.props.initialTranslateX,
        translateY: this.props.initialTranslateY,
        itemWidth: this.props.initialWidth
    }

    itemElementRef: HTMLElement | null = null

    updateTranslate = (width: number, x: number, y: number) => {
        if (this.state.itemWidth !== width || x !== this.state.translateX || y !== this.state.translateY) {
            this.setState({
                itemWidth: width,
                translateX: x,
                translateY: y,
            })
        }
    }

    /**
     * Reports height and width
     */
    reportData() {
        this.context.updateItem(this.props.index, this.props.spans, this.itemElementRef?.clientWidth, this.itemElementRef?.clientHeight, this.updateTranslate)
    }

    componentDidMount() {
        this.reportData()
    }

    componentDidUpdate(prevProps: Readonly<StaggeredGridItemProps & typeof StaggeredGridItem.defaultProps>, prevState: Readonly<StaggeredGridItemState>, snapshot?: any) {
        this.reportData();
    }

    componentWillUnmount() {
        this.context.removeItem(this.props.index)
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
                    overflowX: "hidden",
                    ...this.props.style
                }}
                className={this.props.className}
            >
                {this.props.children}
            </div>
        )
    }
}