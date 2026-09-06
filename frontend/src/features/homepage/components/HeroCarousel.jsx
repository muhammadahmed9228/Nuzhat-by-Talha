import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function HeroCarousel({ slides }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-advance slides every 5 seconds
  useEffect(() => {
    if (slides.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [slides.length]);

  if (!slides || slides.length === 0) return null;

  return (
    <div className="relative w-full h-[52vh] md:h-[80vh] overflow-hidden bg-neutral-900 rounded-none md:rounded-lg">
      {slides.map((slide, index) => (
        <div 
          key={slide._id}
          className={`absolute inset-0 transition-opacity duration-1000 ${index === currentIndex ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        >
          {/* Background Image with Dark Overlay */}
          <div className="absolute inset-0 bg-black/30 z-10"></div>
          <img src={slide.image.url} alt={slide.heading} className="w-full h-full object-cover" />
          
          {/* Text Content */}
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center text-white p-6">
            <h2 className="text-3xl leading-tight md:text-6xl font-serif font-bold mb-4 tracking-wide">{slide.heading}</h2>
            {slide.subtitle && (
              <p className="text-base leading-relaxed md:text-xl mb-8 max-w-2xl text-neutral-100">{slide.subtitle}</p>
            )}
            {slide.buttonText && (
              <Link 
                to={slide.buttonUrl} 
                className="bg-white text-neutral-900 px-8 py-3 rounded-md font-semibold hover:bg-neutral-200 transition"
              >
                {slide.buttonText}
              </Link>
            )}
          </div>
        </div>
      ))}

      {/* Manual Navigation Dots */}
      {slides.length > 1 && (
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-30 flex space-x-2">
          {slides.map((_, index) => (
            <button 
              key={index} 
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full transition-colors ${index === currentIndex ? "bg-white" : "bg-white/50"}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}