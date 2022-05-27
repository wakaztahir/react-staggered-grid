# React Staggered Grid

This is a React component that positions and arranges your items in a staggered grid

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
    style={{width: "100%"}} // when width of the grid is fixed in pixels , use gridWidth prop
    useElementWidth={true} // this would force css styled width (100%) , when false gridWidth = columnWidth * columnWidth
>
    {items.map((item, index) => (
        <StaggeredGridItem
            index={index}
            spans={span}
            style={{transition: "left 0.3s ease,top 0.3s ease"}}
        >
            <MyItem style={{width: "100%"}} />
        </StaggeredGridItem>
    ))}
</StaggeredGrid>
```

## StaggeredGrid Props

StaggeredGrid takes props of a `HTMLElement` , like `style`,`className`

You have to give two of these parameters `columnWidth`,`columns`,`gridWidth`

#### columnWidth : number

This prop adjusts width of each column on the grid This prop is required if `gridWidth` && `columns` props are not being
passed

#### columns : number

This prop adjusts the number of columns , If you want the columns to be adjusted according to width , You don't need to
pass this prop , just pass `columns` and `gridWidth`

#### gridWidth : number

Custom width of the grid , if you don't know width of the grid , pass `useElementWidth = true` and set css style width
to be `100%`

#### elementType : string (optional)

by default "div"

#### useElementWidth : boolean (optional)

This is for gridWidth ,when using css styled width , this should be true If you pass `columns` && `columnWidth` , grid
width would be `columns` * `columnWidth` but if you want to force gridWidth to be element width (css styled width) , you
can pass `useElementWidth = true` and it will get width of the grid using a ref on the parent element

#### horizontalGap : number (optional)

Increase the gap between items horizontally , This also decreases column width to make space for the gap

`columnWidth = columnWidth - horizontalGap * 2`

#### fitHorizontalGap : boolean (optional)

When true , horizontalGap will be subtracted from column width making column width to be decreased to allow for
horizontal gap , Useful when all columns must fit inside gridWidth regardless of horizontal gap !

default : false

#### verticalGap : number (optional)

Increase the gap between items vertically

#### alignment : StaggeredAlignment (optional)

This should be mostly centered , unless you have a custom gridWidth and you'd like it to translate each item according
to the given alignment

default StaggeredAlignment.Center

#### children : ReactNode | undefined (optional)

Children of the grid , should be `StaggeredGridItem[]` | `StaggeredGridItemFunctional[]`

#### calculateHeight: boolean (optional)

Since StaggeredGrid uses translate , it translates items on the page using `position : relative` on the parent Which
makes the parent element has zero height when it contains height this is by default true , which means that when the
grid items are positioned , It tracks the total height and sets it later

#### repositionOnResize : boolean (optional)

when true , reposition will be run when the window is resized , true by default.

#### requestAppend : () => void (optional)

It is used to make the grid infinite , if given a scroll event listener is added and when the user scrolls to the end of
grid , this function is called to add more items !

#### requestAppendScrollTolerance : number (optional)

default : 20 , When user reaches the end - requestAppendScrollTolerance , request append is called

#### gridController : StaggeredGridController (optional)

provide a controller object to call functions on the grid , see `useStaggeredGridController` hook

## StaggeredGridItem

There are two types of items : `StaggeredGridItem` & `StaggeredGridItemFunctional` , Functional component uses
a `useStaggeredItemPosition` hook to get the item position on the grid

> It's important to key your item correctly

### StaggeredGridItem Props

StaggeredGridItem takes props for a `HTMLElement` like `onClick` and `style`
other props include...

#### elementType : string (optional)

by default "div"

#### initialPosition (optional)

    { 
        initialWidth : number // defaut 0
        initialTranslateX : number // default 0
        initialTranslateY : number // default 0
    }

#### itemHeight : number (optional)

If item height is known pixel height , You can provide it , otherwise the height will be calculated using a ref.

#### spans: StaggeredItemSpan | number (optional)

Span of the item , It's constrained in range (1 - totalColumnCount)

#### index: number (required)

This is the index of the item in the array

#### children: ReactNode | undefined (optional)

Children of the item

#### transform (optional)

This is a function which gets a parameter item position which contains item width , x and y which is transformed into
props (attributes) for the staggered grid item element

By default, it uses css properties `left` & `top` to translate each item with `position : absolute` relative to parent

## useStaggeredGridController

If you want to swap items or force reposition items on the grid whenever you want !
You need a StaggeredGridController

If you are using a functional component , You can use
`useStaggeredGridController` hook to get the controller and provide it to StaggeredGrid Component using `gridController`
prop

If you are using a class component , you should create a new controller , it's just an `interface` that you can
implement with stub functions , when registered those stub functions are overridden by the component

```typescript
interface StaggeredGridController {
    /** Swap item at index with item at withIndex , after swapping you must update items state or call reposition */
    swap: (index: number, withIndex: number) => void;
    /** This will request reposition on the next animation frame , useful for multiple calls */
    requestReposition: () => void;
    /** Force reposition all the items */
    reposition: () => void;
}
```