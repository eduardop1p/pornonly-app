export default function videoDuration(duration: number) {
  // eslint-disable-next-line
  const hours = Math.floor(duration / 3600);
  const minutes = Math.floor((duration % 3600) / 60);
  const segunds = Math.floor(duration % 60);
  const zeroLeft = (value: number) => (value > 9 ? value : `0${value}`);

  return `${minutes}:${zeroLeft(segunds)}`;
}
