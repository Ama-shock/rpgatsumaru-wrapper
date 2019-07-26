import { Loader } from './RPGAtsumaruLoader';
import { GlobalSignal, UserSignal, SelfInformation } from '@atsumaru/api-types';

export class Signal{
    private globalStack: GlobalSignal[] = [];
    private account: SelfInformation|null = null;
    readonly ready = this.init();

    private async init(){
        await Loader.loaded;
        await Loader.waitLimitedApi();
        try{
            this.account = await Loader.api.user.getSelfInformation();
        }catch(err){
            console.error(err);
            this.account = null;
        }
    }

    async sendGlobal(data: string): Promise<void>{
        await this.ready;
        if(Loader.atsumaru){
            if(!this.account) return;
            await Loader.waitLimitedApi();
            return Loader.api.signal.sendSignalToGlobal(data);
        }
        this.globalStack.push({
            id: this.globalStack.length +1,
            senderId: 0,
            senderName: 'self',
            createdAt: Date.now(),
            data
        });
    }

    async getGlobal(includeSelf: boolean = false): Promise<GlobalSignal[]>{
        await this.ready;
        if(Loader.atsumaru){
            if(!this.account) return [];
            await Loader.waitLimitedApi();
            const all = await Loader.api.signal.getGlobalSignals();
            if(includeSelf) return all;
            const selfId = this.account.id;
            return all.filter(s=>s.senderId != selfId);
        }
        return this.globalStack;
    }
    
    private privateStack: UserSignal[] = [];

    async sendPrivate(id: number, data: string): Promise<void>{
        await this.ready;
        await Loader.enableInterPlayer();
        if(Loader.atsumaru){
            if(!this.account) return;
            await Loader.waitLimitedApi();
            return Loader.api.signal.sendSignalToUser(id, data);
        }
        this.privateStack.push({
            id: this.privateStack.length +1,
            senderId: 0,
            senderName: 'self',
            createdAt: Date.now(),
            data
        });
    }

    async getPrivate(includeSelf: boolean = false): Promise<UserSignal[]>{
        await this.ready;
        await Loader.enableInterPlayer();
        if(Loader.atsumaru){
            if(!this.account) return [];
            await Loader.waitLimitedApi();
            const all = await Loader.api.signal.getUserSignals();
            if(includeSelf) return all;
            const selfId = this.account.id;
            return all.filter(s=>s.senderId != selfId);
        }
        return this.privateStack;
    }

    
    private clockDiff = 0;
    async syncClock(): Promise<void>{
        await this.ready;
        await Loader.enableInterPlayer();
        if(!this.account) return;
        const selfId = this.account.id;
        await Loader.waitLimitedApi();
        const timestamp = Date.now();
        await Loader.api.signal.sendSignalToUser(selfId, timestamp.toString());
        const all = await Loader.api.signal.getUserSignals();
        const result = all.find(s=>s.senderId === selfId && s.data === timestamp.toString());
        if(!result) return;
        this.clockDiff = result.createdAt - timestamp;
    }

    get now(){
        return Date.now() + this.clockDiff;
    }
}
