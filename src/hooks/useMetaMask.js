import React, {useState, useEffect, useMemo, useCallback} from "react";
import {injected} from '../components/wallet/connectors';
import {useWeb3React} from '@web3-react/core';

export const MetaMaskContext = React.createContext(null);

export const MetaMaskProvider = ({children}) => {

    const { activate, account, library, connector, active, deactivate } = useWeb3React();

    const [ isActive, setIsActive ] = useState(false);
    const [shouldDisable, setShouldDisable] = useState(false);
    const [ isLoading, setIsLoading ] = useState(false);

    // Init loading
    useEffect(()=>{
        connect().then(val => {
            setIsLoading(false);
        })
    }, []);

    // Connect to MetaMask wallet
    const connect = async ()=>{
        console.log('Connecting to MetaMask...');
        setShouldDisable(true)
        try {
            await activate(injected).then(()=>{
                setShouldDisable(false)
            });
        } catch (error) {
            console.log('Error on connecting: ', error);
        }
    }

    // Disconnect from MetaMask wallet
    const disconnect = async () => {
        console.log('Disconnecting wallet from App...');
        try {
            await deactivate();
        } catch (error) {
            console.log('Error on disconnect: ', error);
        }
    }

    // Check when App is connected or disconnected to MetaMask
    const handleIsActive = useCallback(()=>{
        console.log('App is connected with metamask ', active);
        setIsActive(active);
    }, [active]);

    useEffect(()=>{
        handleIsActive()
    }, [handleIsActive])

    const values = useMemo(
        () => ({
            isActive,
            account,
            isLoading,
            connect,
            disconnect,
            shouldDisable,
        }),
        [isActive, isLoading, shouldDisable, account]
    )

    return <MetaMaskContext.Provider value={values}>{children}</MetaMaskContext.Provider>
}

export default function useMetaMask() {
    const context = React.useContext(MetaMaskContext);

    if(context === undefined) {
        throw new Error('useMetaMask hook must be used with a MetaMaskProvider component');
    }

    return context;
}