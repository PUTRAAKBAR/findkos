"use client";

import { useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

export function PhotoGallery({ images }: { images: string[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const openGallery = (index: number = 0) => {
    setCurrentIndex(index);
    setIsOpen(true);
    document.body.style.overflow = "hidden"; // Prevent scrolling behind modal
  };

  const closeGallery = () => {
    setIsOpen(false);
    document.body.style.overflow = "auto";
  };

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  return (
    <>
      {/* Grid Desktop/Tablet View */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-8 rounded-2xl overflow-hidden h-[400px]">
        <div className="md:col-span-2 md:row-span-2 relative h-[400px] cursor-pointer group" onClick={() => openGallery(0)}>
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors z-10" />
          <img src={images[0]} alt="Foto Utama" className="w-full h-full object-cover" />
        </div>
        <div className="hidden md:block relative h-[196px] cursor-pointer group" onClick={() => openGallery(1)}>
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors z-10" />
          <img src={images[1] || images[0]} alt="Foto 2" className="w-full h-full object-cover" />
        </div>
        <div className="hidden md:block relative h-[196px] cursor-pointer group" onClick={() => openGallery(2)}>
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors z-10" />
          <img src={images[2] || images[0]} alt="Foto 3" className="w-full h-full object-cover" />
        </div>
        <div className="hidden md:block relative h-[196px] cursor-pointer group" onClick={() => openGallery(3)}>
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors z-10" />
          <img src={images[3] || images[0]} alt="Foto 4" className="w-full h-full object-cover" />
        </div>
        <div className="hidden md:block relative h-[196px] cursor-pointer group" onClick={() => openGallery(4)}>
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-10 group-hover:bg-black/50 transition-colors">
            <span className="text-white font-medium text-lg">Lihat Semua {images.length} Foto</span>
          </div>
          <img src={images[4] || images[0]} alt="Foto 5" className="w-full h-full object-cover" />
        </div>
      </div>

      {/* Fullscreen Lightbox Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 flex flex-col justify-center items-center backdrop-blur-sm" onClick={closeGallery}>
          <div className="absolute top-6 right-6 z-50">
            <button 
              onClick={closeGallery}
              className="text-white bg-white/10 hover:bg-white/20 p-2 rounded-full backdrop-blur-md transition-all"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <div className="absolute top-6 left-6 z-50 text-white/80 font-medium tracking-widest text-sm">
            {currentIndex + 1} / {images.length}
          </div>

          <button 
            className="absolute left-4 md:left-12 top-1/2 -translate-y-1/2 text-white bg-white/10 hover:bg-white/20 p-3 rounded-full backdrop-blur-md transition-all z-50"
            onClick={prevImage}
          >
            <ChevronLeft className="w-8 h-8" />
          </button>

          <button 
            className="absolute right-4 md:right-12 top-1/2 -translate-y-1/2 text-white bg-white/10 hover:bg-white/20 p-3 rounded-full backdrop-blur-md transition-all z-50"
            onClick={nextImage}
          >
            <ChevronRight className="w-8 h-8" />
          </button>

          <div className="relative w-full max-w-5xl max-h-[85vh] px-4 flex justify-center items-center" onClick={(e) => e.stopPropagation()}>
            <img 
              src={images[currentIndex]} 
              alt={`Foto ${currentIndex + 1}`} 
              className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl" 
            />
          </div>
        </div>
      )}
    </>
  );
}
