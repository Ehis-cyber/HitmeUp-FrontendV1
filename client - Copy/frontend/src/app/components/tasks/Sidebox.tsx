//sidebox
'use client'
import React from 'react';

function CategoryCard({ emoji, title }: { emoji: string; title: string }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm flex items-center gap-2">
      <span className="text-lg">{emoji}</span>
      <div className="font-bold">{title}</div>
    </div>
  );
}

  export default function SideBox() {
  return (
    <div className="flex flex-col gap-4">
      <CategoryCard emoji="🚚" title="Moving Services" />
      <CategoryCard emoji="🏃‍♀️" title="Errands" />
      <CategoryCard emoji="🍔" title="Food Delivery" />
      <CategoryCard emoji="📚" title="Tutoring" />
      <CategoryCard emoji="🌸" title="Gardening/Cleaning Services" />
      <CategoryCard emoji="🔧" title="Artisan" />
      <CategoryCard emoji="💻" title="Graphics and Development" />

      
    </div>
  );

}


