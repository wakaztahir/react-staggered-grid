import React, {useMemo, useState} from "react"
import {StaggeredAlignment, StaggeredGrid, StaggeredGridItem, StaggeredItemSpan} from "react-staggered-grid";

type Item = {
    id: number,
    span: StaggeredItemSpan,
    width: number,
    height: number,
}

function App() {

    const [alignment, setAlignment] = useState(StaggeredAlignment.Center)
    const [columnWidth, setColumnWidth] = useState<number>(300)
    const [columns, setColumns] = useState<number | undefined>(undefined)
    const [horizontalGap, setHorizontalGap] = useState(10)
    const [verticalGap, setVerticalGap] = useState(10)
    const [images, setImages] = useState(false)
    const [multiSpan, setMultiSpan] = useState(false)
    const [fitHorizontalGap, setFitHorizontalGap] = useState(true)

    const totalItems = 100

    // calculating heights array for items
    const randomHeights: Array<number> = useMemo(() => {
        let heights: Array<number> = []
        for (let i = 0; i < totalItems; i++) {
            heights.push(Math.floor((Math.random() * 300) + 300))
        }
        return heights
    }, [totalItems])

    // calculating spans for items
    const randomSpans: Array<number> = useMemo(() => {
        let spans: Array<number> = []
        for (let i = 0; i < totalItems; i++) {
            spans.push(Math.floor(Math.random() * (columns || 2)) + 1)
        }
        return spans
    }, [totalItems, columns])

    // creating items objects
    const items: Array<Item> = useMemo(() => {
        let items1: Array<Item> = []
        for (let i = 0; i < totalItems; i++) {
            let span: number
            if (multiSpan) {
                span = randomSpans[i]
            } else {
                span = 1
            }
            items1.push({
                id: i,
                span: span,
                width: span * columnWidth,
                height: randomHeights[i],
            });
        }
        return items1
    }, [totalItems, columnWidth, multiSpan, randomSpans, randomHeights])

    return (
        <React.Fragment>
            <StaggeredOptions
                alignment={alignment}
                setAlignment={setAlignment}
                columnWidth={columnWidth}
                setColumnWidth={setColumnWidth}
                columns={columns}
                setColumns={setColumns}
                horizontalGap={horizontalGap}
                setHorizontalGap={setHorizontalGap}
                verticalGap={verticalGap}
                setVerticalGap={setVerticalGap}
                fitHorizontalGap={fitHorizontalGap}
                setFitHorizontalGap={setFitHorizontalGap}
                images={images}
                setImages={setImages}
                multiSpan={multiSpan}
                setMultiSpan={setMultiSpan}
            />
            <StaggeredGrid
                alignment={alignment}
                columnWidth={columnWidth}
                columns={columns}
                style={{background: "#e3e3e3"}}
                useElementWidth={true}
                horizontalGap={horizontalGap}
                verticalGap={verticalGap}
                fitHorizontalGap={fitHorizontalGap}
                repositionOnResize={true}
            >
                {items.map((item, index) => {
                    const itemProps: StaggeredTestItemProps = {
                        columnWidth,
                        index,
                        item
                    }
                    return (images ? (
                        <StaggeredImageItem key={"i" + index + "s" + item.span} {...itemProps}/>
                    ) : (
                        <StaggeredTestItem key={"t" + index + "s" + item.span} {...itemProps} />
                    ))
                })}
            </StaggeredGrid>
        </React.Fragment>
    )
}

interface StaggeredTestItemProps {
    item: Item,
    index: number,
    columnWidth: number,
}

function StaggeredTestItem(props: StaggeredTestItemProps) {
    let {item, index} = props
    let [span, setSpan] = useState(props.item.span)
    let [height, setHeight] = useState(props.item.height)
    return (
        <StaggeredGridItem
            index={index}
            spans={span}
            style={{transition: "left 0.3s ease,top 0.3s ease"}}
            itemHeight={height} // when not given , a ref is used to get element height
        >
            <div style={{
                width: "100%",
                height: item.height + "px",
                background: "skyblue",
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center"
            }}>
                <div>Span : <input
                    style={{width: "4em"}}
                    type={"number"}
                    value={span}
                    onChange={(e) => {
                        item.span = parseInt(e.currentTarget.value)
                        setSpan(item.span)
                    }}
                /></div>
                <div>Height : <input
                    style={{width: "4em"}}
                    type={"number"}
                    value={height}
                    onChange={(e) => {
                        item.height = parseInt(e.currentTarget.value)
                        setHeight(item.height)
                    }}
                /></div>
                Name : Item {index}
            </div>
        </StaggeredGridItem>
    )
}

function StaggeredImageItem(props: StaggeredTestItemProps) {
    let {item, index} = props
    const imageUrl = useMemo(() => {
        return "https://picsum.photos/" + item.width + "/" + item.height
    }, [])
    return (
        <StaggeredGridItem
            index={index}
            spans={item.span}
            style={{transition: "left 0.3s ease,top 0.3s ease", overflowX: "hidden"}}
            itemHeight={item.height} // when not given , a ref is used to get element height
        >
            <img src={imageUrl} alt={"Random Image"}/>
        </StaggeredGridItem>
    )
}

interface Options {
    alignment: StaggeredAlignment,
    setAlignment: (alignment: StaggeredAlignment) => void;
    columnWidth: number;
    setColumnWidth: (width: number) => void;
    columns: number | undefined;
    setColumns: (cols: number | undefined) => void;
    horizontalGap: number,
    verticalGap: number,
    setHorizontalGap: (gap: number) => void;
    setVerticalGap: (gap: number) => void;
    fitHorizontalGap: boolean,
    setFitHorizontalGap: (fit: boolean) => void;
    images: boolean,
    setImages: (set: boolean) => void;
    multiSpan: boolean,
    setMultiSpan: (multi: boolean) => void;
}

function StaggeredOptions(props: Options) {
    return (
        <React.Fragment>
            <div style={{width: "100%", height: "3em"}}/>
            <div style={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
                padding: "1em 0em",
                position: "fixed",
                top: 0,
                left: 0,
                zIndex: 99,
                background: "rgba(255,255,255,.3)"
            }}>
                &nbsp;&nbsp;&nbsp;
                <label htmlFor="fitHorizontalGap">Show Images: </label>
                &nbsp;&nbsp;
                <input type={"checkbox"} checked={props.images}
                       onChange={(e) => props.setImages(e.currentTarget.checked)}/>
                &nbsp;&nbsp;&nbsp;
                <label htmlFor="multiSpan">Multi Span: </label>
                &nbsp;&nbsp;
                <input type={"checkbox"} checked={props.multiSpan}
                       onChange={(e) => props.setMultiSpan(e.currentTarget.checked)}/>
                <label htmlFor="alignment">Alignment : </label>
                &nbsp;&nbsp;
                <select
                    value={props.alignment}
                    id={"alignment"}
                    onChange={(e) => {
                        props.setAlignment(parseInt(e.currentTarget.value))
                    }}
                >
                    <option value={StaggeredAlignment.Start}>Start</option>
                    <option value={StaggeredAlignment.Center}>Center</option>
                    <option value={StaggeredAlignment.End}>End</option>
                </select>
                &nbsp;&nbsp;&nbsp;
                <label htmlFor="columnWidth">Column Width : </label>
                &nbsp;&nbsp;
                <input
                    type="number"
                    id="columnWidth"
                    value={props.columnWidth}
                    style={{width: "4em"}}
                    onChange={(e) => props.setColumnWidth(parseInt(e.currentTarget.value))}
                />
                &nbsp;&nbsp;&nbsp;
                <label htmlFor="columns">Total Columns : </label>
                &nbsp;&nbsp;
                <input
                    type="number"
                    id="columns"
                    min={0}
                    defaultValue={props.columns}
                    style={{width: "4em"}}
                    onChange={(e) => props.setColumns(parseInt(e.currentTarget.value))}
                />
                &nbsp;&nbsp;&nbsp;
                <label htmlFor="horizontalGap">Horizontal Gap : </label>
                &nbsp;&nbsp;
                <input
                    type="number"
                    id="horizontalGap"
                    min={0}
                    defaultValue={props.horizontalGap}
                    style={{width: "4em"}}
                    onChange={(e) => props.setHorizontalGap(parseInt(e.currentTarget.value))}
                />
                &nbsp;&nbsp;&nbsp;
                <label htmlFor="verticalGap">Vertical Gap : </label>
                &nbsp;&nbsp;
                <input
                    type="number"
                    id="verticalGap"
                    defaultValue={props.verticalGap}
                    min={0}
                    style={{width: "4em"}}
                    onChange={(e) => props.setVerticalGap(parseInt(e.currentTarget.value))}
                />
                &nbsp;&nbsp;&nbsp;
                <label htmlFor="fitHorizontalGap">Fit Horizontal Gap : </label>
                &nbsp;&nbsp;
                <input type={"checkbox"} checked={props.fitHorizontalGap}
                       onChange={(e) => props.setFitHorizontalGap(e.currentTarget.checked)}/>
            </div>
        </React.Fragment>
    )
}

export default App;
