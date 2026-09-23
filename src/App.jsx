import React, { useEffect, useState } from "react";
import styled, { ThemeProvider } from "styled-components";
import { theme } from "./theme/theme";
import { GlobalStyles } from "./theme/GlobalStyles";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import Navbar from "./components/Navbar";
import AuthModal from "./components/AuthModal";
import ReservationModal from "./components/ReservationModal";
import CartDrawer from "./components/CartDrawer";
import OrdersModal from "./components/OrdersModal";
import StaffDashboardModal from "./components/StaffDashboardModal";
import MenuSection from "./components/MenuSection";
import apiClient from "./api/client";
import { ArrowRight, CalendarDays, Clock, ShieldCheck, RefreshCw } from "lucide-react";

const AppContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const MainContent = styled.main`
  max-width: 1280px;
  width: 100%;
  margin: 0 auto;
  padding: 60px 24px 20px;
  display: flex;
  align-items: center;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: 40px 20px 20px;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1.15fr 0.85fr;
  gap: 60px;
  align-items: center;
  width: 100%;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
    gap: 40px;
  }
`;

const HeroTextContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const Badge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 999px;
  background: ${({ theme }) => theme.colors.card};
  border: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.latte};
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  width: fit-content;
`;

const Title = styled.h1`
  font-size: 54px;
  font-weight: 900;
  line-height: 1.15;
  letter-spacing: -0.5px;
  color: ${({ theme }) => theme.colors.textPrimary};

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    font-size: 38px;
  }
`;

const GradientText = styled.span`
  background: ${({ theme }) => theme.gradients.caramelMocha};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const Subtitle = styled.p`
  font-size: 18px;
  color: ${({ theme }) => theme.colors.textMuted};
  line-height: 1.6;
  max-width: 520px;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    font-size: 16px;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-top: 8px;
`;

const PrimaryActionButton = styled.a`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 16px 32px;
  border-radius: 14px;
  font-size: 16px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.vanilla};
  background: ${({ theme }) => theme.gradients.caramelMocha};
  box-shadow: 0 10px 25px rgba(123, 75, 58, 0.4);
  transition: all 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.gradients.caramelMochaHover};
    transform: translateY(-2px);
  }
`;

const SecondaryActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 16px 28px;
  border-radius: 14px;
  font-size: 16px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.latte};
  background-color: ${({ theme }) => theme.colors.card};
  border: 1px solid ${({ theme }) => theme.colors.border};
  transition: all 0.2s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.cardElevated};
    border-color: ${({ theme }) => theme.colors.latte};
    color: ${({ theme }) => theme.colors.vanilla};
  }
`;

const CardWrapper = styled.div`
  position: relative;
`;

const CardGlow = styled.div`
  position: absolute;
  inset: -10px;
  background: ${({ theme }) => theme.gradients.caramelMocha};
  opacity: 0.12;
  filter: blur(40px);
  border-radius: 30px;
  z-index: 0;
`;

const StatusCard = styled.div`
  position: relative;
  z-index: 1;
  background-color: ${({ theme }) => theme.colors.card};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 28px;
  padding: 36px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6);
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  padding-bottom: 18px;
`;

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
`;

const MetricTile = styled.div`
  padding: 18px;
  border-radius: 18px;
  background-color: ${({ theme }) => theme.colors.cardElevated};
  border: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const MetricLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const MetricValue = styled.span`
  font-size: 28px;
  font-weight: 900;
  color: ${({ $highlight, theme }) => ($highlight ? theme.colors.success : theme.colors.vanilla)};
`;

const RefreshBtn = styled.button`
  background: ${({ theme }) => theme.colors.cardElevated};
  border: 1px solid ${({ theme }) => theme.colors.border};
  padding: 8px;
  border-radius: 10px;
  color: ${({ theme }) => theme.colors.latte};
  transition: all 0.2s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.vanilla};
    border-color: ${({ theme }) => theme.colors.burntCaramel};
  }
`;

function MainDashboard() {
  const { user } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [reservationModalOpen, setReservationModalOpen] = useState(false);
  const [ordersModalOpen, setOrdersModalOpen] = useState(false);
  const [staffModalOpen, setStaffModalOpen] = useState(false);
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
                <ArrowRight size={18} />
              </PrimaryActionButton>

              <SecondaryActionButton onClick={handleOpenReservation}>
                <CalendarDays size={18} />
                Reserve Table
              </SecondaryActionButton>
            </ButtonGroup>
          </HeroTextContainer>

          <CardWrapper>
            <CardGlow />
            <StatusCard>
              <CardHeader>
                <div>
                  <h3 style={{ fontSize: "18px", fontWeight: 800, color: theme.colors.vanilla }}>
                    Dining Room Status
                  </h3>
                  <p style={{ fontSize: "12px", color: theme.colors.textMuted }}>
                    Today's dining availability
                  </p>
                </div>

                <RefreshBtn onClick={fetchStatus}>
                  <RefreshCw size={16} />
                </RefreshBtn>
              </CardHeader>

              <MetricsGrid>
                <MetricTile>
                  <MetricLabel>
                    <Clock size={14} />
                    Dining Service
                  </MetricLabel>
                  <MetricValue $highlight>{status?.status || "OPEN"}</MetricValue>
                </MetricTile>

                <MetricTile>
                  <MetricLabel>
                    <ShieldCheck size={14} />
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

      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
      <ReservationModal
        isOpen={reservationModalOpen}
        onClose={() => setReservationModalOpen(false)}
      />
      <CartDrawer onRequireAuth={() => setAuthModalOpen(true)} />
      <OrdersModal isOpen={ordersModalOpen} onClose={() => setOrdersModalOpen(false)} />
      <StaffDashboardModal isOpen={staffModalOpen} onClose={() => setStaffModalOpen(false)} />
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