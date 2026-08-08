import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

// Notification types
export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message?: string;
  duration?: number;
}

// Modal types
export interface ModalState {
  id: string;
  isOpen: boolean;
  data?: unknown;
}

// UI Store interface
interface UIState {
  // Notifications
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id'>) => string;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;

  // Modals
  modals: Record<string, ModalState>;
  openModal: (id: string, data?: unknown) => void;
  closeModal: (id: string) => void;
  toggleModal: (id: string) => void;

  // Sidebar (for future dashboard)
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (isOpen: boolean) => void;

  // Global loading state
  isGlobalLoading: boolean;
  setGlobalLoading: (isLoading: boolean) => void;
}

// Generate unique ID for notifications
const generateId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

export const useUIStore = create<UIState>()(
  devtools(
    (set, get) => ({
      // Notifications
      notifications: [],

      addNotification: (notification) => {
        const id = generateId();
        const newNotification: Notification = {
          ...notification,
          id,
          duration: notification.duration ?? 5000,
        };

        set(
          (state) => ({
            notifications: [...state.notifications, newNotification],
          }),
          false,
          'addNotification'
        );

        // Auto-remove after duration
        if (newNotification.duration && newNotification.duration > 0) {
          setTimeout(() => {
            get().removeNotification(id);
          }, newNotification.duration);
        }

        return id;
      },

      removeNotification: (id) =>
        set(
          (state) => ({
            notifications: state.notifications.filter((n) => n.id !== id),
          }),
          false,
          'removeNotification'
        ),

      clearNotifications: () =>
        set({ notifications: [] }, false, 'clearNotifications'),

      // Modals
      modals: {},

      openModal: (id, data) =>
        set(
          (state) => ({
            modals: {
              ...state.modals,
              [id]: { id, isOpen: true, data },
            },
          }),
          false,
          'openModal'
        ),

      closeModal: (id) =>
        set(
          (state) => ({
            modals: {
              ...state.modals,
              [id]: { ...state.modals[id], id, isOpen: false },
            },
          }),
          false,
          'closeModal'
        ),

      toggleModal: (id) =>
        set(
          (state) => ({
            modals: {
              ...state.modals,
              [id]: {
                id,
                isOpen: !state.modals[id]?.isOpen,
                data: state.modals[id]?.data,
              },
            },
          }),
          false,
          'toggleModal'
        ),

      // Sidebar
      isSidebarOpen: true,
      toggleSidebar: () =>
        set(
          (state) => ({ isSidebarOpen: !state.isSidebarOpen }),
          false,
          'toggleSidebar'
        ),
      setSidebarOpen: (isOpen) =>
        set({ isSidebarOpen: isOpen }, false, 'setSidebarOpen'),

      // Global loading
      isGlobalLoading: false,
      setGlobalLoading: (isLoading) =>
        set({ isGlobalLoading: isLoading }, false, 'setGlobalLoading'),
    }),
    { name: 'UIStore' }
  )
);

// Selector hooks for better performance
export const useNotifications = () => useUIStore((state) => state.notifications);
export const useAddNotification = () => useUIStore((state) => state.addNotification);
export const useModal = (id: string) =>
  useUIStore((state) => state.modals[id] ?? { id, isOpen: false });
export const useSidebar = () =>
  useUIStore((state) => ({
    isOpen: state.isSidebarOpen,
    toggle: state.toggleSidebar,
    setOpen: state.setSidebarOpen,
  }));
export const useGlobalLoading = () =>
  useUIStore((state) => ({
    isLoading: state.isGlobalLoading,
    setLoading: state.setGlobalLoading,
  }));
