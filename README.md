# React Staggered Grid

This is a react component that positions and arranges your items in a staggered grid , provides animations as well !

## Install

`npm i react-staggered-grid`

## Usage

```typescript jsx
<StaggeredGrid
    display={StaggeredDisplay.Grid}
    className={classes.itemGrid}
    items={items}
    render={(item: Item, index) => {
        <StaggeredGridItem index={index} key={itemKey} spans={StaggeredItemSpan.Full}>
            <div className={classes.sectionItem}>
                <Typography variant={"caption"}>
                    {item.title}
                </Typography>
            </div>
        </StaggeredGridItem>
    }}
/>
```