import React, { FC, useState } from "react";
import Box from "@mui/material/Box";
import { navigations } from "./navigation.data";
import { Link } from "@mui/material";
import { useLocation } from "react-router-dom";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

type NavigationData = {
  path: string;
  label: string;
};

// Phantom Wallet connection function
const connectWallet = async (setWalletAddress: React.Dispatch<React.SetStateAction<string | null>>) => {
  const { solana } = window as any;  // Temporary workaround for TypeScript

  if (solana && solana.isPhantom) {
    try {
      const wallet = await solana.connect();
      const publicKey = wallet.publicKey.toString();
      setWalletAddress(publicKey);
      console.log(`Connected wallet: ${publicKey}`);
    } catch (err) {
      console.error('Phantom wallet connection failed', err);
    }
  } else {
    alert('Phantom Wallet not found. Please install it.');
  }
};

// Function to disconnect wallet (reset state)
const disconnectWallet = (setWalletAddress: React.Dispatch<React.SetStateAction<string | null>>) => {
  setWalletAddress(null);  // Reset the wallet address
  console.log('Wallet disconnected');
};

const Navigation: FC = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  // State to hold the connected wallet address
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  // Function to truncate wallet address (first 3 and last 3 characters)
  const truncateAddress = (address: string) => {
    return `${address.slice(0, 3)}...${address.slice(-3)}`;
  };

  // Handler for connect/disconnect logic based on whether the wallet is connected
  const handleWalletButtonClick = () => {
    if (walletAddress) {
      // If already connected, disconnect wallet
      disconnectWallet(setWalletAddress);
    } else {
      // If not connected, connect wallet
      connectWallet(setWalletAddress);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexFlow: "wrap",
        justifyContent: "end",
        flexDirection: { xs: "column", lg: "row" }
      }}
    >
      {navigations.map(({ path: destination, label }: NavigationData) => (
        <Box
          key={label}
          component={Link}
          href={destination}
          sx={{
            display: "inline-flex",
            position: "relative",
            color: currentPath === destination ? "" : "white",
            lineHeight: "30px",
            letterSpacing: "3px",
            cursor: "pointer",
            textDecoration: "none",
            textTransform: "uppercase",
            fontWeight: 700,
            alignItems: "center",
            justifyContent: "center",
            px: { xs: 0, lg: 3 },
            mb: { xs: 3, lg: 0 },
            fontSize: "20px",
            ...destination === "/" && { color: "primary.main" },
            "& > div": { display: "none" },
            "&.current>div": { display: "block" },
            "&:hover": {
              color: "text.disabled"
            }
          }}
        >
          <Box
            sx={{
              position: "absolute",
              top: 12,
              transform: "rotate(3deg)",
              "& img": { width: 44, height: "auto" }
            }}
          >
            {/* eslint-disable-next-line */}
            <img src="/images/headline-curve.svg" alt="Headline curve" />
          </Box>
          {label}
        </Box>
      ))}

      {/* Connect/Disconnect Wallet button */}
      <Box
        sx={{
          position: "relative",
          color: "white",
          cursor: "pointer",
          textDecoration: "none",
          textTransform: "uppercase",
          fontWeight: 600,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          px: { xs: 0, lg: 3 },
          mb: { xs: 3, lg: 0 },
          fontSize: "24px",
          lineHeight: "6px",
          width: "324px",
          height: "45px",
          borderRadius: "6px",
          backgroundColor: "#00dbe3"
        }}
        onClick={handleWalletButtonClick}  // Connect/Disconnect onClick handler
      >
        {walletAddress ? (
          <>
            <CheckCircleIcon sx={{ color: "green", marginRight: "8px" }} />
            {truncateAddress(walletAddress)}
          </>
        ) : (
          "Connect Wallet"
        )}
      </Box>
    </Box>
  );
};

export default Navigation;
