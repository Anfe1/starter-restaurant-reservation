import React, { useState } from "react";
import { useHistory } from "react-router";
import { createReservation } from "../../utils/api";
import ErrorAlert from "../ErrorAlert";
import ReservationForm from "./ReservationForm";

function ReservationNew({ date }) {
  const history = useHistory();
  const [error, setError] = useState(null);

  const [reservation, setReservation] = useState({
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: date,
    reservation_time: "",
    people: "1",
  });

  //submitHandler
  const submitHandler = (event) => {
    event.preventDefault();
    createReservation({
      ...reservation,
      people: Number(reservation.people),
    })
      .then(() => {
        history.push(`/dashboard?date=${reservation.reservation_date}`);
      })
      .catch(setError);
  };

  return (
    <main>
      <ErrorAlert error={error} />
      <h1>Create a New Reservation</h1>
      <ReservationForm
        reservation={reservation}
        setReservation={setReservation}
        submitHandler={submitHandler}
      />
    </main>
  );
}

export default ReservationNew;
