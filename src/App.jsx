import React, { useState } from "react";
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
import { ArrowRight, CalendarDays, ShoppingBag, Sparkles, Star } from "lucide-react";

const AppContainer = styled.div`
  min-height: 100vh;
  width: 100%;
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
  width: 100%;
  padding: clamp(24px, 4vh, 42px) clamp(16px, 4vw, 56px);
  display: flex;
  align-items: center;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: clamp(32px, 5vw, 64px);
  align-items: center;
  width: 100%;

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: 1.1fr 0.9fr;
  }
`;

const HeroTextContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: clamp(14px, 2vh, 22px);
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
  font-size: clamp(32px, 4.4vw, 58px);
  font-weight: 900;
  line-height: 1.12;
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
  font-size: clamp(14px, 1.5vw, 17px);
  color: ${({ theme }) => theme.colors.textMuted};
  line-height: 1.6;
  max-width: 620px;
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  margin-top: 6px;

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
  padding: clamp(12px, 1.8vh, 16px) clamp(22px, 3vw, 30px);
  border-radius: 14px;
  font-size: 15px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.vanilla};
  background: ${({ theme }) => theme.gradients.caramelMocha};
  box-shadow: 0 8px 22px rgba(123, 75, 58, 0.4);
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
  padding: clamp(12px, 1.8vh, 16px) clamp(20px, 3vw, 26px);
  border-radius: 14px;
  font-size: 15px;
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

const ShowcaseComposition = styled.div`
  position: relative;
  width: 100%;
  max-width: 520px;
  margin: 0 auto;
`;

const CompositionGlow = styled.div`
  position: absolute;
  inset: -14px;
  background: ${({ theme }) => theme.gradients.caramelMocha};
  opacity: 0.16;
  filter: blur(45px);
  border-radius: 40px;
  z-index: 0;
`;

const MainPlateCard = styled.div`
  position: relative;
  z-index: 1;
  width: 100%;
  background-color: ${({ theme }) => theme.colors.card};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 28px;
  padding: clamp(14px, 2.5vh, 20px);
  display: flex;
  flex-direction: column;
  gap: 14px;
  box-shadow: 0 24px 48px rgba(0, 0, 0, 0.7);
`;

const MainImageFrame = styled.div`
  position: relative;
  width: 100%;
  height: clamp(180px, 26vh, 240px);
  border-radius: 20px;
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const MainImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
`;

const FloatingTag = styled.div`
  position: absolute;
  top: 12px;
  left: 12px;
  background: ${({ theme }) => theme.gradients.caramelMocha};
  color: ${({ theme }) => theme.colors.vanilla};
  padding: 6px 14px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.4);
`;

const RatingBadge = styled.div`
  position: absolute;
  bottom: 12px;
  right: 12px;
  background-color: rgba(25, 21, 21, 0.88);
  backdrop-filter: blur(8px);
  border: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.latte};
  padding: 5px 12px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 800;
  display: flex;
  align-items: center;
  gap: 5px;
`;

const DishContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const DishName = styled.h3`
  font-size: 19px;
  font-weight: 900;
  color: ${({ theme }) => theme.colors.vanilla};
`;

const DishDesc = styled.span`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textMuted};
  line-height: 1.4;
`;

const MiniOverlapCard = styled.div`
  position: absolute;
  bottom: -22px;
  right: -16px;
  z-index: 2;
  width: clamp(160px, 22vw, 210px);
  background-color: ${({ theme }) => theme.colors.cardElevated};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 20px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  box-shadow: 0 16px 36px rgba(0, 0, 0, 0.8);
  transform: rotate(2deg);
  transition: transform 0.2s ease;

  &:hover {
    transform: rotate(0deg) scale(1.03);
  }

  @media (max-width: 640px) {
    display: none;
  }
`;

const MiniImage = styled.img`
  width: 100%;
  height: 95px;
  object-fit: cover;
  border-radius: 12px;
  display: block;
`;

const MiniLabel = styled.span`
  font-size: 11px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.vanilla};
  text-align: center;
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
  const [menuRefreshTrigger, setMenuRefreshTrigger] = useState(0);

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
                Artisanal Kitchen & Lounge
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

            <ShowcaseComposition>
              <CompositionGlow />
              <MainPlateCard>
                <MainImageFrame>
                  <MainImage
                    src="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1000&q=80"
                    alt="Charcoal Grilled Prime Ribeye"
                    loading="lazy"
                  />
                  <FloatingTag>Chef's Choice</FloatingTag>
                  <RatingBadge>
                    <Star size={11} fill="#FF9F1C" color="#FF9F1C" />
                    4.9 (180+ Reviews)
                  </RatingBadge>
                </MainImageFrame>

                <DishContent>
                  <DishName>Charcoal Grilled Prime Ribeye</DishName>
                  <DishDesc>Aromatic fresh herbs, garlic-infused butter, fire-roasted asparagus</DishDesc>
                </DishContent>
              </MainPlateCard>

              <MiniOverlapCard>
                <MiniImage
                  src="https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80"
                  alt="Wood-Fired Pizza"
                  loading="lazy"
                />
                <MiniLabel>Wood-Fired Pizza</MiniLabel>
              </MiniOverlapCard>
            </ShowcaseComposition>
          </Grid>
        </MainContent>
      </HeroWrapper>

      <MenuSection refreshTrigger={menuRefreshTrigger} />

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
      <StaffDashboardModal
        isOpen={staffModalOpen}
        onClose={() => setStaffModalOpen(false)}
        onMenuUpdated={() => setMenuRefreshTrigger((p) => p + 1)}
      />
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