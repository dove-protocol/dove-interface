export const wrapAddress = (address: string | undefined): `0x${string}` => {
  return address as `0x${string}`;
};
