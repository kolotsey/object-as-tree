import { asTree } from '../src';


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

test('prints boolean correctly', () => {
    const result = asTree(true);
    expect(result).toBe('true');
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
