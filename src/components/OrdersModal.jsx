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
  max-height: 420px;
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

export default function OrdersModal({ isOpen, onClose }) {
  const [orders, setOrders] = useState([]);
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
          <Title>My Orders</Title>
          <CloseBtn onClick={onClose}>
            <X size={18} />
          </CloseBtn>
        </HeaderRow>

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

                  {o.status !== "COMPLETED" && o.status !== "CANCELLED" && (
                    <PayActionBtn
                      disabled={settlingId === o.id}
                      onClick={() => handleSettle(o.id)}
                    >
                      {settlingId === o.id ? "Settling..." : "Settle Check"}
                    </PayActionBtn>
                  )}
                </OrderFooter>
              </OrderCard>
            ))
          )}
        </OrdersList>
      </ModalCard>
    </Overlay>
  );
}