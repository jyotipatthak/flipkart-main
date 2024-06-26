import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { removeItemFromCart, updateItemQuantityInCart } from '../redux/actions';
import { FaTrash } from 'react-icons/fa';

function Cart() {
  const cart = useSelector((state) => state.cart);
  const isAuthenticated = useSelector((state) => state.isAuthenticated);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleRemoveFromCart = (productId) => {
    dispatch(removeItemFromCart(productId));
  };

  const handleUpdateQuantityCart = (productId, quantity) => {
    dispatch(updateItemQuantityInCart(productId, quantity));
  };

  const totalPrice = Object.values(cart).reduce((acc, item) => {
    const product = item.product;
    if (product) {
      return acc + (product.price || 0) * item.quantity;
    }
    return acc;
  }, 0);

  const handleCheckout = () => {
    if (isAuthenticated) {
      navigate('/checkout');
    } else {
      navigate('/signup');
    }
  };

  return (
    <div className="bg-gray-50 text-gray-800 min-h-screen mt-20 px-8">
      <h2 className="text-4xl font-extrabold mb-12 text-center text-gray-900 sm:mt-20">
        Shopping Cart
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {Object.values(cart).map((item, index) => {
          const product = item.product;
          return (
            <div
              key={index}
              className="border rounded-lg flex flex-col p-6 bg-white shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              {product && (
                <>
                  <img
                    key={product.id + '_image'}
                    className="w-full h-40 object-cover mb-4 rounded-lg cursor-pointer hover:opacity-90 transition-opacity duration-300"
                    src={product.image}
                    alt={product.title}
                  />
                  <h3
                    className="text-lg font-semibold mb-2 text-gray-900"
                    key={product.id + '_title'}
                  >
                    {product.title}
                  </h3>
                  <p
                    className="text-xl font-bold mb-4 text-indigo-600"
                    key={product.id + '_price'}
                  >
                    ${product.price}
                  </p>
                </>
              )}
              {product && product.id in cart && (
                <div
                  className="flex items-center space-x-2"
                  key={product.id + '_buttons'}
                >
                  {cart[product.id].quantity === 1 ? (
                    <button
                      onClick={() => handleRemoveFromCart(product.id)}
                      className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-3 rounded-full transition-colors duration-300"
                    >
                      <FaTrash className="text-white" />
                    </button>
                  ) : (
                    <button
                      onClick={() => handleUpdateQuantityCart(product.id, cart[product.id].quantity - 1)}
                      className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-3 rounded-full transition-colors duration-300"
                    >
                      -1
                    </button>
                  )}

                  <input
                    id="quantity-input"
                    type="number"
                    min={0}
                    value={cart[product.id]?.quantity || 0}
                    onChange={(e) => handleUpdateQuantityCart(product.id, parseInt(e.target.value, 10))}
                    className="text-center border border-gray-300 rounded py-2 px-4 w-16"
                  />

                  <button
                    onClick={() => handleUpdateQuantityCart(product.id, cart[product.id].quantity + 1)}
                    className="bg-green-500 hover:bg-green-600 text-white font-bold py-1 px-3 rounded-full transition-colors duration-300"
                  >
                    +1
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div className="mt-8 sm:mt-12 text-center">
        <p className="text-2xl font-bold mb-4">Total: ${totalPrice.toFixed(2)}</p>
        <button
          onClick={handleCheckout}
          className="hover:bg-indigo-500 bg-indigo-600 text-white font-bold py-3 px-6 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-300"
        >
          Checkout
        </button>
      </div>
    </div>
  );
}

export default Cart;
