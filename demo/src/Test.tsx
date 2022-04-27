
import { FC } from "react";
import StaggeredGrid from "react-staggered-grid/dist/cjs/types"
import StaggeredGridItem from "react-staggered-grid/dist/cjs/types/components"
// import { StaggeredDisplay, StaggeredItemSpan } from "react-staggered-grid";

const Test : FC = () => {

    type Item = { 
        id: number,
         //span: StaggeredItemSpan 
    }

    const items: Array<Item> = []

    for (var i = 0; i < 100; i++) {
        items.push({
            id: i,
            // span: i % 7 == 0 ? StaggeredItemSpan.Full : StaggeredItemSpan.Single
        });
    }

    return (
        <StaggeredGrid
        //     display={StaggeredDisplay.Grid}
            items={items}
            render={(item : Item, index : number) => {
                <StaggeredGridItem index={index} key={index}>
                    <h1>item.id</h1>
                </StaggeredGridItem>
            }}
        />
    )
}

export default Test;