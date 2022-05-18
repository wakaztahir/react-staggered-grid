import React, {useMemo, useState} from "react"
import {StaggeredAlignment, StaggeredGrid, StaggeredGridItem, StaggeredItemSpan} from "react-staggered-grid";

type Item = {
    id: number,
    span: StaggeredItemSpan,
    width: string,
    height: number,
}

function App() {

    const [alignment, setAlignment] = useState(StaggeredAlignment.Center)
    const [columnWidth, setColumnWidth] = useState<number>(300)
    const [columns, setColumns] = useState<number | undefined>(undefined)
    const [horizontalGap, setHorizontalGap] = useState(10)
    const [verticalGap, setVerticalGap] = useState(10)
    const [fitHorizontalGap, setFitHorizontalGap] = useState(true)

    const items: Array<Item> = useMemo(() => {
        let items1: Array<Item> = []
        for (let i = 0; i < 100; i++) {
            let span = Math.floor(Math.random() * 2) + 1
            items1.push({
                id: i,
                span,
                width: "100%",
                height: (Math.random() * 300) + 300,
            });
        }
        return items1
    }, [])

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
            >
                {items.map((item, index) => (
                    <StaggeredTestItem key={index} item={item} index={index}/>
                ))}
            </StaggeredGrid>
        </React.Fragment>
    )
}

interface StaggeredTestItemProps {
    item: Item,
    index: number
}

function StaggeredTestItem(props: StaggeredTestItemProps) {
    let {item, index} = props
    let [span, setSpan] = useState(props.item.span)
    return (
        <StaggeredGridItem
            index={index}
            spans={span}
            style={{transition: "left 0.3s ease,top 0.3s ease"}}
            itemHeight={item.height} // when not given , a ref is used to get element height
        >
            <div style={{
                width: item.width,
                height: item.height + "px",
                background: "skyblue",
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center"
            }}>
                <div>Span : <input style={{width: "4em"}} type={"number"} value={span} onChange={(e) => {
                    setSpan(parseInt(e.currentTarget.value))
                }}/></div>
                Name : Item {index}
            </div>
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
