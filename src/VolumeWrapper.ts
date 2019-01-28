import Loader from './RPGAtsumaruLoader';
import { Subscription } from '@atsumaru/api-types';

export class VolumeWrapper extends Loader{

    private _listener?: (vol:number)=>void;
    get onChange(){return this._listener;}
    set onChange(listener: ((vol:number)=>void)|undefined){
        this._listener = listener;
        this.setListener(listener);
    }
    private _sub?: Subscription;
    private async setListener(listener?: (vol:number)=>void){
        await this.ready;
        if(!this.atsumaru) return;
        this._sub && this._sub.unsubscribe();
        if(listener) this._sub = this.atsumaru.volume.changed().subscribe(listener);
        else delete this._sub;
    }

    private _value: number = 1;
    get value(){
        if(this.atsumaru) return this.atsumaru.volume.getCurrentValue();
        return this._value;
    }
    set value(value: number){
        if(this.atsumaru) throw new Error('Cannot Change Volume.');
        if(value < 0 || 1 < value) throw new Error('Volume in Invalid Range.');
        this._value = value;
        this.onChange && this.onChange(value);
    }

}
