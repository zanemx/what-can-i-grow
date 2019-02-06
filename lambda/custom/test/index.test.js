//const moment = require('moment');
//const foods = require('./../zanemx-modules/Foods');
//const zones = require('./../zanemx-modules/zones');
const expect = require('expect');
const wcig = require('./../zanemx-modules/wcig');

describe("Food Query Funcs",()=>{

    it('gets USDA hardiness zone data given a zip code',()=>{
        // Shutesbury, MA
        const zip = '01072';
        const zoneData = wcig.getZoneFromZip(zip);
        expect(zoneData).toBeTruthy();
        expect(zoneData.zone).toEqual('5b');
    });

    it("gets food from AMAZON.DATE string",()=>{
        const [month,foods] = wcig.getFoodForDate('2019-11-25');
        expect(month).toEqual('november');
        expect(foods).toBeTruthy();
    });

    it("gets foods for current month",()=>{
        const foods = wcig.getFoodsICanGrowThisMonth();
        expect(foods).toBeTruthy();
    });

    it("gets foods for given month",()=>{
        const january = wcig.getFoodsICanGrowInMonth('january');
        const february = wcig.getFoodsICanGrowInMonth('february');
        const march = wcig.getFoodsICanGrowInMonth('march');
        const april = wcig.getFoodsICanGrowInMonth('april');
        const may = wcig.getFoodsICanGrowInMonth('may');
        const june = wcig.getFoodsICanGrowInMonth('june');
        const july = wcig.getFoodsICanGrowInMonth('july');
        const august = wcig.getFoodsICanGrowInMonth('august');
        const september = wcig.getFoodsICanGrowInMonth('september');
        const october = wcig.getFoodsICanGrowInMonth('october');
        const november = wcig.getFoodsICanGrowInMonth('november');
        const december = wcig.getFoodsICanGrowInMonth('december');

        expect(january).toBeTruthy();
        expect(february).toBeTruthy();
        expect(march).toBeTruthy();
        expect(april).toBeTruthy();
        expect(may).toBeTruthy();
        expect(june).toBeTruthy();
        expect(july).toBeTruthy();
        expect(august).toBeTruthy();
        expect(september).toBeTruthy();
        expect(october).toBeTruthy();
        expect(november).toBeTruthy();
        expect(december).toBeTruthy();
    });

    it("gets {title,text} for given food & month ",()=>{
        const payload = wcig.getFoodFromKey("broad beans","january");
        expect(payload).toBeTruthy();
    });
});
