///<reference path="../globals.ts" />
///<reference path="pcb.ts" />
var TSOS;
(function (TSOS) {
    var CPUScheduler = (function () {
        function CPUScheduler(quantum, schedAlg) {
            if (quantum === void 0) { quantum = 6; }
            if (schedAlg === void 0) { schedAlg = "rr"; }
            this.quantum = quantum;
            this.schedAlg = schedAlg;
        }
        CPUScheduler.prototype.contextSwitch = function () {
            var dequeuedPCB = _ReadyQueue.dequeue();
            _ReadyQueue.enqueue(new TSOS.Pcb("WAITING", dequeuedPCB.pid, dequeuedPCB.PC, dequeuedPCB.Acc, dequeuedPCB.Xreg, dequeuedPCB.Yreg, dequeuedPCB.Zflag, dequeuedPCB.base, dequeuedPCB.limit));
        };
        return CPUScheduler;
    }());
    TSOS.CPUScheduler = CPUScheduler;
})(TSOS || (TSOS = {}));
