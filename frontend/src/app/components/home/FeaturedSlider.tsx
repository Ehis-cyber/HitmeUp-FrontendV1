"use client";

import React, {useEffect, useState} from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination } from 'swiper/modules';

interface FeaturedGig {
  id: string;
  taskTitle: string;
  description: string;
  image: string;
  location?: string; // Optional location property
}

const FeaturedSlider: React.FC = () => {
  const [featuredGigs, setFeaturedGigs] = useState<FeaturedGig[]>([]);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        // Ensure this component only renders on the client
        setIsClient(true);

        // Fetch random tasks from the backend
        const fetchFeaturedGigs = async () => {
          try {
            const response = await fetch("http://localhost:8800/api/tasks/random");
            const data = await response.json();
            const formattedGigs = data.map((task: any) => ({
              id: task._id,
              taskTitle: task.taskTitle,
              description: task.jobDescription,
              image: task.companyLogo_userimage || "/images/featured2.jpg", // Use Cloudinary URL or fallback
              location: task.location,
            }));
            setFeaturedGigs(formattedGigs);
          } catch (err) {
            console.error("Failed to fetch featured gigs:", err);
          }
        };
    
        fetchFeaturedGigs();
      }, []);
    
      if (!isClient) {
        // Prevent rendering on the server
        return null;
      }

      return (
        <div className="my-8 bg-gray-100 py-6 px-4 rounded-lg">
          <h2 className="text-2xl font-bold mb-4 text-center">Featured Tasks</h2>
          <Swiper
            modules={[Navigation, Pagination]}
            navigation
            pagination={{ clickable: true }}
            spaceBetween={20}
            slidesPerView={1}
            breakpoints={{
              640: { slidesPerView: 1 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
          >
            {featuredGigs.map((gig) => (
              <SwiperSlide key={gig.id}>
                <div className="relative bg-white rounded-lg shadow-lg overflow-hidden transform transition-transform hover:scale-105 hover:shadow-xl">
                  <img
                    src={gig.image}
                    alt={gig.taskTitle}
                    className="w-full h-40 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-lg font-semibold">{gig.taskTitle}</h3>
                    <p className="text-sm text-gray-600">{gig.description}</p>
                    {gig.location && (
                      <p className="text-xs text-gray-500 italic">{gig.location}</p>
                    )}
                    <button className="mt-4 bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700">
                      Learn More
                    </button>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      );
    };
    
    export default FeaturedSlider;