///<reference path="../globals.ts" />
///<reference path="deviceDriver.ts" />
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var TSOS;
(function (TSOS) {
    // Extends DeviceDriver
    var DeviceDriverFsDD = (function (_super) {
        __extends(DeviceDriverFsDD, _super);
        function DeviceDriverFsDD() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return DeviceDriverFsDD;
    }(TSOS.DeviceDriver));
    TSOS.DeviceDriverFsDD = DeviceDriverFsDD;
})(TSOS || (TSOS = {}));
