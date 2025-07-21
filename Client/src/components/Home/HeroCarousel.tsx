import React, { useEffect, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { fetchBanners } from '@/store/bannerSlice';

const HeroCarousel = () => {
  const [api, setApi] = useState<any>();
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);
  const dispatch = useDispatch();
  const { banners, loading } = useSelector((state: any) => state.banners);
  const heroBanners = banners.filter((b: any) => b.type === 'hero');
  const fallbackHeroBanners = [
    {
      id: 'demo-hero-1',
      imageUrl: '/images/banner1.jpg',
      mobileImageUrl: '',
      type: 'hero',
      category: 'Living Room',
      title: 'Demo Banner 1',
    },
    {
      id: 'demo-hero-2',
      imageUrl: '/images/banner2.jpg',
      mobileImageUrl: '',
      type: 'hero',
      category: 'Bedroom',
      title: 'Demo Banner 2',
    },
    {
      id: 'demo-hero-3',
      imageUrl: '/images/banner3.jpg',
      mobileImageUrl: '',
      type: 'hero',
      category: 'Kids',
      title: 'Demo Banner 3',
    },
  ];
  const displayBanners = heroBanners.length > 0 ? heroBanners : fallbackHeroBanners;

  useEffect(() => {
    if (!banners.length) dispatch(fetchBanners() as any);
  }, [dispatch, banners.length]);

  useEffect(() => {
    if (!api) return;
    const onSelect = () => {
      const newIndex = api.selectedScrollSnap();
      setDirection(newIndex > current ? 1 : -1);
      setCurrent(newIndex);
    };
    api.on("select", onSelect);
    api.on("reInit", onSelect);
    return () => {
      api.off("select", onSelect);
    };
  }, [api, current]);

  useEffect(() => {
    if (!api) return;
    const interval = setInterval(() => {
      api.scrollNext();
    }, 5000);
    return () => clearInterval(interval);
  }, [api]);

  if (loading) return <div className="h-64 flex items-center justify-center text-gray-500">Loading banners...</div>;

  return (
    <div className="relative mt-4 max-w-[1400px] mx-auto px-4 group">
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        setApi={setApi}
        className="w-full group"
      >
        <CarouselContent>
          {displayBanners.map((banner, idx) => (
            <CarouselItem key={banner.id || idx}>
              <Link to={banner.category ? `/category/${encodeURIComponent(banner.category)}` : "/"} className="block group">
                <div className="relative h-[250px] md:h-[350px] lg:h-[450px] w-full overflow-hidden rounded-xl cursor-pointer">
                  <picture>
                    {banner.mobileImageUrl && (
                      <source srcSet={banner.mobileImageUrl} media="(max-width: 768px)" />
                    )}
                    <img
                      src={banner.imageUrl}
                      alt={banner.title || 'Banner'}
                      className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105 bg-gray-100"
                    />
                  </picture>
                  {/* Overlay with title and CTA on hover */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                    <div className="text-center">
                      <span
                        className="inline-block px-8 py-3 rounded-full bg-white text-black font-semibold shadow-lg transition-all duration-300 cursor-pointer transform hover:bg-gray-100 hover:scale-110 hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-black"
                        style={{ boxShadow: '0 4px 24px 0 rgba(0,0,0,0.10)' }}
                      >
                        {banner.title || 'Shop Now'}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
        {/* Navigation Buttons - Inset inside hero banner */}
        <div className="absolute inset-y-0 left-14 flex items-center z-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <CarouselPrevious className="bg-white/90 hover:bg-white text-black border-none shadow-lg cursor-pointer" />
        </div>
        <div className="absolute inset-y-0 right-14 flex items-center z-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <CarouselNext className="bg-white/90 hover:bg-white text-black border-none shadow-lg cursor-pointer" />
        </div>
      </Carousel>
    </div>
  );
};

export default HeroCarousel;