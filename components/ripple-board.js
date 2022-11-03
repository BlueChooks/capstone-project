class RippleBoard extends HTMLElement {
    constructor() {
        super();
        this.resizedRecently = false;
        this.resizeDelay = 500;
        this.flipDelay = 300;
        this.childSize = 30;
        this.spreadMax = 5;

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
                this.querySelector('.flip-container').innerHTML += `<div class="cell" style="--randCol:${this.randCol()};--flipSize:${this.childSize}px;"></div>`;
            }
        }

        let cells = document.querySelectorAll('.cell');

        cells.forEach(cell => {
            cell.style.setProperty('--randCol', this.randCol());

            cell.addEventListener('click', e => {
                this.propagateRings(e);

            });
        });
    }

    flip(element) {
        // console.log('flip');
        
        if (!!element && element.classList.contains('coloured')) {
            element.classList.remove('coloured');
        } else if (!!element) {
            element.classList.add('coloured');

            setTimeout(() => {
                element.classList.remove('coloured')
            }, this.flipDelay);
        } else {
            // console.log('no cell');
        }
        // setTimeout(() => {
        // }, this.flipDelay);
    }

    getCorners(e, step) { // click event, 
        // console.log('getCorners');
        let el = document.elementFromPoint(e.clientX, e.clientY);
        let corners = [
            this.getNextFlipper(el, 'top left', step),
            this.getNextFlipper(el, 'top right', step),
            this.getNextFlipper(el, 'bottom right', step),
            this.getNextFlipper(el, 'bottom left', step)
        ];
        return corners;
    }

    getNextFlipper(currentElement, direction, step) {
        // XY coords of current element edges (middle of edge)
        let top = {x: currentElement.getBoundingClientRect().x + (this.childSize / 2), y: currentElement.getBoundingClientRect().y};
        let bottom = {x: currentElement.getBoundingClientRect().x + (this.childSize / 2), y: currentElement.getBoundingClientRect().y + this.childSize};
        let left = {x: currentElement.getBoundingClientRect().x, y: currentElement.getBoundingClientRect().y + (this.childSize / 2)};
        let right = {x: currentElement.getBoundingClientRect().x + this.childSize, y: currentElement.getBoundingClientRect().y + (this.childSize / 2)};

        let offset = 5;

        let rect = currentElement.getBoundingClientRect();
        let nextFlipper;

        switch(direction) {
            case 'left':
                nextFlipper = !!document.elementFromPoint(left.x - offset, left.y) && document.elementFromPoint(left.x - offset, left.y).classList.contains('cell') ? document.elementFromPoint(left.x - offset, left.y) : null;
                break;
            
            case 'right':
                nextFlipper = !!document.elementFromPoint(right.x + offset, right.y) && document.elementFromPoint(right.x + offset, right.y).classList.contains('cell') ? document.elementFromPoint(right.x + offset, right.y) : null;
                break;

            case 'up':
                nextFlipper = !!document.elementFromPoint(top.x, top.y - offset) && document.elementFromPoint(top.x, top.y - offset).classList.contains('cell') ? document.elementFromPoint(top.x, top.y - offset) : null;
                break;
            
            case 'down':
                nextFlipper = !!document.elementFromPoint(bottom.x, bottom.y + offset) && document.elementFromPoint(bottom.x, bottom.y + offset).classList.contains('cell') ? document.elementFromPoint(bottom.x, bottom.y + offset) : null;
                break;
            
            case 'top left':
                nextFlipper = !!document.elementFromPoint(rect.x - offset - (step * this.childSize), rect.y - offset - (step * this.childSize)) && document.elementFromPoint(rect.x - offset - (step * this.childSize), rect.y - offset - (step * this.childSize)).classList.contains('cell') ? document.elementFromPoint(rect.x - offset - (step * this.childSize), rect.y - offset - (step * this.childSize)) : null;
                break;

            case 'top right':
                nextFlipper = !!document.elementFromPoint(rect.x + this.childSize + offset + (step * this.childSize), rect.y - offset - (step * this.childSize)) && document.elementFromPoint(rect.x + this.childSize + offset + (step * this.childSize), rect.y - offset - (step * this.childSize)).classList.contains('cell') ? document.elementFromPoint(rect.x + this.childSize + offset + (step * this.childSize), rect.y - offset - (step * this.childSize)) : null;
                break;

            case 'bottom right':
                nextFlipper = !!document.elementFromPoint(rect.x + this.childSize + offset + (step * this.childSize), rect.y + this.childSize + offset + (step * this.childSize)) && document.elementFromPoint(rect.x + this.childSize + offset + (step * this.childSize), rect.y + this.childSize + offset + (step * this.childSize)).classList.contains('cell') ? document.elementFromPoint(rect.x + this.childSize + offset + (step * this.childSize), rect.y + this.childSize + offset + (step * this.childSize)) : null;
                break;

            case 'bottom left':
                nextFlipper = !!document.elementFromPoint(rect.x - offset - (step * this.childSize), rect.y + this.childSize + offset + (step * this.childSize)) && document.elementFromPoint(rect.x - offset - (step * this.childSize), rect.y + this.childSize + offset + (step * this.childSize)).classList.contains('cell') ? document.elementFromPoint(rect.x - offset - (step * this.childSize), rect.y + this.childSize + offset + (step * this.childSize)) : null;
                break;
        }

        // console.log(`getNextFlipper(${direction}) ->`, nextFlipper);
        return nextFlipper;
    }

    getRing(corners) { // corners[] looks like [top left, top right, bottom right, bottom left]
        // console.log('getRing');
        /**
         * from given array of corners, take top left, step left (with getNextFlipper(el, left)) and push
         * returned cell to array until it reaches a cell that already appears in corner array. Do same thing
         * stepping down, then do same thing stepping right and up from bottom right corner
         */
        let cells = [...corners];

        let topUnfinished = true;
        let bottomUnfinished = true;
        let leftUnfinished = true;
        let rightUnfinished = true;

        // top
        // console.log('getting top ...');
        if (!!corners[0]) {
            let currentFlipper = corners[0];
            
            while (topUnfinished) {
                let nextRight = this.getNextFlipper(currentFlipper, 'right');
                
                if (!!nextRight && !corners.includes(nextRight)) {
                    cells.push(nextRight);
                    currentFlipper = nextRight;
                } else {
                    topUnfinished = false;
                }
            }

        } else if (!!corners[1]) {
            let currentFlipper = corners[1];

            while (topUnfinished) {
                let nextLeft = this.getNextFlipper(currentFlipper, 'left');

                if(!!nextLeft && !corners.includes(nextLeft) && nextLeft.classList.contains('cell')) {
                    cells.push(nextLeft);
                    currentFlipper = nextLeft;
                } else {
                    topUnfinished = false;
                }
            }
        } else {
            // console.log('no available corners on top');
            topUnfinished = false;
        }

        // bottom
        // console.log('getting bottom ...');
        if (!!corners[2]) {
            let currentFlipper = corners[2];

            while (bottomUnfinished) {
                let nextLeft = this.getNextFlipper(currentFlipper, 'left');
    
                if(!!nextLeft && !corners.includes(nextLeft) && nextLeft.classList.contains('cell')) {
                    cells.push(nextLeft);
                    currentFlipper = nextLeft;
                } else {
                    bottomUnfinished = false;
                    currentFlipper = corners[2];
                }
            }
        } else if (!!corners[3]) {
            let currentFlipper = corners[3];

            while (bottomUnfinished) {
                let nextRight = this.getNextFlipper(currentFlipper, 'right');

                if(!!nextRight && !corners.includes(nextRight) && nextRight.classList.contains('cell')) {
                    cells.push(nextRight);
                    currentFlipper = nextRight;
                } else {
                    bottomUnfinished = false;
                }
            }
        } else {
            // console.log('no available corners on bottom');
            bottomUnfinished = false;
        }

        // left
        // console.log('getting left ...');
        if (!!corners[0]) {
            let currentFlipper = corners[0];

            while (leftUnfinished) {
                let nextDown = this.getNextFlipper(currentFlipper, 'down');
    
                if (!!nextDown && !corners.includes(nextDown) && nextDown.classList.contains('cell')) {
                    cells.push(nextDown);
                    currentFlipper = nextDown;
                } else {
                    leftUnfinished = false;
                }
            }
        } else if (!!corners[3]) {
            let currentFlipper = corners[3];

            while (leftUnfinished) {
                let nextUp = this.getNextFlipper(currentFlipper, 'up');
    
                if (!!nextUp && !corners.includes(nextUp) && nextUp.classList.contains('cell')) {
                    cells.push(nextUp);
                    currentFlipper = nextUp;
                } else {
                    leftUnfinished = false;
                }
            }
        } else {
            // console.log('no available corners on left');
            leftUnfinished = false;
        }

        // right
        // console.log('getting right ...');
        if (!!corners[2]) {
            let currentFlipper = corners[2];

            while (rightUnfinished) {
                let nextUp = this.getNextFlipper(currentFlipper, 'up');
    
                if (!!nextUp && !corners.includes(nextUp) && nextUp.classList.contains('cell')) {
                    cells.push(nextUp);
                    currentFlipper = nextUp;
                } else {
                    rightUnfinished = false;
                }
            }
        } else if (!!corners[1]) {
            let currentFlipper = corners[1];

            while (rightUnfinished) {
                let nextDown = this.getNextFlipper(currentFlipper, 'down');
    
                if (!!nextDown && !corners.includes(nextDown) && nextDown.classList.contains('cell')) {
                    cells.push(nextDown);
                    currentFlipper = nextDown;
                } else {
                    rightUnfinished = false;
                }
            }
        } else {
            // console.log('no available corners on right');
            rightUnfinished = false;
        }

        return cells;
    }

    propagateRings(e) {
        // console.log('propagateRings');
        let propagations = 0;
        const flipRingInterval = setInterval(() => {
            if (propagations < this.spreadMax) {
                let ring = this.getRing(this.getCorners(e, propagations));
                ring.forEach(cell => this.flip(cell));
                propagations++;
            } else {
                clearInterval(flipRingInterval);
            }
        }, this.flipDelay);

    }
    
    // =====----- // -----===== //
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
        if (document.document.elementFromPoint((event.clientX), (event.clientY - this.childSize)) && document.document.elementFromPoint((event.clientX), (event.clientY - this.childSize)).classList.contains('cell')) {
            surrounds.push(document.document.elementFromPoint((event.clientX), (event.clientY - this.childSize)));
        }

        if (document.document.elementFromPoint((event.clientX), (event.clientY + this.childSize)) && document.document.elementFromPoint((event.clientX), (event.clientY + this.childSize)).classList.contains('cell')) {
            surrounds.push(document.document.elementFromPoint((event.clientX), (event.clientY + this.childSize)));
        }

        if (document.document.elementFromPoint((event.clientX - this.childSize), (event.clientY)) && document.document.elementFromPoint((event.clientX - this.childSize), (event.clientY)).classList.contains('cell')) {
            surrounds.push(document.document.elementFromPoint((event.clientX - this.childSize), (event.clientY)));
        }

        if (document.document.elementFromPoint((event.clientX + this.childSize), (event.clientY)) && document.document.elementFromPoint((event.clientX + this.childSize), (event.clientY)).classList.contains('cell')) {
            surrounds.push(document.document.elementFromPoint((event.clientX + this.childSize), (event.clientY)));
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
} customElements.define('ripple-board', RippleBoard);