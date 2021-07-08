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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importDefault(require("react"));
var StaggeredGridContext_1 = require("./StaggeredGridContext");
var StaggeredGridModel_1 = require("./StaggeredGridModel");
var StaggeredGridItem = (function (_super) {
    __extends(StaggeredGridItem, _super);
    function StaggeredGridItem() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {
            translateX: 0,
            translateY: 0,
            itemWidth: 0
        };
        _this.stateUpdating = false;
        _this.nextStateUpdate = function () {
        };
        _this.itemElementRef = null;
        _this.updateTranslate = function (width, x, y) {
            if (!_this.stateUpdating) {
                if (_this.state.itemWidth !== width || x !== _this.state.translateX || y !== _this.state.translateY) {
                    _this.nextStateUpdate = function () {
                    };
                    _this.stateUpdating = true;
                    _this.setState({
                        itemWidth: width,
                        translateX: x,
                        translateY: y,
                    }, function () {
                        _this.nextStateUpdate();
                        _this.stateUpdating = false;
                    });
                }
            }
            else {
                _this.nextStateUpdate = function () {
                    _this.updateTranslate(width, x, y);
                };
            }
        };
        _this.reportData = function () {
            var _a, _b;
            _this.context.itemAdded(_this.props.index, _this.props.spans, (_a = _this.itemElementRef) === null || _a === void 0 ? void 0 : _a.clientWidth, (_b = _this.itemElementRef) === null || _b === void 0 ? void 0 : _b.clientHeight, _this.updateTranslate);
        };
        return _this;
    }
    StaggeredGridItem.prototype.componentDidMount = function () {
        this.reportData();
    };
    StaggeredGridItem.prototype.componentDidUpdate = function (prevProps, prevState, snapshot) {
        var _a, _b;
        this.reportData();
        this.context.itemUpdated(this.props.index, this.props.spans, (_a = this.itemElementRef) === null || _a === void 0 ? void 0 : _a.clientWidth, (_b = this.itemElementRef) === null || _b === void 0 ? void 0 : _b.clientHeight);
    };
    StaggeredGridItem.prototype.componentWillUnmount = function () {
        this.context.itemRemoved(this.props.index);
    };
    StaggeredGridItem.prototype.render = function () {
        var _this = this;
        return (react_1.default.createElement("div", { ref: function (element) {
                _this.itemElementRef = element;
            }, style: {
                width: this.state.itemWidth + "px",
                position: "absolute",
                transform: "translate(" + this.state.translateX + "px," + this.state.translateY + "px)",
                transition: "transform .3s ease-out",
                overflowX: "hidden",
            } }, this.props.children));
    };
    StaggeredGridItem.contextType = StaggeredGridContext_1.StaggeredGridContext;
    StaggeredGridItem.defaultProps = {
        spans: StaggeredGridModel_1.StaggeredItemSpan.Single,
        position: -1,
        onUpdatePosition: function (pos) {
        },
        draggable: true,
    };
    return StaggeredGridItem;
}(react_1.default.Component));
exports.default = StaggeredGridItem;
//# sourceMappingURL=StaggeredGridItem.js.map