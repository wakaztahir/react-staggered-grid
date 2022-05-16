import React, {useState} from "react"
import {
    StaggeredAlignment,
    StaggeredDisplay,
    StaggeredGrid,
    StaggeredGridItem,
    StaggeredItemSpan
} from "react-staggered-grid";

function App() {

    type Item = {
        id: number,
        span: StaggeredItemSpan,
        width: string,
        height: number,
    }

    const items: Array<Item> = []

    for (let i = 0; i < 100; i++) {
        let span = i % 10 === 0 ? StaggeredItemSpan.Full : StaggeredItemSpan.Single
        items.push({
            id: i,
            span,
            width: span === StaggeredItemSpan.Full ? "100%" : "300px",
            height: (Math.random() * 300) + 300,
        });
    }

    const [alignment, setAlignment] = useState(StaggeredAlignment.Center)
    const [display, setDisplay] = useState(StaggeredDisplay.Grid)
    const [columnWidth, setColumnWidth] = useState<number>(260)

    return (
        <React.Fragment>
            <StaggeredOptions
                alignment={alignment}
                setAlignment={setAlignment}
                display={display}
                setDisplay={setDisplay}
                columnWidth={columnWidth}
                setColumnWidth={setColumnWidth}
            />
            <StaggeredGrid
                display={display}
                alignment={alignment}
                items={items}
                columnWidth={columnWidth}
                render={(item: Item, index: number) => (
                    <StaggeredGridItem index={index} key={index} spans={item.span}
                                       style={{transition: "transform 0.3s ease"}}>
                        <div style={{
                            width: item.width,
                            height: item.height + "px",
                            background: "skyblue",
                            textAlign: "center",
                            lineHeight: item.height + "px",
                            margin: "8px"
                        }}>
                            Item {index}
                        </div>
                    </StaggeredGridItem>
                )
                }
            />
        </React.Fragment>
    )
}

interface Options {
    alignment: StaggeredAlignment,
    setAlignment: (alignment: StaggeredAlignment) => void;
    display: StaggeredDisplay,
    setDisplay: (display: StaggeredDisplay) => void;
    columnWidth: number;
    setColumnWidth: (width: number) => void;
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
                style={{width:"6em"}}
                onChange={(e) => props.setColumnWidth(parseInt(e.currentTarget.value))}
            />
        </div>
    )
}

export default App;
