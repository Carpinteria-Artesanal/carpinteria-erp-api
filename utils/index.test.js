const { roundNumber, replaceArrayElement } = require('.');

describe('DeliveryOrderController', () => {
  describe('roundNumber', () => {
    test('Redondea a 2 decimales a la baja', () => {
      const num = roundNumber(3.45254, 2);
      expect(num)
        .toBe(3.45);
    });

    test('Redondea a 2 decimales a la alta', () => {
      const num = roundNumber(3.45556, 2);
      expect(num)
        .toBe(3.46);
    });

    test('Redondea a 3 decimales a la baja', () => {
      const num = roundNumber(3.45254);
      expect(num)
        .toBe(3.453);
    });

    test('Redondea a 2 decimales a la alta', () => {
      const num = roundNumber(3.45556);
      expect(num)
        .toBe(3.456);
    });
  });

  describe('replaceArrayElement', () => {
    let arrayNums;
    let newArray;
    const element = 4;
    const index = 1;
    beforeAll(() => {
      arrayNums = [1, 2, 3, 4, 5];

      newArray = replaceArrayElement({
        array: arrayNums,
        element,
        index,
      });
    });

    test('Se crea un nuevo array con los cambios', () => {
      expect(newArray[index])
        .toBe(element);
      expect(arrayNums.length)
        .toBe(newArray.length);
      expect(arrayNums[index + 1])
        .toBe(newArray[index + 1]);
      expect(arrayNums[index - 1])
        .toBe(newArray[index - 1]);
    });

    test('El array original no cambia', () => {
      expect(arrayNums.toString())
        .toBe('1,2,3,4,5');
    });
  });
});