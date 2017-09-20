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
/* ----------------------------------
   DeviceDriverKeyboard.ts

   Requires deviceDriver.ts

   The Kernel Keyboard Device Driver.
   ---------------------------------- */
var TSOS;
(function (TSOS) {
    // Extends DeviceDriver
    var DeviceDriverKeyboard = (function (_super) {
        __extends(DeviceDriverKeyboard, _super);
        function DeviceDriverKeyboard() {
            // Override the base method pointers.
            var _this = 
            // The code below cannot run because "this" can only be
            // accessed after calling super.
            //super(this.krnKbdDriverEntry, this.krnKbdDispatchKeyPress);
            _super.call(this) || this;
            _this.driverEntry = _this.krnKbdDriverEntry;
            _this.isr = _this.krnKbdDispatchKeyPress;
            return _this;
        }
        DeviceDriverKeyboard.prototype.krnKbdDriverEntry = function () {
            // Initialization routine for this, the kernel-mode Keyboard Device Driver.
            this.status = "loaded";
            // More?
        };
        DeviceDriverKeyboard.prototype.krnKbdDispatchKeyPress = function (params) {
            // Parse the params.    TODO: Check that the params are valid and osTrapError if not.
            var keyCode = params[0];
            var isShifted = params[1];
            _Kernel.krnTrace("Key code:" + keyCode + " shifted:" + isShifted);
            var chr = "";
            // Check to see if we even want to deal with the key that was pressed.
            if (((keyCode >= 65) && (keyCode <= 90)) ||
                ((keyCode >= 97) && (keyCode <= 123))) {
                // Determine the character we want to display.
                // Assume it's lowercase...
                chr = String.fromCharCode(keyCode + 32);
                // ... then check the shift key and re-adjust if necessary.
                if (isShifted)
                    chr = String.fromCharCode(keyCode);
                // TODO: Check for caps-lock and handle as shifted if so.
                _KernelInputQueue.enqueue(chr);
            }
            else if (keyCode == 48) {
                if (isShifted)
                    chr = String.fromCharCode(41);
                else
                    chr = String.fromCharCode(48);
                _KernelInputQueue.enqueue(chr);
            }
            else if (keyCode == 49) {
                if (isShifted)
                    chr = String.fromCharCode(33);
                else
                    chr = String.fromCharCode(49);
                _KernelInputQueue.enqueue(chr);
            }
            else if (keyCode == 50) {
                if (isShifted)
                    chr = String.fromCharCode(40);
                else
                    chr = String.fromCharCode(50);
                _KernelInputQueue.enqueue(chr);
            }
            else if (keyCode == 51) {
                if (isShifted)
                    chr = String.fromCharCode(35);
                else
                    chr = String.fromCharCode(51);
                _KernelInputQueue.enqueue(chr);
            }
            else if (keyCode == 52) {
                if (isShifted)
                    chr = String.fromCharCode(36);
                else
                    chr = String.fromCharCode(52);
                _KernelInputQueue.enqueue(chr);
            }
            else if (keyCode == 53) {
                if (isShifted)
                    chr = String.fromCharCode(37);
                else
                    chr = String.fromCharCode(53);
                _KernelInputQueue.enqueue(chr);
            }
            else if (keyCode == 54) {
                if (isShifted)
                    chr = String.fromCharCode(94);
                else
                    chr = String.fromCharCode(54);
                _KernelInputQueue.enqueue(chr);
            }
            else if (keyCode == 55) {
                if (isShifted)
                    chr = String.fromCharCode(38);
                else
                    chr = String.fromCharCode(55);
                _KernelInputQueue.enqueue(chr);
            }
            else if (keyCode == 56) {
                if (isShifted)
                    chr = String.fromCharCode(42);
                else
                    chr = String.fromCharCode(56);
                _KernelInputQueue.enqueue(chr);
            }
            else if (keyCode == 57) {
                if (isShifted)
                    chr = String.fromCharCode(40);
                else
                    chr = String.fromCharCode(57);
                _KernelInputQueue.enqueue(chr);
            }
            else if ((keyCode == 32) ||
                (keyCode == 8) ||
                (keyCode == 9) ||
                (keyCode == 38) ||
                (keyCode == 40) ||
                (keyCode == 13)) {
                chr = String.fromCharCode(keyCode);
                _KernelInputQueue.enqueue(chr);
            }
            else if (keyCode == 188) {
                if (isShifted)
                    chr = String.fromCharCode(60);
                else
                    chr = String.fromCharCode(44);
                _KernelInputQueue.enqueue(chr);
            }
            else if (keyCode == 190) {
                if (isShifted)
                    chr = String.fromCharCode(62);
                else
                    chr = String.fromCharCode(46);
                _KernelInputQueue.enqueue(chr);
            }
            else if (keyCode == 191) {
                if (isShifted)
                    chr = String.fromCharCode(63);
                else
                    chr = String.fromCharCode(47);
                _KernelInputQueue.enqueue(chr);
            }
            else if (keyCode == 219) {
                if (isShifted)
                    chr = String.fromCharCode(123);
                else
                    chr = String.fromCharCode(91);
                _KernelInputQueue.enqueue(chr);
            }
            else if (keyCode == 221) {
                if (isShifted)
                    chr = String.fromCharCode(125);
                else
                    chr = String.fromCharCode(93);
                _KernelInputQueue.enqueue(chr);
            }
            else if (keyCode == 220) {
                if (isShifted)
                    chr = String.fromCharCode(124);
                else
                    chr = String.fromCharCode(92);
                _KernelInputQueue.enqueue(chr);
            }
            else if (keyCode == 186) {
                if (isShifted)
                    chr = String.fromCharCode(58);
                else
                    chr = String.fromCharCode(59);
                _KernelInputQueue.enqueue(chr);
            }
            else if (keyCode == 192) {
                if (isShifted)
                    chr = String.fromCharCode(34);
                else
                    chr = String.fromCharCode(39);
                _KernelInputQueue.enqueue(chr);
            }
        };
        return DeviceDriverKeyboard;
    }(TSOS.DeviceDriver));
    TSOS.DeviceDriverKeyboard = DeviceDriverKeyboard;
})(TSOS || (TSOS = {}));
