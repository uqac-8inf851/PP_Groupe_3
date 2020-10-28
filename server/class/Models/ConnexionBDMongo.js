const mongoose = require('mongoose')
const ConnexionPropertiesDB = require ('./ConnexionPropertiesDB')

var ConnexionBDMongo = ( () => {

    var database = ConnexionPropertiesDB.database

    var url = ConnexionPropertiesDB.url + database

    var options = ConnexionPropertiesDB.options

    var connexion = undefined
 
    function createInstance() {
        
        let connexion = mongoose.connect(url, options).then(() => 
        {
          console.log('DB Connected!')
    
        }).catch(err => {
    
          console.log(err);
        })

        return connexion;
    }
 
    return {

        getInstance: function () {

            if (!connexion) {

                connexion = createInstance();
            }
            return connexion;
        }
    };

})();

module.exports = ConnexionBDMongo