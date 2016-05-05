# OLOO Factory Creator

This library allows for the creation of factory functions for objects implementing the OLOO pattern (Objects Linking to Other Objects). This is an alternative to classes for object orientation. See [You Don't Know JS: this & Object Prototypes Chapter 6: Behavior Delegation](https://github.com/getify/You-Dont-Know-JS/blob/master/this%20%26%20object%20prototypes/ch6.md) for more information about the pattern.

Essentially this library allows a normal object notation syntax to be used for instantiation and inheritance instead of the horrible `FunctionName.prototype.method = function ()...` syntax or the ES6 `class` syntax and wraps the object creation up in a factory function. This has convenient functionality such as assigning properties automatically onto the new object and also hides the implementation details of how the object was created.

## Installation

### Node

Requires Node 4 due to requiring `Object.assign()`.

```
npm install oloo-factory-creator
```

### Browser

Download `dist/create-factory.min.js` or you  can install with bower:

```
bower install oloo-factory-creator
```

## Usage

In Node, import the `createFactory` function:
         
```javascript
var createFactory = require('oloo-factory-creator');
```

In the browser, import via the script tag, which creates a global function called `createFactory`:

```html
<script src="/path/to/dist/create-factory.min.js" type="text/javascript"></script>
```

### Automatically assign properties into the created objects

The easiest method of creating objects is just to pass an object (or multiple objects) into the factory that will have their properties copied into the created object.

```javascript
// The prototype for user objects
var User = {
    getName: function () {
        return this.name;
    }
};

var userFactory = createFactory(User);

// Create user objects with User as their prototype
var bob = userFactory({
    name: 'Bob'
});

var jim = userFactory({
    name: 'Jim'
});

// Accessing copied properties
console.log(bob.name); // Outputs "Bob"
console.log(jim.name); // Outputs "Jim"

// Calling prototyped methods
console.log(bob.getName()); // Outputs "Bob"
console.log(jim.getName()); // Outputs "Jim"
```

If you need to run some code after the object has been initialised with the passed in properties, you can specify a `postInit()` method in the prototype:

```javascript
var User = {
    postInit: function() {
        console.log('My name is ' + this.name);
    }
};

var userFactory = createFactory(User);

// This outputs "My name is Bob"
var bob = userFactory({
    name: 'Bob'
});
```

### Initialising created objects with an init() method

As an alternative, if an `init()` method is specified in the prototype, that will be used and properties will not be automatically assigned.

```javascript
var User = {
    init: function (name) {
        this.name = name;
    },
    getName: function () {
        return this.name;
    }
};

var bob = userFactory('Bob');

console.log(bob.name); // Outputs "Bob"
console.log(bob.getName()); // Outputs "Bob"
```

### Modules

With either of the above methods, if you're using modules, the recommended usage is to export the created factory method. For example, `user.js` could look like the following:

```javascript
var createFactory = require('oloo-factory-creator');

var User = {
    ...methods
};

module.exports = createFactory(User);
```

And then imported into in another module thus:

```javascript
var User = require('./user');

var user = User({
    name: 'Bob'
});

console.log(user.getName());
```

### Inheritance

In `OLOO` there is no difference between inheritance and instantiation.

## Testing

Simply clone the repository, run `npm install` and then run `npm test`. The tests are in `tests/create-factory-spec.js`.