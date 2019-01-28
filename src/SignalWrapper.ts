import Loader from './RPGAtsumaruLoader';
import { GlobalSignal, UserSignal } from '@atsumaru/api-types';

export class SignalWrapper extends Loader{

    async sendGlobal(data: string): Promise<void>{
        await this.ready;
        if(this.atsumaru){
            await this.waitLimitedApi();
            const api = this.experimentalApi('signal', 'sendSignalToGlobal');
            api && api(data);
            return;
        }
    }
    async getGlobal(): Promise<GlobalSignal[]>{
        await this.ready;
        if(this.atsumaru){
            await this.waitLimitedApi();
            const api = this.experimentalApi('signal', 'getGlobalSignals');
            return api ? api() : [];
        }
        return [];
    }

    async sendPrivate(id: number, data: string): Promise<void>{
        await this.ready;
        if(this.atsumaru){
            await this.waitLimitedApi();
            const api = this.experimentalApi('signal', 'sendSignalToUser');
            api && api(id, data);
            return;
        }
    }
    async getPrivate(): Promise<UserSignal[]>{
        await this.ready;
        if(this.atsumaru){
            await this.waitLimitedApi();
            const api = this.experimentalApi('signal', 'getUserSignals');
            return api ? api() : [];
        }
        return [];
    }
}
