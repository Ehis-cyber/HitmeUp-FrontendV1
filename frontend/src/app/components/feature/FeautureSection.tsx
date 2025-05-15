"use client";

import React from "react";
import { FaCheckCircle } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation } from "swiper/modules";
import { Pagination } from "swiper/modules";

export default function FeatureSection() {
  return (
    <div className="bg-gradient-to-b from-gray-50 to-gray-100 py-16">
      <div className="max-w-[1440px] mx-auto px-4 lg:px-8">
        <h2 className="text-4xl font-extrabold text-black-200 text-center mb-12">
          Explore the Marketplace
        </h2>
        <Swiper
          modules={[Navigation, Pagination]}
          navigation
          pagination={{ clickable: true }}
          spaceBetween={50}
          slidesPerView={1}
          className="w-full"
        >
          {/* Slide 1: Video Section */}
          <SwiperSlide>
            <div className="flex flex-col lg:flex-row items-center gap-12">
              {/* Video */}
              <div className="w-full lg:w-1/2">
                <div className="aspect-w-16 aspect-h-9">
                  <iframe
                    src="\video\videoRecording.mp4" // Replace with your video URL
                    title="Feature Video"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="rounded-lg shadow-lg w-full h-auto"
                  ></iframe>
                </div>
              </div>

              {/* Feature List */}
              <div className="w-full lg:w-1/2">
                <h3 className="text-3xl font-bold text-gray-800 mb-6">
                  Why Choose HitMeUp?
                </h3>
                <ul className="space-y-4">
                  <li className="flex items-center">
                    <FaCheckCircle className="text-purple-600 w-6 h-6 mr-3" />
                    <span className="text-gray-700 text-lg">
                      Connect with trusted taskers in your area.
                    </span>
                  </li>
                  <li className="flex items-center">
                    <FaCheckCircle className="text-purple-600 w-6 h-6 mr-3" />
                    <span className="text-gray-700 text-lg">
                      Save time and get tasks done efficiently.
                    </span>
                  </li>
                  <li className="flex items-center">
                    <FaCheckCircle className="text-purple-600 w-6 h-6 mr-3" />
                    <span className="text-gray-700 text-lg">
                      Affordable and transparent pricing.
                    </span>
                  </li>
                  <li className="flex items-center">
                    <FaCheckCircle className="text-purple-600 w-6 h-6 mr-3" />
                    <span className="text-gray-700 text-lg">
                      Wide range of services to meet your needs.
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </SwiperSlide>

          {/* Slide 2: Explore Services */}
          <SwiperSlide>
            <div className="flex flex-col lg:flex-row items-center gap-12">
              {/* Image */}
              <div className="w-full lg:w-1/2">
                <img
                  src="/images/handshake.jpg"
                  alt="Explore Services"
                  className="rounded-lg shadow-lg"
                />
              </div>

              {/* Text */}
              <div className="w-full lg:w-1/2">
                <h3 className="text-3xl font-bold text-gray-800 mb-6">
                  Discover New Opportunities
                </h3>
                <p className="text-gray-700 text-lg mb-6 leading-relaxed">
                  Find the perfect gig or task that matches your skills and
                  interests. Explore a wide range of categories and start
                  earning today!
                </p>
                <a
                  href="/tasks"
                  className="bg-purple-600 text-white px-6 py-3 rounded-lg shadow hover:bg-purple-700 transition"
                >
                  Browse Tasks
                </a>
              </div>
            </div>
          </SwiperSlide>

          {/* Slide 3: Join the Community */}
          <SwiperSlide>
            <div className="flex flex-col lg:flex-row items-center gap-12">
              {/* Image */}
              <div className="w-full lg:w-1/2">
                <img
                  src="/images/community.jpg"
                  alt="Join the Community"
                  className="rounded-lg shadow-lg"
                />
              </div>

              {/* Text */}
              <div className="w-full lg:w-1/2">
                <h3 className="text-3xl font-bold text-gray-800 mb-6">
                  Join Our Community
                </h3>
                <p className="text-gray-700 text-lg mb-6 leading-relaxed">
                  Be part of a growing community of taskers and clients. Share
                  your experiences, learn from others, and grow together.
                </p>
                <a
                  href="/community"
                  className="bg-purple-600 text-white px-6 py-3 rounded-lg shadow hover:bg-purple-700 transition"
                >
                  Join Now
                </a>
              </div>
            </div>
          </SwiperSlide>
        </Swiper>
      </div>
    </div>
  );
}