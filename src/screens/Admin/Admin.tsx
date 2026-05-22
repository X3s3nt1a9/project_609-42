import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
  ChevronDown,
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
import { useAdminData } from "./admin-data";

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

const statusConfig = {
  confirmed: { text: "Подтверждено", icon: <CheckCircle2 className="h-3.5 w-3.5" />, className: "bg-emerald-100 text-emerald-700" },
  pending: { text: "Ожидает", icon: <Hourglass className="h-3.5 w-3.5" />, className: "bg-amber-100 text-amber-700" },
  cancelled: { text: "Отменено", icon: <XCircle className="h-3.5 w-3.5" />, className: "bg-red-100 text-red-700" },
};

export const Admin = (): JSX.Element => {
  const navigate = useNavigate();
  const { bookings, tables, menuItems, deleteBooking, updateBooking, updateMenuItem } = useAdminData();
  const [activeTab, setActiveTab] = useState<TabKey>("bookings");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [menuDropdownOpenId, setMenuDropdownOpenId] = useState<number | null>(null);

  const tableById = useMemo(() => new Map(tables.map((table) => [table.id, table])), [tables]);

  const activeBookedTableIds = useMemo(
    () => bookings.filter((booking) => booking.status !== "cancelled").map((booking) => booking.tableId),
    [bookings],
  );

  const tablesStatus = useMemo(
    () => tables.map((table) => ({
      ...table,
      available: !activeBookedTableIds.includes(table.id),
    })),
    [tables, activeBookedTableIds],
  );

  const AUTO_UNAVAILABLE_THRESHOLD = 3;

  const menuItemsWithCount = useMemo(
    () =>
      menuItems.map((item) => {
        const selectedCount = bookings.filter(
          (booking) => booking.status !== "cancelled" && booking.menuIds.includes(item.id),
        ).length;
        const autoAvailable = selectedCount < AUTO_UNAVAILABLE_THRESHOLD;
        const computedAvailable = item.manualOverride
          ? item.manualOverride === "enabled"
          : item.available && autoAvailable;

        return {
          ...item,
          selectedCount,
          autoAvailable,
          computedAvailable,
          availabilitySource: item.manualOverride ? "manual" : "auto",
        };
      }),
    [menuItems, bookings],
  );

  const [statusMenuOpenId, setStatusMenuOpenId] = useState<number | null>(null);

  const filteredBookings = useMemo(
    () =>
      bookings.filter((b) => {
        const q = searchQuery.trim().toLowerCase();
        if (!q) return true;
        return b.name.toLowerCase().includes(q) || b.phone.toLowerCase().includes(q);
      }),
    [bookings, searchQuery],
  );

  const handleDeleteBooking = (id: number) => {
    deleteBooking(id);
  };

  const handleEditBooking = (id: number) => {
    navigate(`/admin/bookings/${id}/edit`);
  };

  const handleStatusChange = (id: number, status: keyof typeof statusConfig) => {
    const booking = bookings.find((item) => item.id === id);
    if (!booking) return;
    updateBooking({ ...booking, status });
    setStatusMenuOpenId(null);
  };

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
              <Card
                key={booking.id}
                className={`rounded-[15px] border-0 bg-[#d9d9d9] shadow-none animate-fade-up overflow-visible ${
                  statusMenuOpenId === booking.id ? 'relative z-[9999]' : 'relative'
                }`}
                style={{ ['--animation-delay' as any]: `${i * 0.02}s` }}
              >
                <CardContent className="flex flex-wrap items-center gap-4 px-[22px] py-3 overflow-visible">
                  <div className="flex h-[48px] w-[48px] shrink-0 items-center justify-center rounded-full bg-[#004d40]/10 text-[#004d40]">
                    <User className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1 flex-col justify-center">
                    <p className="[font-family:'Open_Sans',Helvetica] text-lg font-semibold leading-[normal] tracking-[0] text-[#004d40] truncate">
                      {booking.name}
                    </p>
                    <div className="mt-0.5 flex flex-wrap items-center gap-1.5">
                      <Phone className="h-3.5 w-3.5 text-[#6e827f]" />
                      <p className="[font-family:'Open_Sans',Helvetica] text-sm font-semibold leading-[normal] tracking-[0] text-[#6e827f] break-words">
                        {booking.phone}
                      </p>
                    </div>
                  </div>
                  <div className="min-w-[220px] flex-shrink-0 text-left">
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
                  <div className="min-w-[220px] flex-shrink-0 text-left">
                    <div className="flex items-center gap-1.5">
                      <Armchair className="h-3.5 w-3.5 text-[#004d40]" />
                      <p className="[font-family:'Open_Sans',Helvetica] text-sm font-semibold leading-[normal] tracking-[0] text-[#004d40]">
                        Столик {booking.tableId}
                      </p>
                    </div>
                    <div className="mt-0.5 flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-[#6e827f]" />
                      <p className="[font-family:'Open_Sans',Helvetica] text-sm font-semibold leading-[normal] tracking-[0] text-[#6e827f] break-words">
                        {tableById.get(booking.tableId)?.location || "—"}
                      </p>
                    </div>
                    <div className="mt-2 flex items-center gap-1.5">
                      <Users className="h-3.5 w-3.5 text-[#6e827f]" />
                      <p className="[font-family:'Open_Sans',Helvetica] text-sm font-semibold leading-[normal] tracking-[0] text-[#6e827f]">
                        {booking.guests} чел.
                      </p>
                    </div>
                    <p className="mt-1 text-sm leading-5 text-[#6e827f] break-words">
                      {booking.menuIds.length
                        ? booking.menuIds.map((id) => menuItems.find((item) => item.id === id)?.name).filter(Boolean).join(", ")
                        : "Меню не выбрано"}
                    </p>
                  </div>
                  <div className="relative min-w-[200px] flex-shrink-0 flex flex-col items-end gap-2 text-right overflow-visible">
                    <button
                      type="button"
                      className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold transition ${statusConfig[booking.status].className}`}
                      onClick={() => setStatusMenuOpenId(statusMenuOpenId === booking.id ? null : booking.id)}
                    >
                      {statusConfig[booking.status].icon}
                      {statusConfig[booking.status].text}
                      <ChevronDown className="h-4 w-4" />
                    </button>
                    {statusMenuOpenId === booking.id ? (
                      <div className="absolute right-0 top-full z-[9999] mt-2 w-[190px] overflow-hidden rounded-[12px] border border-[#d9d9d9] bg-white shadow-lg">
                        {Object.keys(statusConfig).map((statusKey) => {
                          const key = statusKey as keyof typeof statusConfig;
                          return (
                            <button
                              key={key}
                              type="button"
                              onClick={() => handleStatusChange(booking.id, key)}
                              className={`block w-full px-4 py-3 text-left text-sm transition hover:bg-[#f3f7f4] ${booking.status === key ? "bg-[#edf7ed] font-semibold" : "text-[#374151]"}`}
                            >
                              {statusConfig[key].text}
                            </button>
                          );
                        })}
                      </div>
                    ) : null}
                    <div className="flex flex-wrap items-center justify-end gap-2">
                      <Button type="button" variant="secondary" size="sm" onClick={() => handleEditBooking(booking.id)}>
                        Редактировать
                      </Button>
                      <Button type="button" variant="destructive" size="sm" onClick={() => handleDeleteBooking(booking.id)}>
                        Удалить
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Tables Tab */}
        {activeTab === "tables" && (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {tablesStatus.map((table) => (
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
            {menuItemsWithCount.map((item) => (
              <Card
                key={item.id}
                className={`rounded-[15px] border-0 bg-[#d9d9d9] shadow-none ${menuDropdownOpenId === item.id ? 'relative z-[9999] overflow-visible' : 'relative'}`}>
                <CardContent className="flex min-h-[80px] items-center gap-4 px-[22px] py-3 overflow-visible">
                  <div className={`flex h-[48px] w-[48px] shrink-0 items-center justify-center rounded-xl ${item.computedAvailable ? "bg-[#004d40]/10 text-[#004d40]" : "bg-red-100 text-red-500"}`}>
                    <UtensilsCrossed className="h-5 w-5" />
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col justify-center">
                    <p className="[font-family:'Open_Sans',Helvetica] text-lg font-semibold leading-[normal] tracking-[0] text-[#004d40]">
                      {item.name}
                    </p>
                    <p className="mt-0.5 [font-family:'Open_Sans',Helvetica] text-sm font-semibold leading-[normal] tracking-[0] text-[#6e827f]">
                      {item.category}
                    </p>
                    <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-[#374151]">
                      <span className="inline-flex items-center gap-1 rounded-full bg-[#f3f7f4] px-2 py-1 text-[#374151]">
                        {item.selectedCount ? `${item.selectedCount} заказ${item.selectedCount === 1 ? "" : "а"}` : "Нет заказов"}
                      </span>
                      {item.manualOverride ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#dbeafe] px-2 py-1 text-[#1d4ed8]">
                          {item.manualOverride === "enabled" ? "Вручную доступно" : "Вручную отключено"}
                        </span>
                      ) : !item.autoAvailable ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#fef3c7] px-2 py-1 text-[#b45309]">
                          Авто: достигнут предел
                        </span>
                      ) : null}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <p className="[font-family:'Open_Sans',Helvetica] text-lg font-semibold leading-[normal] tracking-[0] text-[#004d40]">
                      {item.price} ₽
                    </p>
                    <div className="flex flex-col items-end gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          const { selectedCount, autoAvailable, computedAvailable, availabilitySource, ...menuItemBase } = item;
                          if (item.manualOverride) {
                            updateMenuItem({ ...menuItemBase, manualOverride: undefined });
                            setMenuDropdownOpenId(null);
                          } else {
                            updateMenuItem({
                              ...menuItemBase,
                              manualOverride: item.computedAvailable ? 'enabled' : 'disabled',
                            });
                          }
                        }}
                        className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold bg-white text-[#004d40] hover:bg-[#f3fcf5] ${item.manualOverride ? 'border-[#0f6f4d] bg-[#d7f0e2]' : 'border-[#c8e8dc]'}`}
                      >
                        {item.manualOverride ? 'Ручной режим' : 'Автоматический режим'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setMenuDropdownOpenId(menuDropdownOpenId === item.id ? null : item.id)}
                        disabled={!item.manualOverride}
                        className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold ${item.manualOverride ? 'border-[#c8e8dc] bg-white text-[#004d40] hover:bg-[#f3fcf5]' : 'border-[#e2e8f0] bg-[#f8fafc] text-[#94a3b8] cursor-not-allowed'}`}
                      >
                        {item.manualOverride ? 'Выбрать наличие' : 'Недоступно в авто'}
                        <ChevronDown className="h-4 w-4" />
                      </button>
                    </div>
                    {menuDropdownOpenId === item.id && item.manualOverride ? (
                      <div className="absolute right-0 top-full z-[9999] mt-2 w-[220px] overflow-hidden rounded-[12px] border border-[#d9d9d9] bg-white shadow-lg">
                        {(() => {
                          const { selectedCount, autoAvailable, computedAvailable, availabilitySource, ...menuItemBase } = item;
                          return (
                            <>
                              <button
                                type="button"
                                onClick={() => {
                                  updateMenuItem({ ...menuItemBase, manualOverride: 'enabled' });
                                  setMenuDropdownOpenId(null);
                                }}
                                className={`block w-full px-4 py-3 text-left text-sm transition hover:bg-[#f3f7f4] ${item.manualOverride === 'enabled' ? 'bg-[#edf7ed] font-semibold' : 'text-[#374151]'}`}
                              >
                                В наличии
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  updateMenuItem({ ...menuItemBase, manualOverride: 'disabled' });
                                  setMenuDropdownOpenId(null);
                                }}
                                className={`block w-full px-4 py-3 text-left text-sm transition hover:bg-[#fef2f2] ${item.manualOverride === 'disabled' ? 'bg-[#fff5f5] font-semibold' : 'text-[#374151]'}`}
                              >
                                Нет в наличии
                              </button>
                            </>
                          );
                        })()}
                      </div>
                    ) : null}
                    <span
                      className={`inline-flex shrink-0 items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${
                        item.computedAvailable ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
                      }`}
                    >
                      {item.computedAvailable ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                      {item.computedAvailable ? "В наличии" : "Нет в наличии"}
                    </span>
                  </div>
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
