import React, { useState, useEffect } from "react";
import axios from "axios";
import Buffer from "buffer";
import { imagefrombuffer } from "imagefrombuffer";

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const getProducts = async () => {
    try {
      const response = await axios.get("/api/owner/allproducts");
      setProducts(response.data.products);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  return (
    <>
      <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <a href="/" className="flex items-center group">
                <img
                  src="/images/logo.png"
                  className="h-8 w-auto transform group-hover:scale-110 transition-transform duration-300"
                  alt="Logo"
                />
                <span className="ml-2 text-xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  getFast
                </span>
              </a>
            </div>

            <div className="hidden md:flex items-center space-x-6">
              <a
                href="/shop"
                className="menu-transition text-gray-700 hover:text-blue-600 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-blue-600 hover:after:w-full after:transition-all"
              >
                Shop
              </a>
              <a
                href="/cart"
                className="menu-transition text-gray-700 hover:text-blue-600 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-blue-600 hover:after:w-full after:transition-all"
              >
                Cart
              </a>
              <a
                href="/login"
                className="menu-transition text-gray-700 hover:text-blue-600 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-blue-600 hover:after:w-full after:transition-all"
              >
                Login
              </a>
            </div>
          </div>
        </div>
      </nav>

      <main
        className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
        data-scroll-section
      >
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-64 flex-shrink-0 space-y-8">
            <div className="bg-white p-6 rounded-xl shadow-sm fade-in">
              <h3 className="font-medium text-gray-900 mb-4 text-lg">
                Sort By
              </h3>
              <form action="/shop" className="flex items-center">
                <select
                  name="sortby"
                  className="w-full rounded-lg border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="popular">Popular</option>
                  <option value="newest">Newest</option>
                </select>
              </form>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm fade-in">
              <h3 className="font-medium text-gray-900 mb-4 text-lg">
                Categories
              </h3>
              <div className="flex flex-col space-y-3">
                <a
                  href="#"
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  New Collection
                </a>
                <a
                  href="#"
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  All Products
                </a>
                <a
                  href="#"
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Discounted Products
                </a>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm fade-in">
              <h3 className="font-medium text-gray-900 mb-4 text-lg">
                Filters
              </h3>
              <div className="flex flex-col space-y-3">
                <a
                  href="#"
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Availability
                </a>
                <a
                  href="#"
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Discount
                </a>
              </div>
            </div>
          </div>

          {success && (
            <div className="mt-4 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-lg shadow-lg">
                <div className="flex items-center justify-between">
                  <p className="text-sm md:text-base">{success}</p>
                  <button
                    onClick={(e) =>
                      e.target.parentElement.parentElement.remove()
                    }
                    className="ml-4 text-white hover:text-green-200 transition-colors"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      ></path>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="flex-1">
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product, index) => (
                <div
                  key={index}
                  className="product-card bg-white rounded-xl shadow-sm overflow-hidden fade-in border border-gray-100"
                >
                  <div
                    className="h-48 flex items-center justify-center"
                    style={{ backgroundColor: product.bgcolor }}
                  >
                    <img
                      src={imagefrombuffer({
                        type: product.image?.contentType,
                        data: product.image?.data?.data,
                      })}
                    />
                  </div>
                  <div
                    className="p-4"
                    style={{ backgroundColor: product.panelcolor }}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h3
                          className="font-medium text-lg product-name"
                          style={{ color: product.textcolor }}
                        >
                          {product.name}
                        </h3>
                        {product.discount ? (
                          <>
                            <p
                              className="font-bold mt-2"
                              style={{ color: product.textcolor }}
                            >
                              ₹{product.price - product.discount}
                            </p>
                            <p
                              className="text-sm text-green-500"
                              style={{ color: product.textcolor }}
                            >
                              (
                              {Math.round(
                                (product.discount /
                                  (product.price + product.discount)) *
                                  100
                              )}
                              % off)
                            </p>
                            <p className="text-sm text-gray-400 line-through font-semibold">
                              ₹{product.price}
                            </p>
                          </>
                        ) : (
                          <p
                            className="font-bold mt-2"
                            style={{ color: product.textcolor }}
                          >
                            ₹{product.price}
                          </p>
                        )}
                      </div>
                      <a
                        href={`/addtocart/${index}`}
                        className="p-3 bg-white rounded-full hover:bg-gray-50 transition-all duration-300 hover:shadow-md"
                      >
                        <i className="ri-add-line text-gray-700"></i>
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Shop;
