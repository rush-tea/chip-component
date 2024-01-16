export function stringToColor(value: string) {
  let hash = 0;
  let i;

  for (i = 0; i < value.length; i += 1) {
    hash = value.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = '#';

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }

  return color;
}

export const getFirstLetter = (str: string): string => {
  return str.charAt(0).toUpperCase();
};
