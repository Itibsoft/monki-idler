export class Delegate<T> {
    private handlers: { func: (arg: T) => void, context: any }[] = [];

    public add(handler: (arg: T) => void, context: any): void {
        const boundHandler = handler.bind(context);

        this.handlers.push({ func: boundHandler, context });
    }

    public remove(handler: (arg: T) => void, context: any): void {
        const index = this.handlers.findIndex(h => {
            return h.func === handler && h.context === context
        });

        if (index !== -1) {
            this.handlers.splice(index, 1);
        }
    }

    public invoke(arg: T): void {
        for (const { func } of this.handlers) {
            func(arg);
        }
    }
}