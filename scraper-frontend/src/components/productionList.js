import React, { useState } from "react";

const ProductList = () => {
  const [keyword, setKeyword] = useState("nike");
  const [pageNumber, setPageNumber] = useState(1);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5555/scrape", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ keyword, pageNumber }),
      });
      const data = await response.json();
      setProducts(data.data || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setLoading(false);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold text-center mb-4">🔍 eBay Product Scraper</h1>
      <div className="flex justify-center gap-4 mb-4">
        <input
          type="text"
          className="border p-2 rounded"
          placeholder="Enter keyword..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        <input
          type="number"
          className="border p-2 rounded"
          value={pageNumber}
          onChange={(e) => setPageNumber(Number(e.target.value))}
          min="1"
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={fetchProducts}
          disabled={loading}
        >
          {loading ? "Fetching..." : "Search"}
        </button>
      </div>

      <table className="min-w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 p-2">Name</th>
            <th className="border border-gray-300 p-2">Price</th>
            <th className="border border-gray-300 p-2">Description</th>
            <th className="border border-gray-300 p-2">Link</th>
          </tr>
        </thead>
        <tbody>
          {products.length === 0 ? (
            <tr>
              <td colSpan="4" className="text-center p-4">No products found</td>
            </tr>
          ) : (
            products.map((product, index) => (
              <tr key={index} className="hover:bg-gray-100">
                <td className="border border-gray-300 p-2">{product.name}</td>
                <td className="border border-gray-300 p-2">{product.price}</td>
                <td className="border border-gray-300 p-2">{product.description}</td>
                <td className="border border-gray-300 p-2">
                  <a href={product.link} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                    View
                  </a>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ProductList;
