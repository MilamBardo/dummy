/// <reference path='../../typings/globals/pgpromise/pg-promise.d.ts' />
/// <reference path='../../typings/index.d.ts'/>
"use strict";
const Ads = require("../models/Advertisements/AdvertisementsModule");
const dbProvider = require("../../db");
class advertisementRepository {
    constructor() {
        this.db = dbProvider.dbpool;
    }
    //ADDS
    addadvertisement(advertisement) {
        return this.db.one('INSERT INTO advertisements(name, html, advertisementtypeid, datecreated) VALUES($1, $2, $3, $4) RETURNING advertisementid', [advertisement.name, advertisement.html, advertisement.advertisementtypeid, advertisement.datecreated]);
    }
    ;
    //GETS
    getalladvertisementtypes() {
        return new Promise((resolve, reject) => { resolve(this.db.manyOrNone('SELECT * FROM advertisementtypes WHERE isdeleted = false')); }).then((typearray) => {
            let mappedarray = [];
            //let portraits : Array<any> = []
            for (var type of typearray) {
                let mappedtype;
                let advertisementtypeid = type.advertisementtypeid;
                let advertisementtype = type.advertisementtype;
                let isdeleted = type.isdeleted;
                let datecreated = type.datecreated;
                mappedtype = new Ads.AdvertisementType(advertisementtype, isdeleted, advertisementtypeid, datecreated);
                mappedarray.push(mappedtype);
            }
            return mappedarray;
        });
    }
    ;
    getalladvertisements() {
        return new Promise((resolve, reject) => { resolve(this.db.manyOrNone('SELECT * FROM advertisements WHERE isdeleted=false')); }).then((advertarray) => {
            let mappedarray = [];
            //let portraits : Array<any> = []
            for (var advert of advertarray) {
                let mappedadvert;
                let name = advert.name;
                let html = advert.html;
                let pbody = advert.type;
                let id = advert.advertisementid;
                let typeid = advert.advertisementtypeid;
                let datecreated = advert.name;
                mappedadvert = new Ads.Advertisement(name, html, typeid, id, datecreated);
                mappedarray.push(mappedadvert);
            }
            return mappedarray;
        });
    }
}
exports.advertisementRepository = advertisementRepository;
//# sourceMappingURL=advertisementRepository.js.map