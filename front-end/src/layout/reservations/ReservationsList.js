import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import ErrorAlert from "../ErrorAlert";

function ReservationsList({ reservationParam }) {
  const [reservation, setReservation] = useState(reservationParam);
  const [error, setError] = useState(null);
  const history = useHistory();
  return (
    <>
      <ErrorAlert error={error} />
      <tr>
        <th scope="row"> {reservation.reservation_id}</th>
      </tr>
    </>
  );
}

export default ReservationsList;
