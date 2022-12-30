import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import ErrorAlert from "../ErrorAlert";
import { listTables, updateReservationStatus } from "../../utils/api";

function ReservationsList({ reservationParam }) {
  const [reservation, setReservation] = useState(reservationParam);
  const [error, setError] = useState(null);
  const history = useHistory();
  const {
    reservation_id,
    first_name,
    last_name,
    mobile_number,
    reservation_date,
    reservation_time,
    people,
    status,
  } = reservationParam;

  const cancelHandler = (event) => {
    event.preventDefault();
    setError(null);
    if (
      window.confirm(
        "Do you want to cancel this reservation? This cannot be undone."
      )
    ) {
      updateReservationStatus(
        { status: "cancelled" },
        reservation.reservation_id
      )
        .then(() => {
          listTables();
          history.go(0);
        })
        .catch(setError);
    }
  };

  useEffect(() => {
    setReservation(reservation);
  }, [reservation, history]);

  return (
    <>
      <ErrorAlert error={error} />
      <tr>
        <th scope="row"> {reservation_id}</th>
        <td>{first_name}</td>
        <td> {last_name} </td>
        <td> {people} </td>
        <td> {mobile_number} </td>
        <td> {reservation_date} </td>
        <td> {reservation_time} </td>
        <td data-reservation-id-status={reservation_id}>{status}</td>
        <td>
          {reservation.status === "booked" ? (
            <a href={`/reservations/${reservation_id}/seat`}>
              <button className="btn btn-primary"> Seat </button>
            </a>
          ) : (
            <div></div>
          )}
        </td>
        <td>
          {status === "booked" ? (
            <a href={`/reservations/${reservation_id}/edit`}>
              <button className="btn btn-primary "> Edit </button>
            </a>
          ) : (
            <></>
          )}
        </td>
        <td data-reservation-id-cancel={reservation_id}>
          {status === "booked" ? (
            <button className="btn btn-danger ml-2" onClick={cancelHandler}>
              {" "}
              Cancel{" "}
            </button>
          ) : (
            <></>
          )}
        </td>
      </tr>
    </>
  );
}

export default ReservationsList;
