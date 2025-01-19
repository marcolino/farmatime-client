import React, { createContext, useState, useContext, useEffect } from "react";
import LocalStorage from "../libs/LocalStorage";
import config from "../config";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const savedCart = LocalStorage.get("cart");
    return savedCart ? savedCart : {
      acceptToReceiveOffersEmails: false,
      deliveryCode: "-",
      items: [],
    };
  });

  // TODO: only to debug quickerly... :-)
  useEffect(() => {
    if (config.mode.development) {
      if (cart.items.length <= 0) {
        addToCart({
          _id: "67850399c0f7d5f4de20f33e",
          ampere: 300,
          application: "application-booh-1",
          createdAt: "2025-01-01T16:16:15.783Z",
          imageName: "307c0b605dbf48dcefe53bbb5582a881e60f8d4cabb05cbc29cbb1a6e047a4b9.webp",
          imageNameOriginal: "larga e bassa.png",
          isDeleted: false,
          kw: 1.7,
          make: "FIAT",
          mdaCode: "0332",
          models: ['TEMPRA 1.6ie (88-)', 'TIPO 1.4ie-digit (87-95)', 'TIPO 1.6 dgt-selecta (87-95)'],
          notes: "E' un bel motorino",
          oemCode: "oem-booh-1",
          regulator: "incorporato",
          rotation: "destra",
          teeth: 10,
          type: "motorino",
          updatedAt: "2025-01-05T15:13:07.035Z",
          volt: 12,
          price: 9999,
        });
      }
    }
  }, []);

  const setProperty = (propertyName, propertyValue) => {
    if (!Object.hasOwn(cart, propertyName)) {
      console.warning(`cart object has no property "${propertyName}", refusing to set it`);
      return;
    }
    setCart(prevCart => ({
      ...prevCart,
      [propertyName]: propertyValue,
    }));
  };

  const addToCart = (item) => {
    setCart((prevCart) => {
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
    
      // update only items, keep the rest of the cart unchanged
      return {
        ...prevCart,
        items: updatedItems,
      };
    });
  };

  const removeFromCart = (id) => {
    setCart(prevCart => ({
      ...prevCart,
      items: prevCart.items.filter((item) => item._id !== id)
    }));
  };

  const emptyCart = () => {
    setCart(prevCart => ({
      ...prevCart,
      items: [],
    }));
  };

  const setItemQuantity = (id, quantity) => {
    setCart(prevCart => ({
      ...prevCart,
      items: prevCart.items.map(item =>
        item._id === id
          ? { ...item, quantity }
          : item
      )
    }));
  };

  return (
    <CartContext.Provider value={{
      cart, setProperty, addToCart, removeFromCart, emptyCart, setItemQuantity,
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
