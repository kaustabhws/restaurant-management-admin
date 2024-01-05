import { create } from "zustand";

interface useRestaurantModalProps {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export const useRestaurantModal = create<useRestaurantModalProps>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));
