import {IService, Services, ServiceType} from "../services.ts";

export class Logger implements IService {
    public readonly type: ServiceType = ServiceType.LOGGER;

    public constructor() {
        Services.add(this);
    }

    public log(message: string): void {
        console.log(message);
    }

    public error(message: string): void {
        console.error(message);
    }

    public warning(message: string): void {
        console.warn(message);
    }
}