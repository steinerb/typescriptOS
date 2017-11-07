var TSOS;
(function (TSOS) {
    var Pcb = (function () {
        //most flexible constructor
        function Pcb(state, pid, PC, Acc, Xreg, Yreg, Zflag) {
            this.state = state;
            this.pid = pid;
            this.PC = PC;
            this.Acc = Acc;
            this.Xreg = Xreg;
            this.Yreg = Yreg;
            this.Zflag = Zflag;
            this.state = state;
            this.pid = pid;
            this.PC = PC;
            this.Acc = Acc;
            this.Xreg = Xreg;
            this.Yreg = Yreg;
            this.Zflag = Zflag;
        }
        Pcb.prototype.helloWorld = function () {
            _StdOut.putText("Hello World! Love, a pcb");
        };
        Pcb.prototype.toString = function () {
            var toReturn = "";
            toReturn += ("|state:\t" + this.state + "\t");
            toReturn += ("|pc:\t" + String(this.PC) + "\t");
            toReturn += ("|acc:\t" + String(this.Acc) + "\t");
            toReturn += ("|x:\t" + String(this.Xreg) + "\t");
            toReturn += ("|y:\t" + String(this.Yreg) + "\t");
            toReturn += ("|z:\t" + String(this.Zflag) + "\t|");
            return toReturn;
        };
        return Pcb;
    }());
    TSOS.Pcb = Pcb;
})(TSOS || (TSOS = {}));
