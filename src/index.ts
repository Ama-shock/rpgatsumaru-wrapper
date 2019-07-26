import {Comment} from './Comment';
import {Volume} from './Volume';
import {Storage} from './Storage';
import {Query} from './Query';
import {User} from './User';
import {Signal} from './Signal';

const RPGAtsumaru = Object.freeze({
    //comment: new Comment(),
    volume: new Volume(),
    storage: new Storage(),
    query: new Query(),
    user: new User(),
    signal: new Signal()
});

export default RPGAtsumaru;
