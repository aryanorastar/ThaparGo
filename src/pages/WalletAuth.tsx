import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { useToast } from '../hooks/use-toast';
import { useWeb3 } from '../providers/Web3Provider';
import { Loader2, AlertCircle, Wallet } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '../components/ui/alert';

const WalletAuth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { 
    account, 
    chainId, 
    isConnecting, 
    isConnected, 
    connectWallet, 
    switchToMumbai 
  } = useWeb3();

  // Mumbai Testnet Chain ID
  const MUMBAI_CHAIN_ID = 80001;

  // Redirect if already connected and on the right network
  useEffect(() => {
    if (isConnected && chainId === MUMBAI_CHAIN_ID) {
      navigate('/');
    }
  }, [isConnected, chainId, navigate]);

  const handleConnectWallet = async () => {
    try {
      await connectWallet();
    } catch (error) {
      console.error('Error connecting wallet:', error);
      toast({
        title: 'Connection Failed',
        description: 'Failed to connect wallet. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleSwitchNetwork = async () => {
    try {
      await switchToMumbai();
    } catch (error) {
      console.error('Error switching network:', error);
      toast({
        title: 'Network Switch Failed',
        description: 'Failed to switch to Mumbai network. Please try manually.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="container flex items-center justify-center min-h-[80vh] py-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Connect Wallet</CardTitle>
          <CardDescription>
            Connect your wallet to access ThaparGo Web3
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!window.ethereum && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>MetaMask Not Detected</AlertTitle>
              <AlertDescription>
                Please install MetaMask to use this application.
                <a 
                  href="https://metamask.io/download/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block mt-2 text-blue-600 hover:underline"
                >
                  Download MetaMask
                </a>
              </AlertDescription>
            </Alert>
          )}

          {isConnected && chainId !== MUMBAI_CHAIN_ID && (
            <Alert className="bg-yellow-50 border-yellow-200">
              <AlertCircle className="h-4 w-4 text-yellow-600" />
              <AlertTitle className="text-yellow-800">Wrong Network</AlertTitle>
              <AlertDescription className="text-yellow-700">
                Please switch to the Polygon Mumbai Testnet to continue.
              </AlertDescription>
            </Alert>
          )}

          {isConnected && (
            <div className="p-4 border rounded-lg bg-gray-50">
              <p className="text-sm font-medium text-gray-500">Connected Account</p>
              <p className="font-mono text-sm break-all">{account}</p>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          {!isConnected ? (
            <Button 
              onClick={handleConnectWallet} 
              className="w-full" 
              disabled={isConnecting || !window.ethereum}
            >
              {isConnecting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <Wallet className="mr-2 h-4 w-4" />
                  Connect Wallet
                </>
              )}
            </Button>
          ) : chainId !== MUMBAI_CHAIN_ID ? (
            <Button 
              onClick={handleSwitchNetwork} 
              className="w-full bg-yellow-600 hover:bg-yellow-700"
            >
              Switch to Mumbai Testnet
            </Button>
          ) : (
            <Button 
              onClick={() => navigate('/')} 
              className="w-full"
            >
              Continue to App
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default WalletAuth;
