import React, { useState } from "react";
import styled, { keyframes } from "styled-components";
import { X } from "lucide-react";
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
  max-width: 460px;
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
  &::-webkit-scrollbar-track {
    background: transparent;
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
  gap: 14px;
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

  &::placeholder {
    color: ${({ theme }) => theme.colors.textMuted};
  }

  &:focus {
    border-color: ${({ theme }) => theme.colors.burntCaramel};
    box-shadow: 0 0 0 3px rgba(201, 124, 93, 0.18);
    background-color: #2D2424;
  }
`;

const SubmitBtn = styled.button`
  margin-top: 10px;
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
    box-shadow: 0 12px 28px rgba(123, 75, 58, 0.5);
  }

  &:active:not(:disabled) {
    transform: scale(0.98);
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

const ToggleText = styled.div`
  text-align: center;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textMuted};
  margin-top: 2px;
`;

const ToggleLink = styled.button`
  background: transparent;
  color: ${({ theme }) => theme.colors.latte};
  font-weight: 700;
  margin-left: 6px;
  transition: color 0.2s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.vanilla};
    text-decoration: underline;
  }
`;

export default function AuthModal({ isOpen, onClose }) {
  const { login, register } = useAuth();
  const [tab, setTab] = useState("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone_number: "",
    password: "",
    password_confirm: "",
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await login(formData.username, formData.password);
      onClose();
    } catch (err) {
      setError(err.response?.data?.detail || "Invalid username or password.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (formData.password !== formData.password_confirm) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      await register({
        username: formData.username,
        email: formData.email,
        phone_number: formData.phone_number,
        password: formData.password,
        password_confirm: formData.password_confirm,
      });
      await login(formData.username, formData.password);
      onClose();
    } catch (err) {
      const msg =
        err.response?.data?.password?.[0] ||
        err.response?.data?.username?.[0] ||
        err.response?.data?.email?.[0] ||
        "Registration failed. Please check your information.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Overlay onClick={onClose}>
      <ModalCard onClick={(e) => e.stopPropagation()}>
        <HeaderRow>
          <TitleBlock>
            <Title>{tab === "login" ? "Sign In" : "Register"}</Title>
            <Subtitle>
              {tab === "login"
                ? "Access your reservations, orders, and table checks."
                : "Create an account for contactless ordering and bookings."}
            </Subtitle>
          </TitleBlock>
          <CloseBtn onClick={onClose} aria-label="Close">
            <X size={18} />
          </CloseBtn>
        </HeaderRow>

        <TabTrack>
          <TabButton
            type="button"
            $active={tab === "login"}
            onClick={() => {
              setTab("login");
              setError(null);
            }}
          >
            Existing Customer
          </TabButton>
          <TabButton
            type="button"
            $active={tab === "register"}
            onClick={() => {
              setTab("register");
              setError(null);
            }}
          >
            New Account
          </TabButton>
        </TabTrack>

        {error && <ErrorBox>{error}</ErrorBox>}

        {tab === "login" ? (
          <Form onSubmit={handleLogin}>
            <FieldGroup>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                name="username"
                placeholder="e.g. johndoe"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </FieldGroup>

            <FieldGroup>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </FieldGroup>

            <SubmitBtn type="submit" disabled={loading}>
              {loading ? "Signing in..." : "Continue"}
            </SubmitBtn>

            <ToggleText>
              New to DineFlow?
              <ToggleLink
                type="button"
                onClick={() => {
                  setTab("register");
                  setError(null);
                }}
              >
                Create an account
              </ToggleLink>
            </ToggleText>
          </Form>
        ) : (
          <Form onSubmit={handleRegister}>
            <FieldGroup>
              <Label htmlFor="reg-username">Username</Label>
              <Input
                id="reg-username"
                name="username"
                placeholder="Choose a username"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </FieldGroup>

            <FieldGroup>
              <Label htmlFor="reg-email">Email Address</Label>
              <Input
                id="reg-email"
                type="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </FieldGroup>

            <FieldGroup>
              <Label htmlFor="reg-phone">Phone Number (Optional)</Label>
              <Input
                id="reg-phone"
                name="phone_number"
                placeholder="+1 234 567 8900"
                value={formData.phone_number}
                onChange={handleChange}
              />
            </FieldGroup>

            <FieldGroup>
              <Label htmlFor="reg-password">Password</Label>
              <Input
                id="reg-password"
                type="password"
                name="password"
                placeholder="At least 8 characters"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </FieldGroup>

            <FieldGroup>
              <Label htmlFor="reg-confirm">Confirm Password</Label>
              <Input
                id="reg-confirm"
                type="password"
                name="password_confirm"
                placeholder="Re-enter password"
                value={formData.password_confirm}
                onChange={handleChange}
                required
              />
            </FieldGroup>

            <SubmitBtn type="submit" disabled={loading}>
              {loading ? "Creating Account..." : "Create Account"}
            </SubmitBtn>

            <ToggleText>
              Already have an account?
              <ToggleLink
                type="button"
                onClick={() => {
                  setTab("login");
                  setError(null);
                }}
              >
                Sign in
              </ToggleLink>
            </ToggleText>
          </Form>
        )}
      </ModalCard>
    </Overlay>
  );
}