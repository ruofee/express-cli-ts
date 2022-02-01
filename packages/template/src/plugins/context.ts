import {arrayForEach} from '../utils/arrayEasy';

interface Handler {
    (args?: unknown): void;
}

export class Context {
    private plugins: { [key: string]: Array<Handler> } = {};

    public on(pluginName: string, handler: () => void): void {
        if (!this.plugins[pluginName]) {
            this.plugins[pluginName] = [];
        }
        this.plugins[pluginName].push(handler);
    }

    public emit(pluginName: string, args?: unknown): void {
        if (this.plugins[pluginName]) {
            arrayForEach(this.plugins[pluginName], handler => {
                handler(args);
            });
        }
    }
}

const context = new Context();

export default context;
