import { FormEvent, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { useAdminData } from "./admin-data";

export const BookingEdit = (): JSX.Element => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const { bookings, tables, menuItems, updateBooking } = useAdminData();
  const booking = bookings.find((item) => item.id === Number(bookingId));

  const AUTO_UNAVAILABLE_THRESHOLD = 3;
  const menuItemsWithAvailability = useMemo(
    () =>
      menuItems.map((item) => {
        const selectedCount = bookings.filter(
          (bookingItem) => bookingItem.status !== "cancelled" && bookingItem.menuIds.includes(item.id),
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
        };
      }),
    [bookings, menuItems],
  );

  const [name, setName] = useState(booking?.name ?? "");
  const [phone, setPhone] = useState(booking?.phone ?? "");
  const [date, setDate] = useState(booking?.date ?? "");
  const [time, setTime] = useState(booking?.time ?? "");
  const [guests, setGuests] = useState(booking?.guests.toString() ?? "1");
  const [tableId, setTableId] = useState(booking?.tableId.toString() ?? "1");
  const [selectedMenuIds, setSelectedMenuIds] = useState<number[]>(booking?.menuIds ?? []);

  const currentTable = useMemo(() => tables.find((table) => table.id === Number(tableId)), [tables, tableId]);

  if (!booking) {
    return (
      <div className="min-h-screen bg-[#fcfaf8] px-4 py-10 text-center text-[#004d40] md:px-12 lg:px-[95px]">
        <h1 className="text-3xl font-semibold">Бронирование не найдено</h1>
        <p className="mt-3 text-base text-[#6e827f]">Проверьте ссылку или вернитесь к списку бронирований.</p>
        <Button type="button" className="mt-6" onClick={() => navigate("/admin")}>Назад в админку</Button>
      </div>
    );
  }

  const toggleMenuItem = (id: number) => {
    setSelectedMenuIds((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id],
    );
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    updateBooking({
      ...booking,
      name,
      phone,
      date,
      time,
      guests: Number(guests) || booking.guests,
      tableId: Number(tableId),
      menuIds: selectedMenuIds,
    });

    navigate("/admin");
  };

  return (
    <div className="min-h-screen bg-[#ebf7f0] text-[#004d40]">
      <main className="mx-auto max-w-[1100px] px-4 pb-24 pt-10 md:px-12 lg:px-[95px]">
        <section className="mb-10 rounded-[28px] bg-gradient-to-r from-[#e8f8ef] via-[#f4fbf7] to-[#eaf8f2] p-8 shadow-[0_24px_70px_rgba(0,77,64,0.08)]">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-[#006a54]">Админка Healthy Food</p>
              <h1 className="mt-3 text-4xl font-semibold tracking-[-0.03em] text-[#004d40]">Редактирование бронирования</h1>
              <p className="mt-3 max-w-2xl text-base leading-7 text-[#3f6d5f]">
                Измените данные гостя, столик и блюда. Сохранённые изменения сразу появятся в админ-панели.
              </p>
            </div>
            <Button
              type="button"
              variant="secondary"
              className="min-w-[180px] rounded-full border border-[#c8e8db] bg-white px-6 py-4 text-sm font-semibold text-[#004d40] shadow-sm hover:bg-[#f7fcf9]"
              onClick={() => navigate("/admin")}
            >
              Вернуться к списку
            </Button>
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <Card className="rounded-[24px] border border-[#d9ede3] bg-white shadow-sm">
            <CardContent className="space-y-8 px-[32px] py-10">
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-3">
                    <label className="block text-sm font-semibold text-[#004d40]">Имя гостя</label>
                    <Input value={name} onChange={(e) => setName(e.target.value)} className="bg-[#f7faf8]" />
                  </div>
                  <div className="space-y-3">
                    <label className="block text-sm font-semibold text-[#004d40]">Телефон</label>
                    <Input value={phone} onChange={(e) => setPhone(e.target.value)} className="bg-[#f7faf8]" />
                  </div>
                  <div className="space-y-3">
                    <label className="block text-sm font-semibold text-[#004d40]">Дата</label>
                    <Input value={date} onChange={(e) => setDate(e.target.value)} className="bg-[#f7faf8]" />
                  </div>
                  <div className="space-y-3">
                    <label className="block text-sm font-semibold text-[#004d40]">Время</label>
                    <Input value={time} onChange={(e) => setTime(e.target.value)} className="bg-[#f7faf8]" />
                  </div>
                  <div className="space-y-3">
                    <label className="block text-sm font-semibold text-[#004d40]">Гостей</label>
                    <Input value={guests} onChange={(e) => setGuests(e.target.value)} className="bg-[#f7faf8]" />
                  </div>
                  <div className="space-y-3">
                    <label className="block text-sm font-semibold text-[#004d40]">Столик</label>
                    <select
                      value={tableId}
                      onChange={(e) => setTableId(e.target.value)}
                      className="h-12 w-full rounded-[14px] border border-[#d3e6db] bg-[#f7faf8] px-4 text-base font-semibold text-[#004d40] outline-none transition focus:border-[#47b285] focus:ring-2 focus:ring-[#47b285]/20"
                    >
                      {tables.map((table) => (
                        <option key={table.id} value={table.id}>
                          {`Столик ${table.id} — ${table.location} (${table.seats} места)`}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="rounded-[24px] border border-[#d3e6db] bg-[#f3faf5] p-5">
                  <p className="mb-4 text-sm font-semibold text-[#004d40]">Выбранные блюда</p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {menuItemsWithAvailability.map((item) => {
                      const disabled = !item.computedAvailable && !selectedMenuIds.includes(item.id);
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => toggleMenuItem(item.id)}
                          disabled={disabled}
                          className={`flex items-center justify-between rounded-[18px] border px-4 py-4 text-left transition ${
                            selectedMenuIds.includes(item.id)
                              ? "border-[#0f6f4d] bg-[#d7f0e2]"
                              : disabled
                              ? "border-[#f0f0f0] bg-[#f5f5f5] text-[#9ca3af]"
                              : "border-[#d9e7df] bg-white hover:bg-[#f2faf6]"
                          }`}
                        >
                          <div>
                            <p className="text-sm font-semibold text-[#004d40]">{item.name}</p>
                            <p className="mt-1 text-xs text-[#6e827f]">{item.category}</p>
                            {!item.computedAvailable ? (
                              <p className="mt-1 text-xs text-[#b45309]">{item.manualOverride ? "Вручную отключено" : "Временно недоступно"}</p>
                            ) : null}
                          </div>
                          <span className="text-sm font-semibold text-[#004d40]">{item.price} ₽</span>
                        </button>
                      );
                    })}
                  </div>
                  <p className="mt-4 text-xs leading-6 text-[#6e827f]">Нажмите на блюдо, чтобы добавить или убрать его из заказа. Недоступные блюда нельзя выбрать.</p>
                </div>

                <div className="flex flex-wrap gap-4">
                  <Button type="submit" variant="default" className="min-w-[160px] rounded-full px-6 py-4">
                    Сохранить изменения
                  </Button>
                  <Button type="button" variant="secondary" className="min-w-[160px] rounded-full px-6 py-4" onClick={() => navigate("/admin")}>Отмена</Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <Card className="rounded-[24px] border border-[#d3e6db] bg-[#eaf8f0] shadow-sm">
            <CardContent className="space-y-6 px-[30px] py-8">
              <div className="rounded-[20px] bg-white p-4 shadow-sm">
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#00795e]">Текущие данные</p>
                <p className="mt-4 text-base text-[#374b47]">{currentTable ? `Столик ${currentTable.id} — ${currentTable.location}` : "Столик не выбран"}</p>
                <p className="mt-1 text-sm text-[#6e827f]">{selectedMenuIds.length ? `Выбрано блюд: ${selectedMenuIds.length}` : "Пока не выбрано ни одного блюда"}</p>
              </div>
              <div className="rounded-[20px] bg-white p-4 shadow-sm">
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#00795e]">Статус бронирования</p>
                <p className="mt-4 text-base text-[#374b47]">{booking.status === "confirmed" ? "Подтверждено" : booking.status === "pending" ? "Ожидает" : "Отменено"}</p>
                <p className="mt-1 text-sm text-[#6e827f]">Текущее состояние заказа можно изменить позже в списке бронирований.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};
