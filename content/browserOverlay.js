/**
 * XULPHPsrcChrome namespace.
 */
if ("undefined" == typeof(XULPHPsrcChrome)) {
    var XULPHPsrcChrome = {};
}

/**
 * Controls the browser overlay.
 */
XULPHPsrcChrome.BrowserOverlay = {
    /**
     * craete screen shot by rect
     * @param aEvent
     */
    makeScreen: function (aEvent) {
        var date = new Date();
        var fileScreen = date.getTime().toString() + '_screen.png';

        var args = ["-s", "/tmp/" + fileScreen];

        this.systemRequest(
            '/usr/bin/scrot',
            args
        );

        this.uploadToYandex(fileScreen);
    },

    /**
     * analog php system
     * @param shell
     * @param args
     */
    systemRequest: function (shell, args) {
        var file = Components.classes["@mozilla.org/file/local;1"]
            .createInstance(Components.interfaces.nsIFile);

        file.initWithPath(shell);

        var process = Components.classes["@mozilla.org/process/util;1"]
            .createInstance(Components.interfaces.nsIProcess);
        process.init(file);

        process.run(true, args, args.length);
    },

    /**
     * upload screen to yandex
     * @param name
     */
    uploadToYandex: function (name) {
        var xml = '<propertyupdate xmlns="DAV:"><set><prop><public_url xmlns="urn:yandex:disk:meta">true</public_url></prop></set></propertyupdate>';
        var auth = this.getPreference().login + ':' + this.getPreference().pass;

        this.systemRequest('/usr/bin/curl', [
            '-s',
            '--user', auth,
            '-T', '/tmp/' + name,
            '-X', 'PUT',
            'https://webdav.yandex.ru'
        ]);

        this.systemRequest('/usr/bin/curl', [
            '-s',
            '--user', auth,
            '-d', xml,
            '-X', 'PROPPATCH',
            'https://webdav.yandex.ru/' + name
        ]);

        alert("Скриншот сохранён");
    },

    /**
     * get system configuration
     * @returns {{login: *, pass: *}}
     */
    getPreference: function () {
        var prefs = Components.classes["@mozilla.org/preferences-service;1"]
            .getService(Components.interfaces.nsIPrefService);
        var myPrefs = prefs.getBranch("extensions.xulphpsrc.");

        return {
            login: myPrefs.getCharPref('login'),
            pass: myPrefs.getCharPref('pass')
        }
    }
};
