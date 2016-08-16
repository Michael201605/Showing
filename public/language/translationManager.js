/**
 * Created by lhf55 on 7/25/2016.
 */

var cur_lang ='';
$.getJSON('/getCurrentLang',function (lang) {
    cur_lang = lang;
});
