import { /*createContext, */useContext } from "react";
import { AuthContext } from "./AuthContext";
import { CartContext } from "./CartContext";
import { usePersistedState } from "../hooks/usePersistedState";
//import LocalStorage from "../libs/LocalStorage";
//import config from "../config";

const initialStateCart = {
  acceptToReceiveOffersEmails: false,
  deliveryCode: "-",
  isGift: false,
  items: [],
};

//const CartContext = createContext();


export const CartProvider = ({ children }) => {
  const { auth, isLoggedIn } = useContext(AuthContext);
  const [cart, setCart] = usePersistedState(`cart-${isLoggedIn ? auth.user.id : "0"}`, initialStateCart);

  const cartItemsQuantity = () => {
    return cart?.items?.reduce((total, item) => total + item.quantity, 0) ?? 0;
  };

  const setCartProperty = (propertyName, propertyValue) => {
    if (!Object.hasOwn(cart, propertyName)) {
      console.warn(`cart object has no property "${propertyName}", refusing to set it`);
      return;
    }
    setCart(prevCart => ({
      ...prevCart,
      [propertyName]: propertyValue,
    }));
    //saveCart();
  };

  const addItemToCart = (item) => {
    let newCount;
    setCart(prevCart => {
      // check if the item is already in the cart
      const existingItem = prevCart.items.find(cartItem => cartItem._id === item._id);
  
      const updatedItems = existingItem ? // update the quantity of the existing item
        prevCart.items.map(cartItem =>
          cartItem._id === item._id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        )
      : // add the new item to the cart
        [...prevCart.items, { ...item, quantity: item.quantity ?? 1 }]
      ;
    
      // calculate new count here where we have access to the updated items
      newCount = updatedItems.reduce((total, item) => total + item.quantity, 0);
      
      // update only items, keep the rest of the cart unchanged
      const updatedCart = {
        ...prevCart,
        items: updatedItems,
      };
      setCart(updatedCart);
      return updatedCart;
    });
    
    return newCount;
  };

  const removeItemFromCart = (id) => {
    setCart(prevCart => {
      const updatedCart = {
        ...prevCart,
        items: prevCart.items.filter((item) => item._id !== id)
      };
      setCart(updatedCart);
      return updatedCart;
    });
  };

  const emptyCartItems = () => {
    setCart(prevCart => {
      const updatedCart = {
        ...prevCart,
        items: [],
      };
      setCart(updatedCart);
      return updatedCart;
    });
  };

  const setItemQuantity = (id, quantity) => {
    setCart(prevCart => {
      const updatedCart = {
        ...prevCart,
        items: prevCart.items.map(item =>
          item._id === id
            ? { ...item, quantity }
            : item
        )
      };
      return updatedCart;
    });
  };

  const resetCart = () => {
    setCart(initialStateCart);
  };

  return (
    <CartContext.Provider value={{
      cart, setCartProperty, addItemToCart, removeItemFromCart, emptyCartItems, cartItemsQuantity, setItemQuantity, resetCart
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
