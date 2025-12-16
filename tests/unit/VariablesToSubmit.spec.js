// Import the mixin directly
import VariablesToSubmitFilter from '@/mixins/VariablesToSubmitFilter';

// Create a simple object with the method to test
const testMixin = {
  ...VariablesToSubmitFilter.methods,
};

describe('VariablesToSubmitFilter.filterDataForSubmission', () => {
  describe('Backward Compatibility - Empty/Undefined variablesToSubmit', () => {
    it('should return all data when variablesToSubmit is undefined', () => {
      const data = {
        name: 'John',
        age: 30,
        email: 'john@example.com',
        _parent: { previousTask: 'data' },
      };
      const buttonInfo = {};

      const result = testMixin.filterDataForSubmission(data, buttonInfo);

      expect(result).toEqual(data);
      expect(result.name).toBe('John');
      expect(result.age).toBe(30);
      expect(result.email).toBe('john@example.com');
      expect(result._parent).toEqual({ previousTask: 'data' });
    });

    it('should return all data when variablesToSubmit is null', () => {
      const data = {
        name: 'John',
        age: 30,
        email: 'john@example.com',
      };
      const buttonInfo = { variablesToSubmit: null };

      const result = testMixin.filterDataForSubmission(data, buttonInfo);

      expect(result).toEqual(data);
    });

    it('should return all data when variablesToSubmit is an empty array', () => {
      const data = {
        name: 'John',
        age: 30,
        email: 'john@example.com',
        _parent: { previousTask: 'data' },
      };
      const buttonInfo = { variablesToSubmit: [] };

      const result = testMixin.filterDataForSubmission(data, buttonInfo);

      expect(result).toEqual(data);
      expect(result._parent).toEqual({ previousTask: 'data' });
    });

    it('should return all data when buttonInfo is null', () => {
      const data = {
        name: 'John',
        age: 30,
        email: 'john@example.com',
      };

      const result = testMixin.filterDataForSubmission(data, null);

      expect(result).toEqual(data);
    });

    it('should return all data when buttonInfo is undefined', () => {
      const data = {
        name: 'John',
        age: 30,
        email: 'john@example.com',
      };

      const result = testMixin.filterDataForSubmission(data, undefined);

      expect(result).toEqual(data);
    });

    it('should preserve all data including nested objects and arrays', () => {
      const data = {
        name: 'John',
        address: {
          street: '123 Main St',
          city: 'New York',
        },
        hobbies: ['reading', 'coding'],
        _parent: { previousTask: 'data' },
      };
      const buttonInfo = {};

      const result = testMixin.filterDataForSubmission(data, buttonInfo);

      expect(result).toEqual(data);
      expect(result.address.street).toBe('123 Main St');
      expect(result.hobbies).toEqual(['reading', 'coding']);
    });
  });

  describe('Filtering - When variablesToSubmit has values', () => {
    it('should return only selected variables', () => {
      const data = {
        name: 'John',
        age: 30,
        email: 'john@example.com',
        phone: '123-456-7890',
      };
      const buttonInfo = {
        variablesToSubmit: ['name', 'email'],
      };

      const result = testMixin.filterDataForSubmission(data, buttonInfo);

      expect(result.name).toBe('John');
      expect(result.email).toBe('john@example.com');
      expect(result.age).toBeUndefined();
      expect(result.phone).toBeUndefined();
    });

    it('should always include _parent when it exists', () => {
      const data = {
        name: 'John',
        age: 30,
        _parent: { previousTask: 'data', taskId: 123 },
      };
      const buttonInfo = {
        variablesToSubmit: ['name'],
      };

      const result = testMixin.filterDataForSubmission(data, buttonInfo);

      expect(result.name).toBe('John');
      expect(result._parent).toEqual({ previousTask: 'data', taskId: 123 });
      expect(result.age).toBeUndefined();
    });

    it('should handle nested variables with dot notation', () => {
      const data = {
        name: 'John',
        address: {
          street: '123 Main St',
          city: 'New York',
          zip: '10001',
        },
        contact: {
          email: 'john@example.com',
          phone: '123-456-7890',
        },
      };
      const buttonInfo = {
        variablesToSubmit: ['name', 'address', 'contact'],
      };

      const result = testMixin.filterDataForSubmission(data, buttonInfo);

      expect(result.name).toBe('John');
      expect(result.address).toEqual({
        street: '123 Main St',
        city: 'New York',
        zip: '10001',
      });
      expect(result.contact).toEqual({
        email: 'john@example.com',
        phone: '123-456-7890',
      });
    });

    it('should ignore variables that do not exist in data', () => {
      const data = {
        name: 'John',
        age: 30,
      };
      const buttonInfo = {
        variablesToSubmit: ['name', 'nonexistent', 'age'],
      };

      const result = testMixin.filterDataForSubmission(data, buttonInfo);

      expect(result.name).toBe('John');
      expect(result.age).toBe(30);
      expect(result.nonexistent).toBeUndefined();
    });

    it('should handle empty strings in variablesToSubmit array', () => {
      const data = {
        name: 'John',
        age: 30,
      };
      const buttonInfo = {
        variablesToSubmit: ['name', '', 'age'],
      };

      const result = testMixin.filterDataForSubmission(data, buttonInfo);

      expect(result.name).toBe('John');
      expect(result.age).toBe(30);
    });

    it('should handle null values in variablesToSubmit array', () => {
      const data = {
        name: 'John',
        age: 30,
      };
      const buttonInfo = {
        variablesToSubmit: ['name', null, 'age'],
      };

      const result = testMixin.filterDataForSubmission(data, buttonInfo);

      expect(result.name).toBe('John');
      expect(result.age).toBe(30);
    });

    it('should preserve arrays and objects structure', () => {
      const data = {
        name: 'John',
        items: ['item1', 'item2', 'item3'],
        config: {
          setting1: 'value1',
          setting2: 'value2',
        },
      };
      const buttonInfo = {
        variablesToSubmit: ['name', 'items', 'config'],
      };

      const result = testMixin.filterDataForSubmission(data, buttonInfo);

      expect(result.name).toBe('John');
      expect(result.items).toEqual(['item1', 'item2', 'item3']);
      expect(result.config).toEqual({
        setting1: 'value1',
        setting2: 'value2',
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty data object', () => {
      const data = {};
      const buttonInfo = {
        variablesToSubmit: ['name'],
      };

      const result = testMixin.filterDataForSubmission(data, buttonInfo);

      expect(result).toEqual({});
    });

    it('should handle data with only _parent', () => {
      const data = {
        _parent: { previousTask: 'data' },
      };
      const buttonInfo = {
        variablesToSubmit: ['name'],
      };

      const result = testMixin.filterDataForSubmission(data, buttonInfo);

      expect(result._parent).toEqual({ previousTask: 'data' });
      expect(Object.keys(result)).toEqual(['_parent']);
    });

    it('should handle _parent as undefined', () => {
      const data = {
        name: 'John',
        age: 30,
      };
      const buttonInfo = {
        variablesToSubmit: ['name'],
      };

      const result = testMixin.filterDataForSubmission(data, buttonInfo);

      expect(result.name).toBe('John');
      expect(result._parent).toBeUndefined();
    });

    it('should handle variablesToSubmit with duplicate values', () => {
      const data = {
        name: 'John',
        age: 30,
      };
      const buttonInfo = {
        variablesToSubmit: ['name', 'name', 'age'],
      };

      const result = testMixin.filterDataForSubmission(data, buttonInfo);

      expect(result.name).toBe('John');
      expect(result.age).toBe(30);
    });

    it('should handle undefined values in data', () => {
      const data = {
        name: 'John',
        age: undefined,
        email: null,
      };
      const buttonInfo = {
        variablesToSubmit: ['name', 'age', 'email'],
      };

      const result = testMixin.filterDataForSubmission(data, buttonInfo);

      expect(result.name).toBe('John');
      expect(result.email).toBeNull();
      // age is undefined, so it won't be included
      expect(result.age).toBeUndefined();
    });

    it('should return empty object when data is null (backward compatibility)', () => {
      const data = null;
      const buttonInfo = {};

      const result = testMixin.filterDataForSubmission(data, buttonInfo);

      expect(result).toEqual({});
      expect(typeof result).toBe('object');
    });

    it('should return empty object when data is undefined (backward compatibility)', () => {
      const data = undefined;
      const buttonInfo = {};

      const result = testMixin.filterDataForSubmission(data, buttonInfo);

      expect(result).toEqual({});
      expect(typeof result).toBe('object');
    });

    it('should return empty object when data is null and filtering is enabled', () => {
      const data = null;
      const buttonInfo = {
        variablesToSubmit: ['name'],
      };

      const result = testMixin.filterDataForSubmission(data, buttonInfo);

      expect(result).toEqual({});
      expect(typeof result).toBe('object');
    });

    it('should return empty object when data is false (prevents server error)', () => {
      const data = false;
      const buttonInfo = {};

      const result = testMixin.filterDataForSubmission(data, buttonInfo);

      expect(result).toEqual({});
      expect(typeof result).toBe('object');
      expect(result).not.toBe(false);
    });

    it('should return empty object when data is an array (invalid type)', () => {
      const data = [1, 2, 3];
      const buttonInfo = {};

      const result = testMixin.filterDataForSubmission(data, buttonInfo);

      expect(result).toEqual({});
      expect(typeof result).toBe('object');
      expect(Array.isArray(result)).toBe(false);
    });
  });

  describe('Real-world scenarios', () => {
    it('should work like original behavior for existing screens (no variablesToSubmit)', () => {
      // Simulate an existing screen that doesn't have variablesToSubmit configured
      const data = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '123-456-7890',
        address: {
          street: '123 Main St',
          city: 'New York',
        },
        _parent: {
          task1: { field1: 'value1' },
          task2: { field2: 'value2' },
        },
      };
      const buttonInfo = {}; // No variablesToSubmit - like existing screens

      const result = testMixin.filterDataForSubmission(data, buttonInfo);

      // Should return everything exactly as before
      expect(result).toEqual(data);
      expect(result.firstName).toBe('John');
      expect(result.lastName).toBe('Doe');
      expect(result.email).toBe('john.doe@example.com');
      expect(result.phone).toBe('123-456-7890');
      expect(result.address).toEqual({
        street: '123 Main St',
        city: 'New York',
      });
      expect(result._parent).toEqual({
        task1: { field1: 'value1' },
        task2: { field2: 'value2' },
      });
    });

    it('should preserve all system variables (starting with _) when filtering', () => {
      // Test that ALL system variables are preserved, not just _parent
      const data = {
        name: 'John',
        age: 30,
        _parent: { task1: 'data' },
        _systemVar1: 'system1',
        _systemVar2: 'system2',
        _internal: { key: 'value' },
        regularVar: 'regular',
      };
      const buttonInfo = {
        variablesToSubmit: ['name'],
      };

      const result = testMixin.filterDataForSubmission(data, buttonInfo);

      // Should include selected variable + ALL system variables
      expect(result.name).toBe('John');
      expect(result._parent).toEqual({ task1: 'data' });
      expect(result._systemVar1).toBe('system1');
      expect(result._systemVar2).toBe('system2');
      expect(result._internal).toEqual({ key: 'value' });
      expect(result.age).toBeUndefined();
      expect(result.regularVar).toBeUndefined();
    });

    it('should handle screen published before feature was added (no buttonInfo property)', () => {
      // Simulate a screen that was published before the feature existed
      // buttonInfo might not even have the property
      const data = {
        field1: 'value1',
        field2: 'value2',
        field3: 'value3',
        _parent: { previous: 'data' },
      };
      const buttonInfo = { name: 'submitButton', label: 'Submit' }; // No variablesToSubmit property

      const result = testMixin.filterDataForSubmission(data, buttonInfo);

      // Should return all data as it worked before
      expect(result).toEqual(data);
      expect(result.field1).toBe('value1');
      expect(result.field2).toBe('value2');
      expect(result.field3).toBe('value3');
      expect(result._parent).toEqual({ previous: 'data' });
    });

    it('should preserve data from previous tasks in multi-task process (backward compatibility)', () => {
      // Critical: Existing screens in multi-task processes must preserve _parent data
      const data = {
        currentTaskField: 'current',
        _parent: {
          previousTask1: { field1: 'prev1', field2: 'prev2' },
          previousTask2: { field3: 'prev3' },
        },
      };
      const buttonInfo = {}; // No filter - backward compatibility

      const result = testMixin.filterDataForSubmission(data, buttonInfo);

      // Must preserve ALL data including complete _parent structure
      expect(result).toEqual(data);
      expect(result.currentTaskField).toBe('current');
      expect(result._parent.previousTask1).toEqual({ field1: 'prev1', field2: 'prev2' });
      expect(result._parent.previousTask2).toEqual({ field3: 'prev3' });
    });

    it('should filter correctly for new screens with variablesToSubmit configured', () => {
      // Simulate a new screen with variablesToSubmit configured
      const data = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '123-456-7890',
        internalNotes: 'Internal data',
        _parent: {
          task1: { field1: 'value1' },
        },
      };
      const buttonInfo = {
        variablesToSubmit: ['firstName', 'lastName', 'email'],
      };

      const result = testMixin.filterDataForSubmission(data, buttonInfo);

      // Should only include selected variables + _parent
      expect(result.firstName).toBe('John');
      expect(result.lastName).toBe('Doe');
      expect(result.email).toBe('john.doe@example.com');
      expect(result.phone).toBeUndefined();
      expect(result.internalNotes).toBeUndefined();
      expect(result._parent).toEqual({
        task1: { field1: 'value1' },
      });
    });

    it('should preserve data from previous tasks in multi-task process', () => {
      // Simulate a screen that is the 2nd task in a process
      const data = {
        // Data from current task
        task2Field1: 'value1',
        task2Field2: 'value2',
        // Data from previous task (via _parent)
        _parent: {
          task1Field1: 'previous1',
          task1Field2: 'previous2',
        },
      };
      const buttonInfo = {
        variablesToSubmit: ['task2Field1'],
      };

      const result = testMixin.filterDataForSubmission(data, buttonInfo);

      // Should include selected variable + _parent (previous task data)
      expect(result.task2Field1).toBe('value1');
      expect(result.task2Field2).toBeUndefined();
      expect(result._parent).toEqual({
        task1Field1: 'previous1',
        task1Field2: 'previous2',
      });
    });
  });
});

