'use client';
import React from 'react';

function CategoryCard({ emoji, title }: { emoji: string; title: string }) {
  return (
    <div className="bg-gradient-to-r from-purple-500 to-indigo-500 p-3 rounded-md shadow-md flex items-center gap-3 hover:scale-105 transition-transform duration-300 cursor-pointer">
      <span className="text-xl bg-white p-1 rounded-full shadow-md">{emoji}</span>
      <div className="text-white font-medium text-sm">{title}</div>
    </div>
  );
}

export default function SideBox() {
  return (
    <div className="bg-gray-50 p-4 rounded-lg shadow-lg">
      <h2 className="text-lg font-bold text-gray-800 mb-3">Categories</h2>
      <p className="text-gray-600 mb-3">
        From Grocery Runs to Virtual Assistance — We’ve Got You!
      </p>
      <div className="flex flex-col gap-3">
        <CategoryCard emoji="🚚" title="Moving Services" />
        <CategoryCard emoji="🏃‍♀️" title="Errands" />
        <CategoryCard emoji="🍔" title="Food Delivery" />
        <CategoryCard emoji="📚" title="Tutoring" />
        <CategoryCard emoji="🌸" title="Gardening/Cleaning Services" />
        <CategoryCard emoji="🔧" title="Artisan" />
        <CategoryCard emoji="💻" title="Graphics and Development" />
      </div>
    </div>
  );
}