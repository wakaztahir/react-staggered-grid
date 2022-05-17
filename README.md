# React Staggered Grid

This is a react component that positions and arranges your items in a staggered grid

## Install

`npm i react-staggered-grid`

## Usage

Here columns will be generated automatically according to fixed width of each item !

```typescript jsx
import {StaggeredDisplay, StaggeredGrid, StaggeredGridItem, StaggeredItemSpan} from "react-staggered-grid";

<StaggeredGrid
    columns={totalColumns} // number of columns
    columnWidth={columnWidth} // width of each column
    style={{width : "100%"}}
    useElementWidth={true} // uses width : 100%
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

### Props

#### columnWidth ?: number

This prop adjusts width of each column on the grid
This prop is required if `gridWidth` && `columns` props are not being passed

#### columns?: number

This prop adjusts the number of columns , If you want the columns to be adjusted according to width
, You don't need to pass this prop , just pass `columns` and `gridWidth`

#### gridWidth?: number

Custom width of the grid

#### useElementWidth : boolean

If you pass `columns` && `columnWidth` , grid width would be `columns` * `columnWidth` but if you want to 
force use element width , you can pass `useElementWidth = true`

when using css styled width , this should be true

#### alignment?: StaggeredAlignment

This should be mostly centered , unless you have a custom gridWidth and you'd like it to translate each item
according to the given alignment

#### className?: string | undefined

just sets the className on the element of the grid

#### children?: ReactNode | undefined

Children of the grid , should be `StaggeredGridItem`

#### style?: React.CSSProperties | undefined

CSS properties

#### limitSpan: boolean

It limits item span into range (0-total column count) , true by default

#### calculateHeight: boolean

Since StaggeredGrid uses translate , it translates items on the page using `position : relative` on the parent
Which makes the parent element has zero height when it contains height
this is by default true , which means that when the grid items are positioned , It tracks the total height and sets it later