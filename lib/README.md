# React Staggered Grid

This is a react component that positions and arranges your items in a staggered grid

## Demo

https://wakaztahir.github.io/react-staggered-grid

## Install

`npm i react-staggered-grid`

## Usage

Here columns will be generated automatically according to fixed width of each item !

```typescript jsx
import {
    StaggeredAlignment,
    StaggeredGrid,
    StaggeredGridItem,
    StaggeredGridItemFunctional,
    StaggeredItemSpan
} from "react-staggered-grid";

<StaggeredGrid
    columns={totalColumns} // number of columns , don't pass if you want it to be gridWidth / columnWidth
    columnWidth={columnWidth} // width of each column , don't pass if you want it to be gridWidth / columns
    // by default gridWidth = columns * columnWidth
    style={{width: "100%"}} // when width of the grid is fixed in pixels , use gridWidth prop
    useElementWidth={true} // this would force css styled width (100%) calculated using a ref
>
    {items.map((item, index) => (
        <StaggeredGridItem // or use StaggeredGridItemFunctional
            index={index}
            spans={span}
            style={{transition: "transform 0.3s ease"}}
            itemHeight={item.height + 8} // when not given , a ref is used to get element height
        >
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
    ))}
</StaggeredGrid>
```

## StaggeredGrid Props

### columnWidth ?: number

This prop adjusts width of each column on the grid This prop is required if `gridWidth` && `columns` props are not being
passed

### columns?: number

This prop adjusts the number of columns , If you want the columns to be adjusted according to width , You don't need to
pass this prop , just pass `columns` and `gridWidth`

### gridWidth?: number

Custom width of the grid , if you don't know width of the grid , pass `useElementWidth = true` and set css style width
to be `100%`

### useElementWidth : boolean

This is for gridWidth ,when using css styled width , this should be true If you pass `columns` && `columnWidth` , grid
width would be `columns` * `columnWidth` but if you want to force gridWidth to be element width (css styled width) , you
can pass `useElementWidth = true` and it will get width of the grid using a ref on the parent element

### alignment?: StaggeredAlignment

This should be mostly centered , unless you have a custom gridWidth and you'd like it to translate each item according
to the given alignment

### className?: string | undefined

just sets the className on the element of the grid

### children?: ReactNode | undefined

Children of the grid , should be `StaggeredGridItem`

### style?: React.CSSProperties | undefined

CSS properties

### limitSpan: boolean

It limits item span into range (0-total column count) , true by default

### calculateHeight: boolean

Since StaggeredGrid uses translate , it translates items on the page using `position : relative` on the parent Which
makes the parent element has zero height when it contains height this is by default true , which means that when the
grid items are positioned , It tracks the total height and sets it later

## StaggeredGridItem Props

There are two types of items : `StaggeredGridItem` & `StaggeredGridItemFunctional` , the Functional component has
Functional stands for Functional component which uses a `useStaggeredItemPosition` hook to get the item position on the
grid and transforms it into css properties , You can create a custom `StaggeredGridItem` functional component using that
hook and transform the css properties as you desire , look for the implementation of `StaggeredGridItemFunctional`

### initialWidth?: number

Initial width of the item , you don't need to pass it usually its column width

### initialTranslateX?: number

Initial translateX of the item

### initialTranslateY?: number

Initial translateY of the item

### itemHeight ?: number

If you know the item height beforehand , you should pass it StaggeredGridItem uses ref to get element height , if you
pass the height It won't use a ref

### spans?: StaggeredItemSpan | number

Span of the item , It can be full `StaggeredItemSpan.Full` or in range (1 - total column count)

### index: number

This is the index of the item in the array

### style?: React.CSSProperties | undefined

Any css properties

### className?: string | undefined

className for the item

### children?: ReactNode | undefined

Children of the item

### transform?

This is a function which gets passed a parameter item position which contains item width , x and y which is
transformed into props (attributes) for the staggered grid item element It basically tells how to style elements with
item position

By default it uses css property `transform : translate` to translate each item with `position : absolute` relative to
parent but it can be customized