/**
 * Created by pi on 8/2/16.
 */
module.exports = function ( sub, base ) {
    for ( var prop in base ) {
        sub[ prop ] = base[ prop ];
    }
    return sub;
};
