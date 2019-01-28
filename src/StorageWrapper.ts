import Loader from './RPGAtsumaruLoader';
import { SharedSaveItems } from '@atsumaru/api-types';

export class StorageWrapper extends Loader{
    async getItems(){
        await this.ready;
        if(this.atsumaru) return this.atsumaru.storage.getItems();
        const items = [];
        for(let i = 0; i < localStorage.length; i++){
            const key = localStorage.key(i)!;
            const value = localStorage.getItem(key);
            items.push({key, value});
        }
        return items;
    }
    
    async setItems(items: {key: string, value: string}[]){
        await this.ready;
        if(this.atsumaru) return this.atsumaru.storage.setItems(items);
        
        for(let item of items){
            localStorage.setItem(item.key, item.value);
        }
    }

    async removeItems(key: string){
        await this.ready;
        if(this.atsumaru) return this.atsumaru.storage.removeItem(key);
        localStorage.removeItem(key);
    }

    async getSharedItems(userIds: number[], gameId?: number): Promise<SharedSaveItems>{
        await this.ready;
        if(this.atsumaru){
            await this.waitLimitedApi();
            const api = this.experimentalApi('storage', 'getSharedItems');
            return api ? api(userIds, gameId) : {};
        }
        for(let item of await this.getItems()){
            if(item.key != 'Atsumaru Shared') continue;
            return {0: item.value || ''};
        }
        return {};
    }
}
