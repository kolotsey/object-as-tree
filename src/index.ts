
/**
 * Returns true if the object is a structure (object, array, function)
 * 
 * @param obj Any object to be checked
 * @returns True if the object is a structure
 */
function isStructure(obj: any): boolean {
    return (typeof obj=='object' && obj !==null) || Array.isArray(obj) || obj instanceof Function;
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
            return ' //Circular reference\n';
        }
        visited.add(obj);
    }

    let ret:string='';

    if(obj===null){
        ret='null\n';

    }else if(obj instanceof Map){
        if( obj.size==0){
            ret='[0] //Map\n';
        }else if(obj.size==1){
            let key:any=obj.keys().next().value;
            ret='[1] //Map\n'+
                level.join('')+'└─• '+key+'='+objectToTree(obj.get( key), level.concat('  '), visited);
        }else{
            let keys:any[]=Array.from(obj.keys());
            ret='['+obj.size+'] //Map\n'+
                keys.slice(0, -1).map((key)=>{
                    return level.join('')+'├─• '+key+'='+objectToTree(obj.get( key), level.concat('│ '), visited);
                }).join('')+
                level.join('')+'└─• '+keys[keys.length-1]+'='+objectToTree(obj.get( keys[keys.length-1]), level.concat('  '), visited);
        }
    }else if(obj instanceof Set){
        if(obj.size==0){
            ret= '[0] //Set\n';
        }else if(obj.size==1){
            ret= '[1] //Set\n'+
                level.join('')+'└─• '+objectToTree(obj.values().next().value, level.concat('  '), visited);
        }else{
            let values:any[]=Array.from(obj.values());
            ret= '['+obj.size+'] //Set\n'+
                values.slice(0, -1).map((value)=>{
                    return level.join('')+'├─• '+objectToTree(value, level.concat('│ '), visited);
                }).join('')+
                level.join('')+'└─• '+objectToTree(values[values.length-1], level.concat('  '), visited);
        }

    }else if(Array.isArray(obj)){
        if(obj.length==0){
            ret= '[0]\n';
        }else if(obj.length==1){
            ret= '[1]\n'+
                level.join('')+'└─• '+objectToTree(obj[0], level.concat('  '), visited);
        }else{
            ret='['+obj.length+']\n';
            for(let i=0; i<obj.length-1; i++){
                ret+=level.join('')+'├─• '+objectToTree(obj[i], level.concat('│ '), visited);
            }
            ret+=level.join('')+'└─• '+objectToTree(obj[obj.length-1], level.concat('  '), visited);
        }


    }else if(typeof obj==='object' && !(obj instanceof Function)){
        if( obj instanceof Date){
            ret= '{} //Date '+obj.toISOString()+'\n';
        }else{

            let keys:any[]=Object.keys(obj);

            if(keys.length==0){
                ret= '{}\n';

            }else if(keys.length==1){
                ret= '{}\n'+level.join('')+'└─• '+keys[0]+(isStructure(obj[keys[0]])? '' : '=')+objectToTree(obj[keys[0]], level.concat('  '), visited);

            }else{
                ret= '{}\n'+
                        keys.slice(0, -1).map((key)=>{
                            return level.join('')+'├─• '+key+(isStructure(obj[key])? '' : '=')+objectToTree(obj[key], level.concat('│ '), visited);
                        }).join('')+
                        level.join('')+'└─• '+keys[keys.length-1]+(isStructure(obj[keys[keys.length-1]])? '' : '=')+objectToTree(obj[keys[keys.length-1]], level.concat('  '), visited);
            }
        }

    

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


