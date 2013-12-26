/**
 * Created by kwilsbach on 12/26/13.
 */
// building a central namespace for nutrisystem modules, functions, extensions, etc
// to register to.

;(function(exports, $){
    var registry = {};

    exports.register = function(name, moduleDeclaration) {
        if (exports[name] === undefined) {
            exports[name] = moduleDeclaration;
        }
    };

}(window.Nutrisystem_JS = window.Nutrisystem_JS || {}, jquery191));