const { ethers } = require("hardhat");
const { expect } = require("chai");

describe("MedicalRecord", () => {
  let medical, user1, transactionResponse, transactionReceipt;

  beforeEach(async () => {
    const accounts = await ethers.getSigners();
    user1 = accounts[1];
    const Medical = await ethers.getContractFactory("MedicalRecord");
    medical = await Medical.connect(user1).deploy();
  });

  describe("Deployed", () => {
    it("The contract is deployed successfully", async () => {
      expect(await medical.address).to.not.equal(0);
    });
  });

  describe("Add record", () => {
    beforeEach(async () => {
      transactionResponse = await medical
        .connect(user1)
        .addRecord(
          "Waston",
          22,
          "Male",
          "B positive",
          "Dengue",
          "Dengue",
          "Dengue"
        );

      transactionReceipt = await transactionResponse.wait();
    });
    it("Emits a add record event", async () => {
      // Get the logs from the transaction receipt
      const logs = transactionReceipt.logs;
      expect(logs.length).to.be.at.least(1);

      // Parse the event from the logs
      const eventFragment = medical.interface.getEvent(
        "MedicalRecord__AddRecord"
      );
      const event = medical.interface.parseLog({
        topics: logs[0].topics,
        data: logs[0].data,
      });

      // Check the event name
      expect(event.name).to.equal("MedicalRecord__AddRecord");

      // Check the event arguments
      const args = event.args;
      expect(args[0]).to.not.equal(0); // recordId
      expect(args[1]).to.not.equal(0); // timestamp
      expect(args[2]).to.equal("Waston"); // name
      expect(args[3]).to.equal(22); // age
      expect(args[4]).to.equal("Male"); // gender
      expect(args[5]).to.equal("B positive"); // bloodType
      expect(args[6]).to.equal("Dengue"); // allergies
      expect(args[7]).to.equal("Dengue"); // diagnosis
      expect(args[8]).to.equal("Dengue"); //
      //  treatment
    });
    it("The getRecord records function is working preperly or not", async () => {
      const [
        timestamp,
        name,
        age,
        gender,
        bloodType,
        allergies,
        diagnosis,
        treatment,
      ] = await medical.getRecord(1);
      expect(await medical.getRecordId()).to.be.equal(1);
      expect(timestamp).to.not.equal(0);
      expect(name).to.equal("Waston");
      expect(age).to.equal(22);
      expect(gender).to.equal("Male");
      expect(bloodType).to.equal("B positive");
      expect(allergies).to.equal("Dengue");
      expect(diagnosis).to.equal("Dengue");
      expect(treatment).to.equal("Dengue");
    });
  });

  describe("Delete", () => {
    beforeEach(async () => {
      transactionResponse = await medical
        .connect(user1)
        .addRecord(
          "Waston",
          22,
          "Male",
          "B positive",
          "Dengue",
          "Dengue",
          "Dengue"
        );

      transactionReceipt = await transactionResponse.wait();

      transactionResponse = await medical.connect(user1).deleteRecord(1);
      transactionReceipt = await transactionResponse.wait();
    });
    it("The record is presnet in the isdelete mapping", async () => {
      expect(await medical.getDeleted(1)).to.be.equal(true);
    });

    it("It emits a delete event or not", async () => {
      // Get the logs from the transaction receipt
      const logs = transactionReceipt.logs;
      expect(logs.length).to.be.at.least(1);

      // Parse the event from the logs
      const eventFragment = medical.interface.getEvent(
        "MedicalRecord__DeleteRecord"
      );
      const event = medical.interface.parseLog({
        topics: logs[0].topics,
        data: logs[0].data,
      });

      // Check the event name
      expect(event.name).to.equal("MedicalRecord__DeleteRecord");

      // Check the event arguments
      const args = event.args;

      expect(args.timestamp).to.not.equal(0);
      expect(args.name).to.equal("Waston");
      expect(args.age).to.equal(22);
      expect(args.gender).to.equal("Male");
      expect(args.bloodType).to.equal("B positive");
      expect(args.allergies).to.equal("Dengue");
      expect(args.diagnosis).to.equal("Dengue");
      expect(args.treatment).to.equal("Dengue");
    });
  });
});
