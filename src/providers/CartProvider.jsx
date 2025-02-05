import React, { createContext, useState, useContext, useEffect } from "react";
import { AuthContext } from "../providers/AuthProvider";
import { usePersistedState } from "../hooks/usePersistedState";
//import LocalStorage from "../libs/LocalStorage";
//import config from "../config";

const initialStateCart = {
  acceptToReceiveOffersEmails: false,
  deliveryCode: "-",
  isGift: false,
  items: [],
};

const CartContext = createContext();


export const CartProvider = ({ children }) => {
  const { auth, isLoggedIn } = useContext(AuthContext);
  const [cart, setCart] = usePersistedState(`cart-${isLoggedIn ? auth.user.id : "0"}`, initialStateCart);

  // // set cart in memory
  // const [cart, setCart] = useState(() => {
  //   const key = isLoggedIn ? "auth" : "guest";
  //   const storedCart = LocalStorage.get(key)?.user?.cart || initialCart;
  //   //return storedCart || initialCart;
  //   const ret = storedCart || initialCart;
  //   console.log("SETCART:", ret);
  //   return ret;
  // });

  // // save cart in localstorage
  // const saveCart = (cart) => {
  //   const key = isLoggedIn ? "auth" : "guest";
  //   const val = LocalStorage.get(key);
  //   const user = val.user;
  //   if (user) {
  //     user.cart = cart || initialCart;
  //     LocalStorage.set(key, user);
  //   }
  // };

/*
  // TODO: only to debug quickerly... :-)
  useEffect(() => {
    if (config.mode.development) {
      if (cart.items.length <= 0) {
        addItemToCart({
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
*/
  
  // // watch for changes in `isLoggedIn` and reset the cart when it becomes `false`.
  // useEffect(() => {
  //   if (isLoggedIn) {
  //     // copy guest cart to auth user cart
  //     const guestCart = LocalStorage.get("guest")?.user?.cart;
  //     setCart(guestCart);
  //     //saveCart(guestCart);
  //   } else {
  //     resetCart();
  //   }
  // }, [isLoggedIn]);


  // // watch for changes in `isLoggedIn` and set userId accordingly
  // useEffect(() => {
  //   if (isLoggedIn) {
  //     setCart(prevCart => ({
  //       ...prevCart,
  //       userId: auth.user.id, // set auth user id
  //     }));
  //   } else {
  //     setCart(prevCart => ({
  //       ...prevCart,
  //       userId: 0, // set guest userId (0)
  //     }));
  //   }
  // }, [isLoggedIn]);
  
  // useEffect(() => { // TODO: DEBUG ONLY
  //   console.log("CART:", cart);
  // }, [cart]);

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
      //saveCart(updatedCart);
      return updatedCart;
    });
  };

  const resetCart = () => {
    setCart(initialCart);
    //saveCart(initialCart);
  };

  return (
    <CartContext.Provider value={{
      cart, setCartProperty, addItemToCart, removeItemFromCart, emptyCartItems, cartItemsQuantity, setItemQuantity, resetCart/*, saveCart,*/
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
