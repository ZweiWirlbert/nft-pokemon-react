import { useEffect, useState } from 'react';
import './App.css';
import contract from './contracts/NFTCollectible.json';
import { ethers } from 'ethers';
import Assets from './components/Assets';

const contractAddress = '0xF24327E213dDd8Eea86474fDDD73057B99ED0d71';
const abi = contract.abi;

function App() {
  const [currentAccount, setCurrentAccount] = useState(null);
  const [assets, setAssets] = useState([]);
  const [isMinning, setIsMinning] = useState(false);
  const [transactionUrl, setTransactionUrl] = useState('');
  const checkWalletIsConnected = async () => {
    const { ethereum } = window;
    if (!ethereum) {
      console.log('Make sure you have Metamask installed!');
      return;
    } else {
      console.log("Wallet exists! We're ready to go!");
    }

    const accounts = await ethereum.request({ method: 'eth_accounts' });

    if (accounts.lenght !== 0) {
      const account = accounts[0];
      console.log('Found an authorized account: ', account);
      setCurrentAccount(account);
    } else {
      console.log('No authorized account found');
    }
  };

  const getAssets = async (account) => {
    const res = await fetch(
      `https://testnets-api.opensea.io/api/v1/assets?owner=${account}&order_direction=desc&offset=0&limit=20&include_orders=false`
    );
    const data = await res.json();
    console.log(data);
    setAssets(data.assets);
  };

  const connectWalletHandler = async () => {
    const { ethereum } = window;
    if (!ethereum) {
      alert('Please install Metamask!');
    }

    try {
      const accounts = await ethereum.request({
        method: 'eth_requestAccounts',
      });
      console.log('Found account ! Address: ', accounts[0]);
      setCurrentAccount(accounts[0]);
      getAssets(accounts[0]);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    checkWalletIsConnected();
    connectWalletHandler();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentAccount]);

  const mintNftHandler = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const nftContract = new ethers.Contract(contractAddress, abi, signer);

        console.log('Initialize payment');
        let nftTxn = await nftContract.mintNFTs(1, {
          value: ethers.utils.parseEther('0.0002'),
        });

        setIsMinning(true);
        await nftTxn.wait();

        setIsMinning(false);
        setTransactionUrl(`https://rinkeby.etherscan.io/tx/${nftTxn.hash}`);
        setTimeout(() => {
          getAssets(currentAccount);
        }, 10000);
      } else {
        console.log('Ethereum object does not exist');
      }
    } catch (err) {
      console.log(err);
    }
  };

  const connectWalletButton = () => {
    return (
      <button
        onClick={connectWalletHandler}
        className='cta-button connect-wallet-button'
      >
        Connect Wallet
      </button>
    );
  };

  const mintNftButton = () => {
    return (
      <div>
        <button onClick={mintNftHandler} className='cta-button mint-nft-button'>
          Mint NFT With Random Rarities
        </button>
        <p>
          {isMinning
            ? 'please wait...'
            : transactionUrl && (
                <span>
                  Click{' '}
                  <a href={transactionUrl} target='_blank' rel='noreferrer'>
                    Here
                  </a>{' '}
                  to see transaction detail
                </span>
              )}
        </p>
        {currentAccount && (
          <div>
            <div className='account-text'>
              Account address: {currentAccount}
            </div>
            <Assets assets={assets} />
          </div>
        )}
      </div>
    );
  };

  useEffect(() => {
    checkWalletIsConnected();
  }, []);

  return (
    <div className='main-app'>
      <h1>Pokemon Card Collectible </h1>
      <div>{currentAccount ? mintNftButton() : connectWalletButton()}</div>
    </div>
  );
}

export default App;
