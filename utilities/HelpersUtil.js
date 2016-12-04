module.exports = function HelpersUtil(
    config,
    moment
) {
    "use strict";

    var self = this;

    this.config = config;
    this.moment = moment.module;

    this.toIso8601Date = function(dateValue){
        return self.moment(dateValue).format();
    };

    this.convertToIso8601Date = function(dateValue){
        var now = new Date(dateValue);
        return self.moment(now).utc().toISOString();
    };

    this.toIso8601DateNeutral = function(dateValue){
        var dateMoment = self.moment(dateValue);
        var existingOffsetMins = dateMoment.utcOffset();
        return dateMoment.utcOffset(0).add(existingOffsetMins, 'm').format();
    };

    this.toIso8601Time = function(dateValue){
        return self.moment(dateValue).year(1970).month(0).date(1).format();
    };

    this.toIso8601TimeNeutral = function(dateValue){
        var dateMoment = self.moment(dateValue);
        var existingOffsetMins = dateMoment.utcOffset();
        return dateMoment.utcOffset(0).add(existingOffsetMins, 'm').year(1970).month(0).date(1).format();
    };

    this.fromIso8601Date = function(dateString){
        return self.moment(dateString, self.moment.ISO_8601).toDate();
    };

    this.fromIso8601DateToUTC = function(dateString){
        return self.moment(dateString, self.moment.ISO_8601).utc();
    };

    this.formatDate = function(date){
        return self.moment(date).format('YYYY-MM-DD');
    };

    this.getCurrentUTCDate = function(){
        var now = Date.now();
        return self.moment(now).utc().toISOString();
    };

    this.getUTCDate = function(date){
        return self.moment.utc(date).toISOString();
    };

    this.getCurrentUTCFormattedDate = function(timeZone)
    {
        var moment =  self.moment().utc();
        return moment.format('YYYY-MM-DDTHH:mm:ss[Z]')


    };

    this.getCurrentFormattedDate = function(timeZone)
    {
        var moment =  self.moment().utc();
        return moment.format('YYYY-MM-DD');
    };

    this.getCurrentFormattedTime = function(timeZone)
    {
        var moment =  self.moment().utc();
        return moment.format('HH:mm:ss');
    };
    this.addPeriod = function(date,number, period) {
        return self.moment(date, "YYYY-MM-DD").add(number, period).format("YYYY-MM-DD");
    };

    this.addPeriodToCurrentFormattedTime = function(number, period) {
        var moment =  self.moment().utc();
        return moment.add(number, period).format("YYYY-MM-DDTHH:mm:ss[Z]");
    };

    this.subtractPeriod = function(date,number, period) {
        return self.moment(date, "YYYY-MM-DD").subtract(number, period).format("YYYY-MM-DD");
    };

    this.substractPeriodToCurrentFormattedTime = function(number, period) {
        var moment =  self.moment().utc();
        return moment.subtract(number, period).format("YYYY-MM-DD");
    };

    this.subtractPeriodFormatted = function(date,number, period) {
        var moment =  self.moment(date).utc();
        moment = moment.format('YYYY-MM-DD');
        moment = moment+' 00:00:00';
        return self.moment(moment).subtract(number, period).format("YYYY-MM-DDTHH:mm:ss[Z]");
    };

    this.getYesterdayStartTime = function() {
        var moment =  self.moment().utc();
        moment = moment.format('YYYY-MM-DD');
        moment = moment+' 00:00:00';
        return self.moment(moment).subtract(1, 'days').format("YYYY-MM-DDTHH:mm:ss[Z]");
    };

    this.getYesterdayEndTime = function() {
        var moment =  self.moment().utc();
        moment = moment.format('YYYY-MM-DD HH:mm:ss');
        moment = moment+' 23:59:59';
        return self.moment(moment).subtract(1, 'days').format("YYYY-MM-DDTHH:mm:ss[Z]");
    };

    this.getDayStartTime = function(date) {
        var moment =  self.moment();
        moment = moment.format('YYYY-MM-DD');
        moment = moment+' 00:00:00';
        return self.moment(moment).format("YYYY-MM-DDTHH:mm:ss[Z]");
    };

    this.getDayEndTime = function(date) {
        var moment =  self.moment(date);
        moment = moment.format('YYYY-MM-DD');
        moment = moment+' 23:59:59';
        return self.moment(moment).format("YYYY-MM-DDTHH:mm:ss[Z]");
    };
    /**
     * For medication adherence checks, takes a time to check against with a time period that should
     * be added and it will be checked whether the given time is within that time period after the
     * time that is being copmared.
     * @param checkTime
     * @param compareToTime
     * @param timePeriod
     * @returns {*}
     */
    this.checkIsWithinGivenPeriod = function(checkTime, compareToTime, timePeriod) {
        checkTime = self.moment(checkTime);
        compareToTime = self.moment(compareToTime);
        if (checkTime.isBefore(compareToTime)) {
            return self.config.blister.adherence.early;
        } else if (checkTime.isAfter(compareToTime.add(timePeriod, 'm'))) {
            return self.config.blister.adherence.late;
        } else {
            return self.config.blister.adherence.ontime;
        }
    };

    // Takes an ISO 8601 Date string and separates the date and time
    this.separateDateAndTime = function(dateAndTime) {
        var returnDate = moment(date);
        return { date: returnDate.format("YYYY-MM-DD"), time: returnDate.format("HH:mm:ss")};
    };

    this.convertTimestampToISO = function(timestamp) {
        return self.moment(timestamp).format("YYYY-MM-DDTHH:mm:ss[Z]");
    };

    this.resultSet = function(queryResults){
        if(queryResults && Array.isArray(queryResults) && queryResults.length > 0) {
            var documents = queryResults[0].docs;
            if(documents && documents.length > 0){
                return documents;
            }

        }
        return null;
    };

    this.findOne = function(queryResults){
        if(queryResults && queryResults.docs && Array.isArray(queryResults.docs) && queryResults.docs.length > 0) {
            var documents = queryResults.docs;
                return documents[0];
        }
        return null;
    };
    /**
     * Takes an object with a key/value pair and returns it as an object
     * @param keyObj
     * @returns {*}
     */
    this.findKey = function(obj, keyObj) {
        return findKey(obj, keyObj);
    };

    function findKey(obj, keyObj) {
        var p, key, val, tRet;
        for (p in keyObj) {
            if (keyObj.hasOwnProperty(p)) {
                key = p;
                val = keyObj[p];
            }
        }

        for (p in obj) {
            if (p === key) {
                if (obj[p] === val) {
                    return obj;
                }
            } else if (obj[p] instanceof Object) {
                if (obj.hasOwnProperty(p)) {
                    tRet = findKey(obj[p], keyObj);
                    if (tRet) { return tRet; }
                }
            }
        }

        return false;
    }
    this.resultViewSet = function(queryResults){
        if(queryResults && Array.isArray(queryResults) && queryResults.length > 0) {
            var documents = queryResults[0].rows;
            if(documents && documents.length > 0){
                return documents;
            }

        }
        return null;
    };

    this.bulkResultSet = function(queryResults) {
        if(queryResults && Array.isArray(queryResults) && queryResults.length > 0) {
            var documents = queryResults[0];
            if(documents && documents.length > 0){
                return documents;
            }

        }
        return null;
    };

    this.resultMetaSet = function(queryResults){
        if(queryResults && Array.isArray(queryResults) && queryResults.length > 0) {
            var updateStatus = queryResults[0].ok;
                return updateStatus;


        }
        return null;
    };

    this.resultInsertionMetaSet = function(queryResults){
        if(queryResults && Array.isArray(queryResults) && queryResults.length > 0) {
            var insertMeta = queryResults[0];
            return insertMeta;


        }
        return null;
    };


    this.toModelVal = function(val, format){
        if(typeof(val) === "undefined"){
            return null;
        }
        else if(val != null)
        {
            if (Array.isArray(val) && val.length === 0) {
                return null;
            }
            else if(format === 'date'){
                return self.toIso8601Date(val);
            }
            else if(format === 'ndate'){
                return self.toIso8601DateNeutral(val);
            }
            else if(format==="time") {
                return  self.toIso8601Time(val);
            }
            else if(format==="ntime") {
                return  self.toIso8601TimeNeutral(val);
            }
            else if (format === 'bool'){
                var isString = self.isString(val);
                if(isString && val === "true"){
                    return true;
                }
                else if(isString && val === "false"){
                    return false;
                }
                else {
                    return Boolean(val);
                }
            }
            else{
                return val;
            }
        }

        return null;
    };

    this.fromModelVal = function(val, format){
        if(typeof(val) === "undefined"){
            return null;
        }
        else if(val != null)
        {
            var type = typeof(val);
            if(format === 'bool'){
                var valStr = val.toString();
                if ((valStr) === 'true' || (valStr) === '1'){
                    return true;
                }
                else if((valStr) === 'false' || (valStr) === '0'){
                    return false;
                }
                else{
                    return null;
                }
            }
            else if(type === 'bool'){
                return ((val) ? 1 : 0);
            }
            else if(format === 'date'){
                return self.fromIso8601Date(val);
            }
            else if(format === 'utc'){
                return self.fromIso8601DateToUTC(val);
            }
            else if(format === 'num'){
                if(self.isNumeric(val)){
                    return Number(val);
                }
            }
            else{
                return val;
            }
        }

        return null;
    };


    this.generateRandomNumericCode = function (length) {
        var chars = '0123456789';
        var result = '';
        for (var i = length; i > 0; --i){ result += chars[Math.round(Math.random() * (chars.length - 1))];}
        return result;
    };

    this.stringFormat = function(format, args) {
        //var argumentsArray = Array.prototype.slice.apply(arguments);
        //if(argumentsArray.length > 1 ){
        //    var args;
        //    if(Array.isArray(argumentsArray[1])){
        //        args = argumentsArray[1];
        //    }
        //    else {
        //        args = Array.prototype.slice.call(arguments, 1);
        //    }
        //
        //    return format.replace(/{(\d+)}/g, function (match, number) {
        //        return typeof args[number] != 'undefined'
        //            ? args[number]
        //            : match
        //            ;
        //    });
        //}
        //else{
        //    return format;
        //}

        if(args) {
            return format.replace(/{(\d+)}/g, function (match, number) {
                return typeof args[number] !== 'undefined'? args[number]: match;
            });
        }
        else{
            return format;
        }
    };
    this.randomIntInc = function(low, high) {
        return Math.floor(Math.random() * (high - low + 1) + low);
    };
    this.isString = function(val){
        if(typeof(val) !== 'undefined' && val != null) {
            return (typeof val === 'string' || val instanceof String);
        }

        return false;
    };

    this.isNumeric = function(val) {
        if(typeof(val) !== 'undefined' && val != null) {
            return !isNaN(parseFloat(val)) && isFinite(val);
        }

        return false;
    };


    this.padLeft = function (val, paddedLength, padChar){
        return new Array(paddedLength - String(val).length + 1).join(padChar || ' ') + val;
    };

    this.toCurrency = function(val){
        if(typeof(val) === 'undefined' || val == null){
            return null;
        }

        var num = val.toString();
        if(num.indexOf(".") > 0){
            num = num.slice(0, (num.indexOf("."))+3);
        }

        return Number(num);
    };

    this.validateVariable = function(value){
        if(value === "" || value === " " || value === "undefined" || value === null){
            return null;
        } else{
            return value;
        }
    };

    this.validate = function(value, format){
        if(value === "" || value === " " || value === "undefined" || value === null){
            return null;
        } else{
            if(format === 'date'){
                return ((self.moment(value, 'YYYY-MM-DD', true).isValid()) ? value : null);
            }
            else if(format === 'time'){
                return ((self.moment(value, 'HH:mm:ss', true).isValid()) ? value : null);
            }
            else if(format === 'int'){
                return ((/^\+?[1-9][\d]*$/.test(value)) ? value : null);
            }
            return value;
        }
    };
    
    this.validatePeriod = function(value){
        if(!value){
            return self.config.period.daily;
        }else if(value == self.config.period.daily || value == self.config.period.weekly ||
            value == self.config.period.monthly || value == self.config.period.now){
            return value;
        }else {
            return self.config.period.daily;
        }
    };

    this.validatePeriodValue = function(period, value){

        if(period == self.config.period.daily && value){
            var reg = /^\d{4}-\d{2}-\d{2}$/ ;
            return reg.exec(value);

        } else if(period == self.config.period.daily && !value){
            var moment = self.moment().utc();
            return [moment.format('YYYY-MM-DD')];

        } else if(period == self.config.period.weekly && value){
            var reg = /^\d{2}$/ ;
            return reg.exec(value);

        } else if(period == self.config.period.weekly && !value){
            var moment = self.moment().utc();
            return [self.moment(self.subtractPeriod(moment,1, 'week')).week()];

        }else if(period == self.config.period.monthly && value){
            var reg = /^\d{4}-\d{2}$/ ;
            return reg.exec(value);

        } else if(period == self.config.period.monthly && !value){
            var moment = self.moment().utc();
            return [self.moment(self.subtractPeriod(moment,1, 'month')).format('YYYY-MM')];

        } else if(!period || !value){
            return moment;
        } else {
            var reg = /^\d{4}-\d{2}-\d{2}$/ ;
            return reg.exec(value);
        }
    };

    this.getCurrentPeriod = function(period){
        var now = Date.now();
        if(period == self.config.period.daily){
            return self.moment(now).utc().format('YYYY-MM-DD');
        } else if(period == self.config.period.weekly){
            return self.moment(now).utc().week();
        } else if(period == self.config.period.monthly){
            return self.moment(now).utc().format('YYYY-MM');
        } else{
            return self.moment(now).utc().format('YYYY-MM-DD');
        }

    };

    this.getDateAsParameters = function(dateString){
        var date = self.moment(dateString).utc();
        return [date.year(), date.month(), date.date(), date.hour(), date.minute(),date.second()];
    };

    this.validateDate = function(value) {

        if (value) {
            var reg = /^\d{4}-\d{2}-\d{2}$/;
            if(reg.exec(value)){
                value = value + 'T00:00:00Z';
                var moment = self.moment(value).utc();
                return [moment.year(), moment.month(), moment.date()];
            }
            return null;

        } else  {
            var moment = self.moment().utc();
            return [moment.year(), moment.month(), moment.date()];
        }
    }
};

module.exports.$inject = [
    'config',
    'moment'
];

