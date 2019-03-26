import {EventEmitter} from 'events';

class Plunger extends EventEmitter {

    private readonly handler: any;
    private hasDone: boolean = false;

    constructor(handler: (accept: (result: any) => void, reject: (errmsg: string) => void) => void) {
        super();
        this.handler = handler;
    }

    plunge(retryCount: number) {
        this.handler((result: any) => {
            this.emit('completed', result);
            this.hasDone = true;
        }, (errmsg: string) => {
            if (retryCount > 0) {
                this.plunge(--retryCount);
                return;
            } else {
                this.emit('failed', errmsg);
                this.hasDone = true;
            }
        });
    }
}

export default Plunger;