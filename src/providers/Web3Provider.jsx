import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import * as ethers from 'ethers';
import { useToast } from '../hooks/use-toast';


const Web3Context = createContext<Web3ContextType>({
  account,
  chainId,
  provider,
  signer,
  isConnecting,
  isConnected,
  connectWallet () => {},
  disconnectWallet() => {},
  switchToMumbai () => {},
});

export const useWeb3 = () => useContext(Web3Context);


export const Web3Provider = ({ children }) => {
  const [account, setAccount] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const { toast } = useToast();

  // Mumbai Testnet Chain ID
  const MUMBAI_CHAIN_ID = '0x13881';
  const MUMBAI_CHAIN_ID_DECIMAL = 80001;

  // Check if MetaMask is installed
  const isMetaMaskInstalled = () => {
    return typeof window !== 'undefined' && window.ethereum !== undefined;
  };

  // Initialize provider on component mount
  useEffect(() => {
    if (isMetaMaskInstalled()) {
      const ethereum = window.ethereum;
      const ethProvider = new ethers.BrowserProvider(ethereum);
      setProvider(ethProvider);

      // Check if user was previously connected
      const checkConnection = async () => {
        try {
          const accounts = await ethereum.request({ method'eth_accounts' });
          if (accounts.length > 0) {
            const ethSigner = await ethProvider.getSigner();
            setAccount(accounts[0]);
            setSigner(ethSigner);
            setIsConnected(true);

            // Get current chain ID
            const networkChainId = await ethereum.request({ method'eth_chainId' });
            setChainId(parseInt(networkChainId, 16));
          }
        } catch (error) {
          console.error('Error checking connection:', error);
        }
      };

      checkConnection();

      // Setup event listeners
      const handleAccountsChanged = (accounts) => {
        if (accounts.length === 0) {
          // User disconnected
          setAccount(null);
          setSigner(null);
          setIsConnected(false);
          toast({
            title: 'Wallet Disconnected',
            description: 'Your wallet has been disconnected.',
            variant: 'destructive',
          });
        } else {
          // Account changed
          setAccount(accounts[0]);
          toast({
            title: 'Account Changed',
            description: `Connected to ${accounts[0].substring(0, 6)}...${accounts[0].substring(38)}`,
          });
        }
      };

      const handleChainChanged = (chainIdHex) => {
        const newChainId = parseInt(chainIdHex, 16);
        setChainId(newChainId);
        
        if (newChainId !== MUMBAI_CHAIN_ID_DECIMAL) {
          toast({
            title: 'Network Changed',
            description: 'Please connect to Polygon Mumbai Testnet for this application.',
            variant: 'destructive',
          });
        } else {
          toast({
            title: 'Network Changed',
            description: 'Connected to Polygon Mumbai Testnet',
          });
        }
        
        // Reload the page to avoid any state inconsistencies
        window.location.reload();
      };

      ethereum.on('accountsChanged', handleAccountsChanged);
      ethereum.on('chainChanged', handleChainChanged);

      // Cleanup event listeners
      return () => {
        if (ethereum.removeListener) {
          ethereum.removeListener('accountsChanged', handleAccountsChanged);
          ethereum.removeListener('chainChanged', handleChainChanged);
        }
      };
    }
  }, []);

  // Connect wallet function
  const connectWallet = async () => {
    if (!isMetaMaskInstalled()) {
      toast({
        title: 'MetaMask Not Installed',
        description: 'Please install MetaMask to use this application.',
        variant: 'destructive',
      });
      return;
    }

    setIsConnecting(true);

    try {
      const ethereum = window.ethereum;
      const accounts = await ethereum.request({ method'eth_requestAccounts' });
      
      if (accounts.length > 0) {
        const ethProvider = new ethers.BrowserProvider(ethereum);
        const ethSigner = await ethProvider.getSigner();
        
        setAccount(accounts[0]);
        setProvider(ethProvider);
        setSigner(ethSigner);
        setIsConnected(true);

        // Get current chain ID
        const networkChainId = await ethereum.request({ method'eth_chainId' });
        const currentChainId = parseInt(networkChainId, 16);
        setChainId(currentChainId);

        // Check if on Mumbai network
        if (networkChainId !== MUMBAI_CHAIN_ID) {
          toast({
            title: 'Wrong Network',
            description: 'Please switch to Polygon Mumbai Testnet.',
            variant: 'destructive',
          });
        } else {
          toast({
            title: 'Wallet Connected',
            description: `Connected to ${accounts[0].substring(0, 6)}...${accounts[0].substring(38)}`,
          });
        }
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
      toast({
        title: 'Connection Failed',
        description: 'Failed to connect wallet. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsConnecting(false);
    }
  };

  // Disconnect wallet function
  const disconnectWallet = () => {
    setAccount(null);
    setSigner(null);
    setIsConnected(false);
    toast({
      title: 'Wallet Disconnected',
      description: 'Your wallet has been disconnected.',
    });
  };

  // Switch to Mumbai network
  const switchToMumbai = async () => {
    if (!isMetaMaskInstalled() || !provider) {
      toast({
        title: 'MetaMask Not Available',
        description: 'Please install MetaMask or connect your wallet first.',
        variant: 'destructive',
      });
      return;
    }

    try {
      const ethereum = window.ethereum;
      
      // Try to switch to Mumbai network
      try {
        await ethereum.request({
          method'wallet_switchEthereumChain',
          params[{ chainId_CHAIN_ID }],
        });
      } catch (switchError) {
        // This error code indicates that the chain has not been added to MetaMask
        if (switchError.code === 4902) {
          await ethereum.request({
            method'wallet_addEthereumChain',
            params[
              {
                chainId_CHAIN_ID,
                chainName'Polygon Mumbai Testnet',
                nativeCurrency{
                  name'MATIC',
                  symbol'MATIC',
                  decimals18,
                },
                rpcUrls['https://rpc-mumbai.maticvigil.com/'],
                blockExplorerUrls['https://mumbai.polygonscan.com/'],
              },
            ],
          });
        } else {
          throw switchError;
        }
      }
      
      // Update chain ID after successful switch
      const networkChainId = await ethereum.request({ method'eth_chainId' });
      setChainId(parseInt(networkChainId, 16));
      
      toast({
        title: 'Network Switched',
        description: 'Successfully connected to Polygon Mumbai Testnet.',
      });
    } catch (error) {
      console.error('Error switching network:', error);
      toast({
        title: 'Network Switch Failed',
        description: 'Failed to switch to Mumbai network. Please try manually.',
        variant: 'destructive',
      });
    }
  };

  const value = {
    account,
    chainId,
    provider,
    signer,
    isConnecting,
    isConnected,
    connectWallet,
    disconnectWallet,
    switchToMumbai,
  };

  return <Web3Context.Provider value={value}>{children}</Web3Context.Provider>;
};

// Add this to your global.d.ts or a similar type declaration file
declare global {
  interface Window {
    ethereum;
  }
}
