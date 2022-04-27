"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importDefault(require("react"));
var StaggeredGridModel_1 = require("./StaggeredGridModel");
var StaggeredGridContext_1 = require("./StaggeredGridContext");
var StaggeredGrid = (function (_super) {
    __extends(StaggeredGrid, _super);
    function StaggeredGrid() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.gridItems = [];
        _this.state = {
            gridWidth: 0,
            gridHeight: 0,
            items: _this.props.items
        };
        _this.gridElementRef = null;
        _this.getColsCount = function () {
            var count = Math.ceil(_this.state.gridWidth / _this.props.columnWidth) - 1;
            if (count < 1 || count === Infinity) {
                return 1;
            }
            return count;
        };
        _this.reposition = function () {
            try {
                var rowWidth_1 = 0;
                var colNumber_1 = 0;
                var columnCount = _this.getColsCount();
                if (_this.gridItems.length < columnCount) {
                    columnCount = _this.gridItems.length;
                }
                var colsHeight_1 = Array(columnCount).fill(0);
                var rowOffset_1 = 0;
                if (_this.props.alignment === StaggeredGridModel_1.StaggeredAlignment.Center) {
                    rowOffset_1 = (_this.state.gridWidth - (columnCount * _this.props.columnWidth)) / 2;
                }
                else if (_this.props.alignment === StaggeredGridModel_1.StaggeredAlignment.End) {
                    rowOffset_1 = _this.state.gridWidth - (columnCount * _this.props.columnWidth);
                }
                _this.gridItems.forEach(function (item) {
                    try {
                        var x = 0;
                        var y = 0;
                        var itemWidth = (((item.itemColumnSpan === StaggeredGridModel_1.StaggeredItemSpan.Single) || (_this.props.display === StaggeredGridModel_1.StaggeredDisplay.Linear)) ? _this.props.columnWidth : (item.itemColumnSpan === StaggeredGridModel_1.StaggeredItemSpan.Full) ? (_this.state.gridWidth - rowOffset_1 - rowOffset_1) : 0);
                        var itemHeight_1 = item.itemHeight;
                        if (itemHeight_1 != null || itemHeight_1 !== 0 || itemWidth != null || itemWidth !== 0) {
                            if ((rowWidth_1 + itemWidth) < _this.state.gridWidth && item.itemColumnSpan === StaggeredGridModel_1.StaggeredItemSpan.Single && _this.props.display === StaggeredGridModel_1.StaggeredDisplay.Grid) {
                                x = rowWidth_1;
                                rowWidth_1 += itemWidth;
                                y = colsHeight_1[colNumber_1];
                                colsHeight_1[colNumber_1] += itemHeight_1;
                                colNumber_1++;
                            }
                            else {
                                colNumber_1 = 0;
                                x = 0;
                                y = colsHeight_1[colNumber_1];
                                if (item.itemColumnSpan === StaggeredGridModel_1.StaggeredItemSpan.Full) {
                                    var largeHeight_1 = 0;
                                    colsHeight_1.forEach(function (height) {
                                        if (height > largeHeight_1) {
                                            largeHeight_1 = height;
                                        }
                                    });
                                    colsHeight_1.forEach(function (height, index) {
                                        colsHeight_1[index] = largeHeight_1 + itemHeight_1;
                                    });
                                    y = largeHeight_1;
                                    rowWidth_1 = 0;
                                }
                                else if (item.itemColumnSpan === StaggeredGridModel_1.StaggeredItemSpan.Single || _this.props.display === StaggeredGridModel_1.StaggeredDisplay.Linear) {
                                    colsHeight_1[colNumber_1] += itemHeight_1;
                                    rowWidth_1 = itemWidth;
                                    colNumber_1++;
                                }
                            }
                            item.update(itemWidth, (rowOffset_1 + x), y);
                        }
                    }
                    catch (e) {
                        console.warn(e);
                    }
                });
            }
            catch (e) {
                console.error(e);
            }
        };
        _this.refresh = function () {
            if (_this.gridElementRef != null) {
                if (_this.state.gridWidth !== _this.gridElementRef.clientWidth || _this.state.gridHeight !== _this.gridElementRef.clientHeight) {
                    _this.setState({
                        gridWidth: _this.gridElementRef.clientWidth,
                        gridHeight: _this.gridElementRef.clientHeight
                    });
                }
            }
        };
        return _this;
    }
    StaggeredGrid.prototype.componentDidMount = function () {
        window.addEventListener("resize", this.refresh);
    };
    StaggeredGrid.prototype.componentWillUnmount = function () {
        window.removeEventListener('resize', this.refresh);
    };
    StaggeredGrid.prototype.componentDidUpdate = function (prevProps, prevState, snapshot) {
        this.refresh();
        this.reposition();
    };
    StaggeredGrid.prototype.render = function () {
        var _this = this;
        return (react_1.default.createElement(StaggeredGridContext_1.StaggeredGridContext.Provider, { value: {
                colWidth: this.props.columnWidth,
                gridWidth: this.state.gridWidth,
                gridHeight: this.state.gridHeight,
                itemAdded: function (index, itemColumnSpan, width, height, update) {
                    _this.gridItems[index] = {
                        itemColumnSpan: itemColumnSpan,
                        itemWidth: width,
                        itemHeight: height,
                        update: update
                    };
                },
                itemUpdated: function (index, itemColumnSpan, width, height) {
                    var item = _this.gridItems[index];
                    if (item.itemColumnSpan !== itemColumnSpan || item.itemWidth !== width || item.itemHeight !== height) {
                        _this.gridItems[index] = __assign(__assign({}, item), { itemColumnSpan: itemColumnSpan, itemWidth: width, itemHeight: height });
                        _this.refresh();
                        _this.reposition();
                    }
                },
                itemRemoved: function (index) {
                    if (_this.gridItems[index] != null) {
                        _this.gridItems.splice(index, 1);
                    }
                },
                recalculate: this.reposition
            } },
            react_1.default.createElement("div", { ref: function (element) {
                    _this.gridElementRef = element;
                }, style: {
                    position: "relative",
                }, className: this.props.className }, this.state.items.map(function (item, index) {
                return _this.props.render(item, index);
            }))));
    };
    StaggeredGrid.defaultProps = StaggeredGridModel_1.StaggeredGridDefaultProps;
    return StaggeredGrid;
}(react_1.default.Component));
exports.default = StaggeredGrid;
//# sourceMappingURL=StaggeredGrid.js.map