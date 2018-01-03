let typeOf = (type) => {
    type = str(type);
    return (p) => {
        if (typeof p !== type) {
            throw new TypeError("Expected a " + type + "!");
        } else {
            return p;
        }
    };
}

let bool = typeOf("boolean");
let obj = typeOf("object");
let num = typeOf("number");
let undef = typeOf("undefined");

let inc = (x) => {
    x = num(x); 
    return num(x + 1);
}

 
let any = (x) => x;  // <-- if not using categories 

