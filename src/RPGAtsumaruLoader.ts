import {RPGAtsumaruApi, Experimental} from '@atsumaru/api-types';

type RecursiveRequired<T> = Required<{
    [K in keyof T]: Required<T[K]>;
}>;
type Api = RecursiveRequired<RPGAtsumaruApi & Experimental>;

export class Loader{
    private constructor(){
        throw new Error('Cannot construct Loader.');
    }

    static readonly loaded = new Promise(r=>window.addEventListener('load', r, {once: true}));

    static readonly api = new Proxy({}, {
        has: (tgt, key)=>{
            const atsumaru = window.RPGAtsumaru;
            if(!atsumaru) return false;
            if(key in atsumaru) return true;
            if(!atsumaru.experimental) return false;
            return key in atsumaru.experimental;
        },
        get: (tgt, key: string)=>{
            return Loader.passer(key);
        },
        set: (tgt, key, val)=>{
            return false;
        }
    }) as Api;
    
    private static passer(key: string){
        return new Proxy({}, {
            has: (tgt, method)=>{
                const atsumaru = window.RPGAtsumaru;
                if(!atsumaru) return false;
                const api = atsumaru[key as keyof RPGAtsumaruApi] || {};
                if(method in api) return true;

                const exp = atsumaru.experimental && atsumaru.experimental[key as keyof Experimental] || {};
                return method in exp;
            },
            get: (tgt, method: any)=>{
                const atsumaru = window.RPGAtsumaru;
                if(!atsumaru) return undefined;
                const api = atsumaru[key as keyof RPGAtsumaruApi];
                const exp = atsumaru.experimental && atsumaru.experimental[key as keyof Experimental];
                const ins = (api && method in api) ? api : (exp && method in exp) ? exp : undefined;
                if(!ins) return undefined;

                const fn = ins[method as keyof typeof api] as Function;
                return (typeof fn == 'function') ? fn.bind(ins) : fn;
            },
            set: (tgt, key, val)=>{
                return false;
            }
        });
    }

    private static limitedApiPeriod = 0;
    static async waitLimitedApi(){
        const period = Loader.limitedApiPeriod;
        const now = Date.now();
        if(period < now){
            Loader.limitedApiPeriod = now + 5000;
            return;
        }
        Loader.limitedApiPeriod = period + 5000;
        return new Promise<void>(r=>setTimeout(r, period - now));
    }

    static async enableInterPlayer(){
        const p = this.api.interplayer;
        return p && p.enable && p.enable();
    }
    
    static get atsumaru(){
        return window.RPGAtsumaru;
    }
    static get parent(){
        return window.parent.RPGAtsumaru;
    }
}
