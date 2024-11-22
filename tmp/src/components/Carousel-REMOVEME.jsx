import React, { useState, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react'; // TODO: remove this!

const ImageCarousel = ({ slides }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const containerRef = useRef(null);

  const minSwipeDistance = 50;

  const goToNext = () => {
    if (currentIndex < slides.length - 1) {
      setCurrentIndex(curr => curr + 1);
    }
  };

  const goToPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(curr => curr - 1);
    }
  };

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setIsDragging(true);
    setDragOffset(0);
    setTouchStart({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY
    });
  };

  const onTouchMove = (e) => {
    if (!isDragging) return;
    
    const touch = {
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY
    };
    setTouchEnd(touch);

    // Calculate horizontal drag distance
    const horizontalDistance = touch.x - touchStart.x;
    const verticalDistance = Math.abs(touch.y - touchStart.y);

    // Only update drag offset if movement is more horizontal than vertical
    if (Math.abs(horizontalDistance) > verticalDistance) {
      setDragOffset(horizontalDistance);
      e.preventDefault(); // Prevent scrolling while dragging
    }
  };

  const onTouchEnd = useCallback(() => {
    if (!touchStart || !touchEnd) return;

    const horizontalDistance = touchStart.x - touchEnd.x;
    const verticalDistance = Math.abs(touchStart.y - touchEnd.y);

    // Only handle horizontal swipes
    if (Math.abs(horizontalDistance) > verticalDistance && Math.abs(horizontalDistance) > minSwipeDistance) {
      if (horizontalDistance > 0) {
        goToNext();
      } else {
        goToPrev();
      }
    }

    setIsDragging(false);
    setDragOffset(0);
    setTouchStart(null);
    setTouchEnd(null);
  }, [touchStart, touchEnd]);

  if (slides && slides.length > 0)
    return (
    <div className="relative w-full max-w-3xl mx-auto">
      {/* Main carousel container */}
      <div 
        className="relative overflow-hidden w-full"
        style={{ aspectRatio: '16/9' }}
      >
        <div
          ref={containerRef}
          className="flex transition-transform duration-300 ease-out w-full h-full"
          style={{
            transform: `translateX(calc(-${currentIndex * 100}% + ${dragOffset}px))`
          }}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          {slides.map((slide, index) => (
            <div 
              key={index} 
              className="flex-shrink-0 w-full h-full"
            >
              <img
                src={slide.imageUrl}
                alt={slide.alt || `Slide ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={goToPrev}
          className={`absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white shadow-lg ${
            currentIndex === 0 ? 'opacity-50 cursor-not-allowed' : 'opacity-100'
          }`}
          disabled={currentIndex === 0}
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        
        <button
          onClick={goToNext}
          className={`absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white shadow-lg ${
            currentIndex === slides.length - 1 ? 'opacity-50 cursor-not-allowed' : 'opacity-100'
          }`}
          disabled={currentIndex === slides.length - 1}
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Navigation dots */}
      <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-colors ${
              currentIndex === index ? 'bg-blue-500' : 'bg-gray-300'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageCarousel;
