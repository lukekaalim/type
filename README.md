# @lukekaalim/type

Experimental type system. Needs a better name.

## Contributing
Run the experimental test with `node test`.

## Design
To solve the problem of creating a good type system for javascript, we can break the problem
into two discrete sub-problems:

1. Creating a good model of a javascript program's intentions
2. Simulating that model in a constrained environment

We approach the first problem by running `acorn()` through our source code, producing an *estree* data structure. We then run that data structure through our 'javascript parser', which should emit a set of simple operations that we've defined.

Most actions in javascript can be though of as either invoking a sub-routine, or modifying some state. As long as state modification stays within defined bounds, and as long as the sub-routine doesn't violate any constraints, then we can be (somewhat) sure a javascript program is mostly correct.

We define a set of operations that out type system cares about:

1. Primitive creation. Javascript programs freely create primitives of multiple types, including number, strings, arrays and objects. We need to care when one of these is created and used in the program.
2. Sub-routine creation. Javascript allows the dynamic creation and invocation of functions, which can capture the scope of it's parent function as a *closure*.
3. Sub-routine invocation. Javascript executes a function, losing it's current scope but gaining another. We validate that the arguments are valid for that sub-routine's defenition, and handle the type of it's output.

So yeah. That's all JS does from the perspective of this program; assigns primitives and executes functions.

We constrain our problem space so it can be easily solvable, but more importantly, solvable _fast_.

### Lumber
Lumber is the tree-parser that transforms ESTree AST's into Sawmill-consumable statements. Lumber needs to keep track of all Javascript-related logic, creating and defining types for objects on-the-fly, transforming functions into Sawmill programs to learn their signatures and all other good stuff.

### Sawmill
Sawmill is the underlying engine that resolves type constrains. It is quite simple, only supporting a couple of operations. It operates on one statement at a time, validating whether that statement possible (detecting unsound code) and resolving and testing type constraints (autocomplete). It requires a starting state, and cannot parse normal javascript (at least, not without lumber).

It can:
  1. Keep track of values (which are instances of types)
  2. Perform assertions of values to see if they are compatible with other types
  3. Branch execution state on variant types to explore the full possibilities of every potential execution path

Sawmill returns an array of States, eagerly splitting the universe each time it observes a variant.

### Subroutines
A subroutine, subprogram, or **function**, is one of the most important building blocks of a program. The majority of operations
are some kind of subroutine invocation...

A subroutine has three parts in sawmill:

```
type assertion(...arguments);
polymorphic type generation(typeof ...arguments)
return instance generation
```

A returned instance
