import Loader from './RPGAtsumaruLoader';
import { UserInformation } from '@atsumaru/api-types';

export class UserWrapper extends Loader{
    async get(userId?: number): Promise<UserInformation|null>{
        await this.ready;
        if(this.atsumaru){
            await this.waitLimitedApi();
            if(userId){
                const api = this.experimentalApi('user', 'getSelfInformation');
                return api ? api() : null;
            }
            const api = this.experimentalApi('user', 'getUserInformation');
            return api ? api() : null;
        }
        return null;
    }
    
    async getRecentList(): Promise<UserInformation[]>{
        await this.ready;
        if(this.atsumaru){
            await this.waitLimitedApi();
            const api = this.experimentalApi('user', 'getRecentUsers');
            return api ? api() : [];
        }
        return [];
    }
}
