export const resizeImage = (img: HTMLImageElement, maxWidth: number, maxHeight: number, minWidth: number, minHeight: number) => {
  const aspectRatio = img.width / img.height;
  let newWidth = maxWidth;
  let newHeight = maxHeight;

  if (img.width > maxWidth || img.height > maxHeight) {
    if (img.width > img.height) {
      newWidth = maxWidth;
      newHeight = maxWidth / aspectRatio;
    } else {
      newWidth = maxHeight * aspectRatio;
      newHeight = maxHeight;
    }
  } else if (img.width < minWidth || img.height < minHeight) {
    if (img.width < img.height) {
      newWidth = minWidth;
      newHeight = minWidth / aspectRatio;
    } else {
      newWidth = minHeight * aspectRatio;
      newHeight = minHeight;
    }
  } else {
    newWidth = img.width;
    newHeight = img.height;
  }

  return { newWidth, newHeight };
};