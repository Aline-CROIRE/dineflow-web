import React, { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";
import { X, Printer } from "lucide-react";
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
  padding: 12px;
  animation: ${fadeIn} 0.25s ease-out;
  overflow-y: auto;
`;

const ModalCard = styled.div`
  width: 100%;
  max-width: 540px;
  max-height: 92vh;
  background-color: ${({ theme }) => theme.colors.card};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: clamp(20px, 4vw, 28px);
  padding: clamp(18px, 4vw, 32px);
  display: flex;
  flex-direction: column;
  gap: 18px;
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
  font-size: clamp(20px, 4vw, 24px);
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
  flex-shrink: 0;
  transition: all 0.2s;

  &:hover {
    color: ${({ theme }) => theme.colors.vanilla};
  }
`;

const OrdersList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
  max-height: 480px;
  overflow-y: auto;
`;

const OrderCard = styled.div`
  background-color: ${({ theme }) => theme.colors.cardElevated};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 18px;
  padding: clamp(14px, 3vw, 20px);
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const OrderHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 8px;
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
    $status === "COMPLETED"
      ? theme.colors.success
      : $status === "PREPARING"
      ? theme.colors.warning
      : $status === "SERVED"
      ? theme.colors.latte
      : theme.colors.burntCaramel};
  background-color: rgba(0, 0, 0, 0.3);
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const StepperTrack = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 4px;
  padding: 6px 0;
`;

const StepItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
`;

const StepBar = styled.div`
  width: 100%;
  height: 4px;
  border-radius: 2px;
  background-color: ${({ $active, theme }) =>
    $active ? theme.colors.burntCaramel : theme.colors.border};
`;

const StepLabel = styled.span`
  font-size: 9px;
  font-weight: 700;
  text-align: center;
  color: ${({ $active, theme }) =>
    $active ? theme.colors.vanilla : theme.colors.textMuted};
`;

const ItemsSummary = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
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
  flex-wrap: wrap;
  gap: 10px;
  padding-top: 10px;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

const TotalAmount = styled.span`
  font-size: 16px;
  font-weight: 900;
  color: ${({ theme }) => theme.colors.vanilla};
`;

const ActionGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const SecondaryBtn = styled.button`
  background: transparent;
  color: ${({ theme }) => theme.colors.latte};
  font-size: 12px;
  font-weight: 700;
  padding: 8px 14px;
  border-radius: 10px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  align-items: center;
  gap: 6px;
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

const ReceiptBox = styled.div`
  background-color: ${({ theme }) => theme.colors.cardElevated};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 20px;
  padding: clamp(18px, 4vw, 28px);
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

const EmptyState = styled.div`
  text-align: center;
  padding: 40px 0;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 14px;
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
      const interval = setInterval(fetchOrders, 8000);
      return () => clearInterval(interval);
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

  const getStepIndex = (status) => {
    switch (status) {
      case "PENDING":
        return 1;
      case "PREPARING":
        return 2;
      case "SERVED":
        return 3;
      case "COMPLETED":
        return 4;
      default:
        return 0;
    }
  };

  return (
    <Overlay onClick={onClose}>
      <ModalCard onClick={(e) => e.stopPropagation()}>
        <HeaderRow className="no-print">
          <Title>{selectedReceipt ? "Dining Receipt" : "My Orders"}</Title>
          <CloseBtn onClick={selectedReceipt ? () => setSelectedReceipt(null) : onClose}>
            <X size={18} />
          </CloseBtn>
        </HeaderRow>

        {selectedReceipt ? (
          <ReceiptBox id="printable-receipt">
            <div style={{ textAlign: "center", borderBottom: "1px solid #3B3131", paddingBottom: "12px" }}>
              <h3 style={{ fontSize: "18px", fontWeight: 900, color: "#FFF0DC" }}>DINEFLOW RESTAURANT</h3>
              <p style={{ fontSize: "12px", color: "#9E867E", marginTop: "2px" }}>Official Receipt • Order #{selectedReceipt.id}</p>
            </div>

            <ReceiptRow>
              <span>Dining Table</span>
              <span style={{ color: "#FFF0DC", fontWeight: 700 }}>Table {selectedReceipt.table_number}</span>
            </ReceiptRow>

            <ReceiptRow>
              <span>Status</span>
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

            <div className="no-print" style={{ display: "flex", gap: "10px", marginTop: "8px" }}>
              <SecondaryBtn style={{ flex: 1, justifyContent: "center" }} onClick={() => window.print()}>
                <Printer size={15} /> Print Bill
              </SecondaryBtn>
              <button
                onClick={() => setSelectedReceipt(null)}
                style={{ flex: 1, padding: "12px", borderRadius: "10px", background: "#7B4B3A", color: "#FFF0DC", fontWeight: 800 }}
              >
                Back
              </button>
            </div>
          </ReceiptBox>
        ) : (
          <OrdersList>
            {orders.length === 0 ? (
              <EmptyState>You have no active or past dining orders.</EmptyState>
            ) : (
              orders.map((o) => {
                const currentStep = getStepIndex(o.status);
                return (
                  <OrderCard key={o.id}>
                    <OrderHeader>
                      <OrderId>Order #{o.id} • Table {o.table_number}</OrderId>
                      <StatusTag $status={o.status}>{o.status}</StatusTag>
                    </OrderHeader>

                    {o.status !== "CANCELLED" && (
                      <StepperTrack>
                        <StepItem>
                          <StepBar $active={currentStep >= 1} />
                          <StepLabel $active={currentStep >= 1}>Received</StepLabel>
                        </StepItem>
                        <StepItem>
                          <StepBar $active={currentStep >= 2} />
                          <StepLabel $active={currentStep >= 2}>Cooking</StepLabel>
                        </StepItem>
                        <StepItem>
                          <StepBar $active={currentStep >= 3} />
                          <StepLabel $active={currentStep >= 3}>Served</StepLabel>
                        </StepItem>
                        <StepItem>
                          <StepBar $active={currentStep >= 4} />
                          <StepLabel $active={currentStep >= 4}>Settled</StepLabel>
                        </StepItem>
                      </StepperTrack>
                    )}

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

                      <ActionGroup>
                        <SecondaryBtn onClick={() => setSelectedReceipt(o)}>
                          Receipt
                        </SecondaryBtn>
                        {o.status !== "COMPLETED" && o.status !== "CANCELLED" && (
                          <PayActionBtn
                            disabled={settlingId === o.id}
                            onClick={() => handleSettle(o.id)}
                          >
                            {settlingId === o.id ? "Settling..." : "Settle Check"}
                          </PayActionBtn>
                        )}
                      </ActionGroup>
                    </OrderFooter>
                  </OrderCard>
                );
              })
            )}
          </OrdersList>
        )}
      </ModalCard>
    </Overlay>
  );
}