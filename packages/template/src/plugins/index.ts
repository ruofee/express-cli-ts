import {arrayForEach} from '../utils/arrayEasy';
import {plugins} from '../config';
import context from './context';

arrayForEach(plugins, plugin => {
    plugin(context);
});
