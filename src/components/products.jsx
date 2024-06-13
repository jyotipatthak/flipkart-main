import React, { useEffect, useState } from 'react';
import PriceFilter from '../filters/pricefilter';
import Search from '../ui/Searchbar';
import { FaInstagram, FaGithub, FaLinkedin, FaBookmark, FaHeart } from "react-icons/fa";
import { useDispatch, useSelector } from 'react-redux';
import { addItemToCart, removeItemFromCart } from '../redux/actions';
import ProductModal from '../filters/ProductModal';

function Product() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookmarkedItems, setBookmarkedItems] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);

  const cart = useSelector(state => state.cart);
  const dispatch = useDispatch();

  const applyRandomPriceChange = (price) => {
    const changePercentage = (Math.random() - 0.5) * 0.2; // -10% to +10%
    return price + (price * changePercentage);
  };

  const applyRandomDiscount = () => {
    return Math.floor(Math.random() * 21); // 0% to 20%
  };

  const fetchProducts = async (category = null, title = "") => {
    try {
      setIsLoading(true);
      let url = 'https://fakestoreapi.com/products';
      if (category) {
        url = `https://fakestoreapi.com/products/category/${encodeURIComponent(category)}`;
      } else if (title) {
        url = `https://fakestoreapi.com/products?title=${title}`;
      }
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await res.json();

      // Apply random price changes and discounts
      const productsWithPriceChanges = data.map(product => {
        const newPrice = applyRandomPriceChange(product.price);
        const discount = applyRandomDiscount();
        const discountedPrice = newPrice - (newPrice * (discount / 100));
        return {
          ...product,
          price: newPrice,
          discount,
          discountedPrice
        };
      });

      setProducts(productsWithPriceChanges);
      setFilteredProducts(productsWithPriceChanges);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(selectedCategory);
  }, [selectedCategory]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('https://fakestoreapi.com/products/categories');
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await res.json();
        setCategories(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryClick = (category) => {
    setSelectedCategory(prevCategory => prevCategory === category ? null : category);
  };

  const handleSearch = (title) => {
    const filtered = products.filter(product => product.title.toLowerCase().includes(title.toLowerCase()));
    setFilteredProducts(filtered);
  };

  const handlePriceFilter = (minPrice, maxPrice) => {
    const filtered = products.filter(product => {
      const price = product.price;
      return (!minPrice || price >= minPrice) && (!maxPrice || price <= maxPrice);
    });
    setFilteredProducts(filtered);
  };

  const handleImageClick = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const handleAddToCart = (product) => {
    dispatch(addItemToCart(product));
  };

  const handleRemoveFromCart = (productId) => {
    dispatch(removeItemFromCart(productId));
  };

  const handleBookmark = (product) => {
    setBookmarkedItems(prevItems => {
      if (prevItems.includes(product.id)) {
        return prevItems.filter(id => id !== product.id);
      } else {
        return [...prevItems, product.id];
      }
    });
  };

  const handleWishlist = (product) => {
    setWishlistItems(prevItems => {
      if (prevItems.includes(product.id)) {
        return prevItems.filter(id => id !== product.id);
      } else {
        return [...prevItems, product.id];
      }
    });
  };

  return (
    <div className="min-h-screen flex flex-col mt-4 md:flex-row">
      <aside className="w-full md:w-1/4 rounded-3xl bg-slate-400 text-white p-4">
        <h2 className="text-2xl text-black text-center font-bold mb-4">Categories</h2>
        <div className="flex flex-col gap-2">
          {categories.map((category, index) => (
            <p
              key={index}
              className={`text-sm font-bold cursor-pointer px-4 py-2 rounded-lg transition-colors ${
                category === selectedCategory ? 'bg-[#1a2259] text-white' : 'bg-white text-blue-700 hover:bg-blue-200'
              }`}
              onClick={() => handleCategoryClick(category)}
            >
              {category}
            </p>
          ))}
          
          <PriceFilter onFilter={handlePriceFilter} />
          <div className='mt-10'><Search  onSearch={handleSearch} /></div>
          <div className="flex  text-2xl mt-10 text-white space-x-4">
            <a href="https://github.com" className="hover:text-blue-600"><FaGithub /></a>
            <a href="https://instagram.com" className="hover:text-blue-600"><FaInstagram /></a>
            <a href="https://linkedin.com" className="hover:text-blue-600"><FaLinkedin /></a>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col ml-4">
        <div className="flex flex-wrap -m-2">
          {isLoading ? (
            <p>Loading...</p>
          ) : (
            filteredProducts.map((product) => (
              <div key={product.id} className="relative w-full sm:w-1/2 md:w-1/3 lg:w-1/3 p-2">
                <div className="bg-white border rounded-lg shadow-lg flex flex-col items-center p-4">
                  <img
                    className="h-40 w-full mb-4 rounded cursor-pointer object-contain"
                    src={product.image}
                    alt={product.title}
                    onClick={() => handleImageClick(product)}
                  />
                  <div className="absolute top-4 left-4 flex gap-2">
                    <FaBookmark
                      className={`text-2xl cursor-pointer ${bookmarkedItems.includes(product.id) ? 'text-blue-500' : 'text-black'}`}
                      onClick={() => handleBookmark(product)}
                    />
                    <FaHeart
                      className={`text-2xl cursor-pointer ${wishlistItems.includes(product.id) ? 'text-blue-500' : 'text-red-700'}`}
                      onClick={() => handleWishlist(product)}
                    />
                                        
                  </div>
                  <div className="absolute top-4 right-4 flex gap-2">
                  <p className="text-lg font-bold text-red-900 mb-2"> {product.discount}%</p>
                  </div>
                  <h3 className="text-sm font-bold text-gray-800 mb-2 text-center">{product.title}</h3>
                  <div className="flex gap-4 items-center m-2">
                    <p className="text-lg font-semibold text-gray-900 mb-2">${product.price.toFixed(2)}</p>

                    
                    {cart[product.id] ? (
                      <button
                        className="bg-blue-900 text-white px-4 py-1 rounded-lg font-bold text-sm hover:bg-blue-900 transition"
                        onClick={() => handleRemoveFromCart(product.id)}
                      >
                        Remove Item
                      </button>
                    ) : (
                      <button
                        className="bg-indigo-700 text-white px-4 py-1 font-bold text-sm rounded-lg hover:bg-indigo-900 transition"
                        onClick={() => handleAddToCart(product)}
                      >
                        Add to Cart
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        {error && <p className="text-red-500 text-center mt-4">{error}</p>}
        {isModalOpen && <ProductModal product={selectedProduct} onClose={handleCloseModal} />}
      </div>
    </div>
  );
}

export default Product;
