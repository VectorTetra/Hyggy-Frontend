import { useState } from "react";
import Image, { ImageProps } from "next/image";

interface ImageWithFallbackProps extends Omit<ImageProps, 'src' | 'onError'> {
	src: string;
	fallbackSrc: string;
}

const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
	src,
	fallbackSrc,
	alt,
	...props
}) => {
	const [imgSrc, setImgSrc] = useState(src);

	return (
		<Image
			src={imgSrc}
			alt={alt}
			title={alt}
			onError={() => setImgSrc(fallbackSrc)}
			{...props}
		/>
	);
};

export default ImageWithFallback;
