import React, { useState, useEffect } from "react";
import ReservationForm from "./ReservationForm";
import { updateReservation, readReservation } from "../../utils/api";
import { useParams, useHistory } from "react-router-dom";
import ErrorAlert from "../ErrorAlert";

//edit reservation
function EditReservation() {
  const history = useHistory();

  const { reservation_id } = useParams();
  //clear form
  const initialState = {
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    people: 1,
  };

  const [reservation, setReservation] = useState(initialState);
  const [reservationsError, setReservationsError] = useState(null);
  const [error, setError] = useState(null);

  useEffect(loadDashboard, [reservation_id]);

  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    readReservation(reservation_id, abortController.signal)
      .then(setReservation)
      .catch(setReservationsError);

    return () => abortController.abort();
  }

  async function submitHandler(event) {
    event.preventDefault();
    const abortController = new AbortController();
    try {
      await updateReservation(
        reservation_id,
        reservation,
        abortController.signal
      );
      setReservation(initialState);
      const res_date =
        reservation.reservation_date.match(/\d{4}-\d{2}-\d{2}/)[0];
      history.push(`/dashboard?date=` + res_date);
    } catch (error) {
      setError(error);
    }
    return () => abortController.abort();
  }

  return (
    <main>
      <ErrorAlert error={error} />
      <ErrorAlert error={reservationsError} />
      <h1>Edit a New Reservation</h1>
      <ReservationForm
        reservation={reservation}
        setReservation={setReservation}
        submitHandler={submitHandler}
      />
    </main>
  );
}

export default EditReservation;
