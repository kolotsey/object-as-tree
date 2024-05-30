# Object as Tree

A lightweight utility for visualizing JavaScript/TypeScript objects in a tree structure.

## Table of Contents

- [Installation](#installation)
- [Features](#features)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Installation

You can install the object-as-tree package via npm:

```
npm install object-as-tree
```

## Features

- Handles objects, arrays, maps, sets, and other data structures.

- Provides info on RegExp, Date, and other special objects.

- Provides a clear tree representation for easy debugging.

- Detects circular references.

- No dependencies.

## Usage

```js
import asTree from 'object-as-tree';

const myObject= {
    a: 1,
    b: "Hello World!",
    c: {
        d: true,
        e: null
    },
    f:new Date('2021-01-01'),
    g:[1,2,3],
};

console.log(asTree(myObject));
```

Will produce a tree representation of the object:

```
{}
├─• a=1
├─• b="Hello World!"
├─• c{}
│ ├─• d=true
│ └─• e=null
├─• f{} // Date 2021-01-01T00:00:00.000Z
└─• g[3]
  ├─• 1
  ├─• 2
  └─• 3
```

## Contributing

Contributions are welcome.

## License

This project is licensed under the MIT License - see the LICENSE file for details.