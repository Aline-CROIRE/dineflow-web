import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Search, Plus, Check, ChevronLeft, ChevronRight } from "lucide-react";
import apiClient from "../api/client";
import { useCart } from "../context/CartContext";
import DishDetailModal from "./DishDetailModal";

const Section = styled.section`
  width: 100%;
  padding: 30px clamp(16px, 4vw, 56px) 80px;
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
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: clamp(16px, 2.5vw, 24px);
`;

const DishCard = styled.div`
  background-color: ${({ theme }) => theme.colors.card};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 20px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.3);
  cursor: pointer;
  transition: transform 0.2s ease, border-color 0.2s ease;

  &:hover {
    transform: translateY(-3px);
    border-color: ${({ theme }) => theme.colors.burntCaramel};
  }
`;

const CardImageContainer = styled.div`
  position: relative;
  width: 100%;
  height: 190px;
  overflow: hidden;
  background-color: ${({ theme }) => theme.colors.cardElevated};
`;

const CardImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;

  ${DishCard}:hover & {
    transform: scale(1.04);
  }
`;

const CardBody = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex: 1;
  gap: 14px;
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

const PaginationBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin-top: 24px;
`;

const PageBtn = styled.button`
  padding: 8px 16px;
  border-radius: 10px;
  background-color: ${({ theme }) => theme.colors.card};
  border: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.vanilla};
  font-size: 13px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s;

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    border-color: ${({ theme }) => theme.colors.burntCaramel};
    color: ${({ theme }) => theme.colors.latte};
  }
`;

const PageIndicator = styled.span`
  font-size: 13px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 14px;
`;

export const FALLBACK_FOOD_IMAGE =
  "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80";

export function resolveDishImage(name = "") {
  const n = name.toLowerCase();

  if (n.includes("rice") || n.includes("pilau") || n.includes("biryani")) {
    return "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=600&q=80";
  }
  if (n.includes("wing") || n.includes("chicken")) {
    return "https://images.unsplash.com/photo-1567620832903-9fc6debc209f?auto=format&fit=crop&w=600&q=80";
  }
  if (n.includes("steak") || n.includes("beef") || n.includes("ribeye") || n.includes("meat") || n.includes("lamb") || n.includes("chop")) {
    return "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80";
  }
  if (n.includes("pizza") || n.includes("margherita") || n.includes("calzone")) {
    return "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80";
  }
  if (n.includes("salmon") || n.includes("fish") || n.includes("prawn") || n.includes("seafood") || n.includes("sambaza") || n.includes("tilapia")) {
    return "https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=600&q=80";
  }
  if (n.includes("burger") || n.includes("cheeseburger") || n.includes("sandwich")) {
    return "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80";
  }
  if (n.includes("pasta") || n.includes("carbonara") || n.includes("spaghetti") || n.includes("penne") || n.includes("lasagna")) {
    return "https://images.unsplash.com/photo-1621996346565-e3d5d62810f4?auto=format&fit=crop&w=600&q=80";
  }
  if (n.includes("salad") || n.includes("caesar") || n.includes("green") || n.includes("avocado")) {
    return "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80";
  }
  if (n.includes("bread") || n.includes("bruschetta") || n.includes("garlic") || n.includes("toast")) {
    return "https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?auto=format&fit=crop&w=600&q=80";
  }
  if (n.includes("fries") || n.includes("chips")) {
    return "https://images.unsplash.com/photo-1576107232684-1279f3908594?auto=format&fit=crop&w=600&q=80";
  }
  if (n.includes("juice") || n.includes("water") || n.includes("orange") || n.includes("drink") || n.includes("smoothie") || n.includes("cocktail")) {
    return "https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=600&q=80";
  }
  if (n.includes("coffee") || n.includes("latte") || n.includes("espresso") || n.includes("cappuccino") || n.includes("tea")) {
    return "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=600&q=80";
  }
  if (n.includes("dessert") || n.includes("cake") || n.includes("chocolate") || n.includes("ice cream") || n.includes("pie")) {
    return "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=600&q=80";
  }

  return FALLBACK_FOOD_IMAGE;
}

export default function MenuSection({ refreshTrigger }) {
  const { addItem } = useCart();
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [ordering, setOrdering] = useState("name");
  const [addedItemIds, setAddedItemIds] = useState({});
  const [selectedDishModal, setSelectedDishModal] = useState(null);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    apiClient
      .get("restaurant/categories/")
      .then((res) => setCategories(res.data.results || res.data || []))
      .catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    let url = `restaurant/menu-items/?ordering=${ordering}&page=${page}`;
    if (searchQuery.trim()) {
      url += `&search=${encodeURIComponent(searchQuery)}`;
    }
    if (selectedCategory !== "ALL") {
      url += `&category=${selectedCategory}`;
    }

    apiClient
      .get(url)
      .then((res) => {
        const results = res.data.results || res.data || [];
        setItems(results);
        setTotalCount(res.data.count || results.length);
        setTotalPages(Math.ceil((res.data.count || results.length) / 10) || 1);
      })
      .catch(() => {
        setItems([]);
        setTotalCount(0);
        setTotalPages(1);
      });
  }, [selectedCategory, searchQuery, ordering, page, refreshTrigger]);

  const handleCategoryChange = (catId) => {
    setSelectedCategory(catId);
    setPage(1);
  };

  const handleSearchChange = (val) => {
    setSearchQuery(val);
    setPage(1);
  };

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
        <Tagline>Chef's Kitchen</Tagline>
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
            onChange={(e) => handleSearchChange(e.target.value)}
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
          onClick={() => handleCategoryChange("ALL")}
        >
          All Items
        </CategoryChip>
        {categories.map((cat) => (
          <CategoryChip
            key={cat.id}
            $active={selectedCategory === cat.id.toString()}
            onClick={() => handleCategoryChange(cat.id.toString())}
          >
            {cat.name}
          </CategoryChip>
        ))}
      </CategoryTabsTrack>

      {items.length === 0 ? (
        <EmptyState>No dishes match your selection.</EmptyState>
      ) : (
        <>
          <DishesGrid>
            {items.map((dish) => (
              <DishCard key={dish.id} onClick={() => setSelectedDishModal(dish)}>
                <CardImageContainer>
                  <CardImage
                    src={resolveDishImage(dish.name)}
                    alt={dish.name}
                    loading="lazy"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = FALLBACK_FOOD_IMAGE;
                    }}
                  />
                </CardImageContainer>

                <CardBody>
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
                </CardBody>
              </DishCard>
            ))}
          </DishesGrid>

          {totalPages > 1 && (
            <PaginationBar>
              <PageBtn
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                <ChevronLeft size={16} /> Previous
              </PageBtn>

              <PageIndicator>
                Page {page} of {totalPages} ({totalCount} items)
              </PageIndicator>

              <PageBtn
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              >
                Next <ChevronRight size={16} />
              </PageBtn>
            </PaginationBar>
          )}
        </>
      )}

      <DishDetailModal
        dish={selectedDishModal}
        isOpen={Boolean(selectedDishModal)}
        onClose={() => setSelectedDishModal(null)}
      />
    </Section>
  );
}