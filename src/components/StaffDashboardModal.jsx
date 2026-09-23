import React, { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";
import { X, ChevronRight, Check } from "lucide-react";
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
  background-color: rgba(25, 21, 21, 0.85);
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
  max-width: 820px;
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

const TitleBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const Title = styled.h2`
  font-size: 24px;
  font-weight: 900;
  color: ${({ theme }) => theme.colors.vanilla};
`;

const Subtitle = styled.p`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textMuted};
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
    border-color: ${({ theme }) => theme.colors.burntCaramel};
  }
`;

const TabTrack = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: 14px;
  padding: 4px;
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const TabButton = styled.button`
  padding: 10px 14px;
  font-size: 13px;
  font-weight: 700;
  border-radius: 10px;
  color: ${({ $active, theme }) => ($active ? theme.colors.vanilla : theme.colors.textMuted)};
  background-color: ${({ $active, theme }) => ($active ? theme.colors.cardElevated : "transparent")};
  box-shadow: ${({ $active }) => ($active ? "0 4px 12px rgba(0, 0, 0, 0.3)" : "none")};
  transition: all 0.2s;
`;

const ContentArea = styled.div`
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
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const CardTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const OrderHeading = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const OrderNumber = styled.span`
  font-size: 16px;
  font-weight: 900;
  color: ${({ theme }) => theme.colors.vanilla};
`;

const TableTag = styled.span`
  font-size: 12px;
  font-weight: 700;
  background-color: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  padding: 4px 10px;
  border-radius: 8px;
  color: ${({ theme }) => theme.colors.latte};
`;

const StatusPill = styled.span`
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

const ItemList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 10px 0;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const ItemRow = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.vanilla};
`;

const CardActions = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

const PriceText = styled.span`
  font-size: 15px;
  font-weight: 900;
  color: ${({ theme }) => theme.colors.vanilla};
`;

const AdvanceBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.vanilla};
  background: ${({ theme }) => theme.gradients.caramelMocha};
  transition: all 0.2s;

  &:hover {
    background: ${({ theme }) => theme.gradients.caramelMochaHover};
    transform: translateY(-1px);
  }
`;

const TablesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
`;

const TableBox = styled.div`
  background-color: ${({ theme }) => theme.colors.cardElevated};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 16px;
  padding: 18px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const TableNumber = styled.span`
  font-size: 18px;
  font-weight: 900;
  color: ${({ theme }) => theme.colors.vanilla};
`;

const TableDetail = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const TableStatusBadge = styled.span`
  font-size: 11px;
  font-weight: 800;
  padding: 4px 8px;
  border-radius: 6px;
  text-transform: uppercase;
  width: fit-content;
  color: ${({ $status, theme }) =>
    $status === "AVAILABLE"
      ? theme.colors.success
      : $status === "OCCUPIED"
      ? theme.colors.burntCaramel
      : theme.colors.warning};
  background-color: rgba(0, 0, 0, 0.3);
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const ReservationCard = styled.div`
  background-color: ${({ theme }) => theme.colors.cardElevated};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 16px;
  padding: 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
`;

const ResDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const ResCustomer = styled.span`
  font-size: 15px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.vanilla};
`;

const ResTime = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const ActionGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ApproveBtn = styled.button`
  padding: 8px 14px;
  border-radius: 10px;
  font-size: 12px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.vanilla};
  background: ${({ theme }) => theme.colors.success};
  display: flex;
  align-items: center;
  gap: 6px;
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

export default function StaffDashboardModal({ isOpen, onClose }) {
  const [tab, setTab] = useState("orders");
  const [orders, setOrders] = useState([]);
  const [tables, setTables] = useState([]);
  const [reservations, setReservations] = useState([]);

  const fetchAll = () => {
    apiClient
      .get("restaurant/orders/")
      .then((res) => setOrders(res.data.results || res.data || []))
      .catch(() => setOrders([]));

    apiClient
      .get("restaurant/tables/")
      .then((res) => setTables(res.data.results || res.data || []))
      .catch(() => setTables([]));

    apiClient
      .get("restaurant/reservations/")
      .then((res) => setReservations(res.data.results || res.data || []))
      .catch(() => setReservations([]));
  };

  useEffect(() => {
    if (isOpen) {
      fetchAll();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleAdvanceStatus = async (orderId) => {
    try {
      await apiClient.post(`restaurant/orders/${orderId}/advance-status/`);
      fetchAll();
    } catch (err) {
      console.error(err);
    }
  };

  const handleConfirmReservation = async (resId) => {
    try {
      await apiClient.post(`restaurant/reservations/${resId}/confirm/`);
      fetchAll();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCompleteReservation = async (resId) => {
    try {
      await apiClient.post(`restaurant/reservations/${resId}/complete/`);
      fetchAll();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Overlay onClick={onClose}>
      <ModalCard onClick={(e) => e.stopPropagation()}>
        <HeaderRow>
          <TitleBlock>
            <Title>Staff Operations</Title>
            <Subtitle>Kitchen order progression, floor management, and reservations.</Subtitle>
          </TitleBlock>
          <CloseBtn onClick={onClose}>
            <X size={18} />
          </CloseBtn>
        </HeaderRow>

        <TabTrack>
          <TabButton
            type="button"
            $active={tab === "orders"}
            onClick={() => setTab("orders")}
          >
            Kitchen Orders ({orders.filter((o) => o.status !== "COMPLETED" && o.status !== "CANCELLED").length})
          </TabButton>
          <TabButton
            type="button"
            $active={tab === "tables"}
            onClick={() => setTab("tables")}
          >
            Dining Floor ({tables.length})
          </TabButton>
          <TabButton
            type="button"
            $active={tab === "reservations"}
            onClick={() => setTab("reservations")}
          >
            Reservations ({reservations.length})
          </TabButton>
        </TabTrack>

        <ContentArea>
          {tab === "orders" && (
            orders.length === 0 ? (
              <EmptyState>No active orders.</EmptyState>
            ) : (
              orders.map((o) => (
                <OrderCard key={o.id}>
                  <CardTop>
                    <OrderHeading>
                      <OrderNumber>Order #{o.id}</OrderNumber>
                      <TableTag>Table {o.table_number}</TableTag>
                    </OrderHeading>
                    <StatusPill $status={o.status}>{o.status}</StatusPill>
                  </CardTop>

                  <ItemList>
                    {(o.items || []).map((it) => (
                      <ItemRow key={it.id}>
                        <span>{it.quantity}x {it.menu_item_name}</span>
                        <span>{(Math.round(parseFloat(it.unit_price)) * it.quantity).toLocaleString()} RWF</span>
                      </ItemRow>
                    ))}
                  </ItemList>

                  <CardActions>
                    <PriceText>{Math.round(parseFloat(o.total_amount)).toLocaleString()} RWF</PriceText>
                    {o.status === "PENDING" && (
                      <AdvanceBtn onClick={() => handleAdvanceStatus(o.id)}>
                        Start Preparing
                        <ChevronRight size={16} />
                      </AdvanceBtn>
                    )}
                    {o.status === "PREPARING" && (
                      <AdvanceBtn onClick={() => handleAdvanceStatus(o.id)}>
                        Mark as Served
                        <Check size={16} />
                      </AdvanceBtn>
                    )}
                  </CardActions>
                </OrderCard>
              ))
            )
          )}

          {tab === "tables" && (
            <TablesGrid>
              {tables.map((t) => (
                <TableBox key={t.id}>
                  <TableNumber>Table {t.table_number}</TableNumber>
                  <TableDetail>{t.capacity} Seats • {t.location}</TableDetail>
                  <TableStatusBadge $status={t.status}>{t.status}</TableStatusBadge>
                </TableBox>
              ))}
            </TablesGrid>
          )}

          {tab === "reservations" && (
            reservations.length === 0 ? (
              <EmptyState>No reservations booked.</EmptyState>
            ) : (
              reservations.map((r) => (
                <ReservationCard key={r.id}>
                  <ResDetails>
                    <ResCustomer>{r.customer_username} • Table {r.table_number}</ResCustomer>
                    <ResTime>{r.party_size} Guests • {r.reservation_date} at {r.reservation_time.slice(0, 5)}</ResTime>
                  </ResDetails>

                  <ActionGroup>
                    <StatusPill $status={r.status}>{r.status}</StatusPill>
                    {r.status === "PENDING" && (
                      <ApproveBtn onClick={() => handleConfirmReservation(r.id)}>
                        Confirm
                      </ApproveBtn>
                    )}
                    {r.status === "CONFIRMED" && (
                      <ApproveBtn onClick={() => handleCompleteReservation(r.id)}>
                        Complete
                      </ApproveBtn>
                    )}
                  </ActionGroup>
                </ReservationCard>
              ))
            )
          )}
        </ContentArea>
      </ModalCard>
    </Overlay>
  );
}