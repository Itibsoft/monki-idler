import {sys} from "cc";

export class LocalStorage {
    private static readonly _webStorage: Storage = sys.localStorage;

    public static setData<TData>(rootName: string, data: TData): void {
        try {
            const jsonData = JSON.stringify(data);
            this._webStorage.setItem(rootName, jsonData);
        } catch (error) {
            console.error(error);
        }
    }

    public static getData<TData>(key: string, default_data?: TData | undefined): TData | undefined {
        try {
            const jsonData = this._webStorage.getItem(key as string);

            if(!jsonData) {
                return default_data;
            }

            return JSON.parse(jsonData!);
        } catch {
            return undefined;
        }
    }

    public static delete(rootName: string): void {
        try {
            this._webStorage.removeItem(rootName);
        } catch (error) {
            console.error(error);
        }
    }
}