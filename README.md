# Object as Tree

A lightweight utility for visualizing JavaScript/TypeScript objects in a tree structure.

## Table of Contents

- [Installation](#installation)
- [Features](#features)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Installation

You can install the objectToTree package via npm:

```npm install object-as-tree```

## Features

- Handles objects, arrays, maps, sets, and other data structures.

- Provides a clear tree representation for easy debugging.

## Usage

```
const { asTree } = require('object-as-tree');

const myObject= {
    a: 1,
    b: "Hello World!",
    c: {
        d: true,
        e: null
    },
    f:[1,2,3]
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
└─• f[3]
  ├─• 1
  ├─• 2
  └─• 3
```

## Contributing

Contributions are welcome.

## License

This project is licensed under the MIT License - see the LICENSE file for details.