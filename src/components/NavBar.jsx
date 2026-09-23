import React, { useState } from "react";
import styled from "styled-components";
import { UtensilsCrossed, LogIn, LogOut, Menu, X, ShoppingBag } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const Header = styled.header`
  position: sticky;
  top: 0;
  z-index: 50;
  width: 100%;
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  background-color: rgba(25, 21, 21, 0.92);
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const Container = styled.div`
  width: 100%;
  padding: 0 clamp(16px, 4vw, 56px);
  height: clamp(68px, 8vw, 80px);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

const LogoWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  flex-shrink: 0;
`;

const LogoBadge = styled.div`
  width: clamp(38px, 5vw, 44px);
  height: clamp(38px, 5vw, 44px);
  border-radius: 12px;
  background: ${({ theme }) => theme.gradients.caramelMocha};
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 6px 16px rgba(123, 75, 58, 0.35);
`;

const BrandText = styled.div`
  display: flex;
  flex-direction: column;
`;

const BrandTitle = styled.span`
  font-size: clamp(20px, 4vw, 24px);
  font-weight: 900;
  letter-spacing: 1px;
  background: ${({ theme }) => theme.gradients.accentGradient};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const BrandSubtitle = styled.span`
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 1.2px;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.textMuted};

  @media (max-width: 640px) {
    display: none;
  }
`;

const NavLinks = styled.nav`
  display: none;
  align-items: center;
  gap: 32px;

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    display: flex;
  }
`;

const NavLink = styled.a`
  color: ${({ theme }) => theme.colors.latte};
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: color 0.2s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.vanilla};
  }
`;

const NavButton = styled.button`
  background: transparent;
  color: ${({ theme }) => theme.colors.latte};
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: color 0.2s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.vanilla};
  }
`;

const RightCluster = styled.div`
  display: flex;
  align-items: center;
  gap: clamp(10px, 2vw, 16px);
  flex-shrink: 0;
`;

const CartButton = styled.button`
  position: relative;
  background-color: ${({ theme }) => theme.colors.card};
  border: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.vanilla};
  padding: 10px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

  &:hover {
    border-color: ${({ theme }) => theme.colors.burntCaramel};
  }
`;

const CartBadge = styled.span`
  position: absolute;
  top: -6px;
  right: -6px;
  background: ${({ theme }) => theme.colors.burntCaramel};
  color: #ffffff;
  font-size: 10px;
  font-weight: 900;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StaffBadge = styled.button`
  display: none;
  background: ${({ theme }) => theme.colors.cardElevated};
  border: 1px solid ${({ theme }) => theme.colors.burntCaramel};
  color: ${({ theme }) => theme.colors.latte};
  font-size: 12px;
  font-weight: 800;
  padding: 8px 14px;
  border-radius: 10px;
  transition: all 0.2s;

  &:hover {
    background: ${({ theme }) => theme.colors.card};
    color: ${({ theme }) => theme.colors.vanilla};
  }

  @media (min-width: 480px) {
    display: inline-block;
  }
`;

const UserBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const UserClickArea = styled.button`
  background: transparent;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  cursor: pointer;
`;

const Username = styled.span`
  font-size: 14px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.vanilla};
  max-width: 110px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  @media (max-width: 480px) {
    max-width: 70px;
  }
`;

const RoleTag = styled.span`
  font-size: 9px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.latte};
  letter-spacing: 0.5px;
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.vanilla};
  background: ${({ theme }) => theme.gradients.caramelMocha};
  box-shadow: 0 6px 16px rgba(123, 75, 58, 0.3);
  transition: all 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.gradients.caramelMochaHover};
  }
`;

const LogoutButton = styled.button`
  background: ${({ theme }) => theme.colors.card};
  border: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.latte};
  padding: 8px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

  &:hover {
    color: ${({ theme }) => theme.colors.vanilla};
    border-color: ${({ theme }) => theme.colors.burntCaramel};
  }
`;

const MobileMenuButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.colors.card};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 10px;
  padding: 8px;
  color: ${({ theme }) => theme.colors.vanilla};

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    display: none;
  }
`;

const MobileDrawer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px 20px 24px;
  background-color: ${({ theme }) => theme.colors.background};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    display: none;
  }
`;

const DrawerLink = styled.button`
  background: transparent;
  color: ${({ theme }) => theme.colors.latte};
  font-size: 14px;
  font-weight: 600;
  text-align: left;
  padding: 10px 0;
  border-bottom: 1px solid rgba(59, 49, 49, 0.4);
  cursor: pointer;

  &:hover {
    color: ${({ theme }) => theme.colors.vanilla};
  }
`;

export default function Navbar({
  onOpenAuth,
  onOpenReservation,
  onOpenOrders,
  onOpenStaff,
  onOpenProfile,
}) {
  const { user, logout } = useAuth();
  const { totalItemsCount, setIsDrawerOpen } = useCart();
  const [isOpen, setIsOpen] = useState(false);

  const isStaffOrAdmin = user && (user.role === "STAFF" || user.role === "ADMIN");

  return (
    <Header>
      <Container>
        <LogoWrapper>
          <LogoBadge>
            <UtensilsCrossed size={20} color="#FFF0DC" />
          </LogoBadge>
          <BrandText>
            <BrandTitle>DINEFLOW</BrandTitle>
            <BrandSubtitle>Restaurant & Lounge</BrandSubtitle>
          </BrandText>
        </LogoWrapper>

        <NavLinks>
          <NavLink href="#menu">Menu</NavLink>
          <NavButton onClick={onOpenReservation}>Reservations</NavButton>
          {user && <NavButton onClick={onOpenOrders}>My Orders</NavButton>}
          {isStaffOrAdmin && (
            <StaffBadge onClick={onOpenStaff}>Operations</StaffBadge>
          )}
        </NavLinks>

        <RightCluster>
          <CartButton onClick={() => setIsDrawerOpen(true)} title="View Order">
            <ShoppingBag size={18} />
            {totalItemsCount > 0 && <CartBadge>{totalItemsCount}</CartBadge>}
          </CartButton>

          {isStaffOrAdmin && (
            <StaffBadge onClick={onOpenStaff}>Operations</StaffBadge>
          )}

          {user ? (
            <UserBadge>
              <UserClickArea onClick={onOpenProfile} title="Account Settings">
                <Username>{user.username}</Username>
                <RoleTag>{user.role}</RoleTag>
              </UserClickArea>
              <LogoutButton onClick={logout} title="Sign Out">
                <LogOut size={16} />
              </LogoutButton>
            </UserBadge>
          ) : (
            <ActionButton onClick={onOpenAuth}>
              <LogIn size={16} />
              Sign In
            </ActionButton>
          )}

          <MobileMenuButton onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </MobileMenuButton>
        </RightCluster>
      </Container>

      {isOpen && (
        <MobileDrawer>
          <DrawerLink
            onClick={() => {
              setIsOpen(false);
              window.location.hash = "#menu";
            }}
          >
            Our Menu
          </DrawerLink>
          <DrawerLink
            onClick={() => {
              setIsOpen(false);
              onOpenReservation();
            }}
          >
            Table Reservations
          </DrawerLink>
          {user && (
            <DrawerLink
              onClick={() => {
                setIsOpen(false);
                onOpenOrders();
              }}
            >
              My Orders & Receipts
            </DrawerLink>
          )}
          {isStaffOrAdmin && (
            <DrawerLink
              onClick={() => {
                setIsOpen(false);
                onOpenStaff();
              }}
            >
              Staff Operations
            </DrawerLink>
          )}
          {user ? (
            <DrawerLink
              onClick={() => {
                setIsOpen(false);
                onOpenProfile();
              }}
            >
              Account Settings
            </DrawerLink>
          ) : (
            <ActionButton
              style={{ width: "100%", justifyContent: "center", marginTop: "8px" }}
              onClick={() => {
                setIsOpen(false);
                onOpenAuth();
              }}
            >
              <LogIn size={16} />
              Sign In
            </ActionButton>
          )}
        </MobileDrawer>
      )}
    </Header>
  );
}