import React from "react";
import {StaggeredGridContext} from "./StaggeredGridContext";
import {PositionedItem, StaggeredGridItemProps} from "./StaggeredGridModel";

export class StaggeredGridItem extends React.Component<StaggeredGridItemProps & typeof StaggeredGridItem.defaultProps, PositionedItem> {

    static contextType = StaggeredGridContext
    static defaultProps = {
        spans: 1
    }
    context!: React.ContextType<typeof StaggeredGridContext>

    //State Variables
    state: PositionedItem = this.props.initialPosition || {
        left: 0,
        top: 0,
        width: 0
    }

    itemElementRef: HTMLElement | null = null

    updateTranslate = (width: number, x: number, y: number) => {
        if (this.state.width !== width || x !== this.state.left || y !== this.state.top) {
            this.setState({
                width: width,
                left: x,
                top: y,
            })
        }
    }

    /**
     * Reports height and width
     */
    reportData() {
        if (this.props.itemHeight == null && this.itemElementRef == null) return
        this.context.updateItem(this.props.index, this.props.spans, this.props.itemHeight || this.itemElementRef!.clientHeight, this.updateTranslate)
    }

    componentDidMount() {
        this.reportData()
    }

    componentDidUpdate(prevProps: Readonly<StaggeredGridItemProps & typeof StaggeredGridItem.defaultProps>, prevState: Readonly<PositionedItem>, snapshot?: any) {
        if (prevProps.itemHeight !== this.props.itemHeight || prevProps.index !== this.props.index || prevProps.spans !== this.props.spans || prevProps.children !== this.props.children) {
            this.reportData();
        }
    }

    componentWillUnmount() {
        this.context.removeItem(this.props.index)
    }

    transform(itemPos: PositionedItem): React.HTMLProps<HTMLElement> {
        if (this.props.transform != null) {
            return this.props.transform(itemPos)
        }
        const newProps: any = {...this.props}
        delete newProps.initialPosition
        delete newProps.itemHeight
        delete newProps.spans
        delete newProps.index
        delete newProps.style
        delete newProps.children
        delete newProps.transform
        return {
            ...newProps,
            style: {
                position: "absolute",
                width: itemPos.width + "px",
                left: itemPos.left + "px",
                top: itemPos.top + "px",
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
                onLoad={this.reportData.bind(this)}
            >
                {this.props.children}
            </div>
        )
    }
}