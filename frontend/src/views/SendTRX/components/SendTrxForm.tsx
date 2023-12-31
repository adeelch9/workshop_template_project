import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { useForm, SubmitHandler } from "react-hook-form"
import { useAppLoader } from 'state/loading/hooks/useAppLoader';
import { useTronWalletAddress, useUserActionHandlers } from "../../../state/user/hooks";
import { toast } from "react-toastify";
import { getWalletTrxBalance } from 'utils/web3/getWalletTrxBalance'
import sweetAlertService from 'utils/SweetAlertServices/sweetAlertServices';
import { getUserBandwidth } from 'utils/web3/getWalletBandwidth';
import { getUserTransactions } from 'utils/web3/getWalletTransactions';
import { getOwner } from 'contract/tnsContractInteraction';
import { isValidTronAddress } from 'utils/isValidAddress';
interface IFormInput {
  sendersAdress: string
  recieverAddress: string
  amount: number
}

const SendTrxForm = () => {

  const walletBalance = getWalletTrxBalance()
  const { hideLoader, showLoader } = useAppLoader();

  const walletAddress = useTronWalletAddress();
  const { onUpdateTronWalletAddress } = useUserActionHandlers();

  const DomainRegex = /\.(dao|tron|trx)$/;

  const [recieverAddress, setRecieverAddress] = useState('');
  const [amount, setAmount] = useState(0);
  const [senderWalletAddress, setSenderWalletAddress] = useState('');
  const [userBandwidth, setUserBandwidth] = useState(0);
  const [transactions, setTransactions] = useState(0)
  const [estimatedTrx, setEstimatedTrx] = useState(0)

  useEffect(() => {
    const fetch = async () => {
      if (!walletAddress) return
      const bandwidth = await getUserBandwidth(walletAddress)
      setUserBandwidth(bandwidth)
    }
    fetch()
  }, [walletAddress])

  useEffect(() => {
    const fetch = async () => {
      if (recieverAddress.length < 34) return
      const transactions = await getUserTransactions(recieverAddress)
      if (transactions) setTransactions(transactions.length)
    }
    fetch()
  }, [recieverAddress])

  useEffect(() => {
    if (userBandwidth < 268) {
      setEstimatedTrx(0.002);
    } else {
      if (transactions <= 0) {
        setEstimatedTrx(0.002 + 0.1);
      } else {
        setEstimatedTrx(0.002);
      }
    }
  }, [userBandwidth, transactions]);

  useEffect(() => {
    setSenderWalletAddress(walletAddress)
  }, [walletAddress]);


  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<IFormInput>();


  const submitHandler: SubmitHandler<IFormInput> = async (data) => {
    event.preventDefault();
    showLoader();
    const { recieverAddress, amount } = data;

    let trans;

    if (recieverAddress.includes(".dao") || recieverAddress.includes(".tron") || recieverAddress.includes(".trx")) {
      try {
        if (!DomainRegex.test(recieverAddress)) {
          hideLoader();
          sweetAlertService.showErrorAlert("Error", "Invalid domain name");
          return;
        }

        const ownerAddress = await getOwner(recieverAddress);
        const fromHex = await window.tronWeb.address.fromHex(ownerAddress);
        console.log(fromHex);
        if (fromHex === walletAddress) {
          hideLoader();
          sweetAlertService.showErrorAlert("Transaction Failed", "Cannot send TRX to same account");
          return;
        }

        trans = await window.tronWeb.transactionBuilder.sendTrx(fromHex, amount * Math.pow(10, 6), walletAddress);
        const sign = await window.tronWeb.trx.sign(trans);
        const transaction = await window.tronWeb.trx.sendRawTransaction(sign);

      } catch (error: any) {
        hideLoader();
        sweetAlertService.showErrorAlert("Transaction Failed", "No address found on the entered domain");
        return;
      }

    } else {
      try {
        const isValid = await isValidTronAddress(recieverAddress)
        if (!isValid) {
          hideLoader();
          sweetAlertService.showErrorAlert("Error", "Invalid wallet address");
          return;
        }

        trans = await window.tronWeb.transactionBuilder.sendTrx(recieverAddress, amount * Math.pow(10, 6), walletAddress);
        const sign = await window.tronWeb.trx.sign(trans);
        const transaction = await window.tronWeb.trx.sendRawTransaction(sign);

        hideLoader();
        sweetAlertService.showSuccesMessage("Transaction Successful", "Your TRX has been sent successfully");
      } catch (error: any) {
        hideLoader();
        sweetAlertService.showErrorAlert("Transaction Failed", error.message);
      }

      reset();
    }
  };

  const handleWalletConnect = () => {
    event.preventDefault();
    if (window.tronWeb && !window.tronWeb.ready) {
      toast('Please Unlock Tron Web First');
    } else if (window.tronWeb && window.tronWeb.ready) {
      const base58Address = window.tronWeb.defaultAddress.base58;
      if (base58Address) {
        onUpdateTronWalletAddress(base58Address);
      }
    } else {
      toast('Please Install Tron Web Extension.');
    }
  };

  return (
    <SendTrxFormWrapper>
      <div className='content-header'>
        <p>Send TRX </p>
        <p className='balance'> Balance: {walletBalance !== null ? walletBalance : "--"} TRX</p>
      </div>
      <form className='content-wrapper' onSubmit={handleSubmit(submitHandler)}>

        <div className='input-box'>
          <label>From</label>
          <div className='divider' />
          <input
            type='text'
            readOnly
            placeholder='Connect your wallet to send TRX'
            defaultValue={senderWalletAddress}
          />
        </div>
        <div className='input-box'>
          <label>To</label>
          <div className='divider' />
          <input
            type='text'
            placeholder='Enter reciever wallet address or domain name'
            {...register("recieverAddress", { required: true, onChange: (event) => setRecieverAddress(event.target.value) })}
          />
        </div>
        {errors.recieverAddress && <p className='error-text'>This field is required</p>}
        <div className='input-box'>
          <label>Amount</label>
          <div className='divider' />
          <input
            type='number'
            placeholder='3'
            {...register("amount", { required: true, onChange: (event) => setAmount(event.target.value) })}
          />
        </div>
        {errors.amount && <p className='error-text'>This field is required</p>}

        <div className='billing-details'>
          <div className=' expected-price-box flex-between '>
            <p>Estimated Energy Consumption</p>
            <span>{` 0`}</span>
          </div>
          <div className=' expected-price-box flex-between '>
            <p>Estimated Bandwidth Consumption</p>
            <span>{transactions === 0 ? "100" : `268`}</span>
          </div>
          <div className=' expected-price-box flex-between '>
            <p >Estimated TRX Consumption </p>
            <span>{`${estimatedTrx.toFixed(4)} TRX`}</span>
          </div>
        </div>

        {walletAddress ? (
          <button className='submit-button' type='submit'>
            Send
          </button>
        ) : (
          <button className='submit-button' type='button' onClick={handleWalletConnect}>
            Connect wallet to send TRX
          </button>
        )}
      </form>

    </SendTrxFormWrapper>
  )
}

export default SendTrxForm


const SendTrxFormWrapper = styled.div`

padding: 26px 30px ;
box-shadow: 0 10px 20px rgba(0,0,0,.1);
background-color: #fff;
background: linear-gradient(to bottom right, #6699FF 0%, #FFFFFF 45%);
border-radius:10px;
font-family : 'Roboto', sans-serif;
min-width: 700px;

.content-header{
  display:flex;
  flex-direction:row;
  justify-content:space-between;
  align-items:center;
}

.balance{
  margin: 0;
  font-weight: 400;
  font-size: 14px;
  text-align: center;

}

.input-box{
    display:flex;
    flex-direction:row;
    align-items:center;
    justify-content:center;
    background-color: rgb(241,243,243);
    border-radius: 5px;
    padding: 15px;
    margin-bottom: 10px;
    label{
      font-weight: 400;
      font-size: 14px;
      line-height: 20px;
      min-width: 50px;
        display:flex;
        justify-content:center;
    }

    input{
      outline: none;
      border: none;
      margin-right: 10px;
      font-size: 14px;
      font-weight: 600;
      background-color: transparent;
      height: 30px;
      width: -webkit-fill-available;
    }
    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;  
    }
    input::placeholder {
      color: rgba(200, 200, 200, 1);
    }

    /* Firefox */
    input[type=number] {
      -moz-appearance: textfield;
    }

    span{
      font-weight: 400;
      font-size: 14px;
    }


    & .divider{
        width: 1px;
        height: 30px;
        background-color: rgba(0,0,0,.1);
        margin: 0 10px;
    }

  }

  .flex-between{
    display:flex;
    flex-direction:row;
    align-items:center;
    justify-content:space-between;
    }
  .border-bottom{
    border-bottom: 1px solid  #fff;
  }

  .billing-details{
    padding: 12px 20px;
    background-color: rgb(241,243,243);
    border-radius: 8px;
    margin-top: 20px;
  }


  .expected-price-box{
    display:flex;
    flex-direction:row;
    align-items:center;
    padding: 10px 0;

    img{
      filter: brightness(0) saturate(100%) invert(48%) sepia(90%) saturate(637%) hue-rotate(195deg) brightness(102%) contrast(107%);
      margin-right: 10px;
  }
  p{
    font-weight: 400;
    font-size: 12px;
    line-height: 17px;
    color: 	#5A5A5A;
    margin:0;
  }
  span{
    font-weight: 600;
    font-size: 12px;
  }
  }


.submit-button{
    width: 100%;
    margin-top:25px;
    padding: 10px 15px;
    border-radius: 8px;
    border:none;
    background: linear-gradient(90deg , rgba(56, 136, 255, 1) , #fff);
    color:#fff;
    font-weight: 500;
    text-align: center;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.3s ease-in-out;
  }
  .submit-button:hover{
    color: #5a5a5a
  }

  .error-text{
    font-size: 12px;
    font-weight: 500;
    color:red;
    margin:0 0 10px 
  }`