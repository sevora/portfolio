/**
 * Use this to asynchronously load an image from a URL.
 * @param url the URL or path of the image to be loaded.
 * @returns a promise that should resolve to an HTMLImageElement.
 */
function loadImage(url: string) {
    return new Promise<HTMLImageElement>((resolve, reject) => {
        let image = new Image();
        image.onload = () => resolve(image);
        image.onerror = () => reject();
        image.src = url;
    });
}

export { loadImage };