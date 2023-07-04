import { useState } from 'react'
import { toast } from "react-toastify";
import { connectKeplr } from '../services/keplr'
import { SigningCosmWasmClient, CosmWasmClient } from '@cosmjs/cosmwasm-stargate'

import {
  convertMicroDenomToDenom,
  convertDenomToMicroDenom,
  convertFromMicroDenom
} from '../util/conversion'

import {
  NEXT_PUBLIC_CHAIN_RPC_ENDPOINT,
  NEXT_PUBLIC_CHAIN_REST_ENDPOINT,
  NEXT_PUBLIC_CHAIN_ID,
  NEXT_PUBLIC_STAKING_DENOM,
  NEXT_PUBLIC_COINFLIP_CONTRACT
} from '../config'
import { NotificationManager } from 'react-notifications'
// import { create } from 'ipfs-http-client'
import { coin } from '@cosmjs/launchpad'

// import { useNotification } from '../components/Notification'

export const PUBLIC_CHAIN_RPC_ENDPOINT = NEXT_PUBLIC_CHAIN_RPC_ENDPOINT || ''
export const PUBLIC_CHAIN_REST_ENDPOINT = NEXT_PUBLIC_CHAIN_REST_ENDPOINT || ''
export const PUBLIC_CHAIN_ID = NEXT_PUBLIC_CHAIN_ID || ''
export const PUBLIC_STAKING_DENOM = NEXT_PUBLIC_STAKING_DENOM || 'ustars'
export const PUBLIC_COINFLIP_CONTRACT = NEXT_PUBLIC_COINFLIP_CONTRACT || ''

export const defaultFee = {
  amount: [],
  gas: "400000",
}

export const useSigningCosmWasmClient = () => {
  const [client, setClient] = useState(null)
  const [signingClient, setSigningClient] = useState(null)

  const [walletAddress, setWalletAddress] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)

  const [nativeBalanceStr, setNativeBalanceStr] = useState('')
  const [nativeBalance, setNativeBalance] = useState(0)
  
  // const { success: successNotification, error: errorNotification } = useNotification()

  ////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////
  ///////////////////////    connect & disconnect   //////////////////////
  ////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////

  const showNotification = false;
  const notify = (flag, str) => {
    if (!showNotification)
      return;

    if (flag)
      NotificationManager.success(str)
    else
      NotificationManager.error(str)
  }
  const connectWallet = async (inBackground) => {
    if (!inBackground)
      setLoading(true)

    try {
      await connectKeplr()

      // enable website to access kepler
      await (window).keplr.enable(PUBLIC_CHAIN_ID)

      // get offline signer for signing txs
      const offlineSigner = await (window).getOfflineSignerOnlyAmino(
        PUBLIC_CHAIN_ID
      )

      // make client
      setClient(
        await CosmWasmClient.connect(PUBLIC_CHAIN_RPC_ENDPOINT)
      )

      // make client
      setSigningClient(
        await SigningCosmWasmClient.connectWithSigner(
          PUBLIC_CHAIN_RPC_ENDPOINT,
          offlineSigner
        )
      )

      // get user address
      const [{ address }] = await offlineSigner.getAccounts()
      setWalletAddress(address)

      localStorage.setItem("address", address)

      if (!inBackground) {
        setLoading(false)
        notify(true, "Connected Successfully")
      }
    } catch (error) {
      notify(false, `Connect error : ${error}`)
      if (!inBackground) {
        setLoading(false)
      }
    }
  }

  const disconnect = () => {
    if (signingClient) {
      localStorage.removeItem("address")
      signingClient.disconnect()

    }
    setIsAdmin(false)
    setWalletAddress('')
    setSigningClient(null)
    setLoading(false)
    notify(true, `Disconnected successfully`)
  }

  ////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////
  ///////////////////////    global variables    /////////////////////////
  ////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////

  const getBalances = async () => {
    setLoading(true)
    try {
      const objectNative = await signingClient.getBalance(walletAddress, PUBLIC_STAKING_DENOM)
      setNativeBalanceStr(`${convertMicroDenomToDenom(objectNative.amount)} ${convertFromMicroDenom(objectNative.denom)}`)
      setNativeBalance(convertMicroDenomToDenom(objectNative.amount))
      setLoading(false)
      notify(true, `Successfully got balances`)
    } catch (error) {
      setLoading(false)
      notify(false, `GetBalances error : ${error}`)
    }
  }

  return {
    walletAddress,
    signingClient,
    loading,
    error,
    connectWallet,
    disconnect,
    client,
    isAdmin,

    getBalances,
    nativeBalanceStr,
    nativeBalance
  }
}
