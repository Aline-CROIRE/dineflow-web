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
  -webkit-backdrop-filter: blur(12px);
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
  gap: 22px;
  box-shadow: 0 30px 60px -12px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(59, 49, 49, 0.5);
  animation: ${slideUp} 0.28s cubic-bezier(0.16, 1, 0.3, 1);
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.border};
    border-radius: 10px;
  }
`;

const HeaderRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
`;

const TitleBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const Title = styled.h2`
  font-size: clamp(22px, 4vw, 26px);
  font-weight: 900;
  letter-spacing: -0.5px;
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
  flex-shrink: 0;
  transition: all 0.2s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.vanilla};
    border-color: ${({ theme }) => theme.colors.burntCaramel};
    transform: rotate(90deg);
  }
`;

const TabTrack = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: 14px;
  padding: 4px;
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const TabButton = styled.button`
  padding: 10px 16px;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.3px;
  border-radius: 10px;
  color: ${({ $active, theme }) => ($active ? theme.colors.vanilla : theme.colors.textMuted)};
  background-color: ${({ $active, theme }) => ($active ? theme.colors.cardElevated : "transparent")};
  box-shadow: ${({ $active }) => ($active ? "0 4px 12px rgba(0, 0, 0, 0.3)" : "none")};
  transition: all 0.2s ease;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const FieldGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 14px;

  @media (min-width: ${({ theme }) => theme.breakpoints.mobile}) {
    grid-template-columns: 1fr 1fr;
  }
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

const Input = styled.input`
  background-color: ${({ theme }) => theme.colors.cardElevated};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 12px;
  padding: 13px 16px;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.vanilla};
  transition: all 0.2s ease;

  &:focus {
    border-color: ${({ theme }) => theme.colors.burntCaramel};
    box-shadow: 0 0 0 3px rgba(201, 124, 93, 0.18);
  }
`;

const Select = styled.select`
  background-color: ${({ theme }) => theme.colors.cardElevated};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 12px;
  padding: 13px 16px;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.vanilla};
  outline: none;
  cursor: pointer;
  transition: all 0.2s ease;

  &:focus {
    border-color: ${({ theme }) => theme.colors.burntCaramel};
    box-shadow: 0 0 0 3px rgba(201, 124, 93, 0.18);
  }
`;

const TextArea = styled.textarea`
  background-color: ${({ theme }) => theme.colors.cardElevated};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 12px;
  padding: 13px 16px;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.vanilla};
  resize: vertical;
  min-height: 70px;
  font-family: inherit;

  &:focus {
    border-color: ${({ theme }) => theme.colors.burntCaramel};
    box-shadow: 0 0 0 3px rgba(201, 124, 93, 0.18);
  }
`;

const SubmitBtn = styled.button`
  margin-top: 6px;
  padding: 14px;
  border-radius: 14px;
  font-size: 15px;
  font-weight: 800;
  letter-spacing: 0.5px;
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

const ErrorBox = styled.div`
  padding: 12px 16px;
  border-radius: 12px;
  background-color: rgba(201, 124, 93, 0.15);
  border: 1px solid ${({ theme }) => theme.colors.burntCaramel};
  color: ${({ theme }) => theme.colors.vanilla};
  font-size: 13px;
  font-weight: 600;
  line-height: 1.4;
`;

const SuccessCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 16px;
  padding: 24px 0;
`;

const SuccessCircle = styled.div`
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

const SuccessTitle = styled.h3`
  font-size: 20px;
  font-weight: 900;
  color: ${({ theme }) => theme.colors.vanilla};
`;

const SuccessDesc = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.latte};
  line-height: 1.5;
  max-width: 360px;
`;

const ReservationsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-height: 400px;
  overflow-y: auto;
`;

const BookingCard = styled.div`
  background-color: ${({ theme }) => theme.colors.cardElevated};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 16px;
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
`;

const BookingInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const BookingMain = styled.span`
  font-size: 15px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.vanilla};
`;

const BookingSub = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const StatusTag = styled.span`
  font-size: 11px;
  font-weight: 800;
  padding: 4px 10px;
  border-radius: 8px;
  text-transform: uppercase;
  color: ${({ $status, theme }) =>
    $status === "CONFIRMED"
      ? theme.colors.success
      : $status === "CANCELLED"
      ? theme.colors.danger
      : theme.colors.latte};
  background-color: rgba(0, 0, 0, 0.3);
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const CancelBtn = styled.button`
  background: transparent;
  color: ${({ theme }) => theme.colors.burntCaramel};
  font-size: 12px;
  font-weight: 700;
  padding: 6px 12px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  transition: all 0.2s;

  &:hover {
    background-color: rgba(201, 124, 93, 0.1);
    color: ${({ theme }) => theme.colors.vanilla};
  }
`;

const EmptyText = styled.div`
  text-align: center;
  padding: 36px 0;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 14px;
`;

export default function ReservationModal({ isOpen, onClose }) {
  const [tab, setTab] = useState("book");
  const [tables, setTables] = useState([]);
  const [myBookings, setMyBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [confirmedData, setConfirmedData] = useState(null);

  const todayStr = new Date().toISOString().split("T")[0];

  const [formData, setFormData] = useState({
    table: "",
    reservation_date: todayStr,
    reservation_time: "19:00:00",
    party_size: 2,
    special_requests: "",
  });

  useEffect(() => {
    if (isOpen) {
      setError(null);
      setConfirmedData(null);
      apiClient
        .get("restaurant/tables/")
        .then((res) => {
          const tableList = res.data.results || res.data || [];
          setTables(tableList);
          if (tableList.length > 0) {
            setFormData((prev) => ({ ...prev, table: tableList[0].id }));
          }
        })
        .catch(() => setTables([]));

      fetchMyBookings();
    }
  }, [isOpen]);

  const fetchMyBookings = () => {
    apiClient
      .get("restaurant/reservations/")
      .then((res) => setMyBookings(res.data.results || res.data || []))
      .catch(() => setMyBookings([]));
  };

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleBook = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.post("restaurant/reservations/", {
        table: parseInt(formData.table, 10),
        reservation_date: formData.reservation_date,
        reservation_time: formData.reservation_time,
        party_size: parseInt(formData.party_size, 10),
        special_requests: formData.special_requests,
      });

      setConfirmedData(response.data);
      fetchMyBookings();
    } catch (err) {
      const apiError =
        err.response?.data?.table?.[0] ||
        err.response?.data?.party_size?.[0] ||
        err.response?.data?.reservation_date?.[0] ||
        err.response?.data?.detail ||
        "Could not complete table reservation. Please verify details.";
      setError(apiError);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (id) => {
    try {
      await apiClient.delete(`restaurant/reservations/${id}/`);
      fetchMyBookings();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Overlay onClick={onClose}>
      <ModalCard onClick={(e) => e.stopPropagation()}>
        <HeaderRow>
          <TitleBlock>
            <Title>{tab === "book" ? "Table Reservation" : "My Reservations"}</Title>
            <Subtitle>
              {tab === "book"
                ? "Select your dining date, table location, and party size."
                : "Review and manage your scheduled dining visits."}
            </Subtitle>
          </TitleBlock>
          <CloseBtn onClick={onClose} aria-label="Close">
            <X size={18} />
          </CloseBtn>
        </HeaderRow>

        <TabTrack>
          <TabButton
            type="button"
            $active={tab === "book"}
            onClick={() => {
              setTab("book");
              setError(null);
              setConfirmedData(null);
            }}
          >
            Reserve Table
          </TabButton>
          <TabButton
            type="button"
            $active={tab === "list"}
            onClick={() => {
              setTab("list");
              setError(null);
              fetchMyBookings();
            }}
          >
            My Bookings ({myBookings.length})
          </TabButton>
        </TabTrack>

        {error && <ErrorBox>{error}</ErrorBox>}

        {tab === "book" ? (
          confirmedData ? (
            <SuccessCard>
              <SuccessCircle>
                <Check size={28} />
              </SuccessCircle>
              <SuccessTitle>Table Reserved Successfully</SuccessTitle>
              <SuccessDesc>
                Table {confirmedData.table_number} is reserved for {confirmedData.party_size} guests on{" "}
                {confirmedData.reservation_date} at {confirmedData.reservation_time}.
              </SuccessDesc>
              <SubmitBtn type="button" onClick={() => setConfirmedData(null)}>
                Book Another Table
              </SubmitBtn>
            </SuccessCard>
          ) : (
            <Form onSubmit={handleBook}>
              <FieldGroup>
                <Label htmlFor="table">Choose Dining Table</Label>
                <Select
                  id="table"
                  name="table"
                  value={formData.table}
                  onChange={handleChange}
                  required
                >
                  {tables.map((tbl) => (
                    <option key={tbl.id} value={tbl.id}>
                      Table {tbl.table_number} ({tbl.capacity} Seats - {tbl.location})
                    </option>
                  ))}
                </Select>
              </FieldGroup>

              <FieldGrid>
                <FieldGroup>
                  <Label htmlFor="reservation_date">Date</Label>
                  <Input
                    id="reservation_date"
                    type="date"
                    name="reservation_date"
                    min={todayStr}
                    value={formData.reservation_date}
                    onChange={handleChange}
                    required
                  />
                </FieldGroup>

                <FieldGroup>
                  <Label htmlFor="reservation_time">Time Slot</Label>
                  <Select
                    id="reservation_time"
                    name="reservation_time"
                    value={formData.reservation_time}
                    onChange={handleChange}
                  >
                    <option value="12:00:00">12:00 PM (Lunch)</option>
                    <option value="13:30:00">01:30 PM (Lunch)</option>
                    <option value="18:00:00">06:00 PM (Dinner)</option>
                    <option value="19:00:00">07:00 PM (Dinner)</option>
                    <option value="20:30:00">08:30 PM (Dinner)</option>
                    <option value="21:30:00">09:30 PM (Late Dinner)</option>
                  </Select>
                </FieldGroup>
              </FieldGrid>

              <FieldGroup>
                <Label htmlFor="party_size">Number of Guests</Label>
                <Input
                  id="party_size"
                  type="number"
                  name="party_size"
                  min="1"
                  max="12"
                  value={formData.party_size}
                  onChange={handleChange}
                  required
                />
              </FieldGroup>

              <FieldGroup>
                <Label htmlFor="special_requests">Special Requests (Optional)</Label>
                <TextArea
                  id="special_requests"
                  name="special_requests"
                  placeholder="Anniversary, dietary preferences, or seating placement..."
                  value={formData.special_requests}
                  onChange={handleChange}
                />
              </FieldGroup>

              <SubmitBtn type="submit" disabled={loading}>
                {loading ? "Confirming Table..." : "Confirm Reservation"}
              </SubmitBtn>
            </Form>
          )
        ) : (
          <ReservationsList>
            {myBookings.length === 0 ? (
              <EmptyText>You have no active table reservations.</EmptyText>
            ) : (
              myBookings.map((b) => (
                <BookingCard key={b.id}>
                  <BookingInfo>
                    <BookingMain>
                      Table {b.table_number} — {b.party_size} Guests
                    </BookingMain>
                    <BookingSub>
                      {b.reservation_date} at {b.reservation_time.slice(0, 5)}
                    </BookingSub>
                  </BookingInfo>

                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <StatusTag $status={b.status}>{b.status}</StatusTag>
                    {b.status !== "CANCELLED" && b.status !== "COMPLETED" && (
                      <CancelBtn onClick={() => handleCancelBooking(b.id)}>
                        Cancel
                      </CancelBtn>
                    )}
                  </div>
                </BookingCard>
              ))
            )}
          </ReservationsList>
        )}
      </ModalCard>
    </Overlay>
  );
}