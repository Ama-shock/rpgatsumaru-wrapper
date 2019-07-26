import { Loader } from './RPGAtsumaruLoader';

type CommentItem = {
    comment: string;
    commands: {
        raw: string;
        color: string;
        position: string;
        size: string;
        invisible: boolean;
    };
    isMyPost: boolean;
};

export class Comment {
    readonly gpos = new Gpos();
    readonly ready = Promise.all([
        this.init(),
        Loader.loaded
    ]);
    
    protected async init(){
        this.autoUpdate = true;
        await Loader.loaded;
        if(this.wrapper){
            this.wrapper.startUpdateLoop = ()=>{};
            const setup = this.wrapper.setup.bind(this.wrapper);
            this.wrapper.setup = (peer: any, params: any, callback: any)=>{
                setup(peer, params, callback);
                this.defaultOnUpdated = this.layer.onUpdated.bind(this.layer);
                this.layer.onUpdated = (t: any)=>this.onUpdated(t);
            }
        }
    }
    private get wrapper(){
        return Loader.parent && (Loader.parent.comment as any)._commentPlayer;
    }
    private get player(){
        return this.wrapper && this.wrapper._player;
    }
    private get layer(){
        return this.player && this.player._commentLayer;
    }

    update(){
        this.player && this.player.update();
    }

    private _debug = false;
    get debug(){return this._debug;}
    set debug(enable: boolean){
        this._debug = enable;
    }
    
    get isShow(){
        if(this.layer){
            return !!this.layer._isShowComments && !this.layer._isDocumentHidden;
        }
        return false;
    }

    private autoUpdateTimer = 0;
    private autoUpdateLoop(){
        this.autoUpdateTimer = requestAnimationFrame(()=>{
            this.update();
            this.autoUpdateLoop();
        });
    }
    get autoUpdate(){return !!this.autoUpdateTimer;}
    set autoUpdate(enable: boolean){
        if(enable){
            if(this.autoUpdateTimer) return;
            this.autoUpdateLoop();
        }else{
            cancelAnimationFrame(this.autoUpdateTimer);
            this.autoUpdateTimer = 0;
        }
    }

    defaultCommentView = true;
    commentView?: (comment: CommentItem)=>void;
    private defaultOnUpdated?: (t: any)=>void;
    private showed: CommentItem[] = [];
    private onUpdated(t: any){
        if(this.defaultCommentView){
            this.defaultOnUpdated && this.defaultOnUpdated(t);
        }
        if(this.layer){
            const prev = this.showed;
            this.showed = [];
            if(!this.defaultCommentView){
                this.layer.clearStage();
                this.layer._comments = this.layer._comments.filter((c: CommentItem)=>!prev.includes(c));
                if(prev.includes(this.layer._pseudoComment)) this.layer._pseudoComment = null;
            }
            for(let comment of this.layer._comments){
                this.showed.push(comment);
                if(prev.includes(comment)) continue;
                this.commentView && this.commentView(comment);
                if(this.debug) console.info('Comment', this.gpos.toString(), comment);
            }
            if(this.layer._pseudoComment){
                const comment = this.layer._pseudoComment;
                this.showed.push(comment);
                if(!prev.includes(comment)){
                    this.commentView && this.commentView(comment);
                    if(this.debug) console.info('Posted', this.gpos.toString(), comment);
                }
            }
        }
    }
}

export class Gpos implements ProxyHandler<string[]>{
    private get wrapper(){
        return Loader.parent && (Loader.parent.comment as any)._commentPlayer;
    }
    private get player(){
        return this.wrapper && this.wrapper._player;
    }

    get scene(){
        return this.player ? this.player._gameScene.sceneName : '';
    }
    set scene(name: string){
        this.player.changeScene(name);
    }
    
    set(target: string[], property: number, value: string, receiver:string[]) {
        if(!this.player) return false;
        if(isNaN(property)) return true;
        if(target.length <= property){
            this.player.pushContextFactor(value);
            return true;
        }
        
        target[property] = value;
        this.minorContext = 0;
        return true;
    }
    get context(): string[]{
        const contexts = this.player ? this.player._currentText : [];
        return new Proxy<string[]>(contexts, this);
    }
    set context(contexts: string[]){
        if(!this.player) return;
        this.player._currentText = [];
        for(let c of contexts) this.player.pushContextFactor(c);
    }

    get minorContext(){
        return this.player ? this.player._increment : 0;
    }
    set minorContext(num: number){
        if(!this.player) return;
        this.player._increment = num - 1;
        this.next();
    }
    next(){
        this.player && this.player.pushMinorContext();
    }

    toString(){
        return `${this.scene}:${this.context.join('/')}(${this.minorContext})`;
    }
};