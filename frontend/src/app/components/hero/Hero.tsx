import React from 'react';
import SearchForm from './SearchForm';

export default function Hero() {
  return (
    <section className="container mx-auto my-16 px-6 lg:px-0">
      <div className="flex flex-col items-center justify-center text-center space-y-6">
        <h1 className="text-4xl font-bold lg:text-6xl text-gray-800 leading-tight">
          Let's run your tasks, <span className="text-purple-500">HitMeUp!</span>
        </h1>
        <p className="text-lg text-gray-600 lg:text-xl max-w-2xl">
        Need a hand? Find help for any task — fast and easy.
        </p>
        <SearchForm />
      </div>
    </section>
  );
}
