import { createContext, useContext, useMemo, useState, type PropsWithChildren } from "react";

export type BookingStatus = "confirmed" | "pending" | "cancelled";

export interface Booking {
  id: number;
  name: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  tableId: number;
  status: BookingStatus;
  menuIds: number[];
}

export interface TableItem {
  id: number;
  seats: number;
  location: string;
  available: boolean;
}

export interface MenuItem {
  id: number;
  name: string;
  category: string;
  price: number;
  available: boolean;
  manualOverride?: "enabled" | "disabled";
}

const mockBookings: Booking[] = [
  {
    id: 1,
    name: "Иванов Иван",
    phone: "+7 900 123-45-67",
    date: "4 апреля",
    time: "19:00",
    guests: 2,
    tableId: 3,
    status: "confirmed",
    menuIds: [1, 5],
  },
  {
    id: 2,
    name: "Петрова Мария",
    phone: "+7 901 234-56-78",
    date: "4 апреля",
    time: "20:00",
    guests: 4,
    tableId: 5,
    status: "pending",
    menuIds: [2, 3],
  },
  {
    id: 3,
    name: "Сидоров Алексей",
    phone: "+7 902 345-67-89",
    date: "5 апреля",
    time: "18:30",
    guests: 1,
    tableId: 1,
    status: "confirmed",
    menuIds: [6],
  },
  {
    id: 4,
    name: "Козлова Анна",
    phone: "+7 903 456-78-90",
    date: "5 апреля",
    time: "21:00",
    guests: 6,
    tableId: 8,
    status: "cancelled",
    menuIds: [],
  },
];

const mockTables: TableItem[] = [
  { id: 1, seats: 2, location: "У окна", available: true },
  { id: 2, seats: 2, location: "У входа", available: true },
  { id: 3, seats: 4, location: "Центр", available: true },
  { id: 4, seats: 4, location: "У окна", available: true },
  { id: 5, seats: 6, location: "Задняя часть", available: true },
  { id: 6, seats: 2, location: "Барная зона", available: true },
  { id: 7, seats: 8, location: "VIP-зона", available: true },
  { id: 8, seats: 6, location: "Терраса", available: true },
];

const mockMenuItems: MenuItem[] = [
  { id: 1, name: "Греческий салат", category: "Салаты", price: 450, available: true },
  { id: 2, name: "Цезарь с курицей", category: "Салаты", price: 520, available: true },
  { id: 3, name: "Стейк рибай", category: "Горячее", price: 1890, available: true },
  { id: 4, name: "Лосось на гриле", category: "Горячее", price: 1450, available: true },
  { id: 5, name: "Тирамису", category: "Десерты", price: 380, available: true },
  { id: 6, name: "Чизкейк", category: "Десерты", price: 350, available: true },
];

interface AdminContextValue {
  bookings: Booking[];
  tables: TableItem[];
  menuItems: MenuItem[];
  updateBooking: (updatedBooking: Booking) => void;
  updateMenuItem: (updatedMenuItem: MenuItem) => void;
  deleteBooking: (id: number) => void;
  addBooking: (booking: Omit<Booking, "id">) => void;
}

const AdminContext = createContext<AdminContextValue | undefined>(undefined);

export const AdminProvider = ({ children }: PropsWithChildren) => {
  const [bookings, setBookings] = useState<Booking[]>(mockBookings);
  const [tables] = useState<TableItem[]>(mockTables);
  const [menuItems, setMenuItems] = useState<MenuItem[]>(mockMenuItems);

  const updateBooking = (updatedBooking: Booking) => {
    setBookings((prev) => prev.map((booking) => (booking.id === updatedBooking.id ? updatedBooking : booking)));
  };

  const deleteBooking = (id: number) => {
    setBookings((prev) => prev.filter((booking) => booking.id !== id));
  };

  const addBooking = (booking: Omit<Booking, "id">) => {
    setBookings((prev) => [
      ...prev,
      {
        id: Math.max(0, ...prev.map((item) => item.id)) + 1,
        ...booking,
      },
    ]);
  };

  const updateMenuItem = (updatedMenuItem: MenuItem) => {
    setMenuItems((prev) => prev.map((item) => (item.id === updatedMenuItem.id ? updatedMenuItem : item)));
  };

  const value = useMemo(
    () => ({ bookings, tables, menuItems, updateBooking, updateMenuItem, deleteBooking, addBooking }),
    [bookings, tables, menuItems],
  );

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
};

export const useAdminData = (): AdminContextValue => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useAdminData должен использоваться внутри AdminProvider");
  }
  return context;
};
