type ValidationRule = {
  field: string;
  type: 'string' | 'number' | 'boolean' | 'date';
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
};

export class Validator {
  static validate(data: Record<string, any>, rules: ValidationRule[]) {
    const errors: string[] = [];

    for (const rule of rules) {
      const value = data[rule.field];

      // Check required
      if (rule.required && (value === undefined || value === null)) {
        errors.push(`${rule.field} is required`);
        continue;
      }

      // Skip further validation if field is not required and empty
      if (!rule.required && (value === undefined || value === null)) {
        continue;
      }

      // Type validation
      if ((rule.type === 'string' && typeof value !== 'string') ||
          (rule.type === 'number' && typeof value !== 'number') ||
          (rule.type === 'boolean' && typeof value !== 'boolean') ||
          (rule.type === 'date' && !(value instanceof Date))) {
        errors.push(`${rule.field} must be a ${rule.type}`);
      }

      // String specific validations
      if (rule.type === 'string') {
        if (rule.minLength && value.length < rule.minLength) {
          errors.push(`${rule.field} must be at least ${rule.minLength} characters`);
        }
        if (rule.maxLength && value.length > rule.maxLength) {
          errors.push(`${rule.field} must be no more than ${rule.maxLength} characters`);
        }
      }

      // Number specific validations
      if (rule.type === 'number') {
        if (rule.min !== undefined && value < rule.min) {
          errors.push(`${rule.field} must be at least ${rule.min}`);
        }
        if (rule.max !== undefined && value > rule.max) {
          errors.push(`${rule.field} must be no more than ${rule.max}`);
        }
      }
    }

    return errors;
  }
} 