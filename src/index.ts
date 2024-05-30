
/**
 * Returns true if the object is a structure (object, array, function)
 * 
 * @param obj Any object to be checked
 * @returns True if the object is a structure
 */
function isStructure(obj: any): boolean {
    return (typeof obj=='object' && obj !==null && !(obj instanceof Boolean || obj instanceof Number || obj instanceof String )) || Array.isArray(obj) || obj instanceof Function;
}

/**
 * Returns true if the object is a class
 * 
 * @param obj Any object to be checked
 * @returns True if the object is a class
 */
function isClass(obj:any): boolean {
    const isConstructorClass = obj.constructor && obj.constructor.toString().substring(0, 5) === 'class'
    if (obj.prototype === undefined) {
        return isConstructorClass
    }
    const isPrototypeConstructorClass = obj.prototype.constructor
        && obj.prototype.constructor.toString
        && obj.prototype.constructor.toString().substring(0, 5) === 'class'
    return isConstructorClass || isPrototypeConstructorClass
}

/**
 * Recursive function to convert an object to a string with tree representation
 * 
 * @param obj Any object to be converted to a tree string
 * @param level Array of strings to represent the level of the tree
 * @returns A string with the tree representation of the object
 */
function objectToTree(obj: any, level:string[]=[], visited:Set<any>=new Set<any>()): string{
    if (obj && typeof obj ==='object'){
        if( visited.has(obj)) {
            if(Array.isArray(obj)){
                return '[] //Circular reference\n';
            }else{
                return '{} //Circular reference\n';
            }
        }
        visited.add(obj);
    }

    let ret:string='';

    if(obj===null){
        ret='null\n';

    }else if(obj instanceof Date){
        ret= '{} //Date '+obj.toISOString()+'\n';

    }else if(obj instanceof RegExp){
        ret= '{} //RegExp '+obj.toString()+'\n';

    }else if(obj instanceof Error){
        ret= '{} //Error \"'+obj.message+'\"\n';

    }else if(obj instanceof String){
        // Substitute all \n characters with the string '\n'
        ret= '"'+obj.replace(/\n/g, '\\n').replace(/\r/g, '\\r').replace(/"/g, '\\"')+'" //String object\n';

    }else if(obj instanceof Number){
        ret= obj+' //Number object\n';

    }else if(obj instanceof Boolean){
        ret= obj+' //Boolean object\n';

    }else if(obj instanceof Set || Array.isArray(obj)){
        if(obj instanceof Set){
            ret='['+obj.size+'] //Set\n';
            obj=Array.from(obj);
        }else{
            ret='['+obj.length+']\n';    
        }
        for(let i=0; i<obj.length; i++){
            ret+=level.join('')+(i==obj.length-1? '└─• ':'├─• ')+objectToTree(obj[i], level.concat(i==obj.length-1? '  ' : '│ '), visited);
        }

    }else if(obj instanceof Map){
        let keys:any[]=Array.from(obj.keys());
        ret='['+obj.size+'] //Map\n'+
            keys.map((key, i)=>{
                return level.join('')+(i==keys.length-1? '└─• ':'├─• ')+key+(isStructure(obj.get(key))? '' : '=')+objectToTree(obj.get( key), level.concat( i==keys.length-1? '  ' : '│ '), visited);
            }).join('');

    }else if(typeof obj==='object' && !(obj instanceof Function)){
        let keys:any[]=Object.keys(obj);
        ret= '{}\n'+
            keys.map((key, i)=>{
                return level.join('')+(i==keys.length-1? '└─• ':'├─• ')+key+(isStructure(obj[key])? '' : '=')+objectToTree(obj[key], level.concat(i==keys.length-1? '  ' : '│ '), visited);
            }).join('');

    }else if (obj instanceof Function){
        // obj is a function or a class
        if( isClass(obj)){
            ret= '{} //class '+obj.name+'\n';
        }else{
            ret= '{} //function '+obj.name+'()\n';
        }
    
    }else if (typeof obj==='string'){
        // Substitute all \n characters with the string '\n'
        ret= '"'+obj.replace(/\n/g, '\\n').replace(/\r/g, '\\r').replace(/"/g, '\\"')+'"\n';

    }else{
        ret= obj+'\n';
    }

    visited.delete(obj);

    return ret;
}



    
/**
 * Converts the object/array to the string with tree structure
 */
export default function asTree(obj:any=undefined): string{
    // remove last \n character from the result
    let ret:string=objectToTree(obj);
    if(ret.length>0 && ret[ret.length-1]=='\n'){
        return ret.slice(0, -1);
    }
    return ret;
}


