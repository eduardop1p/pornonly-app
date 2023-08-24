interface Props {
  customWidth: number;
  originalHeight: number;
  originalWidth: number;
}

export default function calHeight({
  customWidth,
  originalHeight,
  originalWidth,
}: Props) {
  const calc = (customWidth * originalHeight) / originalWidth;
  return +calc.toFixed(0);
}
