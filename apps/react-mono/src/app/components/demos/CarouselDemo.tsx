import { Carousel } from '@react-mono/ui-controls';

const images = [
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=800&q=80',
];

export default function CarouselDemo() {
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold mb-4">Carousel Demo</h1>

      {/* Basic Image Carousel */}
      <section>
        <h2 className="font-semibold mb-2">Image Carousel</h2>
        <div className="max-w-xl mx-auto">
          <Carousel autoPlay interval={3000}>
            {images.map((src, i) => (
              <img
                key={i}
                src={src}
                alt={`Slide ${i + 1}`}
                className="w-full h-64 object-cover rounded shadow"
              />
            ))}
          </Carousel>
        </div>
      </section>

      {/* Custom Content Carousel */}
      <section>
        <h2 className="font-semibold mb-2">Custom Content Carousel</h2>
        <div className="max-w-xl mx-auto">
          <Carousel showIndicators showControls>
            <div className="flex items-center justify-center h-40 bg-blue-100 text-blue-800 text-xl font-bold">First Slide</div>
            <div className="flex items-center justify-center h-40 bg-green-100 text-green-800 text-xl font-bold">Second Slide</div>
            <div className="flex items-center justify-center h-40 bg-yellow-100 text-yellow-800 text-xl font-bold">Third Slide</div>
          </Carousel>
        </div>
      </section>
    </div>
  );
}
