let str = (s) => {
    if (typeof s !== "string") {
        throw new TypeError("Expected a string!");
    } else {
        return s;
    }
};

let repeat  = (s) => {
    s = str(s);
    return s + s;
};