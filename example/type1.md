# Type1

```js
// @type

/*!
type ExampleSerivce = {
  performMySideEffect: number => void,
};
*/

//! () => ExapleService, void
const createExampleService = () => {
  const closureVariable = '';
  const performMySideEffect = (gamma) => {
    return void gamma;
  };
  return {
    performMySideEffect,
  };
};

export {
  createExampleService,
};
```

There should be 3 sawmill programs, one for the top level, and one for the createExampleService function, and one for it's inner performMySideEffect function.

The createExampleService and performMySideEffect should execute the moment when we get to the variable declarator, and the top level one should execute once we get to the end of the file.

