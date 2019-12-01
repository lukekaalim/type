// @flow strict

class UnimplementedError extends Error {
  constructor(unimplementedFeatureName/*: string*/) {
    super(`This feature (${unimplementedFeatureName}) has not been implemented.`);
  }
}

class UnknownTypeIDError extends Error {
  constructor() {
    super(`The provided type ID was not in the typemap`);
  }
}

const exported = {
  UnimplementedError,
  UnknownTypeIDError
};

export default exported;
export { UnimplementedError, UnknownTypeIDError };