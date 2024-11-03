import {AssetManager, assetManager, ImageAsset, SpriteFrame} from 'cc';

import {AssetsBundle} from "./assets-bundle";
import {IService, Services, ServiceType} from "../services.ts";

export class AssetsBundleManager implements IService {
    public type: ServiceType = ServiceType.ASSET_BUNDLE_MANAGER;

    private readonly _bundles: Map<string, AssetsBundle> = new Map<string, AssetsBundle>();

    public constructor() {
        Services.add(this);
    }

    public async loadSpriteFrameByUrl(url: string): Promise<SpriteFrame> {
        return new Promise<SpriteFrame>((resolve, reject) => {
            const options = {
                maxRetryCount: 0,
                ext: ".png"
            };

            assetManager.loadRemote(url, options, (err, texture: ImageAsset) => {
                if (err) {
                    reject(err);
                } else {
                    const spriteFrame =  SpriteFrame.createWithImage(texture);
                    resolve(spriteFrame);
                }
            })
        });
    }

    public async loadBundle(address: string): Promise<AssetsBundle | undefined> {
        if(this._bundles.has(address)) {
            let bundleCashed = this._bundles.get(address) as AssetsBundle;

            if(!bundleCashed.isReleased) {
                return bundleCashed;
            } else {
                this._bundles.delete(address);
            }
        }

        return new Promise((resolve, reject) => {
            assetManager.loadBundle(address, (error: Error, bundle: AssetManager.Bundle) => {
                if (error) {
                    reject(undefined);
                    return;
                }

                const assetBundle = new AssetsBundle(address, bundle);

                this._bundles.set(address, assetBundle);

                resolve(assetBundle);
            });
        });
    }

    public releaseBundle(bundle: AssetsBundle): void {
        bundle.release();

        this._bundles.delete(bundle.address);
    }
}