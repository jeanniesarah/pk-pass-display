(function (angular, moment) {
    angular.module('pk-pass-display').component('pkApplePassField', {
        controller: ["$sce", "$element", PKApplePassFieldController],
        templateUrl:"apple-pass-field.html",
        bindings: {
            field: '<',
            lang: '<'
        }
    });

    function PKApplePassFieldController($sce, $element) {
        var ctrl = this;
    
        ctrl.$onChanges = onChanges;

        function onChanges(changesObj) {
            if (changesObj.hasOwnProperty("field") && ctrl.field != undefined) {
                fieldChange(ctrl.field);
            }
            if (changesObj.hasOwnProperty("lang") && ctrl.lang != undefined) {
                languageChange(ctrl.lang);
            }
        }

        //scope funcs
        ctrl.getValue = getValue;

        var TextAlignmentMap = {
            "PKTextAlignmentLeft":"left",
            "PKTextAlignmentCenter":"center",
            "PKTextAlignmentRight":"right",
            "PKTextAlignmentNatural":"justify"
        };
        
        var DateStyleMap = {
            "PKDateStyleNone":"none",
            "PKDateStyleShort":"short",
            "PKDateStyleMedium":"medium",
            "PKDateStyleLong":"long",
            "PKDateStyleFull":"full"
        };
        
        var CurrencyMap = {"AED":"د.إ.‏","AFN":"؋","ALL":"Lek","AMD":"դր.","ANG":false,"AOA":false,"ARS":"$","AUD":"$","AWG":false,"AZN":"man.","BAM":"KM","BBD":false,"BDT":"৳","BGN":"лв.","BHD":"د.ب.‏","BIF":false,"BMD":false,"BND":"$","BOB":"Bs","BOV":false,"BRL":"R$","BSD":false,"BTN":"Nu.","BWP":"P","BYR":"","BZD":"$","CAD":"$","CDF":false,"CHE":false,"CHF":"Fr.","CHW":false,"CLF":false,"CLP":"$","CNY":"￥","COP":"$","COU":false,"CRC":"₡","CUC":false,"CUP":false,"CVE":false,"CZK":"Kč","DJF":"Fdj","DKK":"kr","DOP":"RD$","DZD":"د.ج.‏","EGP":"ج.م.‏","ERN":"Nfk","ETB":false,"EUR":"€","FJD":false,"FKP":false,"GBP":"£","GEL":"","GHS":"GH₵","GIP":false,"GMD":false,"GNF":false,"GTQ":"Q","GYD":false,"HKD":"$","HNL":"L","HRK":"kn","HTG":false,"HUF":"Ft","IDR":"Rp","ILS":"₪","INR":"रु.","IQD":"د.ع.‏","IRR":"﷼","ISK":"kr","JMD":"$","JOD":"د.أ.‏","JPY":"￥","KES":false,"KGS":"сом","KHR":"៛","KMF":false,"KPW":false,"KRW":"₩","KWD":"د.ك.‏","KYD":false,"KZT":false,"LAK":"₭","LBP":"ل.ل.‏","LKR":"SL Re","LRD":false,"LSL":false,"LTL":"Lt","LVL":"Ls","LYD":"د.ل.‏","MAD":"د.م.‏","MDL":"","MGA":false,"MKD":"","MMK":"K","MNT":"₮","MOP":"MOP$","MRO":false,"MUR":false,"MVR":"ރ.","MWK":"","MXN":"$","MXV":false,"MYR":"RM","MZN":false,"NAD":false,"NGN":false,"NIO":"C$","NOK":"kr","NPR":"नेरू","NZD":"$","OMR":"ر.ع.‏","PAB":"B/.","PEN":"S/.","PGK":false,"PHP":"₱","PKR":"روپے","PLN":"zł","PYG":false,"QAR":"ر.ق.‏","RON":"RON","RSD":"дин.","RUB":"руб.","RWF":"RF","SAR":"ر.س.‏","SBD":false,"SCR":false,"SDG":"","SEK":"kr","SGD":"$","SHP":false,"SLL":false,"SOS":false,"SRD":false,"SSP":false,"STD":false,"SYP":"ل.س.‏","SZL":false,"THB":"฿","TJS":"сом","TMT":false,"TND":"د.ت.‏","TOP":"T$","TRY":"TL","TTD":"$","TWD":"NT$","TZS":"TSh","UAH":"₴","UGX":false,"USD":"$","USN":false,"USS":false,"UYI":false,"UYU":"$","UZS":"сўм","VEF":"Bs.F.","VND":false,"VUV":false,"WST":false,"XAF":false,"XAG":false,"XAU":false,"XBA":false,"XBB":false,"XBC":false,"XBD":false,"XCD":false,"XDR":false,"XFU":false,"XOF":"CFA","XPD":false,"XPF":false,"XPT":false,"XTS":false,"XXX":false,"YER":"ر.ي.‏","ZAR":"R","ZMK":false,"ZWL":false,"EEK":"kr"};
        
        var NumberStyleMap = {
            "PKNumberStyleDecimal":"decimal",
            "PKNumberStylePercent":"percent",
            "PKNumberStyleScientific":"scientific",
            "PKNumberStyleSpellOut":"spell",
        };
            
        function fieldChange(val) {
            if(val != null) {
                if(val.hasOwnProperty("textAlignment")) {
                    textAlign($element,TextAlignmentMap[val.textAlignment]);
                }
                if(val.hasOwnProperty("dateStyle")) {
                    /*
                        `json:"dateStyle,omitempty"`
                        `json:"ignoresTimeZone,omitempty"`
                        `json:"isRelative,omitempty"`
                        `json:"timeStyle,omitempty"`
                    */
                    ctrl.field.value = timeFormatValue(val.value, DateStyleMap[val.dateStyle]);
                }
                if(val.hasOwnProperty("currencyCode")) {
                    if(CurrencyMap[val.currencyCode]) {
                        ctrl.field.value = CurrencyMap[val.currencyCode] + val.value;
                    } else {
                        ctrl.field.value = val.currencyCode + val.value;
                    }
                }
                if(val.hasOwnProperty("numberStyle")) {
                    ctrl.field.value = numberFormat(val.value, NumberStyleMap[val.numberStyle]);
                }
            }
        }

        function languageChange(val) {
            if(val != null) {
                if(val.hasOwnProperty('text')) {
                    // sort the key to avoid substring is replaced before
                     // the whole string

                    var sortedKeys = [];
                    for (var key in val.text) {
                        if (val.text.hasOwnProperty(key)) {
                            sortedKeys.push(key);
                        }
                    }

                    // sort keys by text length to avoid substring is replaced randomly
                    sortedKeys.sort(function(a, b){
                        // ASC  -> a.length - b.length 
                        // DESC -> b.length - a.length 
                        return b.length - a.length; 
                    });

                    sortedKeys.forEach(function(key){
                        if (val.text.hasOwnProperty(key) && typeof ctrl.field !== "undefined") {
                            if(ctrl.field.hasOwnProperty("value")) {
                                ctrl.field.value = replaceAll(ctrl.field.value, key, val.text[key]);
                            }
                            if(ctrl.field.hasOwnProperty("label")) {
                                ctrl.field.label = replaceAll(ctrl.field.label, key, val.text[key]);
                            }
                            if(ctrl.field.hasOwnProperty("attributedValue")) {
                                ctrl.field.attributedValue = replaceAll(ctrl.field.attributedValue, key, val.text[key]);
                            }
                        }
                    })
                }
            }
        }
            
        function getValue(field) {
            var text = "";
            if(field != null) {
                if(field.hasOwnProperty("attributedValue")) {
                    text = field.attributedValue;
                } else {
                    text = field.value;
                }
            }
            return $sce.trustAsHtml(text.toString().replace(/\n/g, "<br>"));
        }
        
        function textAlign(e,alignment) {
            e.css('text-align', alignment);
        }
        
        //FIXME need to implement number format switch;
        function numberFormat(value, format) {
            switch(format) {
            case 'percent':
                return value+"%";
            default:
                return value;
            }
        }
        
        function timeFormatValue(date, style) {
            var format;
            switch(style) {
            case 'full': // Wednesday, July 17, 2019
                format = 'LLLL';
                break;
            case 'long': // July 17, 2019
                format = 'LL';
                break;
            case 'medium': // Jul 17, 2019
                format = 'll';
                break;
            case 'short': // 7/17/19 (short)
                format = 'l';
                break;
            default:
                return date;
            }
            return moment(date).format(format);
        }

        function replaceAll(string, find, replaceString) {
            var regescaped = find.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
            return new String(string).replace(new RegExp(regescaped, 'g'), replaceString);
        }
    }
})(window.angular, window.moment);