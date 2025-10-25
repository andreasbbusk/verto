import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CardOrderStore {
  // Map of setId to array of card IDs in desired order
  cardOrders: Record<number, number[]>;
  setCardOrder: (setId: number, cardIds: number[]) => void;
  getCardOrder: (setId: number) => number[] | undefined;
  clearCardOrder: (setId: number) => void;
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
