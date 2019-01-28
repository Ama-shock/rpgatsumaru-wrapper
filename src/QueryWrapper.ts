import Loader from './RPGAtsumaruLoader';

export class QueryWrapper extends Loader{

    get data(): {[key: string]: string|undefined}{
        if(this.atsumaru){
            const api = (this.atsumaru as any).query || this.atsumaru.experimental!.query;
            return api || {};
        }
        if(!location.search.startsWith('?')) return {};
        const result = {} as {[key: string]: string};
        location.search.slice(1).split('&').forEach(param=>{
            const [key, value] = param.split('=');
            result[key] = value && decodeURI(value);
        })
        return result;
    }
}
