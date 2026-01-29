import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CardOrderStore {
  // Map of setId to array of card IDs in desired order
  cardOrders: Record<string, string[]>;
  setCardOrder: (setId: string, cardIds: string[]) => void;
  getCardOrder: (setId: string) => string[] | undefined;
  clearCardOrder: (setId: string) => void;
}

export const useCardOrderStore = create<CardOrderStore>()(
  persist(
    (set, get) => ({
      cardOrders: {},
      setCardOrder: (setId, cardIds) =>
        set((state) => ({
          cardOrders: {
            ...state.cardOrders,
            [setId]: cardIds,
          },
        })),
      getCardOrder: (setId) => get().cardOrders[setId],
      clearCardOrder: (setId) =>
        set((state) => {
          const { [setId]: _, ...rest } = state.cardOrders;
          return { cardOrders: rest };
        }),
    }),
    {
      name: "card-order-preferences",
    }
  )
);
