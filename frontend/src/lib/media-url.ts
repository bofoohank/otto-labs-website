const IMAGE_URL_PATTERN = /^https?:\/\/\S+\.(?:gif|webp|png|jpe?g)(?:[?#]\S*)?$/i;

export function getStandaloneImageUrl(value: string) {
  const trimmed = value.trim();

  return IMAGE_URL_PATTERN.test(trimmed) ? trimmed : "";
}
