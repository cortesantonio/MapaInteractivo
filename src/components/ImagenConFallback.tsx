import imagenPorDefecto from '../../public/img/Sin Img.png';

type Props = {
    src?: string;
    alt: string;
    className?: string;
};

export default function ImagenConFallback({ src, alt, className }: Props) {
    const imagenValida = src && src.trim() !== '' ? src : imagenPorDefecto;

    return (
        <img
            src={imagenValida}
            alt={alt}
            className={className}
            onError={(e) => {
                const target = e.target as HTMLImageElement;
                if (target.src !== imagenPorDefecto) {
                    target.onerror = null;
                    target.src = imagenPorDefecto;
                }
            }}
        />
    );
}
