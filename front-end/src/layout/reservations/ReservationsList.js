import React, { useState } from "react";
import { useHistory } from "react-router-dom";

import { cancelReservation } from "../../utils/api";

function ReservationsList({ reservationParam }) {
  // const [error, setError] = useState(null);
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

  const cancelHandler = () => {
    const confirmBox = window.confirm(
      "Do you want to cancel this reservation? This cannot be undone."
    );

    if (confirmBox === true) {
      cancelReservation(reservationParam, reservation_id)
        .then(() => history.go())
        .catch((error) => console.log("error", error));
    }

    return null;
  };

  return (
    <>
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
          {status === "booked" ? (
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
