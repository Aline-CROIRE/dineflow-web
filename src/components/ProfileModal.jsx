import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { X, Eye, EyeOff } from "lucide-react";
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
  background-color: rgba(25, 21, 21, 0.82);
  backdrop-filter: blur(12px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  animation: ${fadeIn} 0.25s ease-out;
`;

const ModalCard = styled.div`
  width: 100%;
  max-width: 440px;
  background-color: ${({ theme }) => theme.colors.card};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 28px;
  padding: clamp(22px, 5vw, 36px);
  display: flex;
  flex-direction: column;
  gap: 20px;
  box-shadow: 0 30px 60px -12px rgba(0, 0, 0, 0.8);
  animation: ${slideUp} 0.28s cubic-bezier(0.16, 1, 0.3, 1);
`;

const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Title = styled.h2`
  font-size: 22px;
  font-weight: 900;
  color: ${({ theme }) => theme.colors.vanilla};
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
  }
`;

const TabTrack = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: 12px;
  padding: 4px;
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const TabBtn = styled.button`
  padding: 8px 12px;
  font-size: 13px;
  font-weight: 700;
  border-radius: 8px;
  color: ${({ $active, theme }) => ($active ? theme.colors.vanilla : theme.colors.textMuted)};
  background-color: ${({ $active, theme }) => ($active ? theme.colors.cardElevated : "transparent")};
  transition: all 0.2s;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 14px;
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

const PasswordWrapper = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
`;

const Input = styled.input`
  width: 100%;
  background-color: ${({ theme }) => theme.colors.cardElevated};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 10px;
  padding: 12px 14px;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.vanilla};

  &:disabled {
    opacity: 0.6;
  }

  &:focus {
    border-color: ${({ theme }) => theme.colors.burntCaramel};
  }
`;

const PasswordInput = styled(Input)`
  padding-right: 44px;
`;

const EyeBtn = styled.button`
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
  margin-top: 6px;
  padding: 12px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.vanilla};
  background: ${({ theme }) => theme.gradients.caramelMocha};
  transition: all 0.2s;

  &:hover {
    transform: translateY(-1px);
  }
`;

const Message = styled.div`
  font-size: 13px;
  font-weight: 600;
  color: ${({ $isError, theme }) => ($isError ? theme.colors.burntCaramel : theme.colors.success)};
`;

export default function ProfileModal({ isOpen, onClose }) {
  const { user, updateUser, fetchProfile } = useAuth();
  const [tab, setTab] = useState("profile");
  const [phone, setPhone] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [msg, setMsg] = useState(null);
  const [isError, setIsError] = useState(false);

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [passwordData, setPasswordData] = useState({
    old_password: "",
    new_password: "",
    new_password_confirm: "",
  });

  useEffect(() => {
    if (user) {
      setPhone(user.phone_number || "");
      setFirstName(user.first_name || "");
      setLastName(user.last_name || "");
    }
  }, [user, isOpen]);

  if (!isOpen || !user) return null;

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setMsg(null);
    try {
      const response = await apiClient.patch("auth/profile/", {
        phone_number: phone,
        first_name: firstName,
        last_name: lastName,
      });
      setIsError(false);
      setMsg("Profile updated successfully.");
      updateUser(response.data);
      fetchProfile();
    } catch {
      setIsError(true);
      setMsg("Could not update profile.");
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setMsg(null);

    if (passwordData.new_password !== passwordData.new_password_confirm) {
      setIsError(true);
      setMsg("New passwords do not match.");
      return;
    }

    try {
      await apiClient.post("auth/change-password/", passwordData);
      setIsError(false);
      setMsg("Password changed successfully.");
      setPasswordData({ old_password: "", new_password: "", new_password_confirm: "" });
    } catch (err) {
      setIsError(true);
      setMsg(err.response?.data?.old_password?.[0] || "Could not change password.");
    }
  };

  return (
    <Overlay onClick={onClose}>
      <ModalCard onClick={(e) => e.stopPropagation()}>
        <HeaderRow>
          <Title>Account Settings</Title>
          <CloseBtn onClick={onClose}>
            <X size={18} />
          </CloseBtn>
        </HeaderRow>

        <TabTrack>
          <TabBtn $active={tab === "profile"} onClick={() => { setTab("profile"); setMsg(null); }}>
            Profile
          </TabBtn>
          <TabBtn $active={tab === "password"} onClick={() => { setTab("password"); setMsg(null); }}>
            Security
          </TabBtn>
        </TabTrack>

        {msg && <Message $isError={isError}>{msg}</Message>}

        {tab === "profile" ? (
          <Form onSubmit={handleUpdateProfile}>
            <Field>
              <Label>Username</Label>
              <Input value={user.username} disabled />
            </Field>

            <Field>
              <Label>Email</Label>
              <Input value={user.email} disabled />
            </Field>

            <Field>
              <Label>First Name</Label>
              <Input
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="e.g. Alice"
              />
            </Field>

            <Field>
              <Label>Last Name</Label>
              <Input
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="e.g. Smith"
              />
            </Field>

            <Field>
              <Label>Phone Number</Label>
              <Input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+250 ..."
              />
            </Field>

            <SubmitBtn type="submit">Save Changes</SubmitBtn>
          </Form>
        ) : (
          <Form onSubmit={handleChangePassword}>
            <Field>
              <Label>Current Password</Label>
              <PasswordWrapper>
                <PasswordInput
                  type={showOldPassword ? "text" : "password"}
                  required
                  value={passwordData.old_password}
                  onChange={(e) => setPasswordData({ ...passwordData, old_password: e.target.value })}
                />
                <EyeBtn type="button" onClick={() => setShowOldPassword(!showOldPassword)}>
                  {showOldPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </EyeBtn>
              </PasswordWrapper>
            </Field>

            <Field>
              <Label>New Password</Label>
              <PasswordWrapper>
                <PasswordInput
                  type={showNewPassword ? "text" : "password"}
                  required
                  value={passwordData.new_password}
                  onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })}
                />
                <EyeBtn type="button" onClick={() => setShowNewPassword(!showNewPassword)}>
                  {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </EyeBtn>
              </PasswordWrapper>
            </Field>

            <Field>
              <Label>Confirm New Password</Label>
              <PasswordWrapper>
                <PasswordInput
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  value={passwordData.new_password_confirm}
                  onChange={(e) => setPasswordData({ ...passwordData, new_password_confirm: e.target.value })}
                />
                <EyeBtn type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </EyeBtn>
              </PasswordWrapper>
            </Field>

            <SubmitBtn type="submit">Update Password</SubmitBtn>
          </Form>
        )}
      </ModalCard>
    </Overlay>
  );
}