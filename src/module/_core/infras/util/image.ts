import type { RcFile, UploadFile } from "antd/es/upload/interface";
import { encode } from "blurhash";

export const handleImage = (
    file: File,
    maxHeight: number,
    maxWidth: number,
    hasBlurhash?: boolean
): Promise<{ file: File; blurhash: string | undefined }> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (event: ProgressEvent<FileReader>) => {
            const img = new Image();
            img.onload = () => {
                let width = img.width;
                let height = img.height;

                if (width > height) {
                    if (width > maxWidth) {
                        height *= maxWidth / width;
                        width = maxWidth;
                    }
                } else {
                    if (height > maxHeight) {
                        width *= maxHeight / height;
                        height = maxHeight;
                    }
                }

                const canvas = document.createElement("canvas");
                const ctx = canvas.getContext("2d");

                canvas.width = width;
                canvas.height = height;

                ctx?.drawImage(img, 0, 0, width, height);

                const imageData = ctx?.getImageData(0, 0, width, height);
                const blurhash =
                    hasBlurhash && imageData
                        ? encode(imageData.data, imageData.width, imageData.height, 4, 3)
                        : undefined;

                canvas.toBlob((blob) => {
                    if (blob) {
                        const resizedFile = new File([blob], file.name, { type: file.type });
                        resolve({ file: resizedFile, blurhash });
                    } else {
                        reject(new Error("Failed to resize the image."));
                    }
                }, "image/jpeg");
            };

            img.src = event.target?.result as string;
        };

        reader.onerror = () => {
            reject(new Error("Failed to read the file."));
        };

        reader.readAsDataURL(file);
    });
};

export const onPreview = async (file: UploadFile) => {
    let src = file.url as string;
    if (!src) {
        src = await new Promise((resolve) => {
            const reader = new FileReader();
            reader.readAsDataURL(file.originFileObj as RcFile);
            reader.onload = () => resolve(reader.result as string);
        });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow?.document.write(image.outerHTML);
};
