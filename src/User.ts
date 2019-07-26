import { Loader } from './RPGAtsumaruLoader';
import { UserInformation, UserIdName, SelfInformation } from '@atsumaru/api-types';

export class User {
    async get(): Promise<SelfInformation|null>;
    async get(userId: number): Promise<UserInformation|null>;
    async get(userId?: number){
        await Loader.loaded;
        if(Loader.atsumaru){
            await Loader.waitLimitedApi();
            try{
                if(!userId) return Loader.api.user.getSelfInformation();
                await Loader.enableInterPlayer();
                return Loader.api.user.getUserInformation(userId);
            }catch(err){
                console.error(err);
                return null;
            }
        }

        return {
            id: 0,
            name: 'self',
            profile: '',
            twitterId: '',
            url: location.href
        };
    }
    
    async getRecentList(): Promise<UserIdName[]>{
        await Loader.loaded;
        await Loader.enableInterPlayer();
        if(Loader.atsumaru){
            await Loader.waitLimitedApi();
            return Loader.api.user.getRecentUsers();
        }

        return [{
            id: 0,
            name: 'self'
        }];
    }
}
