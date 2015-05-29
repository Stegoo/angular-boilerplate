(function () {

    'use strict';
    /*
     * Remove every occurence of the character 'c' in the 'v' string.
     */
    window.rtrim = function rtrim(v, c) {
        if (typeof c === 'undefined')
            c = '\n\r\t';
        while (v.length && c.indexOf(v.charAt(v.length - 1)) !== -1)
            v = v.substr(0, v.length - 1);
        return v;
    };

    window.ltrim = function ltrim(v, c) {
        if (typeof c === 'undefined')
            c = '\n\r\t';
        while (v.length && c.indexOf(v.charAt(0)) !== -1)
            v = v.substr(1, v.length);
        return v;
    };

    window.trim = function trim(v, c) {
        return ltrim(rtrim(v, c), c);
    };

    window.baseUrl = function baseUrl(file) {
        return /*window.path_static_files +*/ 'app/' + file;
    };

    window.slugify = function slugify(text)
    {
        if (!text)
            return undefined;
        return text
            .toLowerCase()
            .replace(/[^\w ]+/g,'')
            .replace(/ +/g,'-');
    };

})();