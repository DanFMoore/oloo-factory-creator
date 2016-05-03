'use strict';

/**
 * Create a factory method for creating an object from a prototype.
 * Uses the OLOO pattern (Objects Linking to Other Objects).
 *
 * If the prototype has an init() method, it will be passed the variadic arguments by the factory function,
 * otherwise they will be assigned to the new object in bulk using Object.assign().
 *
 * If the prototype has a postInit() method, this will be called with no arguments after initialisation has completed.
 *
 * @param {Object} proto
 * @returns {Function}
 */
module.exports = function createFactory(proto) {
    /**
     * @param {...Object} arguments If proto has an init(), pass to it, otherwise assign the properties
     * @return {Object}
     */
    return function factory () {
        var object = Object.create(proto);
        var args = Array.from(arguments);

        if (typeof object.init === 'function') {
            object.init.apply(object, args);
        } else if (args.length) {
            Object.assign.apply(Object, [object].concat(args));

            if (typeof object.postInit === 'function') {
                object.postInit();
            }
        }

        return object;
    }
};