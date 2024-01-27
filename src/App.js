import logo from "./logo.svg";
import "./App.css";
import { useState } from "react";
import Greeter from "./artifacts/contracts/Greeter.sol/Greeter.json";
import Token from "./artifacts/contracts/Token.sol/Token.json";
import NDToken from "./artifacts/contracts/NDToken.sol/NDToken.json";
import { ethers } from "ethers";

function App() {
  const [greeting, setGreetingValue] = useState();
  const [userAccount, setUserAccount] = useState();
  const [amount, setAmount] = useState();

  const greeterAddress = "0x0B306BF915C4d645ff596e518fAf3F9669b97016";
  const tokenAddress = "0x959922bE3CAee4b8Cd9a407cc3ac1C251C2007B1";
  const ndTokenAddress = "0x9A9f2CCfdE556A7E9Ff0848998Aa4a0CFD8863AE";

  async function requestAccount() {
    await window.ethereum.request({ method: "eth_requestAccounts" });
  }

  async function fetchGreeting() {
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(
        greeterAddress,
        Greeter.abi,
        provider
      );
      try {
        const data = await contract.greet();
        console.log("data: ", data);
      } catch (err) {
        console.log("Error: ", err);
      }
    }
  }

  async function getBalance() {
    if (typeof window.ethereum !== "undefined") {
      const [account] = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(tokenAddress, Token.abi, provider);
      const balance = await contract.balanceOf(account);
      console.log("Balance: ", balance.toString());
    }
  }

  async function getERC20Balance() {
    if (typeof window.ethereum !== "undefined") {
      const [account] = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(
        ndTokenAddress,
        NDToken.abi,
        provider
      );
      const balance = await contract.balanceOf(account);
      console.log("ERC20 Balance: ", balance.toString());
    }
  }

  async function setGreeting() {
    if (!greeting) return;
    if (typeof window.ethereum !== "undefined") {
      await requestAccount();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(greeterAddress, Greeter.abi, signer);
      const transaction = await contract.setGreeting(greeting);
      await transaction.wait();
      fetchGreeting();
    }
  }

  async function sendCoins() {
    if (typeof window.ethereum !== "undefined") {
      try {
        await requestAccount();
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(tokenAddress, Token.abi, signer);
        const transaction = await contract.transfer(userAccount, amount);
        await transaction.wait();
        console.log(`${amount} Coins successfully sent to ${userAccount}`);
      } catch (ex) {
        console.log("Transaction failed", ex);
      }
    }
  }

  async function sendERC20Coins() {
    if (typeof window.ethereum !== "undefined") {
      try {
        await requestAccount();
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(
          ndTokenAddress,
          NDToken.abi,
          signer
        );
        const transaction = await contract.transfer(userAccount, amount);
        await transaction.wait();
        console.log(
          `${amount} ERC20 Coins successfully sent to ${userAccount}`
        );
      } catch (ex) {
        console.log("Transaction failed", ex);
      }
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <button onClick={fetchGreeting}>Fetch Greeting</button>
        <button onClick={setGreeting}>Set Greeting</button>
        <input
          onChange={(e) => setGreetingValue(e.target.value)}
          placeholder="Set Greeting. "
        />
        <button onClick={getBalance}>Get Balance</button>
        <button onClick={sendCoins}>Send Coins</button>
        <input
          onChange={(e) => setUserAccount(e.target.value)}
          placeholder="Account ID"
        />
        <input
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount"
        />
        <button onClick={getERC20Balance}>Get ERC20 Balance</button>
        <button onClick={sendERC20Coins}>Send ERC20 Coins</button>
      </header>
    </div>
  );
}

export default App;
