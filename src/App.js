import "./App.css";
import { useEffect } from "react";
import {
  loadMedical,
  loadNetwork,
  loadProvider,
  subscribeToEvent,
} from "./store/interactions";
import { useDispatch } from "react-redux";
import { Form, Navbar } from "./components";
import config from "./config.json";
function App() {
  const dispatch = useDispatch();
  const loadBlockchainData = async () => {
    const provider = loadProvider(dispatch);
    const chainId = await loadNetwork(provider, dispatch);

    const medical_config = config[chainId].MedicalRecord;

    const medical = await loadMedical(
      provider,
      medical_config.address,
      dispatch
    );

    medical.on("*", (event) => {
      console.log("Got an event:", event);
      
      // Then filter for your specific event
      if (event.event === "MedicalRecord__AddRecord") {
        console.log("Got MedicalRecord__AddRecord event:", event.args);
        const medicalOrder = event.args;
        dispatch({
          type: "NEW_RECORD_SUCCESS",
          medicalOrder,
          event
        });
      }
    });

    // console.log("medical: ", medical)
    medical.on(
      "MedicalRecord__AddRecord",
      (
        recordId,
        timestamp,
        name,
        age,
        gender,
        bloodType,
        allergies,
        diagnosis,
        treatment,
        event
      ) => {
        console.log("Event received: ", event); // Debugging

        if (!event) {
          console.log("No event data received.");
          return;
        }

        const medicalOrder = event.args;
        console.log("Medical Order Data: ", medicalOrder);

        dispatch({ type: "NEW_RECORD_SUCCESS", medicalOrder, event });
      }
    );

    // subscribeToEvent(medical, dispatch);
  };
  useEffect(() => {
    loadBlockchainData();
  });
  return (
    <div className="App">
      <Navbar />
      <Form />
    </div>
  );
}

export default App;
