//客户端检测

var client = function(){

    //呈现引擎
    var engine = {
        opera: 0,
        webkit: 0,
        konq: 0,
        gecko: 0,
        ie: 0,
        //具体版本（字符串）
        ver: null
    };

    //浏览器
    var browser = {
        opera: 0,
        safari: 0,
        chrome: 0,
        khtml: 0,
        firefox: 0,
        ie: 0,
        //浏览器具体版本（字符串）
        ver: null
    };

    //平台、设备和操作系统
    var system = {
        win: false,
        mac: false,
        x11: false,

        //移动设备
        iphone: false,
        ipad: false,
        ipod: false,
        ios: false,
        android: false,
        nokiaN: false,
        winMobile: false,

        //游戏系统
        wii: false,
        playstation: false
    };

    //检测呈现引擎和浏览器
    var userAgent = window.navigator.userAgent;
    if (window.opera) {
        engine.ver = window.opera.version();
        engine.opera = parseFloat(engine.ver);
        browser.opera = engine.opera;
    } else if (/AppleWebKit\/(\S+)/.test(userAgent)) {
        engine.ver = RegExp['$1'];
        engine.webkit = parseFloat(engine.ver);

        //确定是Chrome还是Safari
        if (/Chrome\/(\S+)/.test(userAgent)) {
           browser.ver = RegExp['$1'];
           browser.chrome = parseFloat(browser.ver); 
        } else if (/Version\/(\S+)/.test(userAgent)) {
            browser.ver = RegExp['$1'];
            browser.safari = parseFloat(browser.ver);
        }  else {
            //近似地确定版本号
            var safariVersion = 1;
            if (engine.webkit < 100) {
                safariVersion = 1;       
            } else if (engine.webkit < 312) {
                safariVersion = 1.2;
            } else if (engine.webkit < 412) {
                safariVersion = 1.3;
            } else {
                safariVersion = 2;
            }
            browser.safari = browser.ver = safariVersion;
        }
    } else if (/KHTML\/(\S+)/.test(userAgent) || /Konqueror\/([^;]+)/.test(userAgent)) {
        engine.ver = RegExp['$1'];
        engine.konq = parseFloat(engine.ver);
        browser.khtml = engine.konq;
    } else if (/rv:([^\)]+)\)\s?Gecko\/\d{8}/.test(userAgent)) {
        engine.ver = RegExp['$1'];
        engine.gecko = parseFloat(engine.ver); 
        if(/Firefox\/(\S+)/.test(userAgent)) {
            browser.ver = RegExp['$1'];
            browser.firefox = parseFloat(browser.browser.ver);
        }
    } else if (/MSIE ([^;]+)/.test(userAgent)) {
        engine.ver = RegExp['$1'];
        engine.ie = parseFloat(engine.ver);
        browser.ver = engine.ver;
        browser.ie = engine.ie;
    }

    //检测平台
    var platform = window.navigator.platform;
    system.win = platform.indexOf("Win") == 0;
    system.mac = platform.indexOf("Mac") == 0;
    system.x11 = (platform == "X11") || (platform.indexOf("Linux") == 0);
    
    //检测Windows操作系统
    if (system.win) {
        if(/Win(?:dows )?([^do]{2})\s?(\d+\.\d+)?/.test(userAgent)) {
            if (RegExp['$1'] == 'NT') {
                switch(RegExp['$2']) {
                    case '5.0':
                        system.win = "2000";
                        break;
                    case '5.1':
                        system.win = "XP";
                        break;
                    case '6.0':
                        system.win = "Vista";
                        break;
                    case '6.1':
                        system.win = '7';
                        break;
                    case '10.0':
                        system.win = '10';
                        break;
                    default:
                        system.win = 'NT';
                        break;
                }
            } else if (RegExp['$1'] == "9x") {
                system.win = "ME";
            } else {
                system.win = RegExp['$1'];
            };
        };
    };

    //移动设备
    system.iphone = userAgent.indexOf("iPhone") > -1;
    system.ipod = userAgent.indexOf("iPod") > -1;
    system.ipad = userAgent.indexOf("iPad") > -1;
    system.nokiaN = userAgent.indexOf('NokiaN') > -1;

    //Windows Phone
    if (system.win == "CE") {
        system.winMobile = system.win;
    } else if (system.win == "Ph") {
        if(/Windows Phone OS (\d+\.\d+)/.test(userAgent)) {
            system.win = "Phone";
            system.winPhone = parseFloat(RegExp['$1']);
        }
    };

    //检测iOS版本
    if (system.mac && userAgent.indexOf("Mobile") > -1) {
        if (/CPU (?:iPhone)?OS (\d+_\d+)/.test(userAgent)) {
            system.ios = parseFloat(RegExp['$1'].replace("_", "."));
        } else {
            system.ios = 2; //如果不能真正检测出来，只能靠猜
        }
    };

    //检测安卓系统
    if (/Android (\d+\.\d+)/.test(userAgent)) {
        system.android = parseFloat(RegExp['$1']);
    };

    //游戏系统
    system.wii = userAgent.indexOf("Wii") > -1;
    system.playstation = /playstation/i.test(userAgent);

    return {
        engine: engine,
        browser: browser,
        system: system
    };

}();