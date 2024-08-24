export const add_sign = (value: any) => {
  const number = Number(value);
  if (number >= 0) return `+${number}`;
  return number.toString();
};
