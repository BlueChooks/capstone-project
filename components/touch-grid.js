class TouchGrid extends HTMLElement {
    constructor() {
        super();
        this.resizedRecently = false;
        this.resizeDelay = 500;
        this.flipDelay = 300;
        this.childSize = 30;

        this.innerWidth = this.calculateInnerWidth();
        this.innerHeight = this.calculateInnerHeight();

        this.render();
        window.addEventListener('resize', () => this.delayedResize());
    }

    render() {
        this.childSize = this.calculateFlipperSize();
        this.innerWidth = this.calculateInnerWidth();
        this.innerHeight = this.calculateInnerHeight();
        this.innerHTML = `<div class="flip-container" style="width:${this.innerWidth}px;height:${this.innerHeight}px"></div>`;
        this.numRows = this.calculateNumRows();
        this.numCols = this.calculateNumCols();
        for (let i = 0; i < this.numRows; i++) {
            for (let j = 0; j < this.numCols; j++) {
                this.querySelector('.flip-container').innerHTML += `<div class="flipper" style="--randCol:${this.randCol()};--flipSize:${this.childSize}px;"></div>`;
            }
        }

        // flippers.forEach(flipper => {
        //     flipper.style.setProperty('--randCol', this.randCol());

        //     flipper.addEventListener('mouseenter' || 'touchmove', e => {
        //         this.flip(flipper, this.flipDelay);
        //         this.getSurrounds(e).forEach(el => {
        //             setTimeout(() => {
        //                 // this.flip(el, this.flipDelay * 1.25);
        //                 el.classList.add('flipped');
        //                 setTimeout(() => {
        //                     el.classList.remove('flipped');
        //                 // }, this.flipDelay - this.flipDelay / 2);
        //                 }, this.flipDelay * 1.5);
        //                 // }, this.flipDelay);
        //             }, this.flipDelay / 2);
        //         });
        //     });

        //     flipper.addEventListener('mouseout', () => {
        //         this.flip(flipper);
        //     });
        // });
    }

    flip(element, delay) {
        if (element.classList.contains('flipper')) {
            if (!element.classList.contains('flipped')) {
                element.classList.remove('flipped');
            } else {
                setTimeout(() => {
                    element.classList.add('flipped');
                }, delay);
            }
        }
    }
    
    calculateNumRows() {
        return Math.floor(this.innerHeight / this.childSize);
    }

    calculateNumCols() {
        return Math.floor(this.innerWidth / this.childSize);
    }

    // gets the number of pixels to add to innerHeight or innerWidth to make it a multiple of this.childSize
    innerRemainder(outerParam) {
        return this.childSize - (outerParam % this.childSize);
    }

    calculateInnerWidth() {
        return this.getBoundingClientRect().width + this.innerRemainder(this.getBoundingClientRect().width);
    }

    calculateInnerHeight() {
        return this.getBoundingClientRect().height + this.innerRemainder(this.getBoundingClientRect().height);
    }

    calculateFlipperSize() {
        let xl = 999999;
        let lg = 555555;
        let md = 222222;
        let maxFlipperNum;

        if (this.getArea() >= xl) { //xl
            maxFlipperNum = 600;
        } else if (this.getArea() < xl && this.getArea() >= lg) {
            maxFlipperNum = 400;
        } else if (this.getArea() < lg && this.getArea() >= md) {
            maxFlipperNum = 200;
        } else {
            maxFlipperNum = 250;
        }

        return Math.sqrt(this.getArea() / maxFlipperNum);
    }

    randCol() {
        let cols = [
            'var(--yellow)',
            'var(--green)',
            'var(--blue)',
            'var(--purple)',
            'var(--red)',
        ];
        return cols[Math.floor(Math.random() * cols.length)];
        // return `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`; // any colour
    }

    getSurrounds(event) {
        let surrounds = [];
        if (document.elementFromPoint((event.clientX), (event.clientY - this.childSize)) && document.elementFromPoint((event.clientX), (event.clientY - this.childSize)).classList.contains('flipper')) {
            surrounds.push(document.elementFromPoint((event.clientX), (event.clientY - this.childSize)));
        }

        if (document.elementFromPoint((event.clientX), (event.clientY + this.childSize)) && document.elementFromPoint((event.clientX), (event.clientY + this.childSize)).classList.contains('flipper')) {
            surrounds.push(document.elementFromPoint((event.clientX), (event.clientY + this.childSize)));
        }

        if (document.elementFromPoint((event.clientX - this.childSize), (event.clientY)) && document.elementFromPoint((event.clientX - this.childSize), (event.clientY)).classList.contains('flipper')) {
            surrounds.push(document.elementFromPoint((event.clientX - this.childSize), (event.clientY)));
        }

        if (document.elementFromPoint((event.clientX + this.childSize), (event.clientY)) && document.elementFromPoint((event.clientX + this.childSize), (event.clientY)).classList.contains('flipper')) {
            surrounds.push(document.elementFromPoint((event.clientX + this.childSize), (event.clientY)));
        }
        return surrounds;
    }

    // eases processor strain by introducing a delay to rerendering when resizing the window
    delayedResize() {
        if (!this.resizedRecently) {
            this.resizedRecently = true;
            setTimeout(() => this.resizedRecently = false, this.resizeDelay);
            setTimeout(() => this.render(), this.resizeDelay);
        }
    }

    getArea() {
        return this.getBoundingClientRect().width * this.getBoundingClientRect().height;
    }
} customElements.define('touch-grid', TouchGrid);