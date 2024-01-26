import React, { useState } from 'react';
import { useCart } from '../../context/CartContext'; 
import Modal from 'react-modal';
import { useNavigate } from 'react-router-dom';

Modal.setAppElement('#root');

const CartWidget = () => {
  const { state, removeFromCart, clearCart } = useCart();
  const [isModalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleCartIconClick = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const handleRemoveItem = (itemId) => {
    removeFromCart(itemId);
  };

  const handleClearCart = () => {
    clearCart();
    closeModal();
  };

  const handleCheckout = () => {
    setModalOpen(false);
    navigate("/checkout");
  };

  return (
    <div className="relative">
      <a href="#" onClick={handleCartIconClick} className="hover:text-orange-600">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
        </svg>

        {state.cartItems.length > 0 && (
          <span className="bg-orange-700 text-white rounded-full px-2 py-1 text-xs absolute -mt-2 -ml-2">
            {state.cartItems.length}
          </span>
        )}
      </a>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Bolsa de Compras"
        style={{
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 999,
          },
          content: {
            width: '80%',
            maxHeight: '80vh',
            margin: 'auto',
            backgroundColor: '#fff',
            border: '2px solid #000',
            borderRadius: '8px',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          },
        }}
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Bolsa de compras</h2>
        {state.cartItems.length === 0 ? (
          <p>Tu bolsa de compras está vacía, añade alguna prenda para que puedas visualizarlo aquí.</p>
        ) : (
          <div className="overflow-y-auto max-h-60vh">
            <ul className="grid grid-cols-1 gap-4 w-full text-center">
              {state.cartItems.map(item => (
                <li key={item.id} className="border-b py-4 w-full flex items-center ">
                  <img src={`/${item.image}`} alt={item.name} className="w-16 h-16 mr-4 object-cover" />

                  <div>
                    <span>{item.name}</span>
                    <div className="flex items-center">
                      <span className="mr-2">{item.price}</span>
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="text-red-500 hover:text-red-700 focus:outline-none"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                          <path fillRule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
        <div className="flex mt-4">
          <button
            onClick={handleClearCart}
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 mr-2"
          >
            Vaciar Bolsa
          </button>
          <button
            onClick={closeModal}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 ml-2"
          >
            Cerrar
          </button>
        </div>

        {state.cartItems.length > 0 && (
          <button
            onClick={handleCheckout}
            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 mt-4"
          >
            Finalizar mi compra
          </button>
        )}
      </Modal>
    </div>
  );
};

export default CartWidget;

