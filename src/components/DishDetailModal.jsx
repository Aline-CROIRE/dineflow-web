import React, { useState } from "react";
import styled, { keyframes } from "styled-components";
import { X, Plus, Minus, Check } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { resolveDishImage, FALLBACK_FOOD_IMAGE } from "./MenuSection";

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
  overflow-y: auto;
`;

const ModalCard = styled.div`
  width: 100%;
  max-width: 480px;
  max-height: 90vh;
  background-color: ${({ theme }) => theme.colors.card};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 28px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 30px 60px -12px rgba(0, 0, 0, 0.8);
  animation: ${slideUp} 0.28s cubic-bezier(0.16, 1, 0.3, 1);
`;

const ModalHeroImage = styled.div`
  position: relative;
  width: 100%;
  height: 200px;
  background-color: ${({ theme }) => theme.colors.cardElevated};
`;

const Img = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
`;

const ModalCloseBtn = styled.button`
  position: absolute;
  top: 14px;
  right: 14px;
  background-color: rgba(25, 21, 21, 0.85);
  border: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.vanilla};
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

  &:hover {
    background-color: ${({ theme }) => theme.colors.burntCaramel};
  }
`;

const ModalBody = styled.div`
  padding: clamp(20px, 4vw, 28px);
  display: flex;
  flex-direction: column;
  gap: 18px;
  overflow-y: auto;
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
  font-size: 22px;
  font-weight: 900;
  color: ${({ theme }) => theme.colors.vanilla};
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
  padding: 14px 16px;
  border-radius: 14px;
  background-color: ${({ theme }) => theme.colors.cardElevated};
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const PriceTag = styled.span`
  font-size: 20px;
  font-weight: 900;
  color: ${({ theme }) => theme.colors.vanilla};
`;

const QuantityPicker = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  background-color: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 10px;
  padding: 4px 8px;
`;

const PickerBtn = styled.button`
  background: transparent;
  color: ${({ theme }) => theme.colors.vanilla};
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;

  &:hover {
    background-color: ${({ theme }) => theme.colors.cardElevated};
  }
`;

const PickerValue = styled.span`
  font-size: 14px;
  font-weight: 800;
  min-width: 18px;
  text-align: center;
  color: ${({ theme }) => theme.colors.vanilla};
`;

const ActionBtn = styled.button`
  padding: 14px;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.vanilla};
  background: ${({ $added, theme }) =>
    $added ? theme.colors.success : theme.gradients.caramelMocha};
  box-shadow: 0 8px 20px rgba(123, 75, 58, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s;

  &:hover {
    transform: translateY(-1px);
  }
`;

export default function DishDetailModal({ dish, isOpen, onClose, onRequireAuth }) {
  const { user } = useAuth();
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  if (!isOpen || !dish) return null;

  const handleAddToCart = () => {
    if (!user) {
      onClose();
      if (onRequireAuth) onRequireAuth();
      return;
    }

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
        <ModalHeroImage>
          <Img
            src={resolveDishImage(dish.name)}
            alt={dish.name}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = FALLBACK_FOOD_IMAGE;
            }}
          />
          <ModalCloseBtn onClick={onClose}>
            <X size={18} />
          </ModalCloseBtn>
        </ModalHeroImage>

        <ModalBody>
          <TitleBlock>
            <CategoryPill>{dish.category_name || "Chef's Special"}</CategoryPill>
            <DishTitle>{dish.name}</DishTitle>
          </TitleBlock>

          <Description>
            {dish.description || "Prepared with fresh ingredients by our culinary team."}
          </Description>

          <DetailRow>
            <PriceTag>{totalPrice.toLocaleString()} RWF</PriceTag>

            <QuantityPicker>
              <PickerBtn onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                <Minus size={13} />
              </PickerBtn>
              <PickerValue>{quantity}</PickerValue>
              <PickerBtn onClick={() => setQuantity(quantity + 1)}>
                <Plus size={13} />
              </PickerBtn>
            </QuantityPicker>
          </DetailRow>

          <ActionBtn $added={added} onClick={handleAddToCart}>
            {added ? (
              <>
                <Check size={17} />
                Added to Order
              </>
            ) : (
              `Add to Dining Order • ${totalPrice.toLocaleString()} RWF`
            )}
          </ActionBtn>
        </ModalBody>
      </ModalCard>
    </Overlay>
  );
}