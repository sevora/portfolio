function loadImage(url: string) {
    return new Promise<HTMLImageElement>((resolve, reject) => {
        let image = new Image();
        image.onload = () => resolve(image);
        image.onerror = () => reject();
        image.src = url;
    });
}

export default loadImage;