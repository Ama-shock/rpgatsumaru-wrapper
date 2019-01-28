import Wrapper from '../src/index';

Wrapper.comment.debug = true;
Object.defineProperty(window, 'atsumaru', {value: Wrapper});