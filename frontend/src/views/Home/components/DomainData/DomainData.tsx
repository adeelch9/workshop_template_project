import { ForwardArrowIcon, HeartIcon, RedCheckIcon } from "components/Icons";
import styled from "styled-components";
import { useEffect, useState } from "react";

const DomainDataWrapper = styled.div`
    width : 100%;
    display : flex;
    flex-direction : column;
    justify-content : center;
    fons-size : 16px;
    font-family : 'Roboto', sans-serif;
    align-items : center;
    border-radius : 6px;
    margin-bottom : 30px;
    
    & .card-holder{
        width : 100%;
        display : flex;
        flex-direction : row;
    background-color : #fff;

    }

    & .domain-card{
        display : flex;
        flex-direction : column;
        padding: 24px 8px;
        border : 1px solid #eaeaea;
        text-align : center;
        min-width : 132px;
    }
    & .active-domain-card{
        display : flex;
        flex-direction : column;
        padding: 24px 8px;
        border : 1px solid #eaeaea;
        text-align : center;
        min-width : 132px;
        box-shadow: rgb(228, 229, 234) 0px 0px 0px 1px, rgb(13, 103, 254) 0px -4px 0px inset;
        background-color: rgb(240, 245, 255) !important;
    }

    & .extension-name{
        font-family: Inter, sans-serif;
        font-weight: 700;
        font-size: 20px;
        line-height: 1.5;
        margin-bottom : 10px;
        display : flex;
        justify-content : center;
        align-items : center;
        margin : 0;
    }

    & .extension-price{
        font-family: Inter, sans-serif;
        font-weight: 400;
        font-size: 16px;
        display : flex;
        justify-content : center;
        align-items : center;
        margin : 0;
        & svg{
            margin-right : 10px;
        }
    }

    & .domain-card:hover{
        box-shadow: rgb(228, 229, 234) 0px 0px 0px 1px, rgb(13, 103, 254) 0px -4px 0px inset;
        background-color: rgb(240, 245, 255) !important;
    }

    & .mint-button{
        width : 140px;
        height : 40px;
        background-color: rgb(56,136,255);
        border-radius: 10px;
        border: none;
        color: #fff;
        font-family : 'Roboto', sans-serif;
        font-size: 17px;
        cursor: pointer;
        margin :0 10px;
    }

    & .forward-icon{
        margin: 0 0 5px 0 ;
    }
    & .forward-icon-text{
            color: rgb(56,136,255);
            font-size: 18px;
            font-weight: 600;
            line-height: 1.5;
            font-family: Inter, sans-serif;
            margin : 0;
    }

    & .extension-details-box{
        width : 100%;
        display : flex;
        flex-direction : column;
        justify-content : center;
        margin-top : 20px;


    }

    & .extension-details{
        background-color : #fff;
        display : flex;
        flex-direction : row;
        justify-content : space-between;
        border-radius : 8px;
        width : 70%;
        margin-bottom: 10px;
    }

    & .detail-card{
        display : flex;
        flex-direction : row;
        justify-content : center;
        align-items : center;
        padding : 12px 24px;

        & svg{
            margin-right : 10px;
        }
    }

    & .user-domain{
        font-family: Inter, sans-serif;
        font-weight: 700;
        font-size: 18px;
        
        & p{
            margin: 0 ;

        }

        & span{
            font-family: Inter, sans-serif;
            font-weight: 300;
            font-size: 18px;
        }

        & .status{
            background: rgb(54, 171, 97);
            text-transform: uppercase;
            font-size: 12px;
            font-weight: 700;
            color: #fff;
            text-align: center;
            padding: 8px 5px;
            border-radius: 8rem;
            margin-top: 5px;
            width: 80px;
        }
    }

    & .flex-row{
        display : flex;
        flex-direction : row;
        justify-content : center;
        align-items : center;
    }

    & .domain-extension-price{
        margin : 0 10px;
        font-family: Inter, sans-serif;
        font-weight: 400;
        font-size: 18px;
    }

`
type DomainDataProps = {
    activeTab: number;
    setActiveTab: (activeTab: number) => void;
}

const DomainData = ({activeTab, setActiveTab}:DomainDataProps) => {

    const [activeDomain, setActiveDomain] = useState(0);
    const [resultTabs, setResultTabs] = useState(0);

    useEffect(() => {
        setResultTabs(activeTab)
    },[activeTab])

    useEffect(() => {
        setActiveTab(resultTabs)
    },[resultTabs])


    const domainExtensionData = [
        {
            domainName: 'wallet',
            price: '40',
            id: 0,
        },
        {
            domainName: 'x',
            price: '40',
            id: 1,

        },
        {
            domainName: 'polygon',
            price: '40',

            id: 2,
        },
        {
            domainName: 'dao',
            price: '40',
            id: 3,
        },
        {
            domainName: '888',
            price: '40',
            id: 4,
        },
        {
            domainName: 'zil',
            price: '40',
            id: 5,
        },
        {
            domainName: 'bitcoin',
            id: 6,
            price: '400',
        },
    ]


    return (
        <DomainDataWrapper>

          { resultTabs === 0 &&  <div className="card-holder">
                {domainExtensionData.map((item, index) => (
                    <>
                        <div className={activeDomain === item.id ? 'active-domain-card' : "domain-card"} onClick={() => setActiveDomain(item.id)} >
                            <p className="extension-name">.{item.domainName}</p>
                            <p className="extension-price"><RedCheckIcon /> <span>${item.price}</span>  </p>
                        </div>
                        {index === domainExtensionData.length - 1 && <div className="domain-card" onClick={() => setResultTabs(1)} >
                            <p className="forward-icon"><ForwardArrowIcon /> </p>
                            <p className="forward-icon-text">All Endings </p>
                        </div>
                        }
                    </>
                ))}
            </div>}


         {  resultTabs === 0 &&  <div className="extension-details-box">
                <div className="extension-details">
                    <div className="detail-card">
                        <RedCheckIcon />
                        <div className="user-domain">
                            <p>name<span>.{domainExtensionData[activeDomain].domainName}
                            </span></p>
                            <p className="status">Available</p>
                        </div>
                    </div>

                    <div className="flex-row">
                        <p className="domain-extension-price">
                            ${domainExtensionData[activeDomain].price}
                        </p>
                        <HeartIcon />
                        <button className="mint-button">Mint</button>
                    </div>
                </div>
            </div>}

            {(resultTabs === 1) && <div className="extension-details-box">
                {domainExtensionData.map((item, index) => (
                    <div className="extension-details">
                        <div className="detail-card">
                            <RedCheckIcon />
                            <div className="user-domain">
                                <p>name<span>.{item.domainName}
                                </span></p>
                                <p className="status">Available</p>
                            </div>
                        </div>

                        <div className="flex-row">
                            <p className="domain-extension-price">
                                ${item.price}
                            </p>
                            <HeartIcon />
                            <button className="mint-button">Mint</button>
                        </div>
                    </div>
                ))}

            </div>}
        </DomainDataWrapper>)

}

export default DomainData;