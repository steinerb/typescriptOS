///<reference path="../globals.ts" />
/* ------------
     Console.ts

     Requires globals.ts

     The OS Console - stdIn and stdOut by default.
     Note: This is not the Shell. The Shell is the "command line interface" (CLI) or interpreter for this console.
     ------------ */
var TSOS;
(function (TSOS) {
    var Console = (function () {
        function Console(currentFont, currentFontSize, currentXPosition, currentYPosition, buffer) {
            if (currentFont === void 0) { currentFont = _DefaultFontFamily; }
            if (currentFontSize === void 0) { currentFontSize = _DefaultFontSize; }
            if (currentXPosition === void 0) { currentXPosition = 0; }
            if (currentYPosition === void 0) { currentYPosition = _DefaultFontSize; }
            if (buffer === void 0) { buffer = ""; }
            this.currentFont = currentFont;
            this.currentFontSize = currentFontSize;
            this.currentXPosition = currentXPosition;
            this.currentYPosition = currentYPosition;
            this.buffer = buffer;
        } //DO NOT REMOVE
        Console.prototype.init = function () {
            this.clearScreen();
            this.resetXY();
        };
        Console.prototype.resetXY = function () {
            this.currentXPosition = 0;
            this.currentYPosition = this.currentFontSize;
        };
        Console.prototype.clearScreen = function () {
            _DrawingContext.clearRect(0, 0, _Canvas.width, _Canvas.height);
        };
        //the canvas drawing part of backspace. goes back one letter.
        Console.prototype.clearChar = function (text) {
            if (text.length === 1) {
                var lastCharWidth = _DrawingContext.measureText(this.currentFont, this.currentFontSize, text);
                //set point to where it was one letter ago
                this.currentXPosition = this.currentXPosition - lastCharWidth;
                //draw a clear rectangle over the last letter
                _DrawingContext.clearRect(this.currentXPosition, (this.currentYPosition - this.currentFontSize), lastCharWidth, this.currentFontSize);
            }
        };
        //like clearChar, but for multiple characters
        Console.prototype.clearWord = function (text) {
            var currentLast;
            while (text.length > 0) {
                currentLast = text.charAt(text.length - 1);
                _Console.clearChar(currentLast);
                text = text.slice(0, text.length - 1);
            }
        };
        Console.prototype.handleInput = function () {
            while (_KernelInputQueue.getSize() > 0) {
                // Get the next character from the kernel input queue.
                var chr = _KernelInputQueue.dequeue();
                // Check to see if it's "special" (enter or ctrl-c) or "normal" (anything else that the keyboard device driver gave us).
                if (chr === String.fromCharCode(13)) {
                    //KERNAL BUFFERS HANDLING
                    _KernelBuffersIndex = -1;
                    _KernelBuffers.unshift(this.buffer);
                    // The enter key marks the end of a console command, so ...
                    // ... tell the shell ...
                    _OsShell.handleInput(this.buffer);
                    // ... and reset our buffer.
                    this.buffer = "";
                }
                else if (chr === String.fromCharCode(8)) {
                    if (this.buffer.length > 0) {
                        //save last letter
                        var lastLetter = this.buffer[this.buffer.length - 1];
                        //chop off last latter
                        this.buffer = this.buffer.substring(0, this.buffer.length - 1);
                        _Console.clearChar(lastLetter);
                    }
                }
                else if (chr === String.fromCharCode(9)) {
                    var possibilities = [];
                    var current;
                    //gather possible commands
                    for (var i = 0; i < COMMAND_NAMES.length; i++) {
                        current = COMMAND_NAMES[i];
                        if (current.startsWith(this.buffer))
                            possibilities[possibilities.length] = current;
                    }
                    if (possibilities.length === 1) {
                        this.advanceLine();
                        this.currentXPosition = 0;
                        this.buffer = possibilities[0];
                        this.putText(possibilities[0]);
                    }
                }
                else if (chr === String.fromCharCode(38)) {
                    if (_KernelBuffersIndex < _KernelBuffers.length - 1) {
                        _Console.clearWord(this.buffer);
                        _KernelBuffersIndex += 1;
                        this.putText(_KernelBuffers[_KernelBuffersIndex]);
                        this.buffer = _KernelBuffers[_KernelBuffersIndex];
                    }
                }
                else if (chr === String.fromCharCode(40)) {
                    if (_KernelBuffersIndex > 0) {
                        _Console.clearWord(this.buffer);
                        _KernelBuffersIndex -= 1;
                        this.putText(_KernelBuffers[_KernelBuffersIndex]);
                        this.buffer = _KernelBuffers[_KernelBuffersIndex];
                    }
                }
                else {
                    // This is a "normal" character, so ...
                    // ... draw it on the screen...
                    this.putText(chr);
                    // ... and add it to our buffer.
                    this.buffer += chr;
                }
                // TODO: Write a case for Ctrl-C.
            }
        };
        Console.prototype.putText = function (text) {
            // My first inclination here was to write two functions: putChar() and putString().
            // Then I remembered that JavaScript is (sadly) untyped and it won't differentiate
            // between the two.  So rather than be like PHP and write two (or more) functions that
            // do the same thing, thereby encouraging confusion and decreasing readability, I
            // decided to write one function and use the term "text" to connote string or char.
            //
            // UPDATE: Even though we are now working in TypeScript, char and string remain undistinguished.
            //         Consider fixing that.
            if (text !== "") {
                // Draw the text at the current X and Y coordinates.
                _DrawingContext.drawText(this.currentFont, this.currentFontSize, this.currentXPosition, this.currentYPosition, text);
                // Move the current X position.
                var offset = _DrawingContext.measureText(this.currentFont, this.currentFontSize, text);
                this.currentXPosition = this.currentXPosition + offset;
            }
        };
        Console.prototype.advanceLine = function () {
            this.currentXPosition = 0;
            /*
             * Font size measures from the baseline to the highest point in the font.		DefaultFontSize
             * Font descent measures from the baseline to the lowest point in the font.		_DrawingContext.fontDescent(this.currentFont, this.currentFontSize)
             * Font height margin is extra spacing between the lines.						_FontHeightMargin;
                                                                        the new y position
             */
            this.currentYPosition += _DefaultFontSize +
                _DrawingContext.fontDescent(this.currentFont, this.currentFontSize) +
                _FontHeightMargin;
            // TODO: Handle scrolling. (iProject 1)
            var yPositionToBe = this.currentYPosition + _DefaultFontSize + _DrawingContext.fontDescent(this.currentFont, this.currentFontSize) + _FontHeightMargin;
            if (this.currentYPosition > 500) {
                _Console.init();
            }
        };
        return Console;
    }());
    TSOS.Console = Console;
})(TSOS || (TSOS = {}));
