///<reference path="../globals.ts" />
var TSOS;
(function (TSOS) {
    var Pcb = (function () {
        function Pcb(message) {
            if (message === void 0) { message = "hello world"; }
            this.message = message;
        }
        Pcb.prototype.helloWorld = function () {
            _StdOut.putText(this.message);
        };
        return Pcb;
    }());
    TSOS.Pcb = Pcb;
})(TSOS || (TSOS = {}));
