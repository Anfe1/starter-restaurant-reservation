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
        <td>{reservation.first_name}</td>
        <td> {reservation.last_name} </td>
        <td> {reservation.people} </td>
        <td> {reservation.mobile_number} </td>
        <td> {reservation.reservation_date} </td>
        <td> {reservation.reservation_time} </td>
        <td data-reservation-id-status={reservation.reservation_id}>
          {reservation.status}
        </td>
        <td>
          {reservation.status === "booked" ? (
            <a href={`/reservations/${reservation.reservation_id}/seat`}>
              <button className="btn btn-primary"> Seat </button>
            </a>
          ) : (
            <div></div>
          )}
        </td>
        <td data-reservation-id-cancel={reservation.reservation_id}>
          {reservation.status === "booked" ? (
            <button className="btn btn-danger ml-2">Cancel</button>
          ) : (
            <></>
          )}
        </td>
      </tr>
    </>
  );
}

export default ReservationsList;
