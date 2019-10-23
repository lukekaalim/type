# Basic Example

Source Code:
```js
const main = (
  isNumber: boolean,
) => {
  if (isNumber === true) {
    return 100;
  }
  return 200;
};
```
Program Statements:
```
{ type: declare-type, id: 0 }
{ type: declare-program, id: 1, argument: 0, statements: [
  { type: declare-type, id: 2 }
  { type: declare-instance, typeId: 2, id: 3 }
  { type: branch, instanceId: 3,  }
] }
```
Parse Strategy
```
isNumber is an argument, it's also either `true` or `false`.
At the if() statement, there's a block of code
for the variants of the instance given to if (isNumber) that are equvilent to `true`,
  We execute a seperate block of code

```