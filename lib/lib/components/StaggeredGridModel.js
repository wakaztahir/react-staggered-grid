"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StaggeredGridDefaultProps = exports.StaggeredAlignment = exports.StaggeredDisplay = exports.StaggeredItemSpan = void 0;
var StaggeredItemSpan;
(function (StaggeredItemSpan) {
    StaggeredItemSpan[StaggeredItemSpan["Zero"] = 0] = "Zero";
    StaggeredItemSpan[StaggeredItemSpan["Single"] = 1] = "Single";
    StaggeredItemSpan[StaggeredItemSpan["Full"] = 2] = "Full";
})(StaggeredItemSpan = exports.StaggeredItemSpan || (exports.StaggeredItemSpan = {}));
var StaggeredDisplay;
(function (StaggeredDisplay) {
    StaggeredDisplay[StaggeredDisplay["Linear"] = 0] = "Linear";
    StaggeredDisplay[StaggeredDisplay["Grid"] = 1] = "Grid";
})(StaggeredDisplay = exports.StaggeredDisplay || (exports.StaggeredDisplay = {}));
var StaggeredAlignment;
(function (StaggeredAlignment) {
    StaggeredAlignment[StaggeredAlignment["Start"] = 0] = "Start";
    StaggeredAlignment[StaggeredAlignment["Center"] = 1] = "Center";
    StaggeredAlignment[StaggeredAlignment["End"] = 2] = "End";
})(StaggeredAlignment = exports.StaggeredAlignment || (exports.StaggeredAlignment = {}));
exports.StaggeredGridDefaultProps = {
    display: StaggeredDisplay.Grid,
    alignment: StaggeredAlignment.Center,
    columnWidth: 260,
    className: ""
};
//# sourceMappingURL=StaggeredGridModel.js.map