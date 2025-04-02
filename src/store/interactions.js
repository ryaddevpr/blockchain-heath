import { ethers } from "ethers";

import MEDICAL_ABI from "../abis/MedicalRecord.json";

export const loadProvider = (dispatch) => {
  const connection = new ethers.providers.Web3Provider(window.ethereum);
  dispatch({ type: "PROVIDER_LOADED", connection });
  return connection;
};
export const loadNetwork = async (provider, dispatch) => {
  const { chainId } = await provider.getNetwork();
  dispatch({ type: "NETWORK_LOADED", chainId });
  return chainId;
};
export const loadAccount = async (provider, dispatch) => {
  const accounts = await window.ethereum.request({
    method: "eth_requestAccounts",
  });
  const account = ethers.utils.getAddress(accounts[0]);
  dispatch({ type: "ACCOUNT_LOADED", account });
  let balance = await provider.getBalance(account);
  balance = ethers.utils.formatEther(balance);
  dispatch({ type: "ETHER_BALANCE_LOADED", balance });
  return account;
};
export const loadMedical = async (provider, address, dispatch) => {
  try {
    const medical = new ethers.Contract(
      address,
      MEDICAL_ABI, // Make sure this ABI is correct and up to date
      provider
    );

    // Log to verify we have a valid contract
    console.log("Contract loaded:", address);
    console.log("Is contract:", (await provider.getCode(address)) !== "0x");

    dispatch({ type: "MEDICAL_LOADED", medical });
    return medical;
  } catch (error) {
    console.error("Error loading medical contract:", error);
    return null;
  }
};

// In your interactions.js or wherever submitRecord is defined
export const submitRecord = async (
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
) => {
  try {
    dispatch({ type: "NEW_RECORD_LOADED" });

    // Create and send transaction
    const signer = provider.getSigner();
    const transaction = await medical
      .connect(signer)
      .addRecord(
        "name",
        2,
        "gender",
        "bloodType",
        "allergies",
        "diagnosis",
        "treatment"
      );

    // Wait for transaction to be mined
    console.log("Transaction submitted:", transaction.hash);
    const receipt = await transaction.wait();
    console.log("Transaction mined:", receipt);

    // Note: You don't need to dispatch SUCCESS here as the event listener will do it
    // The event listener will trigger once the transaction is mined
  } catch (error) {
    console.error("Transaction failed:", error);
    dispatch({ type: "NEW_RECORD_FAIL" });
  }
};

export const subscribeToEvent = async (medical, dispatch) => {
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
      console.log("subscrive to event ", event.args);
      const medicalOrder = event.args;
      dispatch({ type: "NEW_RECORD_SUCCESS", medicalOrder, event });
    }
  );
};
