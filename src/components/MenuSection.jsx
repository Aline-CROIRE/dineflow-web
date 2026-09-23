import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Search, Plus, Check } from "lucide-react";
import apiClient from "../api/client";

const Section = styled.section`
  max-width: 1280px;
  margin: 0 auto;
  padding: 40px 24px 80px;
  display: flex;
  flex-direction: column;
  gap: 32px;
`;

const SectionHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Tagline = styled.span`
  font-size: 11px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  color: ${({ theme }) => theme.colors.burntCaramel};
`;

const SectionTitle = styled.h2`
  font-size: clamp(28px, 4vw, 38px);
  font-weight: 900;
  letter-spacing: -0.5px;
  color: ${({ theme }) => theme.colors.vanilla};
`;

const ControlsBar = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
`;

const SearchWrapper = styled.div`
  position: relative;
  width: 100%;
  max-width: 360px;
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
    background-color: ${({ theme }) => theme.colors.cardElevated};
  }
`;

const SortSelect = styled.select`
  background-color: ${({ theme }) => theme.colors.card};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 12px;
  padding: 12px 16px;
  font-size: 13px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.latte};
  cursor: pointer;
  outline: none;

  &:focus {
    border-color: ${({ theme }) => theme.colors.burntCaramel};
  }
`;

const CategoryTabsTrack = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  overflow-x: auto;
  padding-bottom: 8px;

  &::-webkit-scrollbar {
    height: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.border};
    border-radius: 4px;
  }
`;

const CategoryChip = styled.button`
  padding: 8px 18px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 700;
  white-space: nowrap;
  color: ${({ $active, theme }) => ($active ? theme.colors.vanilla : theme.colors.latte)};
  background: ${({ $active, theme }) =>
    $active ? theme.gradients.caramelMocha : theme.colors.card};
  border: 1px solid
    ${({ $active, theme }) => ($active ? "transparent" : theme.colors.border)};
  box-shadow: ${({ $active }) => ($active ? "0 4px 14px rgba(123, 75, 58, 0.35)" : "none")};
  transition: all 0.2s ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.burntCaramel};
    color: ${({ theme }) => theme.colors.vanilla};
  }
`;

const DishesGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;

  @media (min-width: ${({ theme }) => theme.breakpoints.mobile}) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.desktop}) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const DishCard = styled.div`
  background-color: ${({ theme }) => theme.colors.card};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 20px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 18px;
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.3);
  transition: transform 0.2s ease, border-color 0.2s ease;

  &:hover {
    transform: translateY(-3px);
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
  font-size: 18px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.vanilla};
`;

const CategoryTag = styled.span`
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.latte};
  background-color: ${({ theme }) => theme.colors.cardElevated};
  padding: 4px 10px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.border};
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
  padding-top: 14px;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

const Price = styled.span`
  font-size: 18px;
  font-weight: 900;
  color: ${({ theme }) => theme.colors.vanilla};
  letter-spacing: 0.5px;
`;

const AddButton = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: ${({ $added, theme }) =>
    $added ? theme.colors.success : theme.gradients.caramelMocha};
  color: ${({ theme }) => theme.colors.vanilla};
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  transition: transform 0.15s ease, background 0.2s ease;

  &:hover {
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 15px;
`;

export default function MenuSection({ onSelectItem }) {
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [ordering, setOrdering] = useState("name");
  const [addedItemIds, setAddedItemIds] = useState({});

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

  const handleAdd = (dish) => {
    setAddedItemIds((prev) => ({ ...prev, [dish.id]: true }));
    if (onSelectItem) onSelectItem(dish);

    setTimeout(() => {
      setAddedItemIds((prev) => ({ ...prev, [dish.id]: false }));
    }, 1200);
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
            placeholder="Search dishes or ingredients..."
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
            <DishCard key={dish.id}>
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
                  onClick={() => handleAdd(dish)}
                  aria-label="Add to order"
                >
                  {addedItemIds[dish.id] ? <Check size={18} /> : <Plus size={18} />}
                </AddButton>
              </DishFooter>
            </DishCard>
          ))}
        </DishesGrid>
      )}
    </Section>
  );
}