/**
 * Created by kwilsbach on 12/26/13.
 */
// building a central namespace for nutrisystem modules, functions, extensions, etc
// to register to.
// as of this date, 12/26/2013, jquery 1.9.1 is required for all files of this library
// and it is required to be use with noConflict set to global var jquery191

;(function(exports, $){
    var registry = {};

    exports.register = function(name, moduleDeclaration) {
        if (exports[name] === undefined) {
            exports[name] = moduleDeclaration;
        }
    };

}(window.Nutrisystem_JS = window.Nutrisystem_JS || {}, jquery191));