import {StaggeredDisplay, StaggeredGrid, StaggeredGridItem, StaggeredItemSpan} from "react-staggered-grid";

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

    return (
        <StaggeredGrid
            display={StaggeredDisplay.Grid}
            items={items}
            render={(item: Item, index: number) => (
                <StaggeredGridItem index={index} key={index} spans={item.span} style={{transition: "transform 0.3s ease"}}>
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
    )
}

export default App;
