///<reference path="../globals.ts" />
///<reference path="pcb.ts" />
var TSOS;
(function (TSOS) {
    var CPUScheduler = (function () {
        function CPUScheduler(quantum) {
            if (quantum === void 0) { quantum = 6; }
            this.quantum = quantum;
        }
        CPUScheduler.prototype.contextSwitch = function () {
            var dequeuedPCB = _ReadyQueue.dequeue();
            _ReadyQueue.enqueue(new TSOS.Pcb("WAITING", dequeuedPCB.pid, dequeuedPCB.PC, dequeuedPCB.Acc, dequeuedPCB.Xreg, dequeuedPCB.Yreg, dequeuedPCB.Zflag, dequeuedPCB.base, dequeuedPCB.limit));
        };
        return CPUScheduler;
    }());
    TSOS.CPUScheduler = CPUScheduler;
})(TSOS || (TSOS = {}));
