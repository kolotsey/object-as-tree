import { dim, red, green, blue, bold, magenta } from "./color-output";

/**
 * Returns true if the object is a class
 * 
 * @param obj Any object to be checked
 * @returns True if the object is a class
 */
function isClass(obj: any): boolean {
    const isConstructorClass = obj.constructor && obj.constructor.toString().substring(0, 5) === 'class'
    if (obj.prototype === undefined) {
        return isConstructorClass
    }
    const isPrototypeConstructorClass = obj.prototype.constructor
        && obj.prototype.constructor.toString
        && obj.prototype.constructor.toString().substring(0, 5) === 'class'
    return isConstructorClass || isPrototypeConstructorClass
}

// Below functions are used to style the tree

function tree(s: string) {
    return dim(s);
}

function index(s: number) {
    return dim(s.toString());
}

function key(s: string) {
    return s;
}

function objType(s: string) {
    return dim(s);
}

function nullObj() {
    return red('null');
}

function undefinedObj() {
    return red('undefined');
}

function string(s: string) {
    return green('"' + s.replace(/\n/g, '\\n').replace(/\r/g, '\\r').replace(/"/g, '\\"') + '"');
}

function number(s: number) {
    return blue(bold(s.toString()));
}

function boolean(s: boolean) {
    return blue(bold(s.toString()));
}

function dateObj(s: Date) {
    return objType('Date(') + string(s.toISOString()) + objType(')');
}

function regexpObj(s: RegExp) {
    return objType('RegExp(') + magenta(s.toString()) + objType(')');
}

function errorObj(s: Error) {
    return objType('Error(') + string(s.message) + objType(')');
}

function functionObj(s: Function) {
    return objType('f') + ' ' + s.name + '()';
}

function classObj(s: any) {
    return objType('Class') + ' ' + s.name;
}

function anyObj(s: any) {
    return s.toString();
}

function comment(s: string) {
    return dim('// ' + s);
}


/**
 * Recursive function to convert an object to a string with tree representation
 * 
 * @param obj Any object to be converted to a tree string
 * @param level Array of strings to represent the level of the tree
 * @returns A string with the tree representation of the object
 */
function objectToTree(obj: any, level: string[] = [], visited: Set<any> = new Set<any>()): string {
    if (obj && typeof obj === 'object') {
        if (visited.has(obj)) {
            if (Array.isArray(obj)) {
                return objType('Array(') + obj.length + objType(')') + ' ' + comment('Circular reference\n');
            } else {
                return objType('Object{}') + ' ' + comment('Circular reference\n');
            }
        }
        visited.add(obj);
    }

    let ret: string = '';

    if (obj === null) {
        ret = nullObj() + '\n';

    } else if (obj instanceof Date) {
        ret = dateObj(obj) + '\n';

    } else if (obj instanceof RegExp) {
        ret = regexpObj(obj) + '\n';

    } else if (obj instanceof Error) {
        ret = errorObj(obj) + '\n';

    } else if (obj instanceof String) {
        // Substitute all \n characters with the string '\n'
        ret = objType('String(') + string(obj.valueOf()) + objType(')') + '\n';

    } else if (obj instanceof Number) {
        ret = objType('Number(') + number(obj.valueOf()) + objType(')') + '\n';

    } else if (obj instanceof Boolean) {
        ret = objType('Boolean(') + boolean(obj.valueOf()) + objType(')') + '\n';

    } else if (obj instanceof Set || Array.isArray(obj)) {
        if (obj instanceof Set) {
            ret = objType('Set(') + obj.size + objType(')') + '\n';
            obj = Array.from(obj);
        } else {
            ret = objType('Array(') + obj.length + objType(')') + '\n';
        }
        for (let i = 0; i < obj.length; i++) {
            ret += level.join('') + (i == obj.length - 1 ? tree('└─• ') : tree('├─• ')) + index(i) + ': ' + objectToTree(obj[i], level.concat(i == obj.length - 1 ? '  ' : tree('│ ')), visited);
        }

    } else if (obj instanceof Map) {
        let keys: any[] = Array.from(obj.keys());
        ret = objType('Map(') + obj.size + objType(')') + '\n' +
            keys.map((k, i) => {
                return level.join('') + (i == keys.length - 1 ? tree('└─• ') : tree('├─• ')) + key(k.toString()) + ': ' + objectToTree(obj.get(k), level.concat(i == keys.length - 1 ? '  ' : tree('│ ')), visited);
            }).join('');

    } else if (typeof obj === 'object' && !(obj instanceof Function)) {
        let keys: any[] = Object.keys(obj);
        ret = objType('Object{}') + '\n' +
            keys.map((k, i) => {
                return level.join('') + (i == keys.length - 1 ? tree('└─• ') : tree('├─• ')) + key(k) + ': ' + objectToTree(obj[k], level.concat(i == keys.length - 1 ? '  ' : tree('│ ')), visited);
            }).join('');

    } else if (obj instanceof Function) {
        // obj is a function or a class
        if (isClass(obj)) {
            ret = classObj(obj) + '\n';
        } else {
            ret = functionObj(obj) + '\n';
        }

    } else if (typeof obj === 'string') {
        // Substitute all \n characters with the string '\n'
        ret = string(obj) + '\n';

    } else if (typeof obj === 'number') {
        ret = number(obj) + '\n';

    } else if (typeof obj === 'boolean') {
        ret = boolean(obj) + '\n';

    } else if (typeof obj === 'undefined') {
        ret = undefinedObj() + '\n';

    } else {
        ret = anyObj(obj) + '\n';
    }

    visited.delete(obj);

    return ret;
}




/**
 * Converts the object/array to the string with tree structure
 */
export default function asTree(obj: any = undefined): string {
    // remove last \n character from the result
    let ret: string = objectToTree(obj);
    if (ret.length > 0 && ret[ret.length - 1] == '\n') {
        return ret.slice(0, -1);
    }
    return ret;
}


