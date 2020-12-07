export default class Arrays {
    static complement = (array1, array2, matchFunc) => {
        let result = array1.filter(b => !array2.some(e => matchFunc(e, b)));
        result = result.concat(array2.filter(b => !array1.some(e => matchFunc(e, b))));
        return result;
    }
}
