import { Routes, Route } from "react-router-dom";
import { Admin } from "./Admin";
import { BookingEdit } from "./BookingEdit";

export const AdminRoutes = (): JSX.Element => {
  return (
    <Routes>
      <Route index element={<Admin />} />
      <Route path="bookings/:bookingId/edit" element={<BookingEdit />} />
    </Routes>
  );
};
