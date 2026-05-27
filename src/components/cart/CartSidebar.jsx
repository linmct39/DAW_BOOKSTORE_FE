import React, { useState } from "react";
import "./CartSidebar.css";
import { useCart } from "../../context/CartContext";
import { useNavigate } from "react-router-dom";

function CartSidebar() {
  const {
    cartItems,
    removeFromCart,
    getTotalItems,
    getTotalPrice,
  } = useCart();

  const navigate = useNavigate();
  const [openPreview, setOpenPreview] = useState(false);
  const [warning, setWarning] = useState("");

  // 👉 chỉ dùng để check logic
  const hasValidItem = cartItems.some(item => item.quantity > 0);

  const handleGoToCart = () => {
    setOpenPreview(false);

    if (!hasValidItem) {
      setWarning("Bạn chưa chọn mua món nào");
      return;
    }

    setWarning("");
    navigate("/cart");
  };

  const handleCheckout = () => {
    setOpenPreview(false);

    if (!hasValidItem) {
      setWarning("Bạn chưa chọn mua món nào");
      return;
    }

    setWarning("");
    navigate("/checkout");
  };

  return (
    <div className="cart-sidebar">

      <div className="sidebar-header">
        <h3>Cart ({getTotalItems()})</h3>
      </div>

      {warning && (
        <div className="cart-warning">
          {warning}
        </div>
      )}

      {cartItems.length === 0 ? (
        <div className="sidebar-empty">
          Cart is empty
        </div>
      ) : (
        <>
          <div className="sidebar-items">
            {cartItems.slice(0, 3).map((item) => (
              <div className="sidebar-item" key={item.id}>
                
                <div className="sidebar-item-info">
                  <h5>{item.title}</h5>
                  <p>{item.quantity} x ${item.price}</p>
                </div>

                <button
                  className="btn-remove-small"
                  onClick={() => removeFromCart(item.id)}
                >
                  ×
                </button>

              </div>
            ))}

            {cartItems.length > 3 && (
              <div className="sidebar-more">
                +{cartItems.length - 3} more items
              </div>
            )}
          </div>

          <div className="sidebar-total">
            Total: ${getTotalPrice().toFixed(2)}
          </div>

          <div className="sidebar-actions">

            <button
              className="btn-view-cart"
              onClick={() => setOpenPreview(true)}
            >
              View Cart
            </button>

            <button
              className="btn-checkout-now"
              onClick={handleCheckout}
            >
              Checkout
            </button>

          </div>

          {openPreview && (
            <div
              className="cart-overlay"
              onClick={() => setOpenPreview(false)}
            >
              <div
                className="cart-preview"
                onClick={(e) => e.stopPropagation()}
              >

                <h3>Cart Summary</h3>

                {cartItems.map((item) => (
                  <div key={item.id} className="preview-item">
                    <span>{item.title}</span>
                    <span>x{item.quantity}</span>
                    <span>
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}

                <hr />

                <div className="preview-total">
                  Total: ${getTotalPrice().toFixed(2)}
                </div>

                <div className="preview-actions">

                  <button onClick={handleGoToCart}>
                    Go to Cart
                  </button>

                  <button onClick={handleCheckout}>
                    Checkout
                  </button>

                </div>

              </div>
            </div>
          )}

        </>
      )}
    </div>
  );
}

export default CartSidebar;