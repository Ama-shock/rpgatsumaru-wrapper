import { Loader } from './RPGAtsumaruLoader';

export class Query{
    private query: {[key: string]: string|undefined};
    readonly ready: Promise<void>;

    constructor(){
        const query = {} as {[key: string]: string};
        if(location.search.startsWith('?')){
            location.search.slice(1).split('&').forEach(param=>{
                const [key, value] = param.split('=');
                query[key] = value && decodeURI(value.replace(/\+/g, '%20'));
            })
        }
        this.query = query;
        this.ready = this.load();
    }
    
    private async load() {
        await Loader.loaded;
        if(!Loader.atsumaru) return;
        this.query = Loader.api.query || {};
    }

    get param(){
        const params = [];
        for(let key in this.query){
            if(!key.startsWith('param')) continue;
            const num = parseInt(key.replace('param', ''));
            if(num) params[num] = this.query[key];
        }
        return params;
    }
}
