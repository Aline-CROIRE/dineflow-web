import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Search, Plus, Check } from "lucide-react";
import apiClient from "../api/client";
import { useCart } from "../context/CartContext";
import DishDetailModal from "./DishDetailModal";

const Section = styled.section`
  max-width: 1280px;
  margin: 0 auto;
  padding: 30px clamp(16px, 4vw, 24px) 80px;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const SectionHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const Tagline = styled.span`
  font-size: 11px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  color: ${({ theme }) => theme.colors.burntCaramel};
`;

const SectionTitle = styled.h2`
  font-size: clamp(24px, 5vw, 36px);
  font-weight: 900;
  letter-spacing: -0.5px;
  color: ${({ theme }) => theme.colors.vanilla};
`;

const ControlsBar = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;

  @media (min-width: 640px) {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
`;

const SearchWrapper = styled.div`
  position: relative;
  width: 100%;
  max-width: 100%;

  @media (min-width: 640px) {
    max-width: 360px;
  }
`;

const SearchIconWrapper = styled.div`
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: ${({ theme }) => theme.colors.textMuted};
  display: flex;
  align-items: center;
`;

const SearchInput = styled.input`
  width: 100%;
  background-color: ${({ theme }) => theme.colors.card};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 12px;
  padding: 12px 14px 12px 42px;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.vanilla};
  transition: all 0.2s ease;

  &::placeholder {
    color: ${({ theme }) => theme.colors.textMuted};
  }

  &:focus {
    border-color: ${({ theme }) => theme.colors.burntCaramel};
  }
`;

const SortSelect = styled.select`
  background-color: ${({ theme }) => theme.colors.card};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 12px;
  padding: 12px 14px;
  font-size: 13px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.latte};
  cursor: pointer;
  outline: none;
  width: 100%;

  @media (min-width: 640px) {
    width: auto;
  }

  &:focus {
    border-color: ${({ theme }) => theme.colors.burntCaramel};
  }
`;

const CategoryTabsTrack = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  overflow-x: auto;
  padding-bottom: 8px;
  -webkit-overflow-scrolling: touch;

  &::-webkit-scrollbar {
    height: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.border};
    border-radius: 4px;
  }
`;

const CategoryChip = styled.button`
  padding: 8px 16px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
  white-space: nowrap;
  flex-shrink: 0;
  color: ${({ $active, theme }) => ($active ? theme.colors.vanilla : theme.colors.latte)};
  background: ${({ $active, theme }) =>
    $active ? theme.gradients.caramelMocha : theme.colors.card};
  border: 1px solid
    ${({ $active, theme }) => ($active ? "transparent" : theme.colors.border)};
  transition: all 0.2s ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.burntCaramel};
  }
`;

const DishesGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;

  @media (min-width: 600px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
  }
`;

const DishCard = styled.div`
  background-color: ${({ theme }) => theme.colors.card};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 18px;
  padding: clamp(18px, 4vw, 24px);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 16px;
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.3);
  cursor: pointer;
  transition: transform 0.2s ease, border-color 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    border-color: ${({ theme }) => theme.colors.burntCaramel};
  }
`;

const DishHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
`;

const DishName = styled.h3`
  font-size: 17px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.vanilla};
`;

const CategoryTag = styled.span`
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.latte};
  background-color: ${({ theme }) => theme.colors.cardElevated};
  padding: 3px 8px;
  border-radius: 6px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  flex-shrink: 0;
`;

const DishDescription = styled.p`
  font-size: 13px;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const DishFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 12px;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

const Price = styled.span`
  font-size: 17px;
  font-weight: 900;
  color: ${({ theme }) => theme.colors.vanilla};
`;

const AddButton = styled.button`
  width: 38px;
  height: 38px;
  border-radius: 10px;
  background: ${({ $added, theme }) =>
    $added ? theme.colors.success : theme.gradients.caramelMocha};
  color: ${({ theme }) => theme.colors.vanilla};
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  transition: transform 0.15s ease;

  &:hover {
    transform: scale(1.05);
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 14px;
`;

export default function MenuSection() {
  const { addItem } = useCart();
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [ordering, setOrdering] = useState("name");
  const [addedItemIds, setAddedItemIds] = useState({});
  const [selectedDishModal, setSelectedDishModal] = useState(null);

  useEffect(() => {
    apiClient
      .get("restaurant/categories/")
      .then((res) => setCategories(res.data.results || res.data || []))
      .catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    let url = `restaurant/menu-items/?ordering=${ordering}`;
    if (searchQuery.trim()) {
      url += `&search=${encodeURIComponent(searchQuery)}`;
    }
    if (selectedCategory !== "ALL") {
      url += `&category=${selectedCategory}`;
    }

    apiClient
      .get(url)
      .then((res) => setItems(res.data.results || res.data || []))
      .catch(() => setItems([]));
  }, [selectedCategory, searchQuery, ordering]);

  const handleDirectAdd = (e, dish) => {
    e.stopPropagation();
    addItem(dish);
    setAddedItemIds((prev) => ({ ...prev, [dish.id]: true }));

    setTimeout(() => {
      setAddedItemIds((prev) => ({ ...prev, [dish.id]: false }));
    }, 900);
  };

  const formatRWF = (amount) => {
    const numeric = Math.round(parseFloat(amount) || 0);
    return `${numeric.toLocaleString()} RWF`;
  };

  return (
    <Section id="menu">
      <SectionHeader>
        <Tagline>Artisanal Kitchen</Tagline>
        <SectionTitle>Our Menu</SectionTitle>
      </SectionHeader>

      <ControlsBar>
        <SearchWrapper>
          <SearchIconWrapper>
            <Search size={16} />
          </SearchIconWrapper>
          <SearchInput
            placeholder="Search dishes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </SearchWrapper>

        <SortSelect value={ordering} onChange={(e) => setOrdering(e.target.value)}>
          <option value="name">Sort by: Name (A-Z)</option>
          <option value="price">Sort by: Price (Low to High)</option>
          <option value="-price">Sort by: Price (High to Low)</option>
        </SortSelect>
      </ControlsBar>

      <CategoryTabsTrack>
        <CategoryChip
          $active={selectedCategory === "ALL"}
          onClick={() => setSelectedCategory("ALL")}
        >
          All Items
        </CategoryChip>
        {categories.map((cat) => (
          <CategoryChip
            key={cat.id}
            $active={selectedCategory === cat.id.toString()}
            onClick={() => setSelectedCategory(cat.id.toString())}
          >
            {cat.name}
          </CategoryChip>
        ))}
      </CategoryTabsTrack>

      {items.length === 0 ? (
        <EmptyState>No dishes match your selection.</EmptyState>
      ) : (
        <DishesGrid>
          {items.map((dish) => (
            <DishCard key={dish.id} onClick={() => setSelectedDishModal(dish)}>
              <div>
                <DishHeader>
                  <DishName>{dish.name}</DishName>
                  <CategoryTag>{dish.category_name || "Special"}</CategoryTag>
                </DishHeader>
                <DishDescription>
                  {dish.description || "Prepared freshly upon order."}
                </DishDescription>
              </div>

              <DishFooter>
                <Price>{formatRWF(dish.price)}</Price>
                <AddButton
                  $added={addedItemIds[dish.id]}
                  onClick={(e) => handleDirectAdd(e, dish)}
                  aria-label="Add to order"
                >
                  {addedItemIds[dish.id] ? <Check size={18} /> : <Plus size={18} />}
                </AddButton>
              </DishFooter>
            </DishCard>
          ))}
        </DishesGrid>
      )}

      <DishDetailModal
        dish={selectedDishModal}
        isOpen={Boolean(selectedDishModal)}
        onClose={() => setSelectedDishModal(null)}
      />
    </Section>
  );
}