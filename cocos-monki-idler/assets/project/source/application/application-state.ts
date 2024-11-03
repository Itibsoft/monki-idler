export enum APPLICATION_STATE_TYPE {
    NONE = "NONE",
    META = "META",
    CORE = "CORE"
}

export abstract class ApplicationState {
    public abstract type: APPLICATION_STATE_TYPE;

    public abstract enterAsync(): Promise<void>;
    public abstract exitAsync(): Promise<void>;
}