export class Music {
    constructor(init?: Music) {
        Object.assign(this, init);
    }

    brand: string;
    title: string;
    artist: string;
    no: string;
}