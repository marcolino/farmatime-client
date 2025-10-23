import { useContext } from "react";
import { CartContext } from "../providers/CartContext";

export const useCart = () => useContext(CartContext);
