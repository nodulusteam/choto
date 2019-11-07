

import { Sheet } from '../db/sheet';

import {
    Method, Param, Verbs, MethodResult, Body,
    Query, SecurityContext, Inject, MethodConfig,
} from '@methodus/server';
import { Config } from '../config';
import { AdModel } from '../models/ad.model';

@MethodConfig('AdsController')
export class AdsController {
    constructor() {

    }

    @Method(Verbs.Get, '/ads/')
    public async list(@SecurityContext() securityContext: any): Promise<MethodResult> {
        const adsDb = new Sheet(Config.sheets.data);
        const result: any = await adsDb.query(0, ``, 1, 1000);
        return new MethodResult(result.data);
    }



    @Method(Verbs.Get, '/ads/:id')
    public async get(@Param('id') id: string, @SecurityContext() securityContext: any): Promise<MethodResult> {
        const adsDb = new Sheet(Config.sheets.data);
        const result: any = await adsDb.query(0, ``, 1, 1000);
        return new MethodResult(result.data);
    }



    @Method(Verbs.Post, '/ads', [])
    public async insert(@Body() adInfo: AdModel, @SecurityContext() securityContext: any): Promise<MethodResult> {

        const adsDb = new Sheet(Config.sheets.data);
        adInfo.dateentered = new Date().toLocaleString();
        adInfo.status = 'new';

        const insertResult = await adsDb.insert(0, adInfo);

        return new MethodResult(insertResult);
    }

    @Method(Verbs.Put, '/ads/:ad_id', [])
    public async update(@Body() adInfo: any, @Param('ad_id') ad_id: string,
        @SecurityContext() securityContext: any): Promise<MethodResult> {

        const adsDb = new Sheet(Config.sheets.data);
        adInfo.dateupdate = new Date().toLocaleString();
        adInfo.keyid = ad_id;
        adInfo = await adsDb.update(adInfo);

        return new MethodResult(adInfo);
    }

    @Method(Verbs.Delete, '/ads/:ad_id', [])
    public async delete(@Param('ad_id') ad_id: string,
        @SecurityContext() securityContext: any): Promise<MethodResult> {

        const adsDb = new Sheet(Config.sheets.data);
        let adInfo: AdModel = new AdModel();
        adInfo.dateentered = new Date().toLocaleString();
        adInfo.keyid = ad_id;
        const deleteresult = await adsDb.delete(adInfo);
        console.log(adInfo);
        return new MethodResult(adInfo);
    }

}



