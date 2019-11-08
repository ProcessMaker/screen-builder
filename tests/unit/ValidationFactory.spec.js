import { ValidatorFactory } from '../../src/factories/ValidatorFactory';

const config = require('./fixtures/screen_validation');

describe('Validator Factory', () => {


  it('without data validation with errors', () => {
    const expected = {
      name1: [ 'The name1 field is required.' ],
      name2: [ 'The name2 field is required.' ],
      name3: [ 'The name3 field is required.' ],
      name4: [ 'The name4 field is required.' ],
      name5: [ 'The name5 field is required.' ],
      name6: [ 'The name6 field is required.' ],
      name7: [ 'The name7 field is required.' ],
    };

    let validation = ValidatorFactory(config, {});
    let errors = validation.getErrors();
    expect(Object.keys(errors).length).toBe(7);
    expect(errors).toEqual(expected);
  });

  it('with data validation with errors', () => {
    const expected = {
      name2: [ 'The name2 field is required.' ],
      name4: [ 'The name4 field is required.' ],
      name6: [ 'The name6 field is required.' ],
    };

    let validation = ValidatorFactory(config, {name1: 'text1', name3:'text3', name5:'text5', name7:'text7'});
    let errors = validation.getErrors();
    expect(Object.keys(errors).length).toBe(3);
    expect(errors).toEqual(expected);
  });

  it('with data completed validation success', () => {
    const expected = {};

    let validation = ValidatorFactory(config, {name1: 'text1', name2: 'text2', name3:'text3', name4: 'text4', name5:'text5', name6: 'text6', name7:'text7'});
    let errors = validation.getErrors();
    expect(Object.keys(errors).length).toBe(0);
    expect(errors).toEqual(expected);
  });

});
