export type ContactFields = {
  name: string;
  email: string;
  message: string;
};

export type ContactErrors = Partial<Record<keyof ContactFields, string>>;

export const limits = {
  name: 100,
  email: 254,
  message: 5000,
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validateContact(input: Record<string, unknown>) {
  const fields: ContactFields = {
    name: String(input.name ?? "").trim(),
    email: String(input.email ?? "").trim(),
    message: String(input.message ?? "").trim(),
  };
  const errors: ContactErrors = {};

  if (fields.name.length < 2) errors.name = "Please enter your name.";
  else if (fields.name.length > limits.name) errors.name = "That name is too long.";

  if (!EMAIL_PATTERN.test(fields.email) || fields.email.length > limits.email) {
    errors.email = "Please enter a valid email address.";
  }

  if (fields.message.length < 10) errors.message = "Tell me a little more (at least 10 characters).";
  else if (fields.message.length > limits.message) errors.message = "Please keep it under 5,000 characters.";

  return { fields, errors, valid: Object.keys(errors).length === 0 };
}
