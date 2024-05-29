# Object as Tree

A lightweight utility for visualizing JavaScript/TypeScript objects in a tree structure.

## Table of Contents

- [Installation](#installation)
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

const myObject = {
  name: 'John Doe',
  age: 30,
  address: {
    street: '123 Main St',
    city: 'Anytown',
  },
};

console.log( asTree(myObject));
```

## Contributing

Contributions are welcome.

## License

This project is licensed under the MIT License - see the LICENSE file for details.