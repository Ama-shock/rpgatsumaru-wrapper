import RPGAtsumaruLoader from './RPGAtsumaruLoader';
import {CommentWrapper} from './CommentWrapper';
import {VolumeWrapper} from './VolumeWrapper';
import {StorageWrapper} from './StorageWrapper';
import {QueryWrapper} from './QueryWrapper';
import {UserWrapper} from './UserWrapper';
import {SignalWrapper} from './SignalWrapper';

const RPGAtsumaruWrapper = Object.freeze({
    comment: new CommentWrapper(),
    volume: new VolumeWrapper(),
    storage: new StorageWrapper(),
    query: new QueryWrapper(),
    user: new UserWrapper(),
    signal: new SignalWrapper()
});

export {
    RPGAtsumaruWrapper as default,
    RPGAtsumaruLoader,
    CommentWrapper,
    VolumeWrapper,
    StorageWrapper,
    QueryWrapper,
    UserWrapper,
    SignalWrapper
};

