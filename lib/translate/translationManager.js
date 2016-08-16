/**
 * Created by pi on 7/22/16.
 */
var Language = require('../../Models/Um/Language');
var initialize =function () {
    var english = Language.findOrCreate(
        {
            where:
            {
                Ident: 'EN'
            },
            defaults:
            {
                Name:'English',
                IsActive: false
            }
        }
    ).spread(function (language,created) {
        console.log(language.get({
            plain: true
        }));
        console.log(created);
    });
    var chinese = Language.findOrCreate(
        {
            where:
            {
                Ident: 'CN'
            },
            defaults:
            {
                Name:'Chinese',
                IsActive: false
            }
        }
    ).spread(function (language,created) {
        console.log(language.get({
            plain: true
        }));
        console.log(created);
    });
};

module.exports = function (app) {
    // initialize();
    app.get('/getCurrentLang',function (req,res) {
        Language.findOne({where :{IsActive:true}}).then(function (lan) {
            var cur_Lang={};
            if(lan){
                cur_Lang= lan;
                res.send(cur_Lang);
            }
            else {
                //if not find the current language, just find the default language English,
                // and set it is as current language: en.IsActive = true;
                var english = Language.findOne(
                    {
                        where:
                        {
                            Ident: 'EN'
                        }

                    }
                ).then(function (en) {

                    en.IsActive = true;
                    en.save().then(function () {
                        res.send(cur_Lang);
                    });
                });
            }
        });

    });
    return {
        initialize: initialize
    }
};