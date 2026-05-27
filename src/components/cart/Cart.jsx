import React, { useState } from "react";
import { useCart } from "../../context/CartContext";
import { useNavigate } from "react-router-dom";
import "./Cart.css";

function Cart() {
  const {
    cartItems,
    updateQuantity,
    clearCart,
    getTotalPrice,
  } = useCart();

  const navigate = useNavigate();
  const [warning, setWarning] = useState("");

  const hasValidItem = cartItems.some(item => item.quantity > 0);

  const handleCheckout = () => {
    if (!hasValidItem) {
      setWarning("Bạn chưa chọn mua món nào");
      return;
    }

    setWarning("");
    navigate("/checkout");
  };

  return (
    <div className="cart-container">
      <h1>Cart</h1>

      {/* WARNING */}
      {warning && (
        <div className="cart-warning">
          {warning}
        </div>
      )}

      {cartItems.length === 0 ? (
        <div className="empty-cart">
          <p>Your cart is empty</p>
        </div>
      ) : (
        <>
          <div className="cart-items">

            {cartItems.map((item) => (
              <div className="cart-item" key={item.id}>

                <div className="item-info">
                  <h4>{item.title}</h4>
                  <p className="item-author">{item.author}</p>
                  <p className="item-price">
                    ${item.price}
                  </p>
                </div>

                <div className="item-quantity">
                  <button
                    onClick={() =>
                      updateQuantity(item.id, item.quantity - 1)
                    }
                  >
                    -
                  </button>

                  <input value={item.quantity} readOnly />

                  <button
                    onClick={() =>
                      updateQuantity(item.id, item.quantity + 1)
                    }
                  >
                    +
                  </button>
                </div>

                <div className="item-total">
                  ${(item.price * item.quantity).toFixed(2)}
                </div>

                <button
                  className="btn-remove"
                  onClick={() => updateQuantity(item.id, 0)}
                >
                  Remove
                </button>

              </div>
            ))}

          </div>

          <div className="cart-summary">

            <div className="summary-row">
              <span>Total:</span>
              <span>${getTotalPrice().toFixed(2)}</span>
            </div>

            <div className="cart-actions">

              <button
                className="btn-checkout"
                onClick={handleCheckout}
              >
                Checkout
              </button>

              <button
                className="btn-continue"
                onClick={clearCart}
              >
                Clear Cart
              </button>

            </div>

          </div>
        </>
      )}
    </div>
  );
}

export default Cart;