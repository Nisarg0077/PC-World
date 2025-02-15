import React, { useState, useEffect } from "react";

const FilterPanel = ({ categories, products, onFilterChange }) => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [maxProductPrice, setMaxProductPrice] = useState(10000);
  const [priceRange, setPriceRange] = useState(10000);

  // Update max price based on products
  useEffect(() => {
    if (products.length > 0) {
      const highestPrice = Math.max(...products.map((p) => Number(p.price)));
      setMaxProductPrice(highestPrice);
      setPriceRange(highestPrice);
    }
  }, [products]);

  const handleCategoryChange = (e) => {
    const category = e.target.value;
    setSelectedCategory(category);
    onFilterChange({ category, price: priceRange });
  };

  const handlePriceChange = (e) => {
    const price = Number(e.target.value);
    setPriceRange(price);
    onFilterChange({ category: selectedCategory, price });
  };

  return (
    <div className="bg-white p-4 shadow-md rounded-lg m-2 w-2/12">
      <h3 className="text-lg font-semibold mb-2">Filter Products</h3>

      {/* Category Filter */}
      <label className="block mb-2 text-sm font-medium">Category</label>
      <select
        className="w-full border p-2 rounded-md"
        onChange={handleCategoryChange}
      >
        <option value="">All Categories</option>
        {categories.map((category, index) => (
          <option key={index} value={category}>
            {category.toUpperCase()}
          </option>
        ))}
      </select>

      {/* Price Range Filter */}
      <label className="block mt-4 mb-2 text-sm font-medium">
        Max Price: ₹{priceRange}
      </label>
      <input
        type="range"
        min="100"
        max={maxProductPrice}
        value={priceRange}
        onChange={handlePriceChange}
        className="w-full"
      />
    </div>
  );
};

export default FilterPanel;
