// @type

/*!
type ExampleSerivce = {
  performMySideEffect: number => void,
};
*/

//! () => ExapleService, void
const createExampleService = () => {
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
