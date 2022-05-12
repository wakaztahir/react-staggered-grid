import {FC} from "react";
import {StaggeredDisplay, StaggeredGrid, StaggeredGridItem, StaggeredItemSpan} from "react-staggered-grid";

const Test: FC = () => {

    type Item = {
        id: number,
        width: number,
        height: number,
        span: StaggeredItemSpan
    }

    const items: Array<Item> = []

    for (let i = 0; i < 100; i++) {
        items.push({
            id: i,
            width: 300,
            height: (Math.random() * 300) + 300,
            span: i % 7 === 0 ? StaggeredItemSpan.Full : StaggeredItemSpan.Single
        });
    }

    return (
        <StaggeredGrid
            display={StaggeredDisplay.Grid}
            items={items}
            render={(item: Item, index: number) => (
                <StaggeredGridItem index={index} key={index} style={{transition: "transform 0.3s ease"}}>
                    <div style={{
                        width: "300px",
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

export default Test;