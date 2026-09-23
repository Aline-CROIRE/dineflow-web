import React, { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";
import { X, Plus, Minus, Check } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import apiClient from "../api/client";

const slideIn = keyframes`
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
`;

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1000;
  background-color: rgba(25, 21, 21, 0.7);
  backdrop-filter: blur(8px);
  display: flex;
  justify-content: flex-end;
  animation: ${fadeIn} 0.2s ease;
`;

const Drawer = styled.aside`
  width: 100%;
  max-width: 440px;
  height: 100%;
  background-color: ${({ theme }) => theme.colors.card};
  border-left: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  flex-direction: column;
  box-shadow: -20px 0 40px rgba(0, 0, 0, 0.7);
  animation: ${slideIn} 0.25s cubic-bezier(0.16, 1, 0.3, 1);
`;

const DrawerHeader = styled.div`
  padding: 24px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Title = styled.h2`
  font-size: 20px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.vanilla};
`;

const CloseBtn = styled.button`
  background: transparent;
  color: ${({ theme }) => theme.colors.textMuted};
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s;

  &:hover {
    color: ${({ theme }) => theme.colors.vanilla};
  }
`;

const ItemsList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 20px 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const ItemRow = styled.div`
  background-color: ${({ theme }) => theme.colors.cardElevated};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 16px;
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

const ItemDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
`;

const ItemName = styled.span`
  font-size: 15px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.vanilla};
`;

const ItemPrice = styled.span`
  font-size: 13px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.latte};
`;

const QuantityControls = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 10px;
  padding: 4px 6px;
`;

const QtyBtn = styled.button`
  background: transparent;
  color: ${({ theme }) => theme.colors.vanilla};
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;

  &:hover {
    background-color: ${({ theme }) => theme.colors.card};
  }
`;

const QtyValue = styled.span`
  font-size: 13px;
  font-weight: 800;
  min-width: 18px;
  text-align: center;
  color: ${({ theme }) => theme.colors.vanilla};
`;

const DrawerFooter = styled.div`
  padding: 24px;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  background-color: ${({ theme }) => theme.colors.background};
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const Label = styled.label`
  font-size: 11px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  color: ${({ theme }) => theme.colors.latte};
`;

const Select = styled.select`
  background-color: ${({ theme }) => theme.colors.card};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 12px;
  padding: 12px 14px;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.vanilla};
  outline: none;
`;

const SubtotalRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 4px;
`;

const SubtotalLabel = styled.span`
  font-size: 14px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const SubtotalValue = styled.span`
  font-size: 20px;
  font-weight: 900;
  color: ${({ theme }) => theme.colors.vanilla};
`;

const OrderBtn = styled.button`
  padding: 14px;
  border-radius: 14px;
  font-size: 15px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.vanilla};
  background: ${({ theme }) => theme.gradients.caramelMocha};
  box-shadow: 0 8px 24px rgba(123, 75, 58, 0.4);
  transition: all 0.2s ease;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.gradients.caramelMochaHover};
    transform: translateY(-2px);
  }
`;

const PayBtn = styled.button`
  padding: 14px;
  border-radius: 14px;
  font-size: 15px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.vanilla};
  background: ${({ theme }) => theme.colors.success};
  box-shadow: 0 8px 20px rgba(82, 183, 136, 0.35);
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
  }
`;

const ErrorText = styled.div`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.burntCaramel};
  font-weight: 600;
`;

const SuccessReceipt = styled.div`
  padding: 32px 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 16px;
  margin: auto 0;
`;

const CheckCircle = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background-color: rgba(82, 183, 136, 0.15);
  border: 1px solid ${({ theme }) => theme.colors.success};
  color: ${({ theme }) => theme.colors.success};
  display: flex;
  align-items: center;
  justify-content: center;
`;

export default function CartDrawer({ onRequireAuth }) {
  const { user } = useAuth();
  const {
    items,
    updateQuantity,
    clearCart,
    totalItemsCount,
    totalAmountRWF,
    isDrawerOpen,
    setIsDrawerOpen,
  } = useCart();

  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeOrder, setActiveOrder] = useState(null);
  const [paymentSuccess, setPaymentSuccess] = useState(null);

  useEffect(() => {
    if (isDrawerOpen) {
      apiClient
        .get("restaurant/tables/")
        .then((res) => {
          const tList = res.data.results || res.data || [];
          setTables(tList);
          if (tList.length > 0 && !selectedTable) {
            setSelectedTable(tList[0].id);
          }
        })
        .catch(() => setTables([]));
    }
  }, [isDrawerOpen]);

  if (!isDrawerOpen) return null;

  const handlePlaceOrder = async () => {
    if (!user) {
      setIsDrawerOpen(false);
      onRequireAuth();
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const payload = {
        table: parseInt(selectedTable, 10),
        order_items: items.map((i) => ({
          menu_item: i.id,
          quantity: i.quantity,
        })),
      };

      const response = await apiClient.post("restaurant/orders/", payload);
      setActiveOrder(response.data);
      clearCart();
    } catch (err) {
      setError(
        err.response?.data?.order_items?.[0] ||
        err.response?.data?.detail ||
        "Could not place order."
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePayOrder = async (orderId) => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.post(`restaurant/orders/${orderId}/pay/`, {
        payment_method: "CARD",
      });
      setPaymentSuccess(response.data);
      setActiveOrder(null);
    } catch (err) {
      setError(err.response?.data?.detail || "Payment settlement failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Overlay onClick={() => setIsDrawerOpen(false)}>
      <Drawer onClick={(e) => e.stopPropagation()}>
        <DrawerHeader>
          <Title>Your Dining Order ({totalItemsCount})</Title>
          <CloseBtn onClick={() => setIsDrawerOpen(false)}>
            <X size={20} />
          </CloseBtn>
        </DrawerHeader>

        {paymentSuccess ? (
          <SuccessReceipt>
            <CheckCircle>
              <Check size={28} />
            </CheckCircle>
            <h3 style={{ fontSize: "20px", fontWeight: 900, color: "#FFF0DC" }}>
              Check Settled
            </h3>
            <p style={{ fontSize: "14px", color: "#E7C6A1", lineHeight: 1.5 }}>
              Payment of {Math.round(parseFloat(paymentSuccess.amount)).toLocaleString()} RWF was confirmed.
            </p>
            <OrderBtn
              style={{ marginTop: "16px", width: "100%" }}
              onClick={() => {
                setPaymentSuccess(null);
                setIsDrawerOpen(false);
              }}
            >
              Done
            </OrderBtn>
          </SuccessReceipt>
        ) : activeOrder ? (
          <SuccessReceipt>
            <CheckCircle>
              <Check size={28} />
            </CheckCircle>
            <h3 style={{ fontSize: "20px", fontWeight: 900, color: "#FFF0DC" }}>
              Order Placed
            </h3>
            <p style={{ fontSize: "14px", color: "#E7C6A1", lineHeight: 1.5 }}>
              Order #{activeOrder.id} is being prepared for Table {activeOrder.table_number}.
            </p>
            <div style={{ width: "100%", marginTop: "14px" }}>
              <PayBtn
                style={{ width: "100%" }}
                disabled={loading}
                onClick={() => handlePayOrder(activeOrder.id)}
              >
                {loading ? "Processing..." : `Settle Bill (${Math.round(parseFloat(activeOrder.total_amount)).toLocaleString()} RWF)`}
              </PayBtn>
            </div>
          </SuccessReceipt>
        ) : items.length === 0 ? (
          <div style={{ margin: "auto", textAlign: "center", color: "#9E867E", fontSize: "14px" }}>
            Your order is empty. Explore the menu to add dishes.
          </div>
        ) : (
          <>
            <ItemsList>
              {items.map((dish) => (
                <ItemRow key={dish.id}>
                  <ItemDetails>
                    <ItemName>{dish.name}</ItemName>
                    <ItemPrice>
                      {(Math.round(parseFloat(dish.price) || 0) * dish.quantity).toLocaleString()} RWF
                    </ItemPrice>
                  </ItemDetails>

                  <QuantityControls>
                    <QtyBtn onClick={() => updateQuantity(dish.id, -1)}>
                      <Minus size={14} />
                    </QtyBtn>
                    <QtyValue>{dish.quantity}</QtyValue>
                    <QtyBtn onClick={() => updateQuantity(dish.id, 1)}>
                      <Plus size={14} />
                    </QtyBtn>
                  </QuantityControls>
                </ItemRow>
              ))}
            </ItemsList>

            <DrawerFooter>
              <FieldGroup>
                <Label htmlFor="table-select">Select Your Table</Label>
                <Select
                  id="table-select"
                  value={selectedTable}
                  onChange={(e) => setSelectedTable(e.target.value)}
                >
                  {tables.map((t) => (
                    <option key={t.id} value={t.id}>
                      Table {t.table_number} ({t.capacity} Seats - {t.location})
                    </option>
                  ))}
                </Select>
              </FieldGroup>

              {error && <ErrorText>{error}</ErrorText>}

              <SubtotalRow>
                <SubtotalLabel>Total</SubtotalLabel>
                <SubtotalValue>{totalAmountRWF.toLocaleString()} RWF</SubtotalValue>
              </SubtotalRow>

              <OrderBtn
                disabled={loading || items.length === 0}
                onClick={handlePlaceOrder}
              >
                {loading ? "Sending Order..." : "Send Order to Kitchen"}
              </OrderBtn>
            </DrawerFooter>
          </>
        )}
      </Drawer>
    </Overlay>
  );
}