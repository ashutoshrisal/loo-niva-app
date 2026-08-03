import Image from "next/image";

const images = [
  "/1.JPG",
  "/2.JPG",
  "/3.JPG",
  "/4.JPG",
];

export default function HeroGallery() {
  return (
    <div className="hidden xl:grid grid-cols-3 gap-3">
      {images.map((img, index) => (
        <div
          key={index}
          className="overflow-hidden rounded-2xl shadow-xl hover:scale-105 transition duration-300"
        >
          <Image
            src={img}
            alt={`Image ${index + 1}`}
            width={180}
            height={180}
            className="h-32 w-full object-cover rounded-2xl"
          />
        </div>
      ))}
    </div>
  );
}