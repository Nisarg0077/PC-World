import { createContext, useReducer, useContext, useEffect } from "react";
import axios from "axios";

const initialState = {
  cartItems: [],
  loading: true,
};

const cartReducer = (state, action) => {
    switch (action.type) {
      case "SET_CART":
        return {
          ...state,
          cartItems: action.payload,
          loading: false,
        };
      case "ADD_ITEM":
        
        return {
          ...state,
          cartItems: [...state.cartItems, action.payload],
          
        };
      case "REMOVE_ITEM":
        return {
          ...state,
          cartItems: state.cartItems.filter((item) => item.product !== action.payload),
        };
      case "INCREASE_QUANTITY":
        return {
          ...state,
          cartItems: state.cartItems.map((item) =>
            item.product === action.payload ? { ...item, quantity: item.quantity + 1 } : item
          ),
        };
        case "DECREASE_QUANTITY":
            return {
              ...state,
              cartItems: state.cartItems
                .map((item) =>
                  item.product === action.payload
                    ? { ...item, quantity: item.quantity - 1 }
                    : item
                )
                .filter((item) => item.quantity > 0), 
            };
            case "UPDATE_QUANTITY":
                return {
                  ...state,
                  cartItems: state.cartItems.map((item) =>
                    item.product === action.payload.product
                      ? { ...item, quantity: action.payload.quantity }
                      : item
                  ),
                };
              
          
      case "CLEAR_CART":
        return { ...state, cartItems: [] };
      default:
        return state;
    }
  };
  

// Create Context
const CartContext = createContext();

// Cart Provider
export const CartProvider = ({ children }) => {
    const [state, dispatch] = useReducer(cartReducer, initialState);
  
    // Fetch Cart from API
    const fetchCart = async (userId) => {
      try {
        const response = await axios.get(`http://localhost:5000/api/cart/${userId}`);
        dispatch({ type: "SET_CART", payload: response.data.cartItems || [] });
      } catch (error) {
        console.error("Failed to fetch cart:", error);
      }
    };
    
    const clearCart = () => {
      dispatch({ type: "CLEAR_CART" });
    };
    // Get total cart count
    const cartCount = state.cartItems.reduce((total, item) => total + item.quantity, 0);

  
    return (
        <CartContext.Provider value={{ state, dispatch, fetchCart, cartCount, clearCart  }}>
        {children}
      </CartContext.Provider>
    );
  };
  
export const useCart = () => useContext(CartContext);
