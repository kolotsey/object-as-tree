
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
function objectToTree(obj: any, level:string[]=[]): string{
    if(obj===null){
        return 'null\n';

    }else if(obj instanceof Map){
        if( obj.size==0){
            return '[0] //Map\n';
        }else if(obj.size==1){
            let key:any=obj.keys().next().value;
            return '[1] //Map\n'+
                level.join('')+'└─• '+key+'='+objectToTree(obj.get( key), level.concat('  '));
        }else{
            let keys:any[]=Array.from(obj.keys());
            return '['+obj.size+'] //Map\n'+
                keys.slice(0, -1).map((key)=>{
                    return level.join('')+'├─• '+key+'='+objectToTree(obj.get( key), level.concat('│ '));
                }).join('')+
                level.join('')+'└─• '+keys[keys.length-1]+'='+objectToTree(obj.get( keys[keys.length-1]), level.concat('  '));
        }
    }else if(obj instanceof Set){
        if(obj.size==0){
            return '[0] //Set\n';
        }else if(obj.size==1){
            return '[1] //Set\n'+
                level.join('')+'└─• '+objectToTree(obj.values().next().value, level.concat('  '));
        }else{
            let values:any[]=Array.from(obj.values());
            return '['+obj.size+'] //Set\n'+
                values.slice(0, -1).map((value)=>{
                    return level.join('')+'├─• '+objectToTree(value, level.concat('│ '));
                }).join('')+
                level.join('')+'└─• '+objectToTree(values[values.length-1], level.concat('  '));
        }

    }else if(Array.isArray(obj)){
        if(obj.length==0){
            return '[0]\n';
        }else if(obj.length==1){
            return '[1]\n'+
                level.join('')+'└─• '+objectToTree(obj[0], level.concat('  '));
        }else{
            let ret:string='';
            for(let i=0; i<obj.length-1; i++){
                ret+=level.join('')+'├─• '+objectToTree(obj[i], level.concat('│ '));
            }
            ret+=level.join('')+'└─• '+objectToTree(obj[obj.length-1], level.concat('  '));
            return '['+obj.length+']\n'+ret;
        }


    }else if(typeof obj==='object' && !(obj instanceof Function)){
        if( obj instanceof Date){
            return '{} //Date '+obj.toISOString()+'\n';
        }

        let keys:any[]=Object.keys(obj);

        if(keys.length==0){
            return '{}\n';

        }else if(keys.length==1){
            return '{}\n'+level.join('')+'└─• '+keys[0]+(isStructure(obj[keys[0]])? '' : '=')+objectToTree(obj[keys[0]], level.concat('  '));

        }else{
            return '{}\n'+
                    keys.slice(0, -1).map((key)=>{
                        return level.join('')+'├─• '+key+(isStructure(obj[key])? '' : '=')+objectToTree(obj[key], level.concat('│ '));
                    }).join('')+
                    level.join('')+'└─• '+keys[keys.length-1]+(isStructure(obj[keys[keys.length-1]])? '' : '=')+objectToTree(obj[keys[keys.length-1]], level.concat('  '));
        }
    

    

    }else if (obj instanceof Function){
        // obj is a function or a class
        if( isClass(obj)){
            return '{} //class '+obj.name+'\n';
        }else{
            return '{} //function '+obj.name+'()\n';
        }
    
    }else if (typeof obj==='string'){
        // Substitute all \n characters with the string '\n'
        return '"'+obj.replace(/\n/g, '\\n').replace(/\r/g, '\\r').replace(/"/g, '\\"')+'"\n';
        // return '"'+obj+'"\n';

    }else{
        return obj+'\n';
    }
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


