import React, { useEffect, useState } from "react";
import styled, { ThemeProvider } from "styled-components";
import { theme } from "./theme/theme";
import { GlobalStyles } from "./theme/GlobalStyles";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { CartProvider, useCart } from "./context/CartContext";
import Navbar from "./components/Navbar";
import AuthModal from "./components/AuthModal";
import ReservationModal from "./components/ReservationModal";
import CartDrawer from "./components/CartDrawer";
import OrdersModal from "./components/OrdersModal";
import StaffDashboardModal from "./components/StaffDashboardModal";
import ProfileModal from "./components/ProfileModal";
import MenuSection from "./components/MenuSection";
import apiClient from "./api/client";
import { ArrowRight, CalendarDays, Clock, ShieldCheck, RefreshCw, ShoppingBag } from "lucide-react";

const AppContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
`;

const MainContent = styled.main`
  max-width: 1280px;
  width: 100%;
  margin: 0 auto;
  padding: clamp(32px, 6vw, 60px) clamp(16px, 4vw, 24px) 20px;
  display: flex;
  align-items: center;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: clamp(32px, 6vw, 60px);
  align-items: center;
  width: 100%;

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: 1.15fr 0.85fr;
  }
`;

const HeroTextContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: clamp(16px, 3vw, 24px);
`;

const Badge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 14px;
  border-radius: 999px;
  background: ${({ theme }) => theme.colors.card};
  border: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.latte};
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  width: fit-content;
`;

const Title = styled.h1`
  font-size: clamp(28px, 6vw, 54px);
  font-weight: 900;
  line-height: 1.15;
  letter-spacing: -0.5px;
  color: ${({ theme }) => theme.colors.textPrimary};
  word-break: break-word;
`;

const GradientText = styled.span`
  background: ${({ theme }) => theme.gradients.caramelMocha};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const Subtitle = styled.p`
  font-size: clamp(14px, 2.5vw, 17px);
  color: ${({ theme }) => theme.colors.textMuted};
  line-height: 1.6;
  max-width: 520px;
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 4px;

  @media (max-width: 480px) {
    flex-direction: column;
    width: 100%;
  }
`;

const PrimaryActionButton = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: clamp(12px, 3vw, 16px) clamp(20px, 4vw, 30px);
  border-radius: 12px;
  font-size: 15px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.vanilla};
  background: ${({ theme }) => theme.gradients.caramelMocha};
  box-shadow: 0 8px 22px rgba(123, 75, 58, 0.35);
  transition: all 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.gradients.caramelMochaHover};
    transform: translateY(-2px);
  }

  @media (max-width: 480px) {
    width: 100%;
  }
`;

const SecondaryActionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: clamp(12px, 3vw, 16px) clamp(18px, 4vw, 26px);
  border-radius: 12px;
  font-size: 15px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.latte};
  background-color: ${({ theme }) => theme.colors.card};
  border: 1px solid ${({ theme }) => theme.colors.border};
  transition: all 0.2s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.cardElevated};
    color: ${({ theme }) => theme.colors.vanilla};
  }

  @media (max-width: 480px) {
    width: 100%;
  }
`;

const CardWrapper = styled.div`
  position: relative;
  width: 100%;
`;

const CardGlow = styled.div`
  position: absolute;
  inset: -8px;
  background: ${({ theme }) => theme.gradients.caramelMocha};
  opacity: 0.1;
  filter: blur(30px);
  border-radius: 28px;
  z-index: 0;
`;

const StatusCard = styled.div`
  position: relative;
  z-index: 1;
  background-color: ${({ theme }) => theme.colors.card};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: clamp(20px, 4vw, 28px);
  padding: clamp(20px, 4vw, 32px);
  display: flex;
  flex-direction: column;
  gap: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  padding-bottom: 14px;
`;

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;

  @media (min-width: 420px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const MetricTile = styled.div`
  padding: clamp(12px, 3vw, 16px);
  border-radius: 14px;
  background-color: ${({ theme }) => theme.colors.cardElevated};
  border: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const MetricLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const MetricValue = styled.span`
  font-size: clamp(22px, 4vw, 26px);
  font-weight: 900;
  color: ${({ $highlight, theme }) => ($highlight ? theme.colors.success : theme.colors.vanilla)};
`;

const RefreshBtn = styled.button`
  background: ${({ theme }) => theme.colors.cardElevated};
  border: 1px solid ${({ theme }) => theme.colors.border};
  padding: 8px;
  border-radius: 8px;
  color: ${({ theme }) => theme.colors.latte};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.vanilla};
  }
`;

const MobileStickyBar = styled.button`
  position: fixed;
  bottom: 16px;
  left: 16px;
  right: 16px;
  z-index: 90;
  background: ${({ theme }) => theme.gradients.caramelMocha};
  color: ${({ theme }) => theme.colors.vanilla};
  border-radius: 14px;
  padding: 14px 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.7);

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    display: none;
  }
`;

function MainDashboard() {
  const { user } = useAuth();
  const { totalItemsCount, totalAmountRWF, setIsDrawerOpen } = useCart();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [reservationModalOpen, setReservationModalOpen] = useState(false);
  const [ordersModalOpen, setOrdersModalOpen] = useState(false);
  const [staffModalOpen, setStaffModalOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [status, setStatus] = useState(null);

  const fetchStatus = () => {
    apiClient
      .get("restaurant/status/")
      .then((res) => setStatus(res.data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const handleOpenReservation = () => {
    if (!user) {
      setAuthModalOpen(true);
    } else {
      setReservationModalOpen(true);
    }
  };

  const handleOpenOrders = () => {
    if (!user) {
      setAuthModalOpen(true);
    } else {
      setOrdersModalOpen(true);
    }
  };

  return (
    <AppContainer>
      <Navbar
        onOpenAuth={() => setAuthModalOpen(true)}
        onOpenReservation={handleOpenReservation}
        onOpenOrders={handleOpenOrders}
        onOpenStaff={() => setStaffModalOpen(true)}
        onOpenProfile={() => setProfileModalOpen(true)}
      />

      <MainContent>
        <Grid>
          <HeroTextContainer>
            <Badge>Welcome to DineFlow</Badge>

            <Title>
              Warm Hospitality Meets <GradientText>Artisanal Flavors.</GradientText>
            </Title>

            <Subtitle>
              Browse our chef-curated selection, reserve your table with ease, and enjoy a seamless dining experience.
            </Subtitle>

            <ButtonGroup>
              <PrimaryActionButton href="#menu">
                View Menu
                <ArrowRight size={16} />
              </PrimaryActionButton>

              <SecondaryActionButton onClick={handleOpenReservation}>
                <CalendarDays size={16} />
                Reserve Table
              </SecondaryActionButton>
            </ButtonGroup>
          </HeroTextContainer>

          <CardWrapper>
            <CardGlow />
            <StatusCard>
              <CardHeader>
                <div>
                  <h3 style={{ fontSize: "16px", fontWeight: 800, color: theme.colors.vanilla }}>
                    Dining Room Status
                  </h3>
                  <p style={{ fontSize: "12px", color: theme.colors.textMuted }}>
                    Today's dining availability
                  </p>
                </div>

                <RefreshBtn onClick={fetchStatus}>
                  <RefreshCw size={15} />
                </RefreshBtn>
              </CardHeader>

              <MetricsGrid>
                <MetricTile>
                  <MetricLabel>
                    <Clock size={13} />
                    Dining Service
                  </MetricLabel>
                  <MetricValue $highlight>{status?.status || "OPEN"}</MetricValue>
                </MetricTile>

                <MetricTile>
                  <MetricLabel>
                    <ShieldCheck size={13} />
                    Available Tables
                  </MetricLabel>
                  <MetricValue>{status?.available_tables ?? "--"}</MetricValue>
                </MetricTile>
              </MetricsGrid>
            </StatusCard>
          </CardWrapper>
        </Grid>
      </MainContent>

      <MenuSection />

      {totalItemsCount > 0 && (
        <MobileStickyBar onClick={() => setIsDrawerOpen(true)}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <ShoppingBag size={17} />
            <span style={{ fontWeight: 800, fontSize: "13px" }}>{totalItemsCount} Dishes</span>
          </div>
          <span style={{ fontWeight: 900, fontSize: "14px" }}>{totalAmountRWF.toLocaleString()} RWF →</span>
        </MobileStickyBar>
      )}

      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
      <ReservationModal
        isOpen={reservationModalOpen}
        onClose={() => setReservationModalOpen(false)}
      />
      <CartDrawer onRequireAuth={() => setAuthModalOpen(true)} />
      <OrdersModal isOpen={ordersModalOpen} onClose={() => setOrdersModalOpen(false)} />
      <StaffDashboardModal isOpen={staffModalOpen} onClose={() => setStaffModalOpen(false)} />
      <ProfileModal isOpen={profileModalOpen} onClose={() => setProfileModalOpen(false)} />
    </AppContainer>
  );
}

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <AuthProvider>
        <CartProvider>
          <MainDashboard />
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}