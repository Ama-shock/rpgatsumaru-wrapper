import { Loader } from './RPGAtsumaruLoader';
import { StorageItem } from '@atsumaru/api-types';

const sharedKey = 'Atsumaru Shared';

export class Storage{
    private cache: StorageItem[] = [];
    async getItems(){
        await Loader.loaded;
        if(Loader.atsumaru){
            this.cache = await Loader.api.storage.getItems();
            if(this.cache.find(item=>item.key == sharedKey)) await Loader.enableInterPlayer();
            return this.cache;
        }

        const items = [];
        for(let i = 0; i < localStorage.length; i++){
            const key = localStorage.key(i)!;
            const value = localStorage.getItem(key);
            items.push({key, value});
        }
        return items;
    }
    
    async setItems(items: {key: string, value: string}[]){
        await Loader.loaded;
        if(Loader.atsumaru){
            if(items.find(item=>item.key == sharedKey)) await Loader.enableInterPlayer();
            return Loader.api.storage.setItems(items);
        }
        
        for(let item of items){
            localStorage.setItem(item.key, item.value);
        }
    }

    async removeItems(key: string){
        await Loader.loaded;
        if(Loader.atsumaru) return Loader.api.storage.removeItem(key);
        localStorage.removeItem(key);
    }

    async getOthersShared<S>(userIds: number[], gameId?: number): Promise<{[userId:number]: S}>{
        await Loader.loaded;
        if(Loader.atsumaru){
            await Loader.waitLimitedApi();
            const saves = await Loader.api.storage.getSharedItems(userIds, gameId);
            return new Proxy(saves, {
                set: ()=>false,
                get: (tgt, key: number)=>tgt[key] && JSON.parse(tgt[key]) as S
            }) as any;
        }

        for(let item of await this.getItems()){
            if(item.key != sharedKey) continue;
            return {
                0: item.value && JSON.parse(item.value)
            };
        }
        return {};
    }
    
    private async load<T>(key: string){
        const all = await this.getItems();
        const data = all.find(d=>d.key == key);
        return data && data.value ? JSON.parse(data.value) as T : null;
    }
    private async save<T>(key: string, data: T){
        return this.setItems([{key: key, value: JSON.stringify(data)}]);
    }

    async loadSystem<S>(){
        return this.load<S>('system');
    }
    async saveSystem<S>(data: S){
        return this.save<S>('system', data);
    }
    
    async loadShared<S>(){
        return this.load<S>(sharedKey);
    }
    async saveShared<S>(data: S){
        return this.save<S>(sharedKey, data);
    }

    async loadData<D>(id: number){
        return this.load<D>('data' + id);
    }
    async saveData<D>(id: number, data: D){
        return this.save<D>('data' + id, data);
    }
    async loadAllData<D>(){
        const raw = await this.getItems();
        const data = [] as D[];
        for(let d of raw){
            if(!d.key.startsWith('data')) continue;
            const id = parseInt(d.key.replace('data', ''));
            if(!id) continue;
            data[id] = d.value && JSON.parse(d.value);
        }
        return data;
    }
    
}
