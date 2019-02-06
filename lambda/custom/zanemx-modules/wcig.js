const moment = require('moment');
const foods = require('./Foods');
const zones =  require('./zones');
//const axios = require('axios');

module.exports = {


    /* 
     * get zip code 
     */
    getZipCode(System){
        if(System)false;

        //const {user,device,apiEndpoint,apiAccessToken} = System;
        //const url = `${apiEndpoint}/v1/devices/${device.deviceId}/settings/address/countryAndPostalCode`;

        // send request 
        //const options = {
        //method:'get',
        //headers:{
        //'Content-Type':'application/json',
        //'X-Amzn-RequestId':user.userId,
        //'Authorization':`Bearer ${apiAccessToken}`,
        //},
        //url:url
        //};
        //axios.get(url,{
        //'Content-Type':'application/json',
        //'X-Amzn-RequestId':user.userId,
        //'Authorization':`Bearer ${apiAccessToken}`,
        //}).then((response)=>{

        //console.log(response);
    },

    /* 
     * returns {string} pretty month name when given a string {string} id 1-12 representing months
     */
    _getPrettyMonthFromId(id){
        id--;
        return [
            'january', 'february', 'march',
            'april',   'may',      'june',
            'july',    'august',   'september',
            'october', 'november', 'december',
        ][id];
    },

    /*  
     * returns {zone value} given a {zip code} 
     */
    getZoneFromZip(zip){
        return zones[zip];
    },

    /*
     * Utterances that map to a specific date (such as "today", "now", or "november twenty-fifth")
     * convert to a complete date: 2015-11-25. Note that this defaults to dates on or after the
     * current date (see below for more examples).
     */
    getFoodForDate(when){
        let id = when.substring(when.indexOf('-')+1,when.lastIndexOf('-'));
        const month =  this._getPrettyMonthFromId(parseInt(id));
        return [month,this.getFoodsICanGrowInMonth(month)];
    },

    // Returns a array of foods you can grow this month 
    getFoodsICanGrowThisMonth(){
        const month = moment().format('MMMM').toLowerCase();
        const food = foods[month].map((item)=>{
            return item['title'];
        });
        return food;
    },

    // Get foods to grow in {month} 
    getFoodsICanGrowInMonth(month){
        month = month.toLowerCase();
        const food = foods[month].map((item)=>{
            return item['title'];
        });
        return food;
    },

    // return {title, text} object when passed (food,month) 
    getFoodFromKey(food,month){
        food = food.toLowerCase();

        const _foods = foods[month];
        for(const _food in _foods){
            const obj = _foods[_food];
            if(obj.title.toLowerCase()=== food){
                return obj;
            }
        }
        return null;
    }
};
