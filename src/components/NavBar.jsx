import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { UtensilsCrossed, LogIn, LogOut, Menu, X, ShoppingBag } from "lucide-react";
import apiClient from "../api/client";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const Header = styled.header`
  position: sticky;
  top: 0;
  z-index: 50;
  backdrop-filter: blur(14px);
  background-color: rgba(25, 21, 21, 0.88);
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const Container = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 24px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const LogoWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  cursor: pointer;
`;

const LogoBadge = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: ${({ theme }) => theme.gradients.caramelMocha};
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 20px rgba(123, 75, 58, 0.35);
`;

const BrandText = styled.div`
  display: flex;
  flex-direction: column;
`;

const BrandTitle = styled.span`
  font-size: 24px;
  font-weight: 900;
  letter-spacing: 1.5px;
  background: ${({ theme }) => theme.gradients.accentGradient};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const BrandSubtitle = styled.span`
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.textMuted};

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    display: none;
  }
`;

const NavLinks = styled.nav`
  display: flex;
  align-items: center;
  gap: 28px;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    display: none;
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
  gap: 16px;
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

const UserBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;

const Username = styled.span`
  font-size: 14px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.vanilla};
`;

const RoleTag = styled.span`
  font-size: 10px;
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
  box-shadow: 0 6px 18px rgba(123, 75, 58, 0.3);
  transition: all 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.gradients.caramelMochaHover};
    transform: translateY(-1px);
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    display: none;
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
  display: none;
  background: ${({ theme }) => theme.colors.card};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 10px;
  padding: 8px;
  color: ${({ theme }) => theme.colors.vanilla};

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

export default function Navbar({ onOpenAuth, onOpenReservation, onOpenOrders }) {
  const { user, logout } = useAuth();
  const { totalItemsCount, setIsDrawerOpen } = useCart();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Header>
      <Container>
        <LogoWrapper>
          <LogoBadge>
            <UtensilsCrossed size={22} color="#FFF0DC" />
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
        </NavLinks>

        <RightCluster>
          <CartButton onClick={() => setIsDrawerOpen(true)} title="View Order">
            <ShoppingBag size={18} />
            {totalItemsCount > 0 && <CartBadge>{totalItemsCount}</CartBadge>}
          </CartButton>

          {user ? (
            <UserBadge>
              <UserInfo>
                <Username>{user.username}</Username>
                <RoleTag>{user.role}</RoleTag>
              </UserInfo>
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
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </MobileMenuButton>
        </RightCluster>
      </Container>
    </Header>
  );
}