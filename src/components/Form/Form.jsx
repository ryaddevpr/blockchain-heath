import React, { useState } from "react";
import "./form.css";
import { useDispatch, useSelector } from "react-redux";
import { submitRecord } from "../../store/interactions";

const Form = () => {
  const account = useSelector((state) => state.provider.account);

  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [bloodType, setBloodType] = useState("");
  const [allergies, setAllergies] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [treatment, setTreatment] = useState("");

  const provider = useSelector((state) => state.provider.connection);
  const dispatch = useDispatch();
const medical = useSelector((state)=>state.medical.contract)
  const submitHandler = async (e) => {
    e.preventDefault();

    await submitRecord(
      name,
      age,
      gender,
      bloodType,
      allergies,
      diagnosis,
      treatment,
      provider,
      medical,
      dispatch
    );
  };

  return (
    <div className="login-container">
      {account ? (
        <form onSubmit={submitHandler}>
          <h1>Patient Details</h1>

          <label htmlFor="name">Patient Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            required
            onChange={(e) => setName(e.target.value)}
            value={name}
            placeholder="John Doe"
          />

          <label htmlFor="age">Age:</label>
          <input
            type="number"
            id="age"
            name="age"
            required
            onChange={(e) => setAge(e.target.value)}
            value={age}
            placeholder="Enter Age"
          />

          <label htmlFor="gender">Gender:</label>
          <select
            name="gender"
            id="gender"
            required
            onChange={(e) => setGender(e.target.value)}
            value={gender}
          >
            <option value="" disabled>
              Select Gender
            </option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>

          <label htmlFor="bloodType">Blood Type:</label>
          <input
            type="text"
            id="bloodType"
            name="bloodType"
            required
            onChange={(e) => setBloodType(e.target.value)}
            value={bloodType}
            placeholder="e.g. A+, O-"
          />

          <label htmlFor="allergies">Allergies:</label>
          <input
            type="text"
            id="allergies"
            name="allergies"
            required
            onChange={(e) => setAllergies(e.target.value)}
            value={allergies}
            placeholder="Specify allergies"
          />

          <label htmlFor="diagnosis">Diagnosis:</label>
          <input
            type="text"
            id="diagnosis"
            name="diagnosis"
            required
            onChange={(e) => setDiagnosis(e.target.value)}
            value={diagnosis}
            placeholder="Enter diagnosis"
          />

          <label htmlFor="treatment">Treatment:</label>
          <input
            type="text"
            id="treatment"
            name="treatment"
            required
            onChange={(e) => setTreatment(e.target.value)}
            value={treatment}
            placeholder="Enter treatment plan"
          />

          <input type="submit" value="Submit" />
        </form>
      ) : (
        <h1>Connect the account first</h1>
      )}
    </div>
  );
};

export default Form;
