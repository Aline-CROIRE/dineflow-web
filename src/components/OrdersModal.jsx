import React, { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";
import { X, Check } from "lucide-react";
import apiClient from "../api/client";

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const slideUp = keyframes`
  from { 
    opacity: 0; 
    transform: translateY(20px) scale(0.97); 
  }
  to { 
    opacity: 1; 
    transform: translateY(0) scale(1); 
  }
`;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1000;
  background-color: rgba(25, 21, 21, 0.82);
  backdrop-filter: blur(12px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  animation: ${fadeIn} 0.25s ease-out;
  overflow-y: auto;
`;

const ModalCard = styled.div`
  width: 100%;
  max-width: 520px;
  max-height: 90vh;
  background-color: ${({ theme }) => theme.colors.card};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 28px;
  padding: clamp(22px, 5vw, 36px);
  display: flex;
  flex-direction: column;
  gap: 20px;
  box-shadow: 0 30px 60px -12px rgba(0, 0, 0, 0.8);
  animation: ${slideUp} 0.28s cubic-bezier(0.16, 1, 0.3, 1);
  overflow-y: auto;
`;

const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Title = styled.h2`
  font-size: 22px;
  font-weight: 900;
  color: ${({ theme }) => theme.colors.vanilla};
`;

const CloseBtn = styled.button`
  background-color: ${({ theme }) => theme.colors.cardElevated};
  border: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.latte};
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

  &:hover {
    color: ${({ theme }) => theme.colors.vanilla};
  }
`;

const OrdersList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
  max-height: 440px;
  overflow-y: auto;
`;

const OrderCard = styled.div`
  background-color: ${({ theme }) => theme.colors.cardElevated};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 16px;
  padding: 18px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const OrderHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const OrderId = styled.span`
  font-size: 15px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.vanilla};
`;

const StatusTag = styled.span`
  font-size: 11px;
  font-weight: 800;
  padding: 4px 10px;
  border-radius: 8px;
  text-transform: uppercase;
  color: ${({ $status, theme }) =>
    $status === "COMPLETED" ? theme.colors.success : theme.colors.latte};
  background-color: rgba(0, 0, 0, 0.3);
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const ItemsSummary = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  padding-top: 10px;
`;

const ItemLine = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const OrderFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 8px;
`;

const TotalAmount = styled.span`
  font-size: 16px;
  font-weight: 900;
  color: ${({ theme }) => theme.colors.vanilla};
`;

const ReceiptBtn = styled.button`
  background: transparent;
  color: ${({ theme }) => theme.colors.latte};
  font-size: 12px;
  font-weight: 700;
  padding: 6px 12px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  transition: all 0.2s;

  &:hover {
    color: ${({ theme }) => theme.colors.vanilla};
    border-color: ${({ theme }) => theme.colors.burntCaramel};
  }
`;

const PayActionBtn = styled.button`
  padding: 8px 16px;
  border-radius: 10px;
  font-size: 12px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.vanilla};
  background: ${({ theme }) => theme.colors.success};
  transition: all 0.2s;

  &:hover {
    transform: scale(1.02);
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px 0;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 14px;
`;

const ReceiptBox = styled.div`
  background-color: ${({ theme }) => theme.colors.cardElevated};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 18px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const ReceiptRow = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.latte};
`;

export default function OrdersModal({ isOpen, onClose }) {
  const [orders, setOrders] = useState([]);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [settlingId, setSettlingId] = useState(null);

  const fetchOrders = () => {
    apiClient
      .get("restaurant/orders/")
      .then((res) => setOrders(res.data.results || res.data || []))
      .catch(() => setOrders([]));
  };

  useEffect(() => {
    if (isOpen) {
      fetchOrders();
      setSelectedReceipt(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSettle = async (orderId) => {
    setSettlingId(orderId);
    try {
      await apiClient.post(`restaurant/orders/${orderId}/pay/`, {
        payment_method: "CARD",
      });
      fetchOrders();
    } catch (err) {
      console.error(err);
    } finally {
      setSettlingId(null);
    }
  };

  return (
    <Overlay onClick={onClose}>
      <ModalCard onClick={(e) => e.stopPropagation()}>
        <HeaderRow>
          <Title>{selectedReceipt ? "Dining Receipt" : "My Orders"}</Title>
          <CloseBtn onClick={selectedReceipt ? () => setSelectedReceipt(null) : onClose}>
            <X size={18} />
          </CloseBtn>
        </HeaderRow>

        {selectedReceipt ? (
          <ReceiptBox>
            <div style={{ textAlign: "center", borderBottom: "1px solid #3B3131", paddingBottom: "12px" }}>
              <h3 style={{ fontSize: "18px", fontWeight: 900, color: "#FFF0DC" }}>DINEFLOW RESTAURANT</h3>
              <p style={{ fontSize: "12px", color: "#9E867E", marginTop: "2px" }}>Receipt for Order #{selectedReceipt.id}</p>
            </div>

            <ReceiptRow>
              <span>Dining Table</span>
              <span style={{ color: "#FFF0DC", fontWeight: 700 }}>Table {selectedReceipt.table_number}</span>
            </ReceiptRow>

            <ReceiptRow>
              <span>Settlement Status</span>
              <span style={{ color: "#52B788", fontWeight: 800 }}>{selectedReceipt.status}</span>
            </ReceiptRow>

            <div style={{ display: "flex", flexDirection: "column", gap: "6px", borderTop: "1px solid #3B3131", borderBottom: "1px solid #3B3131", padding: "12px 0" }}>
              {(selectedReceipt.items || []).map((it) => (
                <div key={it.id} style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", color: "#FFF0DC" }}>
                  <span>{it.quantity}x {it.menu_item_name}</span>
                  <span>{(Math.round(parseFloat(it.unit_price)) * it.quantity).toLocaleString()} RWF</span>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "18px", fontWeight: 900, color: "#FFF0DC" }}>
              <span>Total Paid</span>
              <span>{Math.round(parseFloat(selectedReceipt.total_amount)).toLocaleString()} RWF</span>
            </div>

            <button
              onClick={() => setSelectedReceipt(null)}
              style={{ padding: "12px", borderRadius: "10px", background: "#7B4B3A", color: "#FFF0DC", fontWeight: 800, marginTop: "8px" }}
            >
              Back to Orders
            </button>
          </ReceiptBox>
        ) : (
          <OrdersList>
            {orders.length === 0 ? (
              <EmptyState>You have no past or active dining orders.</EmptyState>
            ) : (
              orders.map((o) => (
                <OrderCard key={o.id}>
                  <OrderHeader>
                    <OrderId>Order #{o.id} — Table {o.table_number}</OrderId>
                    <StatusTag $status={o.status}>{o.status}</StatusTag>
                  </OrderHeader>

                  <ItemsSummary>
                    {(o.items || []).map((it) => (
                      <ItemLine key={it.id}>
                        <span>{it.quantity}x {it.menu_item_name}</span>
                        <span>{(Math.round(parseFloat(it.unit_price)) * it.quantity).toLocaleString()} RWF</span>
                      </ItemLine>
                    ))}
                  </ItemsSummary>

                  <OrderFooter>
                    <TotalAmount>
                      {Math.round(parseFloat(o.total_amount)).toLocaleString()} RWF
                    </TotalAmount>

                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <ReceiptBtn onClick={() => setSelectedReceipt(o)}>
                        Receipt
                      </ReceiptBtn>
                      {o.status !== "COMPLETED" && o.status !== "CANCELLED" && (
                        <PayActionBtn
                          disabled={settlingId === o.id}
                          onClick={() => handleSettle(o.id)}
                        >
                          {settlingId === o.id ? "Settling..." : "Settle Check"}
                        </PayActionBtn>
                      )}
                    </div>
                  </OrderFooter>
                </OrderCard>
              ))
            )}
          </OrdersList>
        )}
      </ModalCard>
    </Overlay>
  );
}