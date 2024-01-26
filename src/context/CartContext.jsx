import React, { createContext, useContext, useReducer } from "react";

// Estado inicial del carrito
const initialState = {
  cartItems: [],
};

// Contexto
const CartContext = createContext(); // Crea el contexto del carrito

// Definir tipos de acciones
const ADD_TO_CART = "ADD_TO_CART";
const REMOVE_FROM_CART = "REMOVE_FROM_CART";
const CLEAR_CART = "CLEAR_CART";

// Crear el proveedor del contexto
const CartProvider = ({ children }) => {
  // Definir el reducer para manejar las acciones del carrito
  const cartReducer = (state, action) => {
    switch (action.type) {
      case ADD_TO_CART:
        const existingProductIndex = state.cartItems.findIndex(item => item.id === action.payload.id);

        if (existingProductIndex !== -1) {
          // El producto ya está en el carrito, actualizar la cantidad
          const updatedCart = [...state.cartItems];
          updatedCart[existingProductIndex].quantity += 1;

          return {
            ...state,
            cartItems: updatedCart,
          };
        } else {
          // Agg el nuevo producto al carrito con cantidad 1
          return {
            ...state,
            cartItems: [...state.cartItems, { ...action.payload, quantity: 1 }],
          };
        }

      case REMOVE_FROM_CART:
        return {
          ...state,
          cartItems: state.cartItems.filter(item => item.id !== action.payload),
        };

      case CLEAR_CART:

        return {
          ...state,
          cartItems: [],
        };

      default:
        return state;
    }
  };

  // Configurar el estado y el dispatch con useReducer
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Definir las acciones del carrito que estarán disponibles para los componentes
  const addToCart = (item) => {
    dispatch({ type: ADD_TO_CART, payload: item });
  };

  const removeFromCart = (itemId) => {
    dispatch({ type: REMOVE_FROM_CART, payload: itemId });
  };

  const clearCart = () => {
    dispatch({ type: CLEAR_CART });
  };

  // Devolver el proveedor y el contexto para envolver la aplicación
  return (
    <CartContext.Provider value={{ state, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart debe usarse dentro de un CartProvider");
  }
  return context;
};

export { CartProvider, useCart };
