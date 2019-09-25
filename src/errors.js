// @flow strict

class UnimplementedError extends Error {
  constructor(unimplementedFeatureName/*: string*/) {
    super(`This feature (${unimplementedFeatureName}) has not been implemented.`);
  }
}

module.exports = {
  UnimplementedError,
};