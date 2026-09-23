import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { UtensilsCrossed, LogIn, LogOut, Menu, X } from "lucide-react";
import apiClient from "../api/client";
import { useAuth } from "../context/AuthContext";

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
  gap: 32px;

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

const StatusBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 14px;
  border-radius: 999px;
  background-color: ${({ theme }) => theme.colors.card};
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const StatusDot = styled.span`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: ${({ $isOpen, theme }) =>
    $isOpen ? theme.colors.success : theme.colors.danger};
`;

const StatusText = styled.span`
  font-size: 12px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textSecondary};
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

const MobileDrawer = styled.div`
  display: none;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 16px 24px 24px;
    background-color: ${({ theme }) => theme.colors.background};
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  }
`;

export default function Navbar({ onOpenAuth, onOpenReservation }) {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [serviceStatus, setServiceStatus] = useState("Open");

  useEffect(() => {
    apiClient
      .get("restaurant/status/")
      .then((res) => {
        setServiceStatus(res.data.status === "OPEN" ? "Open" : "Closed");
      })
      .catch(() => setServiceStatus("Closed"));
  }, []);

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

          <StatusBadge>
            <StatusDot $isOpen={serviceStatus === "Open"} />
            <StatusText>{serviceStatus}</StatusText>
          </StatusBadge>
        </NavLinks>

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
      </Container>

      {isOpen && (
        <MobileDrawer>
          <NavLink href="#menu" onClick={() => setIsOpen(false)}>
            Menu
          </NavLink>
          <button
            onClick={() => {
              onOpenReservation();
              setIsOpen(false);
            }}
            style={{
              padding: "8px 0",
              background: "transparent",
              color: "#E7C6A1",
              textAlign: "left",
              fontWeight: 600,
            }}
          >
            Reservations
          </button>
          {user ? (
            <button
              onClick={() => {
                logout();
                setIsOpen(false);
              }}
              style={{
                padding: "12px",
                background: "transparent",
                color: "#E7C6A1",
                textAlign: "left",
              }}
            >
              Sign Out ({user.username})
            </button>
          ) : (
            <button
              onClick={() => {
                onOpenAuth();
                setIsOpen(false);
              }}
              style={{
                padding: "12px",
                background: "#7B4B3A",
                color: "#FFF0DC",
                borderRadius: "10px",
              }}
            >
              Sign In
            </button>
          )}
        </MobileDrawer>
      )}
    </Header>
  );
}