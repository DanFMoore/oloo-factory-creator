describe('createFactory', function() {
    var createFactory = require('../lib/create-factory');

    describe('with a prototype without init or postInit methods', function () {
        beforeEach(function () {
            this.prototype = {
                inheritedValue: 6,
                getValue: function () {
                    return this.value;
                }
            };

            var factory = createFactory(this.prototype);

            // Can supply multiple objects from which to assign the properties
            this.object = factory(
                {
                    value: 'Test Value'
                },
                {
                    value2: 'Another Test Value'
                }
            )
        });

        it('should set the prototype as a prototype of the new object', function () {
            expect(this.prototype.isPrototypeOf(this.object)).toEqual(true);

            expect(this.object.hasOwnProperty('inheritedValue')).toEqual(false);
            expect(this.object.inheritedValue).toEqual(6);

            expect(this.object.hasOwnProperty('getValue')).toEqual(false);
            expect(this.object.getValue()).toEqual('Test Value');
        });

        it('should set the properties passed in onto the new object', function () {
            expect(this.object.hasOwnProperty('value')).toEqual(true);
            expect(this.object.value).toEqual('Test Value');

            expect(this.object.hasOwnProperty('value2')).toEqual(true);
            expect(this.object.value2).toEqual('Another Test Value');
        });
    });

    describe('with a prototype with a postInit method', function () {
        beforeEach(function () {
            this.prototype = {
                postInit: function () {
                    expect(this.value).toEqual('Test Value');
                }
            };

            spyOn(this.prototype, 'postInit').andCallThrough();

            var factory = createFactory(this.prototype);

            this.object = factory({
                'value': 'Test Value'
            });
        });

        it('should set the prototype as a prototype of the new object', function () {
            expect(this.prototype.isPrototypeOf(this.object)).toEqual(true);
        });

        it('should call postInit after setting the properties', function () {
            expect(this.prototype.postInit).toHaveBeenCalledWith();
        });
    });

    describe('with a prototype with an init method', function () {
        beforeEach(function () {
            this.prototype = {
                init: jasmine.createSpy('init')
            };

            var factory = createFactory(this.prototype);
            this.object = factory('Test Value', 'Another Test Value');
        });

        it('should set the prototype as a prototype of the new object', function () {
            expect(this.prototype.isPrototypeOf(this.object)).toEqual(true);
        });

        it('should call init with the parameters passed in to the factory', function () {
            expect(this.prototype.init).toHaveBeenCalledWith('Test Value', 'Another Test Value');
        });
    });
});
