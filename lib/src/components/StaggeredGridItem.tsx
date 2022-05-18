import React from "react";
import {StaggeredGridContext} from "./StaggeredGridContext";
import {PositionedItem, StaggeredGridItemProps, StaggeredItemSpan} from "./StaggeredGridModel";

export class StaggeredGridItem extends React.Component<StaggeredGridItemProps & typeof StaggeredGridItem.defaultProps, PositionedItem> {

    static contextType = StaggeredGridContext

    context!: React.ContextType<typeof StaggeredGridContext>

    static defaultProps = {
        initialWidth: 0,
        initialTranslateX: 0,
        initialTranslateY: 0,
        spans: StaggeredItemSpan.Single,
    }

    //State Variables

    state: PositionedItem = {
        translateX: this.props.initialTranslateX,
        translateY: this.props.initialTranslateY,
        width: this.props.initialWidth
    }

    itemElementRef: HTMLElement | null = null

    updateTranslate = (width: number, x: number, y: number) => {
        if (this.state.width !== width || x !== this.state.translateX || y !== this.state.translateY) {
            this.setState({
                width: width,
                translateX: x,
                translateY: y,
            })
        }
    }

    /**
     * Reports height and width
     */
    reportData() {
        this.context.updateItem(this.props.index, this.props.spans, this.props.itemHeight || this.itemElementRef?.clientHeight, this.updateTranslate)
    }

    componentDidMount() {
        this.reportData()
    }

    componentDidUpdate(prevProps: Readonly<StaggeredGridItemProps & typeof StaggeredGridItem.defaultProps>, prevState: Readonly<PositionedItem>, snapshot?: any) {
        this.reportData();
    }

    componentWillUnmount() {
        this.context.removeItem(this.props.index)
    }

    transform(itemPos: PositionedItem): React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> {
        if (this.props.transform != null) {
            return this.props.transform(itemPos)
        }
        return {
            style: {
                position: "absolute",
                width: itemPos.width + "px",
                transform: `translate(${itemPos.translateX}px,${itemPos.translateY}px)`,
                overflowX: "hidden",
                ...this.props.style
            }
        }
    }

    render() {
        return (
            <div
                {...this.transform(this.state)}
                ref={this.props.itemHeight == null ? (element) => {
                    this.itemElementRef = element
                } : undefined}
                className={this.props.className}
            >
                {this.props.children}
            </div>
        )
    }
}