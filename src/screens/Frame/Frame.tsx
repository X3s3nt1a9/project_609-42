import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  CheckCircle2,
  Users,
  Armchair,
  CalendarDays,
  Clock,
  ChevronRight,
  Phone,
  User,
  Heart,
  Leaf,
  Award,
  ChefHat,
  MapPin,
  Mail,
  Instagram,
  Facebook,
  Menu,
  X,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import logo from "../../../logo.svg";

const navigationItems = [
  { label: "Home", href: "#home" },
  { label: "About us", href: "#about" },
  { label: "Contact us", href: "#contact" },
  { label: "Admin", href: "/admin" },
];

const timeSlots = [
  "9:00",
  "9:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
];

const aboutFeatures = [
  {
    icon: <Leaf className="h-8 w-8" />,
    title: "Свежие продукты",
    description: "Мы используем только фермерские продукты, доставленные каждое утро с местных хозяйств.",
  },
  {
    icon: <ChefHat className="h-8 w-8" />,
    title: "Шеф-повар",
    description: "Наш шеф-повар Алексей Морозов — обладатель звезды Мишлен с 15-летним опытом.",
  },
  {
    icon: <Heart className="h-8 w-8" />,
    title: "Забота о здоровье",
    description: "Каждое блюдо разработано с учётом баланса нутриентов и пользы для организма.",
  },
  {
    icon: <Award className="h-8 w-8" />,
    title: "Награды",
    description: "Лучший ресторан здорового питания 2024 по версии Moscow Dining Awards.",
  },
];

const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
  if (href.startsWith("#")) {
    e.preventDefault();
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  }
};

export const Frame = (): JSX.Element => {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [selectedTime, setSelectedTime] = useState<string>(timeSlots[0]);
  const timeScrollRef = useRef<HTMLDivElement | null>(null);
  const [guestCount, setGuestCount] = useState<number>(2);
  const [selectedTable, setSelectedTable] = useState<string>("Терраса");
  const [selectedDateISO, setSelectedDateISO] = useState<string>(() => new Date().toISOString().split("T")[0]);
  const formatDate = (iso: string) => {
    try {
      const d = new Date(iso + "T00:00:00");
      const dayMonth = new Intl.DateTimeFormat("ru-RU", { day: "numeric", month: "long" }).format(d);
      const weekday = new Intl.DateTimeFormat("ru-RU", { weekday: "long" }).format(d);
      return `${dayMonth}, ${weekday}`;
    } catch (e) {
      return iso;
    }
  };
  const [selectedDate, setSelectedDate] = useState<string>(formatDate(selectedDateISO));
  const [calendarMonth, setCalendarMonth] = useState<Date>(new Date(selectedDateISO + "T00:00:00"));

  const prevMonth = () => {
    setCalendarMonth((m) => new Date(m.getFullYear(), m.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCalendarMonth((m) => new Date(m.getFullYear(), m.getMonth() + 1, 1));
  };

  const isoFromDate = (d: Date) => d.toISOString().split("T")[0];

  const isSameISO = (d: Date, iso: string) => isoFromDate(d) === iso;
  const [openDropdown, setOpenDropdown] = useState<"guests" | "table" | "date" | null>(null);
  const [name, setName] = useState<string>("");
  const [phone, setPhone] = useState<string>("+7");
  const [bookingMessage, setBookingMessage] = useState<string>("");
  const [showMessage, setShowMessage] = useState<boolean>(false);

  const guestOptions = [2, 3, 4, 5, 6];
  const tableOptions = ["Терраса", "У окна", "VIP", "Для двоих"];
  const dateOptions = ["4 апреля, пятница", "5 апреля, суббота", "6 апреля, воскресенье"];

  const availability = true;

  const bookingCards = [
    {
      key: "availability",
      lucideIcon: <CheckCircle2 className="h-7 w-7" />,
      title: "Есть ли свободные места?",
      value: availability ? "Да" : "Нет",
      hasArrow: false,
    },
    {
      key: "guests",
      lucideIcon: <Users className="h-7 w-7" />,
      title: "Количество гостей",
      value: `${guestCount} человека`,
      hasArrow: false,
    },
    {
      key: "table",
      lucideIcon: <Armchair className="h-7 w-7" />,
      title: "Выбранный столик",
      value: selectedTable,
      hasArrow: false,
    },
    {
      key: "date",
      lucideIcon: <CalendarDays className="h-7 w-7" />,
      title: "Выбранная дата",
      value: selectedDate,
      hasArrow: false,
    },
  ];

  const onNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    handleNavClick(e, href);
    setMobileNavOpen(false);
  };

  const scrollTimeSlots = () => {
    if (timeScrollRef.current) {
      timeScrollRef.current.scrollBy({ left: 220, behavior: "smooth" });
    }
  };

  const handleBooking = () => {
    if (!name.trim() || !phone.trim() || phone.trim() === "+7") {
      setBookingMessage("Пожалуйста, заполните имя и телефон, чтобы завершить бронирование.");
      setShowMessage(true);
      return;
    }

    setBookingMessage(
      `Поздравляем, ${name}! Ваш столик на ${selectedDate} в ${selectedTime} для ${guestCount} гостей забронирован. Ждём вас в ресторане Healthy Restaurant!`
    );
    setShowMessage(true);

    setTimeout(() => {
      setShowMessage(false);
    }, 7000);
  };

  return (
    <div className="min-h-screen bg-[#fcfaf8]">
      <header className="w-full bg-[#004d40] animate-fade-in">
        <div className="mx-auto flex min-h-[120px] w-full max-w-[1440px] items-center justify-between px-8 py-4 md:px-12 lg:px-[95px]">
          <div className="flex items-center gap-4">
            <a href="#home" className="flex items-center gap-3 shrink-0" aria-label="Healthy restaurant home">
              <img src={logo} alt="Healthy Restaurant" className="h-[70px] w-auto transition-transform duration-300 hover:scale-105" />
              <div className="hidden md:flex flex-col leading-tight">
                <span className="[font-family:'EastMarket-Regular',Helvetica] text-[22px] font-semibold text-white">Healthy</span>
                <span className="[font-family:'Open_Sans',Helvetica] text-[10px] uppercase tracking-[0.24em] text-[#b8f4d9]">
                  Restaurant
                </span>
              </div>
            </a>
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
                  {item.href.startsWith("#") ? (
                    <a
                      href={item.href}
                      onClick={(e) => handleNavClick(e, item.href)}
                      className="[font-family:'Open_Sans',Helvetica] text-base font-semibold leading-[normal] tracking-[0] text-white hover:text-white/80 transition-transform duration-200 hover:-translate-y-1"
                      style={{ ['--animation-delay' as any]: `${0.02 * i}s` }}
                    >
                      {item.label}
                    </a>
                  ) : (
                    <Link
                      to={item.href}
                      className="[font-family:'Open_Sans',Helvetica] text-base font-semibold leading-[normal] tracking-[0] text-white hover:text-white/80 transition-transform duration-200 hover:-translate-y-1"
                      style={{ ['--animation-delay' as any]: `${0.02 * i}s` }}
                    >
                      {item.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>
          <Button
            type="button"
            className="h-auto min-h-[60px] rounded-[7px] bg-white px-6 py-3 text-center [font-family:'Open_Sans',Helvetica] text-base font-semibold leading-[normal] tracking-[0] text-[#004d40] hover:bg-white/90 transform transition-transform duration-200 hover:scale-105 active:scale-95"
          >
            <span>
              Забронировать
              <br />
              столик
            </span>
          </Button>
        </div>
        {mobileNavOpen ? (
          <div className="md:hidden bg-[#003a33] border-t border-white/10">
            <div className="mx-auto flex max-w-[1440px] flex-col gap-3 px-4 py-4">
              {navigationItems.map((item) => (
                <div key={item.label}>
                  {item.href.startsWith("#") ? (
                    <a
                      href={item.href}
                      onClick={(e) => onNavClick(e, item.href)}
                      className="block rounded-[10px] border border-white/10 bg-white/10 px-4 py-3 text-white text-base font-semibold hover:bg-white/15"
                    >
                      {item.label}
                    </a>
                  ) : (
                    <Link
                      to={item.href}
                      onClick={() => setMobileNavOpen(false)}
                      className="block rounded-[10px] border border-white/10 bg-white/10 px-4 py-3 text-white text-base font-semibold hover:bg-white/15"
                    >
                      {item.label}
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </header>

      <main className="mx-auto flex w-full max-w-[1440px] flex-col items-center px-4 pb-24 pt-[52px] md:px-12 lg:px-[95px]">
        {/* HOME / Booking Section */}
        <section id="home" className="flex w-full max-w-[454px] flex-col items-center scroll-mt-32">
          <h1 className="mb-8 text-center [font-family:'Open_Sans',Helvetica] text-[32px] font-semibold leading-[normal] tracking-[0] text-[#004d40]">
            Забронировать столик в ресторане
          </h1>
          <div className="flex w-full flex-col gap-3">
            {bookingCards.map((card) => {
              const isSelectable = card.key !== "availability";
              const active = openDropdown === card.key;

              return (
                <div key={card.key} className="relative">
                  <button
                    type="button"
                    onClick={isSelectable ? () => setOpenDropdown(openDropdown === card.key ? null : (card.key as "guests" | "table" | "date")) : undefined}
                    className={`w-full rounded-[15px] border-0 bg-[#d9d9d9] shadow-none transition-transform duration-300 hover:-translate-y-1 animate-fade-up ${
                      isSelectable ? "cursor-pointer" : "cursor-default"
                    }`}
                  >
                    <div className="flex min-h-[104px] items-center gap-4 px-[22px] py-3 text-left">
                      <div className="flex h-[60px] w-[60px] shrink-0 items-center justify-center rounded-xl bg-[#004d40]/10 text-[#004d40]">
                        {card.lucideIcon}
                      </div>
                      <div className="flex min-w-0 flex-1 flex-col justify-center">
                        <p className="[font-family:'Open_Sans',Helvetica] text-xs font-semibold leading-[normal] tracking-[0] text-[#6e827f]">
                          {card.title}
                        </p>
                        <p className="mt-1 text-2xl [font-family:'Open_Sans',Helvetica] font-semibold leading-[normal] tracking-[0] text-[#004d40]">
                          {card.value}
                        </p>
                      </div>
                      {isSelectable ? (
                        <ChevronRight className={`h-6 w-6 text-[#004d40] transition-transform ${active ? "rotate-90" : ""}`} />
                      ) : null}
                    </div>
                  </button>
                  {active ? (
                    <div className="absolute left-0 w-full top-full z-10 mt-2 overflow-hidden rounded-[15px] border border-[#d9d9d9] bg-white shadow-xl animate-fade-in">
                      {card.key === "date" ? (
                        <div className="p-4">
                          <div className="mb-3 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <CalendarDays className="h-5 w-5 text-[#004d40]" />
                              <div className="[font-family:'Open_Sans',Helvetica] text-base font-semibold text-[#004d40]">{formatDate(selectedDateISO)}</div>
                            </div>
                            <div className="flex items-center gap-2">
                              <button type="button" onClick={prevMonth} className="inline-flex items-center justify-center h-8 w-8 rounded border bg-white text-[#004d40]">
                                <ChevronRight className="h-4 w-4 transform -rotate-180" />
                              </button>
                              <button type="button" onClick={nextMonth} className="inline-flex items-center justify-center h-8 w-8 rounded border bg-white text-[#004d40]">
                                <ChevronRight className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                          <div className="w-full rounded-[10px] bg-[#f7faf9] p-3">
                            <div className="grid grid-cols-7 gap-1 text-xs text-[#6e827f] mb-2">
                              <div className="text-center">Пн</div>
                              <div className="text-center">Вт</div>
                              <div className="text-center">Ср</div>
                              <div className="text-center">Чт</div>
                              <div className="text-center">Пт</div>
                              <div className="text-center">Сб</div>
                              <div className="text-center">Вс</div>
                            </div>
                            <div className="grid grid-cols-7 gap-1">
                              {(() => {
                                const year = calendarMonth.getFullYear();
                                const month = calendarMonth.getMonth();
                                const first = new Date(year, month, 1);
                                const startIndex = (first.getDay() + 6) % 7; // Monday first
                                const cells: Date[] = [];
                                const startDate = new Date(year, month, 1 - startIndex);
                                for (let i = 0; i < 42; i++) {
                                  const d = new Date(startDate);
                                  d.setDate(startDate.getDate() + i);
                                  cells.push(d);
                                }

                                return cells.map((d) => {
                                  const disabled = d.getMonth() !== month;
                                  const iso = isoFromDate(d);
                                  const selected = selectedDateISO === iso;
                                  const today = isoFromDate(new Date()) === iso;
                                  return (
                                    <button
                                      key={iso}
                                      type="button"
                                      onClick={() => {
                                        if (!disabled) {
                                          setSelectedDateISO(iso);
                                          setSelectedDate(formatDate(iso));
                                          setOpenDropdown(null);
                                        }
                                      }}
                                      className={`h-8 w-full rounded text-center text-sm leading-8 ${disabled ? "text-[#c1c1c1]" : "text-[#004d40]"} ${
                                        selected ? "bg-[#004d40] text-white font-semibold" : today ? "ring-1 ring-[#b8f4d9]" : "hover:bg-[#e6fffa]"
                                      }`}
                                    >
                                      {d.getDate()}
                                    </button>
                                  );
                                });
                              })()}
                            </div>
                          </div>
                        </div>
                      ) : (
                        (card.key === "guests" ? guestOptions : tableOptions).map((option) => (
                          <button
                            key={option}
                            type="button"
                            onClick={() => {
                              if (card.key === "guests") {
                                setGuestCount(option as number);
                              }
                              if (card.key === "table") {
                                setSelectedTable(option as string);
                              }
                              setOpenDropdown(null);
                            }}
                            className={`flex w-full justify-between px-4 py-3 text-left text-[#0f172a] transition hover:bg-[#f1f5f9] ${
                              (card.key === "guests" && guestCount === option) || (card.key === "table" && selectedTable === option)
                                ? "bg-[#e6fffa] text-[#004d40]"
                                : ""
                            }`}
                          >
                            <span>{card.key === "guests" ? `${option} человек` : option}</span>
                          </button>
                        ))
                      )}
                    </div>
                  ) : null}
                </div>
              );
            })}

            <section aria-label="Выберите время" className="pt-1">
              <h2 className="mb-[7px] flex items-center gap-2 [font-family:'Open_Sans',Helvetica] text-base font-semibold leading-[normal] tracking-[0] text-[#999999]">
                <Clock className="h-4 w-4" />
                Выберите время
              </h2>
              <div className="relative h-[50px]">
                <div ref={timeScrollRef} className="flex gap-2.5 overflow-x-auto pr-12 items-center">
                  {timeSlots.map((time, i) => (
                    <button
                      key={time}
                      type="button"
                      onClick={() => setSelectedTime(time)}
                      className={`flex h-[50px] min-w-[90px] items-center justify-center rounded-xl px-4 [font-family:'Open_Sans',Helvetica] text-base font-semibold leading-[normal] tracking-[0] transition-all duration-300 ${
                        selectedTime === time
                          ? "bg-[#004d40] text-white shadow-xl"
                          : "bg-[#d9d9d9] text-black hover:bg-[#b8e5dc]"
                      } animate-fade-in`}
                      style={{ ['--animation-delay' as any]: `${i * 0.03}s` }}
                    >
                      {time}
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={scrollTimeSlots}
                  className="absolute right-0 top-1/2 flex h-[50px] w-[50px] -translate-y-1/2 items-center justify-center rounded-full border border-[#d9d9d9] bg-white shadow-sm"
                  aria-label="Смотреть следующие времена"
                >
                  <ChevronRight className="h-5 w-5 text-[#004d40]" />
                </button>
              </div>
            </section>
            <Card className="rounded-[15px] border-0 bg-[#d9d9d9] shadow-none">
              <CardContent className="flex min-h-[104px] items-center gap-4 p-0">
                <div className="flex h-[104px] w-[60px] shrink-0 items-center justify-center">
                  <User className="h-7 w-7 text-[#004d40]" />
                </div>
                <Input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Введите ФИО"
                  className="h-[104px] border-0 bg-transparent px-0 [font-family:'Open_Sans',Helvetica] text-2xl font-semibold leading-[normal] tracking-[0] text-black placeholder:text-[#999999] focus-visible:ring-0 focus-visible:ring-offset-0"
                />
              </CardContent>
            </Card>
            <Card className="rounded-[15px] border-0 bg-[#d9d9d9] shadow-none">
              <CardContent className="flex min-h-[104px] items-center gap-4 px-6 py-[10px]">
                <div className="flex h-[60px] w-[60px] shrink-0 items-center justify-center rounded-xl bg-[#004d40]/10 text-[#004d40]">
                  <Phone className="h-7 w-7" />
                </div>
                <div className="flex flex-1 flex-col justify-center gap-2">
                  <label className="[font-family:'Open_Sans',Helvetica] text-base font-semibold leading-[normal] tracking-[0] text-[#999999]">
                    Введите номер телефона
                  </label>
                  <Input
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                    className="h-auto border-0 bg-transparent p-0 [font-family:'Open_Sans',Helvetica] text-2xl font-semibold leading-[normal] tracking-[0] text-black focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                </div>
              </CardContent>
            </Card>

            {showMessage ? (
              <div className="rounded-[15px] border border-emerald-200 bg-emerald-50 px-5 py-4 text-center text-emerald-900 shadow-sm transition duration-500 ease-out">
                {bookingMessage}
              </div>
            ) : null}

            <div className="flex justify-end pt-2">
              <Button
                type="button"
                onClick={handleBooking}
                className="h-auto min-h-[60px] rounded-[7px] bg-[#004d40] px-5 py-4 [font-family:'Open_Sans',Helvetica] text-base font-semibold leading-[normal] tracking-[0] text-white hover:bg-[#004d40]/90"
              >
                Забронировать
              </Button>
            </div>
          </div>
        </section>

        {/* ABOUT US Section */}
        <section id="about" className="mt-24 flex w-full max-w-[900px] flex-col items-center scroll-mt-32">
          <h2 className="mb-4 text-center [font-family:'Open_Sans',Helvetica] text-[32px] font-semibold leading-[normal] tracking-[0] text-[#004d40]">
            О нас
          </h2>
          <p className="mb-10 text-center [font-family:'Open_Sans',Helvetica] text-base font-normal leading-relaxed tracking-[0] text-[#6e827f] max-w-[600px]">
            Healthy Restaurant — это место, где здоровое питание становится удовольствием. С 1998 года мы радуем гостей
            блюдами из свежих фермерских продуктов, созданными с заботой о вашем здоровье и вкусе.
          </p>
          <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
            {aboutFeatures.map((feature) => (
              <Card key={feature.title} className="rounded-[15px] border-0 bg-[#d9d9d9] shadow-none">
                <CardContent className="flex min-h-[160px] flex-col items-start gap-3 px-[22px] py-6">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#004d40]/10 text-[#004d40]">
                    {feature.icon}
                  </div>
                  <h3 className="[font-family:'Open_Sans',Helvetica] text-lg font-semibold leading-[normal] tracking-[0] text-[#004d40]">
                    {feature.title}
                  </h3>
                  <p className="[font-family:'Open_Sans',Helvetica] text-sm font-normal leading-relaxed tracking-[0] text-[#6e827f]">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* CONTACT US Section */}
        <section id="contact" className="mt-24 flex w-full max-w-[900px] flex-col items-center scroll-mt-32">
          <h2 className="mb-4 text-center [font-family:'Open_Sans',Helvetica] text-[32px] font-semibold leading-[normal] tracking-[0] text-[#004d40]">
            Связаться с нами
          </h2>
          <p className="mb-10 text-center [font-family:'Open_Sans',Helvetica] text-base font-normal leading-relaxed tracking-[0] text-[#6e827f] max-w-[500px]">
            У вас есть вопросы или пожелания? Мы всегда рады обратной связи от наших гостей.
          </p>
          <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-3">
            <Card className="rounded-[15px] border-0 bg-[#d9d9d9] shadow-none">
              <CardContent className="flex min-h-[160px] flex-col items-center justify-center gap-3 px-[22px] py-6">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#004d40]/10 text-[#004d40]">
                  <MapPin className="h-7 w-7" />
                </div>
                <h3 className="[font-family:'Open_Sans',Helvetica] text-base font-semibold leading-[normal] tracking-[0] text-[#004d40]">
                  Адрес
                </h3>
                <p className="text-center [font-family:'Open_Sans',Helvetica] text-sm font-normal leading-relaxed tracking-[0] text-[#6e827f]">
                  г. Москва, ул. Тверская, д. 15
                </p>
              </CardContent>
            </Card>
            <Card className="rounded-[15px] border-0 bg-[#d9d9d9] shadow-none">
              <CardContent className="flex min-h-[160px] flex-col items-center justify-center gap-3 px-[22px] py-6">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#004d40]/10 text-[#004d40]">
                  <Phone className="h-7 w-7" />
                </div>
                <h3 className="[font-family:'Open_Sans',Helvetica] text-base font-semibold leading-[normal] tracking-[0] text-[#004d40]">
                  Телефон
                </h3>
                <p className="text-center [font-family:'Open_Sans',Helvetica] text-sm font-normal leading-relaxed tracking-[0] text-[#6e827f]">
                  +7 (495) 123-45-67
                </p>
              </CardContent>
            </Card>
            <Card className="rounded-[15px] border-0 bg-[#d9d9d9] shadow-none">
              <CardContent className="flex min-h-[160px] flex-col items-center justify-center gap-3 px-[22px] py-6">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#004d40]/10 text-[#004d40]">
                  <Mail className="h-7 w-7" />
                </div>
                <h3 className="[font-family:'Open_Sans',Helvetica] text-base font-semibold leading-[normal] tracking-[0] text-[#004d40]">
                  Email
                </h3>
                <p className="text-center [font-family:'Open_Sans',Helvetica] text-sm font-normal leading-relaxed tracking-[0] text-[#6e827f]">
                  info@healthyfood.ru
                </p>
              </CardContent>
            </Card>
          </div>
          <div className="mt-8 flex items-center gap-6">
            <a href="#" className="flex h-12 w-12 items-center justify-center rounded-full bg-[#004d40]/10 text-[#004d40] hover:bg-[#004d40] hover:text-white transition-colors" aria-label="Instagram">
              <Instagram className="h-5 w-5" />
            </a>
            <a href="#" className="flex h-12 w-12 items-center justify-center rounded-full bg-[#004d40]/10 text-[#004d40] hover:bg-[#004d40] hover:text-white transition-colors" aria-label="Facebook">
              <Facebook className="h-5 w-5" />
            </a>
            <a href="#" className="flex h-12 w-12 items-center justify-center rounded-full bg-[#004d40]/10 text-[#004d40] hover:bg-[#004d40] hover:text-white transition-colors" aria-label="Phone">
              <Phone className="h-5 w-5" />
            </a>
          </div>
        </section>
      </main>

      <footer className="w-full bg-[#004d40]">
        <div className="mx-auto flex h-20 w-full max-w-[1440px] items-center justify-center px-4 text-center [font-family:'DM_Sans',Helvetica] text-[26px] font-normal leading-[normal] tracking-[0] text-primary-colorsbrand-beige">
          &copy;2026 - HealthyFood. All Rights Reserved.
        </div>
      </footer>
    </div>
  );
};
