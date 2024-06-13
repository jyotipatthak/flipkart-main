import React from "react";
import { FaHeart, FaBookmark, FaTimes } from 'react-icons/fa';

const ProductModal = ({ product, onClose }) => {
  // const [bookmarkedItems, setBookmarkedItems] = useState([]);
  // const [wishlistItems, setWishlistItems] = useState([]);

  if (!product) return null;

  // Generate a random discount between 5% and 30%
  const discount = Math.floor(Math.random() * 26) + 5;

  // const handleBookmark = (product) => {
  //   setBookmarkedItems(prevItems => {
  //     if (prevItems.includes(product.id)) {
  //       return prevItems.filter(id => id !== product.id);
  //     } else {
  //       return [...prevItems, product.id];
  //     }
  //   });
  // };

  // const handleWishlist = (product) => {
  //   setWishlistItems(prevItems => {
  //     if (prevItems.includes(product.id)) {
  //       return prevItems.filter(id => id !== product.id);
  //     } else {
  //       return [...prevItems, product.id];
  //     }
  //   });
  // };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-4 rounded-lg w-full h-full max-w-none flex flex-col md:flex-row overflow-y-auto">
        <button onClick={onClose} className="absolute top-2 right-2 text-black z-10">
          <FaTimes />
        </button>
        
        <img
          className="h-80 w-96 mt-16 mb-4 rounded cursor-pointer object-contain"
          src={product.image}
          alt={product.title}
        />
        <div className="md:ml-4  flex-col justify-between w-full md:w-1/2 p-4">
          <div>
            <h3 className="text-lg mt-6 font-bold mb-2">{product.title}</h3>
            <p className="text-md  mt-6 font-bold mb-2">Price: ${product.price}</p>
            <p className="text-sm mt-6 mb-4">{product.description}</p>
          </div>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <button className="bg-red-700 mt-6 hover:bg-red-900 text-white font-bold py-2 px-4 rounded-full flex items-center">
              <FaHeart className="mr-2" /> Wishlist
            </button>
            <button className="bg-blue-500 hover:bg-blue-600 mt-6 text-white font-bold py-2 px-4 rounded-full flex items-center">
              <FaBookmark className="mr-2" /> Bookmark
            </button>
            
          </div>
          <div className=" md:mt-0">
            <p className="text-sm text-gray-500"> <span className="text-red-500 text-lg font-bold">{discount}%</span> off</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
