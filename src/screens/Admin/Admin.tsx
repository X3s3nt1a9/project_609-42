import { useState } from "react";
import { Link } from "react-router-dom";
import {
  CalendarCheck,
  Armchair,
  Users,
  Clock,
  Search,
  Phone,
  User,
  MapPin,
  UtensilsCrossed,
  ChevronRight,
  Menu,
  X,
  Settings,
  LayoutDashboard,
  CheckCircle2,
  XCircle,
  Hourglass,
} from "lucide-react";
import logo from "../../../logo.svg";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";

const navigationItems = [
  { label: "Home", href: "/" },
  { label: "About us", href: "#" },
  { label: "Contact us", href: "#" },
  { label: "Admin", href: "/admin" },
];

type TabKey = "bookings" | "tables" | "menu";

const tabs: { key: TabKey; label: string; icon: React.ReactNode }[] = [
  { key: "bookings", label: "Бронирования", icon: <CalendarCheck className="h-4 w-4" /> },
  { key: "tables", label: "Столики", icon: <Armchair className="h-4 w-4" /> },
  { key: "menu", label: "Меню", icon: <UtensilsCrossed className="h-4 w-4" /> },
];

const mockBookings = [
  { id: 1, name: "Иванов Иван", phone: "+7 900 123-45-67", date: "4 апреля", time: "19:00", guests: 2, table: 3, status: "confirmed" as const },
  { id: 2, name: "Петрова Мария", phone: "+7 901 234-56-78", date: "4 апреля", time: "20:00", guests: 4, table: 5, status: "pending" as const },
  { id: 3, name: "Сидоров Алексей", phone: "+7 902 345-67-89", date: "5 апреля", time: "18:30", guests: 1, table: 1, status: "confirmed" as const },
  { id: 4, name: "Козлова Анна", phone: "+7 903 456-78-90", date: "5 апреля", time: "21:00", guests: 6, table: 8, status: "cancelled" as const },
];

const mockTables = [
  { id: 1, seats: 2, location: "У окна", available: true },
  { id: 2, seats: 2, location: "У входа", available: true },
  { id: 3, seats: 4, location: "Центр", available: false },
  { id: 4, seats: 4, location: "У окна", available: true },
  { id: 5, seats: 6, location: "Задняя часть", available: false },
  { id: 6, seats: 2, location: "Барная зона", available: true },
  { id: 7, seats: 8, location: "VIP-зона", available: true },
  { id: 8, seats: 6, location: "Терраса", available: false },
];

const mockMenuItems = [
  { id: 1, name: "Греческий салат", category: "Салаты", price: 450, available: true },
  { id: 2, name: "Цезарь с курицей", category: "Салаты", price: 520, available: true },
  { id: 3, name: "Стейк рибай", category: "Горячее", price: 1890, available: true },
  { id: 4, name: "Лосось на гриле", category: "Горячее", price: 1450, available: false },
  { id: 5, name: "Тирамису", category: "Десерты", price: 380, available: true },
  { id: 6, name: "Чизкейк", category: "Десерты", price: 350, available: true },
];

const statusConfig = {
  confirmed: { text: "Подтверждено", icon: <CheckCircle2 className="h-3.5 w-3.5" />, className: "bg-emerald-100 text-emerald-700" },
  pending: { text: "Ожидает", icon: <Hourglass className="h-3.5 w-3.5" />, className: "bg-amber-100 text-amber-700" },
  cancelled: { text: "Отменено", icon: <XCircle className="h-3.5 w-3.5" />, className: "bg-red-100 text-red-700" },
};

export const Admin = (): JSX.Element => {
  const [activeTab, setActiveTab] = useState<TabKey>("bookings");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filteredBookings = mockBookings.filter((b) => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return true;
    return b.name.toLowerCase().includes(q) || b.phone.toLowerCase().includes(q);
  });

  return (
    <div className="min-h-screen bg-[#fcfaf8]">
      <header className="w-full bg-[#004d40] animate-fade-in">
        <div className="mx-auto flex min-h-[120px] w-full max-w-[1440px] items-center justify-between px-8 py-4 md:px-12 lg:px-[95px]">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-3 shrink-0" aria-label="Healthy restaurant home">
              <img src={logo} alt="Healthy Restaurant" className="h-[70px] w-auto transition-transform duration-300 hover:scale-105" />
              <div className="hidden md:flex flex-col leading-tight">
                <span className="[font-family:'EastMarket-Regular',Helvetica] text-[22px] font-semibold text-white">Healthy</span>
                <span className="[font-family:'Open_Sans',Helvetica] text-[10px] uppercase tracking-[0.24em] text-[#b8f4d9]">
                  Restaurant
                </span>
              </div>
            </Link>
            <button
              type="button"
              onClick={() => setMobileNavOpen((prev) => !prev)}
              className="inline-flex h-[60px] w-[60px] items-center justify-center rounded-[7px] border border-white/20 bg-[#004d40]/90 text-white transition hover:bg-[#005d50] md:hidden"
              aria-label={mobileNavOpen ? "Закрыть меню" : "Открыть меню"}
            >
              {mobileNavOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
          <nav aria-label="Main navigation" className="hidden md:block">
            <ul className="flex items-center justify-center gap-[50px]">
              {navigationItems.map((item, i) => (
                <li key={item.label}>
                  <Link
                    to={item.href}
                    className="[font-family:'Open_Sans',Helvetica] text-base font-semibold leading-[normal] tracking-[0] text-white hover:text-white/80 transition-transform duration-200 hover:-translate-y-1"
                    style={{ ['--animation-delay' as any]: `${0.02 * i}s` }}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <Link to="/">
            <Button
              type="button"
              className="inline-flex h-auto min-h-[60px] rounded-[7px] bg-white px-6 py-3 text-center [font-family:'Open_Sans',Helvetica] text-base font-semibold leading-[normal] tracking-[0] text-[#004d40] hover:bg-white/90"
            >
              <span>
                Забронировать
                <br />
                столик
              </span>
            </Button>
          </Link>
        </div>
        {mobileNavOpen ? (
          <div className="md:hidden bg-[#003a33] border-t border-white/10">
            <div className="mx-auto flex max-w-[1440px] flex-col gap-3 px-4 py-4">
              {navigationItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.href}
                  onClick={() => setMobileNavOpen(false)}
                  className="block rounded-[10px] border border-white/10 bg-white/10 px-4 py-3 text-white text-base font-semibold hover:bg-white/15"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        ) : null}
      </header>

      <main className="mx-auto flex w-full max-w-[1440px] flex-col px-4 pb-24 pt-[52px] md:px-12 lg:px-[95px]">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-[7px] bg-[#004d40]">
            <LayoutDashboard className="h-5 w-5 text-white" />
          </div>
          <h1 className="[font-family:'Open_Sans',Helvetica] text-[32px] font-semibold leading-[normal] tracking-[0] text-[#004d40]">
            Панель администратора
          </h1>
        </div>

        {/* Stats */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Бронирований сегодня", value: "12", icon: <CalendarCheck className="h-6 w-6" /> },
            { label: "Свободных столиков", value: "5", icon: <Armchair className="h-6 w-6" /> },
            { label: "Гостей сегодня", value: "34", icon: <Users className="h-6 w-6" /> },
            { label: "Ожидают подтверждения", value: "3", icon: <Clock className="h-6 w-6" /> },
          ].map((stat) => (
            <Card key={stat.label} className="rounded-[15px] border-0 bg-[#d9d9d9] shadow-none">
              <CardContent className="flex min-h-[104px] items-center gap-4 px-[22px] py-3">
                <div className="flex h-[60px] w-[60px] shrink-0 items-center justify-center rounded-xl bg-[#004d40]/10 text-[#004d40]">
                  {stat.icon}
                </div>
                <div className="flex min-w-0 flex-1 flex-col justify-center">
                  <p className="[font-family:'Open_Sans',Helvetica] text-xs font-semibold leading-[normal] tracking-[0] text-[#6e827f]">
                    {stat.label}
                  </p>
                  <p className="mt-1 [font-family:'Open_Sans',Helvetica] text-2xl font-semibold leading-[normal] tracking-[0] text-[#004d40]">
                    {stat.value}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tabs */}
        <div className="mb-6 flex gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 rounded-[7px] px-5 py-3 [font-family:'Open_Sans',Helvetica] text-base font-semibold leading-[normal] tracking-[0] transition-colors ${
                activeTab === tab.key
                  ? "bg-[#004d40] text-white"
                  : "bg-[#d9d9d9] text-[#004d40] hover:bg-[#d9d9d9]/80"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Bookings Tab */}
        {activeTab === "bookings" && (
          <div className="flex flex-col gap-3">
            <div className="mb-2 flex items-center gap-3">
              <div className="relative max-w-md flex-1">
                <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#999999]" />
                <Input
                  placeholder="Поиск по имени или телефону..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-12 rounded-[7px] border-0 bg-[#d9d9d9] pl-10 pr-4 [font-family:'Open_Sans',Helvetica] text-base font-semibold placeholder:text-[#999999] focus-visible:ring-0 focus-visible:ring-offset-0"
                />
              </div>
            </div>
            {filteredBookings.map((booking, i) => (
              <Card key={booking.id} className="rounded-[15px] border-0 bg-[#d9d9d9] shadow-none animate-fade-up" style={{ ['--animation-delay' as any]: `${i * 0.02}s` }}>
                <CardContent className="flex min-h-[80px] items-center gap-4 px-[22px] py-3">
                  <div className="flex h-[48px] w-[48px] shrink-0 items-center justify-center rounded-full bg-[#004d40]/10 text-[#004d40]">
                    <User className="h-5 w-5" />
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col justify-center">
                    <p className="[font-family:'Open_Sans',Helvetica] text-lg font-semibold leading-[normal] tracking-[0] text-[#004d40]">
                      {booking.name}
                    </p>
                    <div className="mt-0.5 flex items-center gap-1.5">
                      <Phone className="h-3.5 w-3.5 text-[#6e827f]" />
                      <p className="[font-family:'Open_Sans',Helvetica] text-sm font-semibold leading-[normal] tracking-[0] text-[#6e827f]">
                        {booking.phone}
                      </p>
                    </div>
                  </div>
                  <div className="hidden flex-col items-center sm:flex">
                    <div className="flex items-center gap-1.5">
                      <CalendarCheck className="h-3.5 w-3.5 text-[#004d40]" />
                      <p className="[font-family:'Open_Sans',Helvetica] text-sm font-semibold leading-[normal] tracking-[0] text-[#004d40]">
                        {booking.date}
                      </p>
                    </div>
                    <div className="mt-0.5 flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-[#6e827f]" />
                      <p className="[font-family:'Open_Sans',Helvetica] text-sm font-semibold leading-[normal] tracking-[0] text-[#6e827f]">
                        {booking.time}
                      </p>
                    </div>
                  </div>
                  <div className="hidden flex-col items-center sm:flex">
                    <div className="flex items-center gap-1.5">
                      <Armchair className="h-3.5 w-3.5 text-[#004d40]" />
                      <p className="[font-family:'Open_Sans',Helvetica] text-sm font-semibold leading-[normal] tracking-[0] text-[#004d40]">
                        Столик {booking.table}
                      </p>
                    </div>
                    <div className="mt-0.5 flex items-center gap-1.5">
                      <Users className="h-3.5 w-3.5 text-[#6e827f]" />
                      <p className="[font-family:'Open_Sans',Helvetica] text-sm font-semibold leading-[normal] tracking-[0] text-[#6e827f]">
                        {booking.guests} чел.
                      </p>
                    </div>
                  </div>
                  <span
                    className={`flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1 [font-family:'Open_Sans',Helvetica] text-xs font-semibold ${statusConfig[booking.status].className}`}
                  >
                    {statusConfig[booking.status].icon}
                    {statusConfig[booking.status].text}
                  </span>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Tables Tab */}
        {activeTab === "tables" && (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {mockTables.map((table) => (
              <Card
                key={table.id}
                className={`rounded-[15px] border-0 shadow-none transition-colors ${
                  table.available ? "bg-[#d9d9d9]" : "bg-[#d9d9d9]/50"
                }`}
              >
                <CardContent className="flex min-h-[140px] flex-col items-center justify-center gap-2 px-[22px] py-4">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${table.available ? "bg-[#004d40]/10 text-[#004d40]" : "bg-red-100 text-red-500"}`}>
                    <Armchair className="h-6 w-6" />
                  </div>
                  <p className="[font-family:'Open_Sans',Helvetica] text-xl font-semibold leading-[normal] tracking-[0] text-[#004d40]">
                    Столик {table.id}
                  </p>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-[#6e827f]" />
                    <p className="[font-family:'Open_Sans',Helvetica] text-sm font-semibold leading-[normal] tracking-[0] text-[#6e827f]">
                      {table.location}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Users className="h-3.5 w-3.5 text-[#6e827f]" />
                    <p className="[font-family:'Open_Sans',Helvetica] text-sm font-semibold leading-[normal] tracking-[0] text-[#6e827f]">
                      {table.seats} мест
                    </p>
                  </div>
                  <span
                    className={`flex items-center gap-1 rounded-full px-3 py-1 [font-family:'Open_Sans',Helvetica] text-xs font-semibold ${
                      table.available
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {table.available ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                    {table.available ? "Свободен" : "Занят"}
                  </span>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Menu Tab */}
        {activeTab === "menu" && (
          <div className="flex flex-col gap-3">
            {mockMenuItems.map((item) => (
              <Card key={item.id} className="rounded-[15px] border-0 bg-[#d9d9d9] shadow-none">
                <CardContent className="flex min-h-[80px] items-center gap-4 px-[22px] py-3">
                  <div className={`flex h-[48px] w-[48px] shrink-0 items-center justify-center rounded-xl ${item.available ? "bg-[#004d40]/10 text-[#004d40]" : "bg-red-100 text-red-500"}`}>
                    <UtensilsCrossed className="h-5 w-5" />
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col justify-center">
                    <p className="[font-family:'Open_Sans',Helvetica] text-lg font-semibold leading-[normal] tracking-[0] text-[#004d40]">
                      {item.name}
                    </p>
                    <p className="mt-0.5 [font-family:'Open_Sans',Helvetica] text-sm font-semibold leading-[normal] tracking-[0] text-[#6e827f]">
                      {item.category}
                    </p>
                  </div>
                  <p className="shrink-0 [font-family:'Open_Sans',Helvetica] text-lg font-semibold leading-[normal] tracking-[0] text-[#004d40]">
                    {item.price} ₽
                  </p>
                  <span
                    className={`flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1 [font-family:'Open_Sans',Helvetica] text-xs font-semibold ${
                      item.available
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {item.available ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                    {item.available ? "В наличии" : "Нет в наличии"}
                  </span>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      <footer className="w-full bg-[#004d40]">
        <div className="mx-auto flex h-20 w-full max-w-[1440px] items-center justify-center px-4 text-center [font-family:'DM_Sans',Helvetica] text-[26px] font-normal leading-[normal] tracking-[0] text-primary-colorsbrand-beige">
          &copy;2026 - HealthyFood. All Rights Reserved.
        </div>
      </footer>
    </div>
  );
};
