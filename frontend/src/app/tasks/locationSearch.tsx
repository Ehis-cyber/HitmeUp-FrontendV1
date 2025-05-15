import { useState } from "react";

interface LocationSearchProps {
  onLocationSelect: (location: string) => void; // Callback to pass the selected location
}

const LocationSearch: React.FC<LocationSearchProps> = ({ onLocationSelect }) => {
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const nigeriaLocations = [
  { state: "Lagos", cities: ["Lekki", "Ikeja", "Ikoyi","Victoria Island"] },
  { state: "Abuja", cities: ["Garki", "Wuse", "Bwari","Kubwa","Central Area","Maitama"] },
  { state: "Rivers", cities: ["Port Harcourt", "Rumu-","GRA", "Obio-Akpor"] },
];

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);

    if (value.length > 0) {
      const matches = nigeriaLocations.filter((loc) =>
        loc.state.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(matches.map((loc) => loc.state));
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearch(suggestion);
    setSuggestions([]);
    onLocationSelect(suggestion); // Pass the selected location to the parent component
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={search}
        onChange={handleSearchChange}
        placeholder="Search location"
        className="w-full px-4 py-2 border rounded-lg"
      />
      {suggestions.length > 0 && (
        <ul className="absolute bg-white border rounded-lg mt-2 w-full">
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LocationSearch;