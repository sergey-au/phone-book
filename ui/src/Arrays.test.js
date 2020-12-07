import Arrays from "./Arrays";

describe('Arrays', () => {

    const matchFunc = (a, b) => a.name === b.name;

    it('should return empty array complement', () => {
        const result = Arrays.complement([], [], matchFunc);
        expect(result.length).toBe(0);
    });

    it('should return empty array of two indentical arrays', () => {
        const a1 = [ {name: 'Alex'}, {name: 'Mark'}, {name: 'Peter'}];
        const a2 = [ {name: 'Alex'}, {name: 'Mark'}, {name: 'Peter'}];
        const result = Arrays.complement(a1, a2, matchFunc);
        expect(result.length).toBe(0);
        expect(result).toEqual([]);
    });

    it('should return valid complement of mutually exclusive arrays', () => {
        const a1 = [ {name: 'Alex'}, {name: 'Mark'}, {name: 'Peter'}];
        const a2 = [ {name: 'Kate'}, {name: 'Helen'}, {name: 'Emma'}];
        const result = Arrays.complement(a1, a2, matchFunc);
        expect(result.length).toBe(6);
        expect(result).toEqual(a1.concat(a2));
    });

    it('should return valid complement of arrays sharing the same values', () => {
        const a1 = [ {name: 'Alex'}, {name: 'Mark'}, {name: 'Peter'}];
        const a2 = [ {name: 'Alex'}, {name: 'Mark'}, {name: 'Emma'}];
        const result = Arrays.complement(a1, a2, matchFunc);
        expect(result.length).toBe(2);
        expect(result).toEqual([ {name: 'Peter'}, {name: 'Emma'}]);
    });

});
