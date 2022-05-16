# React Staggered Grid

This is a react component that positions and arranges your items in a staggered grid

## Install

`npm i react-staggered-grid`

## Usage

Here columns will be generated automatically according to fixed width of each item !

```typescript jsx
import {StaggeredDisplay, StaggeredGrid, StaggeredGridItem, StaggeredItemSpan} from "react-staggered-grid";

<StaggeredGrid
    display={display}
    alignment={alignment}
    columnWidth={columnWidth}
>
    {items.map((item, index) => (
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
    ))}
</StaggeredGrid>
```