import {Context} from './plugins/context';

interface Plugin {
    (context: Context): void;
}

export const plugins: Array<Plugin> = [
    (context) => {
        context.on('beforeStart', () => {
            console.log('[plugins]: before start');
        });

        context.on('start', () => {
            console.log('[plugins]: start');
        });
    },
];
