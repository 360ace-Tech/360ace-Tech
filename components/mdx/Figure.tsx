import Image from 'next/image';

type Props = {
  src: string;
  alt: string;
  caption?: string;
  width?: number;
  height?: number;
};

export default function Figure({ src, alt, caption, width = 1200, height = 630 }: Props) {
  return (
    <figure style={{ margin: '1.25rem 0', textAlign: 'center' }}>
      {/* If src is remote or outside public/, Next/Image remotePatterns must allow it. */}
      <Image src={src} alt={alt} width={width} height={height} style={{ width: '100%', height: 'auto' }} />
      {caption && (
        <figcaption style={{ opacity: 0.8, fontSize: 14, marginTop: 8 }}>{caption}</figcaption>
      )}
    </figure>
  );
}

