import { useState, useEffect, React } from "react";
import axios from "axios";
import Buffer from "buffer";

const Cart = () => {
  const [user, setUser] = useState({});
  const [cartItems, setCartItems] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const getEmailFromToken = () => {
    const token = document.cookie.split("=")[1];
    if (!token) {
      return null;
    }
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.email;
  };

  const email = getEmailFromToken();

  const getUser = async () => {
    try {
      const response = await axios.get(`/api/user/profile/${email}`);
      setUser(response.data.user);
      if (response.data.user.cart) {
        setUser(response.data.user);
        setCartItems(response.data.user.cart);
        calculateSubtotal(response.data.user.cart);
      }
    } catch (err) {
      setError("Failed to fetch cart");
    }
  };

  const calculateSubtotal = (items) => {
    const total = items.reduce((acc, item) => {
      const price = item.discount ? item.price - item.discount : item.price;
      return acc + (price * (item.quantity || 1));
    }, 0);
    setSubtotal(total);
  };

  useEffect(() => {
    getUser();
  }, []);



  return (
    <>
     <div>
    {user.cart > 0 ? (
      <div>Cart Items</div>
    ) : (
      <div>No items in cart</div>
    )}
     </div>
    </>
  );
};

export default Cart;
