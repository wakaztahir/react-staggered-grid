import StaggeredGrid, { StaggeredGridItem } from "react-staggered-grid";
import { StaggeredDisplay, StaggeredItemSpan } from "react-staggered-grid/src";

const Test = () => {

    type Item = { id: number, span: StaggeredItemSpan }

    const items: Array<Item> = []

    for (var i = 0; i < 100; i++) {
        items.push({
            id: i,
            span: i % 7 == 0 ? StaggeredItemSpan.Full : StaggeredItemSpan.Single
        });
    }

    return (
        // <StaggeredGrid
        //     display={StaggeredDisplay.Grid}
        //     items={items}
        //     render={(item, index) => {
        //         <StaggeredGridItem index={index} key={index} spans={item.span}>
                    <h1>item.id</h1>
                /* </StaggeredGridItem>
            }}
        /> */
    )
}

export default Test;