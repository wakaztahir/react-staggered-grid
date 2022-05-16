import React, {useMemo, useState} from "react"
import {
    StaggeredAlignment,
    StaggeredDisplay,
    StaggeredGrid,
    StaggeredGridItem,
    StaggeredItemSpan
} from "react-staggered-grid";

type Item = {
    id: number,
    span: StaggeredItemSpan,
    width: string,
    height: number,
}

function App() {

    const [alignment, setAlignment] = useState(StaggeredAlignment.Center)
    const [display, setDisplay] = useState(StaggeredDisplay.Grid)
    const [columnWidth, setColumnWidth] = useState<number>(300)
    const [columns,setColumns] = useState<number | undefined>(undefined)

    const items: Array<Item> = useMemo(() => {
        let items1: Array<Item> = []
        for (let i = 0; i < 100; i++) {
            let span = i % 10 === 0 ? StaggeredItemSpan.Full : StaggeredItemSpan.Single
            items1.push({
                id: i,
                span,
                width: span === StaggeredItemSpan.Full ? "100%" : columnWidth + "px",
                height: (Math.random() * 300) + 300,
            });
        }
        return items1
    }, [columnWidth])

    return (
        <React.Fragment>
            <StaggeredOptions
                alignment={alignment}
                setAlignment={setAlignment}
                display={display}
                setDisplay={setDisplay}
                columnWidth={columnWidth}
                setColumnWidth={setColumnWidth}
                columns={columns}
                setColumns={setColumns}
            />
            <StaggeredGrid
                display={display}
                alignment={alignment}
                columnWidth={columnWidth}
                columns={columns}
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
            style={{transition: "transform 0.3s ease"}}>
            <div style={{
                width: item.width,
                height: item.height + "px",
                background: "skyblue",
                textAlign: "center",
                margin: "8px",
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
    display: StaggeredDisplay,
    setDisplay: (display: StaggeredDisplay) => void;
    columnWidth: number;
    setColumnWidth: (width: number) => void;
    columns : number | undefined;
    setColumns: (cols : number | undefined) => void;
}

function StaggeredOptions(props: Options) {
    return (
        <div style={{width: "100%", display: "flex", justifyContent: "center", marginTop: "1em"}}>
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
            &nbsp;&nbsp;&nbsp;&nbsp;
            <label htmlFor="display">Display : </label>
            &nbsp;&nbsp;
            <select
                onChange={(e) => {
                    props.setDisplay(parseInt(e.currentTarget.value))
                }}
                value={props.display}
                id={"display"}
            >
                <option value={StaggeredDisplay.Linear}>Display : Linear</option>
                <option value={StaggeredDisplay.Grid}>Display : Grid</option>
            </select>
            &nbsp;&nbsp;&nbsp;&nbsp;
            <label htmlFor="columnWidth">Column Width : </label>
            &nbsp;&nbsp;
            <input
                type="number"
                id="columnWidth"
                value={props.columnWidth}
                style={{width: "6em"}}
                onChange={(e) => props.setColumnWidth(parseInt(e.currentTarget.value))}
            />
            &nbsp;&nbsp;&nbsp;&nbsp;
            <label htmlFor="columns">Total Columns : </label>
            &nbsp;&nbsp;
            <input
                type="number"
                id="columns"
                value={props.columns}
                style={{width: "6em"}}
                onChange={(e) => props.setColumns(parseInt(e.currentTarget.value))}
            />
        </div>
    )
}

export default App;
