import React, { useState } from "react";
import styled, { keyframes } from "styled-components";
import { X, Plus, Minus, Check } from "lucide-react";
import { useCart } from "../context/CartContext";

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
  max-width: 480px;
  background-color: ${({ theme }) => theme.colors.card};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 28px;
  padding: clamp(24px, 5vw, 36px);
  display: flex;
  flex-direction: column;
  gap: 20px;
  box-shadow: 0 30px 60px -12px rgba(0, 0, 0, 0.8);
  animation: ${slideUp} 0.28s cubic-bezier(0.16, 1, 0.3, 1);
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

const CategoryPill = styled.span`
  font-size: 11px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: ${({ theme }) => theme.colors.burntCaramel};
`;

const DishTitle = styled.h2`
  font-size: 24px;
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
  flex-shrink: 0;
  transition: all 0.2s;

  &:hover {
    color: ${({ theme }) => theme.colors.vanilla};
  }
`;

const Description = styled.p`
  font-size: 14px;
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const DetailRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  border-radius: 16px;
  background-color: ${({ theme }) => theme.colors.cardElevated};
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const PriceTag = styled.span`
  font-size: 22px;
  font-weight: 900;
  color: ${({ theme }) => theme.colors.vanilla};
`;

const QuantityPicker = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  background-color: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 12px;
  padding: 6px 10px;
`;

const PickerBtn = styled.button`
  background: transparent;
  color: ${({ theme }) => theme.colors.vanilla};
  width: 26px;
  height: 26px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;

  &:hover {
    background-color: ${({ theme }) => theme.colors.cardElevated};
  }
`;

const PickerValue = styled.span`
  font-size: 15px;
  font-weight: 800;
  min-width: 20px;
  text-align: center;
  color: ${({ theme }) => theme.colors.vanilla};
`;

const ActionBtn = styled.button`
  padding: 16px;
  border-radius: 14px;
  font-size: 15px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.vanilla};
  background: ${({ $added, theme }) =>
    $added ? theme.colors.success : theme.gradients.caramelMocha};
  box-shadow: 0 8px 24px rgba(123, 75, 58, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s;

  &:hover {
    transform: translateY(-1px);
  }
`;

export default function DishDetailModal({ dish, isOpen, onClose }) {
  const { addItem, updateQuantity } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  if (!isOpen || !dish) return null;

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem(dish);
    }
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      onClose();
    }, 800);
  };

  const unitPrice = Math.round(parseFloat(dish.price) || 0);
  const totalPrice = unitPrice * quantity;

  return (
    <Overlay onClick={onClose}>
      <ModalCard onClick={(e) => e.stopPropagation()}>
        <HeaderRow>
          <TitleBlock>
            <CategoryPill>{dish.category_name || "Artisanal Kitchen"}</CategoryPill>
            <DishTitle>{dish.name}</DishTitle>
          </TitleBlock>
          <CloseBtn onClick={onClose}>
            <X size={18} />
          </CloseBtn>
        </HeaderRow>

        <Description>
          {dish.description || "Prepared with fresh, locally-sourced seasonal ingredients by our culinary team."}
        </Description>

        <DetailRow>
          <PriceTag>{totalPrice.toLocaleString()} RWF</PriceTag>

          <QuantityPicker>
            <PickerBtn onClick={() => setQuantity(Math.max(1, quantity - 1))}>
              <Minus size={14} />
            </PickerBtn>
            <PickerValue>{quantity}</PickerValue>
            <PickerBtn onClick={() => setQuantity(quantity + 1)}>
              <Plus size={14} />
            </PickerBtn>
          </QuantityPicker>
        </DetailRow>

        <ActionBtn $added={added} onClick={handleAddToCart}>
          {added ? (
            <>
              <Check size={18} />
              Added to Order
            </>
          ) : (
            `Add to Dining Order • ${totalPrice.toLocaleString()} RWF`
          )}
        </ActionBtn>
      </ModalCard>
    </Overlay>
  );
}