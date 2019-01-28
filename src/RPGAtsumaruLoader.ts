import {RPGAtsumaruApi, Experimental} from '@atsumaru/api-types';

export default class RPGAtsumaruLoader{
    static readonly load = new Promise(r=>window.addEventListener('load', r, {once: true}));
    static readonly parentLoad = new Promise(r=>window.parent.addEventListener('load', r, {once: true}));

    protected get atsumaru(){
        return window.RPGAtsumaru;
    }
    protected get parent(){
        return window.parent.RPGAtsumaru;
    }

    readonly ready = this.init();
    protected async init(){
        await Promise.all([
            RPGAtsumaruLoader.load,
            RPGAtsumaruLoader.parentLoad
        ]);
    }

    protected experimentalApi(api: keyof Experimental, prop: string){
        if(!this.atsumaru) return null;
        for(let exp of [this.atsumaru as Experimental, this.atsumaru.experimental]){
            const a = exp && exp[api] as any;
            if(!a) continue;
            if(a[prop] instanceof Function) return a[prop].bind(a);
            return a[prop];
        }
        return null;
    }

    private static limitedApiPeriod = 0;
    protected async waitLimitedApi(){
        const period = RPGAtsumaruLoader.limitedApiPeriod;
        const now = Date.now();
        if(period < now){
            RPGAtsumaruLoader.limitedApiPeriod = now + 5000;
            return;
        }
        RPGAtsumaruLoader.limitedApiPeriod = period + 5000;
        return new Promise<void>(r=>setTimeout(r, period - now));
    }
}
