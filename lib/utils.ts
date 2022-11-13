export const transitionAnimation = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
  },
};

export const validateNumber = (value: string) => {
  return RegExp(/^[0-9]*\.?[0-9]*$/).test(value);
};
