import React, { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";
import { X, ChevronRight, Check, Trash2, Plus } from "lucide-react";
import apiClient from "../api/client";
import { useAuth } from "../context/AuthContext";

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
  max-width: 880px;
  max-height: 90vh;
  background-color: ${({ theme }) => theme.colors.card};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 28px;
  padding: clamp(20px, 4vw, 32px);
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
  display: flex;
  align-items: center;
  gap: 6px;
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: 14px;
  padding: 4px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  overflow-x: auto;
`;

const TabButton = styled.button`
  padding: 10px 16px;
  font-size: 13px;
  font-weight: 700;
  border-radius: 10px;
  white-space: nowrap;
  color: ${({ $active, theme }) => ($active ? theme.colors.vanilla : theme.colors.textMuted)};
  background-color: ${({ $active, theme }) => ($active ? theme.colors.cardElevated : "transparent")};
  box-shadow: ${({ $active }) => ($active ? "0 4px 12px rgba(0, 0, 0, 0.3)" : "none")};
  transition: all 0.2s;
`;

const ContentArea = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-height: 500px;
  overflow-y: auto;
`;

const MetricsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
`;

const MetricTile = styled.div`
  background-color: ${({ theme }) => theme.colors.cardElevated};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 18px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const MetricLabel = styled.span`
  font-size: 12px;
  font-weight: 800;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.latte};
`;

const MetricValue = styled.span`
  font-size: 26px;
  font-weight: 900;
  color: ${({ theme }) => theme.colors.vanilla};
`;

const ActionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 8px;
`;

const SectionSubhead = styled.h3`
  font-size: 16px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.vanilla};
`;

const ToggleFormBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border-radius: 10px;
  font-size: 12px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.vanilla};
  background: ${({ theme }) => theme.gradients.caramelMocha};
`;

const FormBox = styled.form`
  background-color: ${({ theme }) => theme.colors.cardElevated};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 18px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;

  @media (min-width: 600px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const Label = styled.label`
  font-size: 11px;
  font-weight: 800;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.latte};
`;

const Input = styled.input`
  background-color: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 10px;
  padding: 10px 12px;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.vanilla};
`;

const Select = styled.select`
  background-color: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 10px;
  padding: 10px 12px;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.vanilla};
  outline: none;
`;

const SubmitBtn = styled.button`
  align-self: flex-end;
  padding: 10px 20px;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.vanilla};
  background: ${({ theme }) => theme.colors.success};
  transition: all 0.2s;

  &:hover {
    transform: translateY(-1px);
  }
`;

const ListGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 14px;
`;

const EntityCard = styled.div`
  background-color: ${({ theme }) => theme.colors.cardElevated};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 16px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 12px;
`;

const EntityTop = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
`;

const EntityTitle = styled.span`
  font-size: 16px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.vanilla};
`;

const EntityMeta = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const DeleteBtn = styled.button`
  background: transparent;
  color: ${({ theme }) => theme.colors.burntCaramel};
  padding: 4px;
  transition: color 0.2s;

  &:hover {
    color: ${({ theme }) => theme.colors.vanilla};
  }
`;

const StatusPill = styled.span`
  font-size: 11px;
  font-weight: 800;
  padding: 4px 8px;
  border-radius: 6px;
  text-transform: uppercase;
  width: fit-content;
  color: ${({ $status, theme }) =>
    $status === "COMPLETED" || $status === "AVAILABLE"
      ? theme.colors.success
      : $status === "PREPARING" || $status === "OCCUPIED"
      ? theme.colors.burntCaramel
      : theme.colors.warning};
  background-color: rgba(0, 0, 0, 0.3);
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const OrderCard = styled.div`
  background-color: ${({ theme }) => theme.colors.cardElevated};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 18px;
  padding: 18px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const AdvanceBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 10px;
  font-size: 12px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.vanilla};
  background: ${({ theme }) => theme.gradients.caramelMocha};
  transition: all 0.2s;

  &:hover {
    transform: translateY(-1px);
  }
`;

const UserRow = styled.div`
  background-color: ${({ theme }) => theme.colors.cardElevated};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 14px;
  padding: 14px 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

export default function StaffDashboardModal({ isOpen, onClose }) {
  const { user } = useAuth();
  const [tab, setTab] = useState("orders");
  const [metrics, setMetrics] = useState(null);
  const [orders, setOrders] = useState([]);
  const [tables, setTables] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [usersList, setUsersList] = useState([]);

  const [showAddTable, setShowAddTable] = useState(false);
  const [showAddDish, setShowAddDish] = useState(false);

  const [tableForm, setTableForm] = useState({
    table_number: "",
    capacity: 4,
    location: "INDOOR",
  });

  const [dishForm, setDishForm] = useState({
    name: "",
    price: "",
    category: "",
    description: "",
  });

  const fetchAllData = () => {
    apiClient.get("restaurant/orders/").then((res) => setOrders(res.data.results || res.data || [])).catch(() => {});
    apiClient.get("restaurant/tables/").then((res) => setTables(res.data.results || res.data || [])).catch(() => {});
    apiClient.get("restaurant/menu-items/").then((res) => setMenuItems(res.data.results || res.data || [])).catch(() => {});
    apiClient.get("restaurant/categories/").then((res) => {
      const cats = res.data.results || res.data || [];
      setCategories(cats);
      if (cats.length > 0 && !dishForm.category) {
        setDishForm((prev) => ({ ...prev, category: cats[0].id }));
      }
    }).catch(() => {});
    apiClient.get("restaurant/reservations/").then((res) => setReservations(res.data.results || res.data || [])).catch(() => {});
    apiClient.get("restaurant/metrics/").then((res) => setMetrics(res.data)).catch(() => {});

    if (user && (user.role === "ADMIN" || user.is_superuser)) {
      apiClient.get("auth/users/").then((res) => setUsersList(res.data.results || res.data || [])).catch(() => {});
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchAllData();
      const interval = setInterval(fetchAllData, 10000);
      return () => clearInterval(interval);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleAdvanceOrder = async (orderId) => {
    try {
      await apiClient.post(`restaurant/orders/${orderId}/advance-status/`);
      fetchAllData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleConfirmReservation = async (resId) => {
    try {
      await apiClient.post(`restaurant/reservations/${resId}/confirm/`);
      fetchAllData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCompleteReservation = async (resId) => {
    try {
      await apiClient.post(`restaurant/reservations/${resId}/complete/`);
      fetchAllData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateTable = async (e) => {
    e.preventDefault();
    try {
      await apiClient.post("restaurant/tables/", {
        table_number: parseInt(tableForm.table_number, 10),
        capacity: parseInt(tableForm.capacity, 10),
        location: tableForm.location,
        status: "AVAILABLE",
      });
      setShowAddTable(false);
      setTableForm({ table_number: "", capacity: 4, location: "INDOOR" });
      fetchAllData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteTable = async (tableId) => {
    try {
      await apiClient.delete(`restaurant/tables/${tableId}/`);
      fetchAllData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateDish = async (e) => {
    e.preventDefault();
    try {
      await apiClient.post("restaurant/menu-items/", {
        name: dishForm.name,
        price: dishForm.price,
        category: parseInt(dishForm.category, 10),
        description: dishForm.description,
        is_available: true,
      });
      setShowAddDish(false);
      setDishForm({ name: "", price: "", category: categories[0]?.id || "", description: "" });
      fetchAllData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteDish = async (dishId) => {
    try {
      await apiClient.delete(`restaurant/menu-items/${dishId}/`);
      fetchAllData();
    } catch (err) {
      console.error(err);
    }
  };

  const handlePromoteUser = async (userId, newRole) => {
    try {
      await apiClient.patch(`auth/users/${userId}/`, { role: newRole });
      fetchAllData();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Overlay onClick={onClose}>
      <ModalCard onClick={(e) => e.stopPropagation()}>
        <HeaderRow>
          <TitleBlock>
            <Title>Restaurant Operations</Title>
            <Subtitle>Live auto-sync enabled (10s refresh).</Subtitle>
          </TitleBlock>
          <CloseBtn onClick={onClose}>
            <X size={18} />
          </CloseBtn>
        </HeaderRow>

        <TabTrack>
          <TabButton type="button" $active={tab === "orders"} onClick={() => setTab("orders")}>
            Kitchen ({orders.filter((o) => o.status !== "COMPLETED" && o.status !== "CANCELLED").length})
          </TabButton>
          <TabButton type="button" $active={tab === "tables"} onClick={() => setTab("tables")}>
            Tables ({tables.length})
          </TabButton>
          <TabButton type="button" $active={tab === "menu"} onClick={() => setTab("menu")}>
            Menu ({menuItems.length})
          </TabButton>
          <TabButton type="button" $active={tab === "reservations"} onClick={() => setTab("reservations")}>
            Bookings ({reservations.length})
          </TabButton>
          <TabButton type="button" $active={tab === "metrics"} onClick={() => setTab("metrics")}>
            Performance
          </TabButton>
          {user && (user.role === "ADMIN" || user.is_superuser) && (
            <TabButton type="button" $active={tab === "users"} onClick={() => setTab("users")}>
              Users ({usersList.length})
            </TabButton>
          )}
        </TabTrack>

        <ContentArea>
          {tab === "orders" && (
            orders.length === 0 ? (
              <div style={{ padding: "40px 0", textAlign: "center", color: "#9E867E" }}>No active orders in kitchen.</div>
            ) : (
              orders.map((o) => (
                <OrderCard key={o.id}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: "16px", fontWeight: 800, color: "#FFF0DC" }}>
                      Order #{o.id} • Table {o.table_number}
                    </span>
                    <StatusPill $status={o.status}>{o.status}</StatusPill>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                    {(o.items || []).map((it) => (
                      <div key={it.id} style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", color: "#E7C6A1" }}>
                        <span>{it.quantity}x {it.menu_item_name}</span>
                        <span>{(Math.round(parseFloat(it.unit_price)) * it.quantity).toLocaleString()} RWF</span>
                      </div>
                    ))}
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "8px", borderTop: "1px solid #3B3131" }}>
                    <span style={{ fontSize: "15px", fontWeight: 900, color: "#FFF0DC" }}>
                      {Math.round(parseFloat(o.total_amount)).toLocaleString()} RWF
                    </span>
                    {o.status === "PENDING" && (
                      <AdvanceBtn onClick={() => handleAdvanceOrder(o.id)}>
                        Start Preparing <ChevronRight size={14} />
                      </AdvanceBtn>
                    )}
                    {o.status === "PREPARING" && (
                      <AdvanceBtn onClick={() => handleAdvanceOrder(o.id)}>
                        Mark as Served <Check size={14} />
                      </AdvanceBtn>
                    )}
                  </div>
                </OrderCard>
              ))
            )
          )}

          {tab === "tables" && (
            <>
              <ActionHeader>
                <SectionSubhead>Dining Floor Management</SectionSubhead>
                <ToggleFormBtn onClick={() => setShowAddTable(!showAddTable)}>
                  <Plus size={14} /> Add Table
                </ToggleFormBtn>
              </ActionHeader>

              {showAddTable && (
                <FormBox onSubmit={handleCreateTable}>
                  <FormRow>
                    <Field>
                      <Label>Table Number</Label>
                      <Input
                        type="number"
                        placeholder="e.g. 15"
                        value={tableForm.table_number}
                        onChange={(e) => setTableForm({ ...tableForm, table_number: e.target.value })}
                        required
                      />
                    </Field>
                    <Field>
                      <Label>Capacity (Seats)</Label>
                      <Input
                        type="number"
                        min="1"
                        max="20"
                        value={tableForm.capacity}
                        onChange={(e) => setTableForm({ ...tableForm, capacity: e.target.value })}
                        required
                      />
                    </Field>
                    <Field>
                      <Label>Location</Label>
                      <Select
                        value={tableForm.location}
                        onChange={(e) => setTableForm({ ...tableForm, location: e.target.value })}
                      >
                        <option value="INDOOR">Indoor</option>
                        <option value="OUTDOOR">Outdoor</option>
                        <option value="BALCONY">Balcony</option>
                        <option value="ROOFTOP">Rooftop</option>
                      </Select>
                    </Field>
                  </FormRow>
                  <SubmitBtn type="submit">Save Dining Table</SubmitBtn>
                </FormBox>
              )}

              <ListGrid>
                {tables.map((tbl) => (
                  <EntityCard key={tbl.id}>
                    <EntityTop>
                      <EntityTitle>Table {tbl.table_number}</EntityTitle>
                      <DeleteBtn onClick={() => handleDeleteTable(tbl.id)}>
                        <Trash2 size={16} />
                      </DeleteBtn>
                    </EntityTop>
                    <EntityMeta>{tbl.capacity} Seats • {tbl.location}</EntityMeta>
                    <StatusPill $status={tbl.status}>{tbl.status}</StatusPill>
                  </EntityCard>
                ))}
              </ListGrid>
            </>
          )}

          {tab === "menu" && (
            <>
              <ActionHeader>
                <SectionSubhead>Culinary Offerings</SectionSubhead>
                <ToggleFormBtn onClick={() => setShowAddDish(!showAddDish)}>
                  <Plus size={14} /> Add New Dish
                </ToggleFormBtn>
              </ActionHeader>

              {showAddDish && (
                <FormBox onSubmit={handleCreateDish}>
                  <FormRow>
                    <Field>
                      <Label>Dish Name</Label>
                      <Input
                        placeholder="e.g. Garlic Butter Prawns"
                        value={dishForm.name}
                        onChange={(e) => setDishForm({ ...dishForm, name: e.target.value })}
                        required
                      />
                    </Field>
                    <Field>
                      <Label>Price (RWF)</Label>
                      <Input
                        type="number"
                        placeholder="e.g. 12000"
                        value={dishForm.price}
                        onChange={(e) => setDishForm({ ...dishForm, price: e.target.value })}
                        required
                      />
                    </Field>
                    <Field>
                      <Label>Category</Label>
                      <Select
                        value={dishForm.category}
                        onChange={(e) => setDishForm({ ...dishForm, category: e.target.value })}
                      >
                        {categories.map((c) => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </Select>
                    </Field>
                  </FormRow>
                  <Field>
                    <Label>Description</Label>
                    <Input
                      placeholder="Ingredients and culinary preparation details..."
                      value={dishForm.description}
                      onChange={(e) => setDishForm({ ...dishForm, description: e.target.value })}
                    />
                  </Field>
                  <SubmitBtn type="submit">Publish to Menu</SubmitBtn>
                </FormBox>
              )}

              <ListGrid>
                {menuItems.map((dish) => (
                  <EntityCard key={dish.id}>
                    <EntityTop>
                      <EntityTitle>{dish.name}</EntityTitle>
                      <DeleteBtn onClick={() => handleDeleteDish(dish.id)}>
                        <Trash2 size={16} />
                      </DeleteBtn>
                    </EntityTop>
                    <EntityMeta>{dish.category_name || "Bistro Special"}</EntityMeta>
                    <span style={{ fontSize: "16px", fontWeight: 900, color: "#FFF0DC" }}>
                      {Math.round(parseFloat(dish.price)).toLocaleString()} RWF
                    </span>
                  </EntityCard>
                ))}
              </ListGrid>
            </>
          )}

          {tab === "reservations" && (
            reservations.length === 0 ? (
              <div style={{ padding: "40px 0", textAlign: "center", color: "#9E867E" }}>No reservations booked.</div>
            ) : (
              reservations.map((r) => (
                <div key={r.id} style={{ background: "#241E1E", border: "1px solid #3B3131", borderRadius: "14px", padding: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <span style={{ fontSize: "15px", fontWeight: 800, color: "#FFF0DC", display: "block" }}>
                      {r.customer_username} • Table {r.table_number}
                    </span>
                    <span style={{ fontSize: "12px", color: "#9E867E" }}>
                      {r.party_size} Guests • {r.reservation_date} at {r.reservation_time.slice(0, 5)}
                    </span>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <StatusPill $status={r.status}>{r.status}</StatusPill>
                    {r.status === "PENDING" && (
                      <SubmitBtn type="button" onClick={() => handleConfirmReservation(r.id)}>Confirm</SubmitBtn>
                    )}
                    {r.status === "CONFIRMED" && (
                      <SubmitBtn type="button" onClick={() => handleCompleteReservation(r.id)}>Complete</SubmitBtn>
                    )}
                  </div>
                </div>
              ))
            )
          )}

          {tab === "metrics" && (
            <MetricsContainer>
              <MetricTile>
                <MetricLabel>Total Revenue</MetricLabel>
                <MetricValue>{Math.round(parseFloat(metrics?.total_revenue || 0)).toLocaleString()} RWF</MetricValue>
              </MetricTile>

              <MetricTile>
                <MetricLabel>Active Kitchen Orders</MetricLabel>
                <MetricValue>{metrics?.active_orders ?? "--"}</MetricValue>
              </MetricTile>

              <MetricTile>
                <MetricLabel>Total Reservations</MetricLabel>
                <MetricValue>{metrics?.total_reservations ?? "--"}</MetricValue>
              </MetricTile>
            </MetricsContainer>
          )}

          {tab === "users" && (
            usersList.map((u) => (
              <UserRow key={u.id}>
                <div>
                  <span style={{ fontSize: "14px", fontWeight: 800, color: "#FFF0DC", display: "block" }}>
                    {u.username} ({u.email})
                  </span>
                  <span style={{ fontSize: "11px", color: "#9E867E" }}>Role: {u.role}</span>
                </div>

                {u.role === "CUSTOMER" && (
                  <ToggleFormBtn onClick={() => handlePromoteUser(u.id, "STAFF")}>
                    Promote to Staff
                  </ToggleFormBtn>
                )}
                {u.role === "STAFF" && (
                  <ToggleFormBtn onClick={() => handlePromoteUser(u.id, "ADMIN")}>
                    Promote to Admin
                  </ToggleFormBtn>
                )}
              </UserRow>
            ))
          )}
        </ContentArea>
      </ModalCard>
    </Overlay>
  );
}