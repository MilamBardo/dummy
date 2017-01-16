/// <reference path='../../typings/globals/pgpromise/pg-promise.d.ts' />
/// <reference path='../../typings/index.d.ts'/>

import * as pg from 'pg';
import * as pgPromise from 'pg-promise';
import * as Ads from '../models/Advertisements/AdvertisementsModule';
import dbProvider = require('../../db')

export class advertisementRepository
{

    db = dbProvider.dbpool;
    
    constructor() {
            }

    //ADDS
    addadvertisement(advertisement : Ads.Advertisement)
    {
            return this.db.one('INSERT INTO advertisements(name, html, advertisementtypeid, datecreated) VALUES($1, $2, $3, $4) RETURNING advertisementid', [advertisement.name, advertisement.html, advertisement.advertisementtypeid, advertisement.datecreated]);
    };

    //GETS
    getalladvertisementtypes()
    {
             return new Promise( (resolve:any, reject:any) => {resolve(this.db.manyOrNone('SELECT * FROM advertisementtypes WHERE isdeleted = false'))}).then((typearray:any[]) => {
                         let mappedarray:Array<Ads.AdvertisementType> = [];
                         //let portraits : Array<any> = []
                         for (var type of typearray) 
                         {
                                let mappedtype : Ads.AdvertisementType;
                                let advertisementtypeid : number = type.advertisementtypeid;
                                let advertisementtype : string = type.advertisementtype;
                                let isdeleted : boolean =type.isdeleted;
                                let datecreated : Date = type.datecreated;
                                mappedtype = new Ads.AdvertisementType(advertisementtype, isdeleted, advertisementtypeid, datecreated);
                                mappedarray.push(mappedtype);
                         }
                         return mappedarray;
             });
    };
    getalladvertisements()
    {
             return new Promise( (resolve:any, reject:any) => {resolve(this.db.manyOrNone('SELECT * FROM advertisements WHERE isdeleted=false'))}).then((advertarray:any[]) => {
                     let mappedarray:Array<Ads.Advertisement> = [];
                         //let portraits : Array<any> = []
                         for (var advert of advertarray) 
                         {
                                let mappedadvert : Ads.Advertisement;
                                let name : string = advert.name;
                                let html: string = advert.html;
                                let pbody: string = advert.type;
                                let id:number = advert.advertisementid;
                                let typeid:number = advert.advertisementtypeid;
                                let datecreated: Date = advert.name;
                                mappedadvert = new Ads.Advertisement(name, html, typeid, id, datecreated)
                                mappedarray.push(mappedadvert);
                         }
                         return mappedarray;
                });
    }
//      getadvertisementbyid(advertisementid: number)
//         {
//                 return new Promise( (resolve:any, reject:any) => {resolve(this.db.oneOrNone('SELECT * FROM advertisements WHERE id =$1', [advertisementid]))}).then((advert:any) => {
//                         let mappedadvert : Ads.Advertisement;
//                         let name : string = advert.name;
//                         let html: string = advert.html;
//                         let pbody: string = advert.type;
//                         let id:number = advert.name;
//                         let pdate: Date = advert.name;
//                         mappedadvert = new Posts.Post(ptitle, pbody, pexcerpt, id, url, pdate);
//                         return mappedpost;
//                 });
//         };

}