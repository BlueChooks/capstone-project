class BeastPop extends HTMLElement {
    constructor() {
        super();
        // this.input = this.innerHTML;

        switch(this.innerHTML) {
            case 'chook':
                this.innerHTML = this.chook(this.getAttribute('direction'));
                break;
            default:
                this.innerHTML = this.chook('left');
        }
    }

    chook(direction) {
        let left = 1;
        let right = -1;
        
        return `
        <svg style="--direction:${direction === 'left' ? left : right}" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
        width="30.441px" height="68.643px" viewBox="0 0 30.441 68.643" enable-background="new 0 0 30.441 68.643" xml:space="preserve">
        <path fill="var(--secondary)" d="M29.396,12.218c2.726,2.281-0.502,6.362-2.643,7.95c-2.247,1.668-3.896,3.608-6.055,1.975
            c-2.159-1.635-0.337-4.292,1.674-7.009C24.277,12.563,26.669,9.934,29.396,12.218z"/>
        <path fill="var(--secondary)" d="M23.555,4.236c3.449,1.146,4.096,5.837-1.447,14.165c-1.939,2.914-3.787,2.902-4.885,2.245
            c-1.099-0.657-4.026-2.765,0.481-13.057C18.871,4.926,20.824,3.329,23.555,4.236z"/>
        <path fill="var(--secondary)" d="M12.272,0.047c4.962-0.57,6.025,4.077,5.996,9.521s-1.34,10.885-4.044,11.387
            c-5.208,0.966-6.054-8.243-6.315-10.467C7.647,8.263,7.294,0.62,12.272,0.047z"/>
        <path fill="var(--primary)" d="M15.27,13.933c-7.336,0-13.285,5.947-13.285,13.285v41.425h26.57V27.218
            C28.555,19.88,22.606,13.933,15.27,13.933z"/>
        <ellipse cx="4.609" cy="26.426" rx="1.545" ry="3.052"/>
        <ellipse cx="16.928" cy="26.426" rx="2.797" ry="3.052"/>
        <path fill="var(--secondary)" d="M8.833,29.478c-1.031,0-1.948,0.458-2.584,1.171l-0.005-0.013L0,36.429h8.833
            c1.919,0,3.476-1.556,3.476-3.475C12.309,31.035,10.752,29.478,8.833,29.478z"/>
    </svg>`
    }

} customElements.define('beast-pop', BeastPop);