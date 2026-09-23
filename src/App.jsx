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
import AmbientArtCanvas from "./components/AmbientArtCanvas";
import apiClient from "./api/client";
import { ArrowRight, CalendarDays, ShoppingBag, Sparkles } from "lucide-react";

const AppContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
`;

const HeroWrapper = styled.div`
  position: relative;
  width: 100%;
  min-height: calc(100vh - 80px);
  min-height: calc(100dvh - 80px);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const MainContent = styled.main`
  position: relative;
  z-index: 1;
  max-width: 1600px;
  width: 100%;
  margin: 0 auto;
  padding: clamp(20px, 3vh, 36px) clamp(16px, 4vw, 48px);
  display: flex;
  align-items: center;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: clamp(24px, 4vw, 48px);
  align-items: center;
  width: 100%;

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: 1.15fr 0.85fr;
  }
`;

const HeroTextContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: clamp(12px, 2vh, 18px);
`;

const Badge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 14px;
  border-radius: 999px;
  background-color: ${({ theme }) => theme.colors.card};
  border: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.latte};
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 1px;
  text-transform: uppercase;
  width: fit-content;
`;

const Title = styled.h1`
  font-size: clamp(28px, 3.8vw, 48px);
  font-weight: 900;
  line-height: 1.15;
  letter-spacing: -0.5px;
  color: ${({ theme }) => theme.colors.vanilla};
  word-break: break-word;
`;

const GradientText = styled.span`
  background: ${({ theme }) => theme.gradients.caramelMocha};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const Subtitle = styled.p`
  font-size: clamp(13px, 1.4vw, 16px);
  color: ${({ theme }) => theme.colors.textMuted};
  line-height: 1.6;
  max-width: 580px;
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
  padding: clamp(12px, 1.8vh, 14px) clamp(20px, 3vw, 26px);
  border-radius: 12px;
  font-size: 14px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.vanilla};
  background: ${({ theme }) => theme.gradients.caramelMocha};
  box-shadow: 0 8px 20px rgba(123, 75, 58, 0.35);
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
  padding: clamp(12px, 1.8vh, 14px) clamp(18px, 3vw, 24px);
  border-radius: 12px;
  font-size: 14px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.latte};
  background-color: ${({ theme }) => theme.colors.card};
  border: 1px solid ${({ theme }) => theme.colors.border};
  transition: all 0.2s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.cardElevated};
    color: ${({ theme }) => theme.colors.vanilla};
    border-color: ${({ theme }) => theme.colors.burntCaramel};
  }

  @media (max-width: 480px) {
    width: 100%;
  }
`;

const ShowcaseWrapper = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  justify-content: center;
`;

const ShowcaseGlow = styled.div`
  position: absolute;
  inset: -10px;
  background: ${({ theme }) => theme.gradients.caramelMocha};
  opacity: 0.15;
  filter: blur(35px);
  border-radius: 32px;
  z-index: 0;
`;

const ShowcaseCard = styled.div`
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 500px;
  background-color: ${({ theme }) => theme.colors.card};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 24px;
  padding: clamp(14px, 2vh, 18px);
  display: flex;
  flex-direction: column;
  gap: 12px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6);
`;

const DishImageFrame = styled.div`
  position: relative;
  width: 100%;
  height: clamp(160px, 24vh, 230px);
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const DishImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
`;

const FloatingSpecialTag = styled.div`
  position: absolute;
  top: 12px;
  left: 12px;
  background: ${({ theme }) => theme.gradients.caramelMocha};
  color: ${({ theme }) => theme.colors.vanilla};
  padding: 4px 12px;
  border-radius: 999px;
  font-size: 10px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
`;

const ShowcaseFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
`;

const DishMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const DishTitle = styled.h3`
  font-size: 16px;
  font-weight: 900;
  color: ${({ theme }) => theme.colors.vanilla};
`;

const DishTagline = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const PricePill = styled.span`
  font-size: 15px;
  font-weight: 900;
  color: ${({ theme }) => theme.colors.latte};
  background-color: ${({ theme }) => theme.colors.cardElevated};
  border: 1px solid ${({ theme }) => theme.colors.border};
  padding: 5px 12px;
  border-radius: 10px;
  flex-shrink: 0;
`;

const TableServiceBar = styled.div`
  background: ${({ theme }) => theme.colors.cardElevated};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 12px;
  padding: 10px 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
`;

const ServiceStatusText = styled.span`
  font-size: 11px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.latte};
  display: flex;
  align-items: center;
  gap: 6px;
`;

const ServicePulse = styled.span`
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.success};
  box-shadow: 0 0 8px ${({ theme }) => theme.colors.success};
`;

const TablesFreeCount = styled.span`
  font-size: 11px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.vanilla};
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

  useEffect(() => {
    apiClient
      .get("restaurant/status/")
      .then((res) => setStatus(res.data))
      .catch(() => {});
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

      <HeroWrapper>
        <AmbientArtCanvas />

        <MainContent>
          <Grid>
            <HeroTextContainer>
              <Badge>
                <Sparkles size={12} />
                Fine Dining & Lounge
              </Badge>

              <Title>
                Exceptional Cuisine, <GradientText>Unforgettable Evenings.</GradientText>
              </Title>

              <Subtitle>
                Experience chef-crafted dishes inspired by genuine culinary heritage. Reserve your table, explore our seasonal tasting menu, and enjoy seamless dining from table to check.
              </Subtitle>

              <ButtonGroup>
                <PrimaryActionButton href="#menu">
                  Explore Menu
                  <ArrowRight size={15} />
                </PrimaryActionButton>

                <SecondaryActionButton onClick={handleOpenReservation}>
                  <CalendarDays size={15} />
                  Book Table
                </SecondaryActionButton>
              </ButtonGroup>
            </HeroTextContainer>

            <ShowcaseWrapper>
              <ShowcaseGlow />
              <ShowcaseCard>
                <DishImageFrame>
                  <DishImage
                    src="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1000&q=80"
                    alt="Charcoal Grilled Ribeye Special"
                    loading="lazy"
                  />
                  <FloatingSpecialTag>Chef's Signature</FloatingSpecialTag>
                </DishImageFrame>

                <ShowcaseFooter>
                  <DishMeta>
                    <DishTitle>Charcoal Grilled Ribeye</DishTitle>
                    <DishTagline>Aromatic herbs, garlic butter, roasted asparagus</DishTagline>
                  </DishMeta>
                  <PricePill>28,000 RWF</PricePill>
                </ShowcaseFooter>

                <TableServiceBar>
                  <ServiceStatusText>
                    <ServicePulse />
                    {status?.status === "OPEN" ? "Kitchen & Dinner Service Active" : "Service Opens Soon"}
                  </ServiceStatusText>
                  <TablesFreeCount>
                    {status?.available_tables ?? "--"} Tables Available
                  </TablesFreeCount>
                </TableServiceBar>
              </ShowcaseCard>
            </ShowcaseWrapper>
          </Grid>
        </MainContent>
      </HeroWrapper>

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