import React, { useState, useRef } from "react";
import styled, { keyframes } from "styled-components";
import { X, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../context/AuthContext";
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
  line-height: 1.45;
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

const PasswordFieldWrapper = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
`;

const Input = styled.input`
  width: 100%;
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

const PasswordInput = styled(Input)`
  padding-right: 44px;
`;

const EyeToggleBtn = styled.button`
  position: absolute;
  right: 12px;
  background: transparent;
  color: ${({ theme }) => theme.colors.latte};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  transition: color 0.2s;

  &:hover {
    color: ${({ theme }) => theme.colors.vanilla};
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

const SuccessNotification = styled.div`
  padding: 12px 16px;
  border-radius: 12px;
  background-color: rgba(82, 183, 136, 0.15);
  border: 1px solid ${({ theme }) => theme.colors.success};
  color: ${({ theme }) => theme.colors.vanilla};
  font-size: 13px;
  font-weight: 600;
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

const OtpGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 8px;
  margin: 12px 0;
`;

const OtpBox = styled.input`
  width: 100%;
  height: 52px;
  background-color: ${({ theme }) => theme.colors.cardElevated};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 12px;
  font-size: 20px;
  font-weight: 900;
  text-align: center;
  color: ${({ theme }) => theme.colors.vanilla};
  transition: all 0.2s ease;

  &:focus {
    border-color: ${({ theme }) => theme.colors.burntCaramel};
    box-shadow: 0 0 0 3px rgba(201, 124, 93, 0.2);
    background-color: #2D2424;
  }
`;

const ResendSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 6px;
`;

export default function AuthModal({ isOpen, onClose }) {
  const { login, register, setAuthData } = useAuth();
  const [tab, setTab] = useState("login");
  const [step, setStep] = useState("form");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [registeredEmail, setRegisteredEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);

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
      if (err.response?.data?.needs_verification) {
        setRegisteredEmail(err.response.data.email);
        setStep("verify");
        setNotification("Please enter the 6-digit code sent to your email.");
      } else {
        setError(err.response?.data?.detail || "Invalid username or password.");
      }
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

      setRegisteredEmail(formData.email);
      setStep("verify");
      setNotification(`Verification code sent to ${formData.email}. Please check your inbox.`);
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

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    setError(null);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim();
    if (/^\d{6}$/.test(pastedData)) {
      const digits = pastedData.split("");
      setOtp(digits);
      inputRefs.current[5]?.focus();
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const fullCode = otp.join("");
    if (fullCode.length !== 6) {
      setError("Please enter the complete 6-digit code.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.post("auth/verify-email/", {
        email: registeredEmail,
        code: fullCode,
      });

      setAuthData(response.data);
      onClose();
    } catch (err) {
      setError(err.response?.data?.code?.[0] || err.response?.data?.detail || "Invalid code.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError(null);
    setNotification(null);
    try {
      await apiClient.post("auth/resend-verification/", { email: registeredEmail });
      setNotification("A fresh 6-digit verification code has been sent to your inbox.");
    } catch (err) {
      setError(err.response?.data?.email?.[0] || "Could not resend code.");
    }
  };

  const resetState = () => {
    setStep("form");
    setError(null);
    setNotification(null);
    setOtp(["", "", "", "", "", ""]);
  };

  return (
    <Overlay onClick={onClose}>
      <ModalCard onClick={(e) => e.stopPropagation()}>
        <HeaderRow>
          <TitleBlock>
            <Title>
              {step === "verify"
                ? "Verify Email"
                : tab === "login"
                ? "Sign In"
                : "Register"}
            </Title>
            <Subtitle>
              {step === "verify"
                ? `Enter the 6-digit code sent to ${registeredEmail}`
                : tab === "login"
                ? "Access your reservations, orders, and table checks."
                : "Create an account for contactless ordering and bookings."}
            </Subtitle>
          </TitleBlock>
          <CloseBtn onClick={onClose} aria-label="Close">
            <X size={18} />
          </CloseBtn>
        </HeaderRow>

        {step === "form" && (
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
        )}

        {notification && <SuccessNotification>{notification}</SuccessNotification>}
        {error && <ErrorBox>{error}</ErrorBox>}

        {step === "verify" ? (
          <Form onSubmit={handleVerifyOtp}>
            <OtpGrid onPaste={handleOtpPaste}>
              {otp.map((digit, idx) => (
                <OtpBox
                  key={idx}
                  ref={(el) => (inputRefs.current[idx] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(idx, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                  autoFocus={idx === 0}
                  required
                />
              ))}
            </OtpGrid>

            <SubmitBtn type="submit" disabled={loading || otp.join("").length < 6}>
              {loading ? "Verifying Code..." : "Verify & Sign In"}
            </SubmitBtn>

            <ResendSection>
              <ToggleLink type="button" onClick={handleResend}>
                Resend code
              </ToggleLink>
              <ToggleLink type="button" onClick={resetState}>
                Back to registration
              </ToggleLink>
            </ResendSection>
          </Form>
        ) : tab === "login" ? (
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
              <PasswordFieldWrapper>
                <PasswordInput
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <EyeToggleBtn
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </EyeToggleBtn>
              </PasswordFieldWrapper>
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
                placeholder="+250 ..."
                value={formData.phone_number}
                onChange={handleChange}
              />
            </FieldGroup>

            <FieldGroup>
              <Label htmlFor="reg-password">Password</Label>
              <PasswordFieldWrapper>
                <PasswordInput
                  id="reg-password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="At least 8 characters"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <EyeToggleBtn
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </EyeToggleBtn>
              </PasswordFieldWrapper>
            </FieldGroup>

            <FieldGroup>
              <Label htmlFor="reg-confirm">Confirm Password</Label>
              <PasswordFieldWrapper>
                <PasswordInput
                  id="reg-confirm"
                  type={showConfirmPassword ? "text" : "password"}
                  name="password_confirm"
                  placeholder="Re-enter password"
                  value={formData.password_confirm}
                  onChange={handleChange}
                  required
                />
                <EyeToggleBtn
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </EyeToggleBtn>
              </PasswordFieldWrapper>
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