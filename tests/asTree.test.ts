import asTree from '../src';


test('prints empty input correctly', () => {
    const result = asTree();
    expect(result).toBe('undefined');
});

test('prints null correctly', () => {
    const result = asTree(null);
    expect(result).toBe('null');
});

test('prints undefined correctly', () => {
    const result = asTree(undefined);
    expect(result).toBe('undefined');
});

test('prints number correctly', () => {
    const result = asTree(123);
    expect(result).toBe('123');
});

test('prints Number correctly', () => {
    const result = asTree(new Number(123));
    expect(result).toBe('123 //Number object');
});

test('prints NaN correctly', () => {
    const result = asTree(NaN);
    expect(result).toBe('NaN');
});

test('prints Infinity correctly', () => {
    const result = asTree(Infinity);
    expect(result).toBe('Infinity');
});

test('prints -Infinity correctly', () => {
    const result = asTree(-Infinity);
    expect(result).toBe('-Infinity');
});

test('prints "" correctly', () => {
    const result = asTree('');
    expect(result).toBe('""');
});

test('prints string correctly', () => {
    const result = asTree('Hello, World!');
    expect(result).toBe('"Hello, World!"');
});

test('prints string with new line correctly', () => {
    const result = asTree('Hello\r\nWorld!');
    expect(result).toBe('"Hello\\r\\nWorld!"');
});

test('prints string with quotes correctly', () => {
    const result = asTree('\'Hello\' "World"!');
    expect(result).toBe('"\'Hello\' \\"World\\"!"');
});

test('prints String correctly', () => {
    const result = asTree(new String('Hello, World!'));
    expect(result).toBe('"Hello, World!" //String object');
});

test('prints boolean correctly', () => {
    const result = asTree(true);
    expect(result).toBe('true');
});

test('prints Boolean correctly', () => {
    const result = asTree(new Boolean(true));
    expect(result).toBe('true //Boolean object');
});

test('prints object in object correctly', () => {
    const result = asTree({
        name: new String('John'),
        age: new Number(30),
        married: new Boolean(true),
        birthday: new Date('2021-01-01'),
    });
    expect(result).toBe(`\
{}
├─• name="John" //String object
├─• age=30 //Number object
├─• married=true //Boolean object
└─• birthday{} //Date 2021-01-01T00:00:00.000Z`);
});

test('prints empty array correctly', () => {
    const result = asTree([]);
    expect(result).toBe('[0]');
});

test('prints array correctly', () => {
    const result = asTree([1, 2, 3]);
    expect(result).toBe(`\
[3]
├─• 1
├─• 2
└─• 3`);
});

test('prints map correctly', () => {
    var map=new Map();
    map.set('name', 'John');
    map.set('age', 30);
    const result = asTree(map);
    expect(result).toBe(`\
[2] //Map
├─• name="John"
└─• age=30`);
});

test('prints map with nested map correctly', () => {
    var map=new Map();
    map.set('name', 'John');
    var addressMap=new Map();
    addressMap.set('city', 'New York');
    addressMap.set('zip', 10001);
    map.set('address', addressMap);
    const result = asTree(map);
    expect(result).toBe(`\
[2] //Map
├─• name="John"
└─• address[2] //Map
  ├─• city="New York"
  └─• zip=10001`);
});

test('prints map with non-string keys correctly', () => {
    var map=new Map();
    map.set([1,2], 'John');
    map.set({a:'a', b:'b'}, 30);
    const result = asTree(map);
    expect(result).toBe(`\
[2] //Map
├─• 1,2="John"
└─• [object Object]=30`);
});

test('prints set correctly', () => {
    const set = new Set([1, 2, 3]);
    const result = asTree(set);
    expect(result).toBe(`\
[3] //Set
├─• 1
├─• 2
└─• 3`);
});

test('prints empty object correctly', () => {
    const result = asTree({});
    expect(result).toBe('{}');
});

test('prints object correctly', () => {
    const result = asTree({ name: 'John', age: 30 });
    expect(result).toBe(`\
{}
├─• name="John"
└─• age=30`);
});

test('prints date correctly', () => {
    const result = asTree(new Date('2021-01-01'));
    expect(result).toBe('{} //Date 2021-01-01T00:00:00.000Z');
});

test('prints regexp correctly', () => {
    const result = asTree(/test/);
    expect(result).toBe('{} //RegExp /test/');
});

test('prints error correctly', () => {
    const result = asTree(new Error('Error message'));
    expect(result).toBe('{} //Error "Error message"');
});

test('prints function correctly', () => {
    const result = asTree(function test() {});
    expect(result).toBe('{} //function test()');
});

test('prints class correctly', () => {
    class Test {}
    const result = asTree(Test);
    expect(result).toBe('{} //class Test');
});

test('prints class instance correctly', () => {
    class Test {}
    const result = asTree(new Test());
    expect(result).toBe('{}');
});

test('prints class instance with properties correctly', () => {
    class Test {
        name = 'John';
        age = 30;
    }
    const result = asTree(new Test());
    expect(result).toBe(`\
{}
├─• name="John"
└─• age=30`);
});

test('prints object with nested object correctly', () => {
    const result = asTree({ name: 'John', address: { city: 'New York', zip: 10001 } });
    expect(result).toBe(`\
{}
├─• name="John"
└─• address{}
  ├─• city="New York"
  └─• zip=10001`);
});

test('prints Record correctly', () => {
    const record:Record<string, string|number> = { name: 'John', age: 30 };
    const result = asTree({ name: 'John', age: 30 });
    expect(result).toBe(`\
{}
├─• name="John"
└─• age=30`);
});

test('detects circular reference', () => {
    const obj:any = { name: 'John' };
    obj['self'] = obj;
    const result = asTree(obj);
    expect(result).toBe(`\
{}
├─• name="John"
└─• self{} //Circular reference`);
});

test('detects circular reference in array', () => {
    const obj:any = [1, 2, 3];
    obj.push(obj);
    const result = asTree(obj);
    expect(result).toBe(`\
[4]
├─• 1
├─• 2
├─• 3
└─• [] //Circular reference`);
});

test('handles same object without circular reference', () => {
    const obj:any = { name: 'John' };
    const result = asTree([obj, obj]);
    expect(result).toBe(`\
[2]
├─• {}
│ └─• name="John"
└─• {}
  └─• name="John"`);
});
