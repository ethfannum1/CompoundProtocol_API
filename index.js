
// --------------------------------------------------------------------------------------------------------------
/* 
Primero:

Se instala en la carpeta del código, la librería web3.js.
Install the dependencies in the local node_modules folder.

Ver la ayuda: poner esta URL local en el navegador:
file:///C:/Program%20Files/nodejs/node_modules/npm/docs/public/cli-commands/npm-install/index.html


Ejecutar dentro de la carpeta de código: "npm i web3"
Esto crea:
    - la carpeta "node_modules"
    - package-lock.json

*/


// Este archivo JS se puede llamar como se quiera: app.js , main.js , ...

// --------------------------------------------------------------------------------------------------------------


// Primero hay que crear una instancia de la librería Web3, para poderla usar.

// Requerimos el módulo web3 que está en la carpeta "node_modules" que está instalada previamente en la misma carpeta de código donde está este JS.
const Web3 = require('web3'); /* Web3 es una clase */

// Instanciar el objeto Web3.
// Se le pasa la URL de un nodo de ETH, en este caso de Infura, que nos sirve de puerta de entrada a la blockchain.
const web3 = new Web3('PUT HERE YOUR INFURA WSS ADDRESS NODE TO CONNECT TO THE BLOCKCHAIN'); // wss = web socket secure // Red Ropsten.

/* 
Se van a hacer solicitudes GET y SET a los contratos de Compound.
Para las GET, que no modifican el estado de los contratos, no se necesita una wallet.
Pero para las SET, que sí modifican el estado de los contratos, se necesita una wallet.
Wallet en este caso de Ropsten.

Uso esta:
public key: 0x9FE1B3221940B4fff0bE36a069CD93D58D3C7885
private key: 06a6959d9e714c282fea14ec2d6f69ec2f81f256f041bd3c0692b06dba82538c 
*/
const private_key = 'PUT HERE YOUR OWN PRIVATE KEY';

/*
    https://web3js.readthedocs.io/en/v1.2.1/web3-eth-accounts.html#wallet    

    web3.eth.accounts.wallet;
    Contains an in memory wallet with multiple accounts.
*/

/*  Añade la private key a la wallet en memoria, creando una address en esa wallet.
    Adds an account using a private key or account object to the wallet.
    https://web3js.readthedocs.io/en/v1.2.1/web3-eth-accounts.html#wallet-add 
*/
web3.eth.accounts.wallet.add('0x' + private_key);

// Mostramos en pantalla la address creada dentro de la wallet
// codigo1.bmp
console.log(web3.eth.accounts.wallet[0]);

/*  Ahora guardar en una variable la address pública.
    Se puede hacer a mano copiándola de arriba, o se puede hacer usando la API de web3:
*/
const public_key = web3.eth.accounts.wallet[0].address;

// Mostramos por pantalla la clave pública.
console.log(public_key);


/*  Contract cETH (Ropsten)

    Vamos a depositar ETHs, y por tanto necesitamos interactuar dentro del protocolo de Compound, con el contrato específico de cETH.

    Vamos a llamar a funciones del contrato Compound: necesitamos instanciar ese contrato.
    Necesitamos:
        - el ABI del contrato (es un JSON que es la interfaz que nos informa de las características del contrato: funciones, parámetros, retornos, propiedades, ...)
        - la address del contrato
*/

/*  ABI del contrato.
    
*/
const contractABI = [{"inputs":[{"internalType":"contract ComptrollerInterface","name":"comptroller_","type":"address"},{"internalType":"contract InterestRateModel","name":"interestRateModel_","type":"address"},{"internalType":"uint256","name":"initialExchangeRateMantissa_","type":"uint256"},{"internalType":"string","name":"name_","type":"string"},{"internalType":"string","name":"symbol_","type":"string"},{"internalType":"uint8","name":"decimals_","type":"uint8"},{"internalType":"address payable","name":"admin_","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"cashPrior","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"interestAccumulated","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"borrowIndex","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"totalBorrows","type":"uint256"}],"name":"AccrueInterest","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"borrower","type":"address"},{"indexed":false,"internalType":"uint256","name":"borrowAmount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"accountBorrows","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"totalBorrows","type":"uint256"}],"name":"Borrow","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"error","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"info","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"detail","type":"uint256"}],"name":"Failure","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"liquidator","type":"address"},{"indexed":false,"internalType":"address","name":"borrower","type":"address"},{"indexed":false,"internalType":"uint256","name":"repayAmount","type":"uint256"},{"indexed":false,"internalType":"address","name":"cTokenCollateral","type":"address"},{"indexed":false,"internalType":"uint256","name":"seizeTokens","type":"uint256"}],"name":"LiquidateBorrow","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"minter","type":"address"},{"indexed":false,"internalType":"uint256","name":"mintAmount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"mintTokens","type":"uint256"}],"name":"Mint","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"oldAdmin","type":"address"},{"indexed":false,"internalType":"address","name":"newAdmin","type":"address"}],"name":"NewAdmin","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"contract ComptrollerInterface","name":"oldComptroller","type":"address"},{"indexed":false,"internalType":"contract ComptrollerInterface","name":"newComptroller","type":"address"}],"name":"NewComptroller","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"contract InterestRateModel","name":"oldInterestRateModel","type":"address"},{"indexed":false,"internalType":"contract InterestRateModel","name":"newInterestRateModel","type":"address"}],"name":"NewMarketInterestRateModel","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"oldPendingAdmin","type":"address"},{"indexed":false,"internalType":"address","name":"newPendingAdmin","type":"address"}],"name":"NewPendingAdmin","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"oldReserveFactorMantissa","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"newReserveFactorMantissa","type":"uint256"}],"name":"NewReserveFactor","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"redeemer","type":"address"},{"indexed":false,"internalType":"uint256","name":"redeemAmount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"redeemTokens","type":"uint256"}],"name":"Redeem","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"payer","type":"address"},{"indexed":false,"internalType":"address","name":"borrower","type":"address"},{"indexed":false,"internalType":"uint256","name":"repayAmount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"accountBorrows","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"totalBorrows","type":"uint256"}],"name":"RepayBorrow","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"benefactor","type":"address"},{"indexed":false,"internalType":"uint256","name":"addAmount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"newTotalReserves","type":"uint256"}],"name":"ReservesAdded","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"admin","type":"address"},{"indexed":false,"internalType":"uint256","name":"reduceAmount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"newTotalReserves","type":"uint256"}],"name":"ReservesReduced","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"Transfer","type":"event"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"constant":false,"inputs":[],"name":"_acceptAdmin","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"reduceAmount","type":"uint256"}],"name":"_reduceReserves","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"contract ComptrollerInterface","name":"newComptroller","type":"address"}],"name":"_setComptroller","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"contract InterestRateModel","name":"newInterestRateModel","type":"address"}],"name":"_setInterestRateModel","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address payable","name":"newPendingAdmin","type":"address"}],"name":"_setPendingAdmin","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"newReserveFactorMantissa","type":"uint256"}],"name":"_setReserveFactor","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"accrualBlockNumber","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"accrueInterest","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"admin","outputs":[{"internalType":"address payable","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"balanceOfUnderlying","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"borrowAmount","type":"uint256"}],"name":"borrow","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"borrowBalanceCurrent","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"borrowBalanceStored","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"borrowIndex","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"borrowRatePerBlock","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"comptroller","outputs":[{"internalType":"contract ComptrollerInterface","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"exchangeRateCurrent","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"exchangeRateStored","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"getAccountSnapshot","outputs":[{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getCash","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"contract ComptrollerInterface","name":"comptroller_","type":"address"},{"internalType":"contract InterestRateModel","name":"interestRateModel_","type":"address"},{"internalType":"uint256","name":"initialExchangeRateMantissa_","type":"uint256"},{"internalType":"string","name":"name_","type":"string"},{"internalType":"string","name":"symbol_","type":"string"},{"internalType":"uint8","name":"decimals_","type":"uint8"}],"name":"initialize","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"interestRateModel","outputs":[{"internalType":"contract InterestRateModel","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"isCToken","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"borrower","type":"address"},{"internalType":"contract CToken","name":"cTokenCollateral","type":"address"}],"name":"liquidateBorrow","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[],"name":"mint","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"pendingAdmin","outputs":[{"internalType":"address payable","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"redeemTokens","type":"uint256"}],"name":"redeem","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"redeemAmount","type":"uint256"}],"name":"redeemUnderlying","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"repayBorrow","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"borrower","type":"address"}],"name":"repayBorrowBehalf","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[],"name":"reserveFactorMantissa","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"liquidator","type":"address"},{"internalType":"address","name":"borrower","type":"address"},{"internalType":"uint256","name":"seizeTokens","type":"uint256"}],"name":"seize","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"supplyRatePerBlock","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"totalBorrows","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"totalBorrowsCurrent","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalReserves","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"dst","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"src","type":"address"},{"internalType":"address","name":"dst","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"}];

// Address del contrato.
const contract_address = '0xbe839b6d93e3ea47effcca1f27841c917a8794f3'; 

// Instanciar el contrato.
const compound_cETH_contractinstance = new web3.eth.Contract(contractABI, contract_address); // https://web3js.readthedocs.io/en/v1.2.1/web3-eth-contract.html
// Mostrar en pantalla la instancia del contrato.
// console.log(compound_cETH_contractinstance);
    



// -----------------------------------------------------------------------
// Función de tipo GETTER: no hace falta firmar transacción. Métooo CALL.
// -----------------------------------------------------------------------

// -------------------------------------------------------------------------------------------------------------------------------------------------
// Función de tipo SETTER: hace falta firmar transacción. Cambia el estado del contrato (variables de estado = generales del contrato). Método SEND.
// -------------------------------------------------------------------------------------------------------------------------------------------------




// Función con la que operar:

const main = async () => {
    
    // ( 1 )

    // -----------------------------------------------------------------------------------------------------------------------------------
    /*  Función que dice el interés ganado, por cada bloque, por cada ETH metido.
        At any point in time one may query the contract to get the current supply rate per block.
        https://compound.finance/docs/ctokens#supply-rate 
    */
    let srpb;

    try {
        srpb = await compound_cETH_contractinstance.methods.supplyRatePerBlock().call(); // Devuelve resultado en weis.
    }
    catch(error) {
        console.log(error);
    } 
       
    // Convertir de weis a ETH.
    // https://web3js.readthedocs.io/en/v1.2.1/web3-utils.html#fromwei
    srpb = web3.utils.fromWei(srpb); // Por defecto es 'ether'

    // Mostrar en consola.
    console.log(srpb + 'ETH');
    // -----------------------------------------------------------------------------------------------------------------------------------



    // ( 2 )
    
    // Comento la función, porque cada vez que se llama, esta función transfiere desde mi address de Ropsten 1 ETH al cETH de Compound.

    // -----------------------------------------------------------------------------------------------------------------------------------
    /*  Función para transferir 1 ETH al contrato de cETH
        The mint function transfers an asset into the protocol, which begins accumulating interest based on the current Supply Rate for the asset. 
        https://compound.finance/docs/ctokens#mint 
    */
    // await compound_cETH_contractinstance.methods.mint().send({
        // from: public_key,

        /*  Compound informa del rango de gas que hay que poner para cada función:
            https://compound.finance/docs#gas-costs 
        */
        // gasLimit: web3.utils.toHex(200000), // https://web3js.readthedocs.io/en/v1.2.1/web3-utils.html#tohex

        /*  Precio del gas:
            https://ethgasstation.info/ 
        */
        // gasPrice: web3.utils.toHex(53000000000), 

        // value: web3.utils.toHex(web3.utils.toWei('1', 'ether')) // https://web3js.readthedocs.io/en/v1.2.1/web3-utils.html#towei
    // });
    // -----------------------------------------------------------------------------------------------------------------------------------



    // ( 3 )

    // -----------------------------------------------------------------------------------------------------------------------------------
    /*  Función que dice cuántos ETH podríamos sacar, con la cantidad de cETH que tenemos metidos en Compound. 
        The user's underlying balance, representing their assets in the protocol, is equal to the user's cToken balance multiplied by the Exchange Rate.
        https://compound.finance/docs/ctokens#underlying-balance
    */
    let bou;

    try {
        bou = await compound_cETH_contractinstance.methods.balanceOfUnderlying(public_key).call();
    }
    catch(error) {
        console.log(error);
    }

    bou = web3.utils.fromWei(bou); // bou = web3.utils.fromWei(bou).toString();

    console.log(bou + 'ETH');
    // -----------------------------------------------------------------------------------------------------------------------------------



    // ( 4 )
    
    // -----------------------------------------------------------------------------------------------------------------------------------
    /*  Función que dice cuántos cETH tenemos.
        Método propio de cualquier token ERC20: balanceOf

        function balanceOf(address _owner) constant returns (uint256 balance)
        Get the account balance of another account with address _owner.
    */    
    let bo;

    try {
        bo = await compound_cETH_contractinstance.methods.balanceOf(public_key).call();
    }
    catch(error) {
        console.log(error);        
    }
   
    // cETH tiene 8 decimales: dividir entre 8 para hallar su cantidad entera de cETH.
    bo = (bo / 1e8); // bo = (bo / 1e8).toString();

    console.log(bo + 'cETH');
    // -----------------------------------------------------------------------------------------------------------------------------------



    // ( 5 )

    // -----------------------------------------------------------------------------------------------------------------------------------
    /*  Función que dice el ratio de intercambio actual. 
        Qué cantidad de ETH equivale a 1 cETH.
        Esta cantidad irá aumentando a medida que se vayan minando bloques, por tanto cada vez podremos sacar más ETH por los cETH metidos.
        The current exchange rate as an unsigned integer, scaled by 1e18.
        https://compound.finance/docs/ctokens#exchange-rate
    */
    let erc;

    try {
        erc = await compound_cETH_contractinstance.methods.exchangeRateCurrent().call();
    }
    catch(error) {
        console.log(error);
    }
    
    // La documentación de Compound parece que pone 1e18 ¿? , pero el dato correcto sale con 1e28.
    erc = (erc / 1e28); // erc = (erc / 1e28).toString;

    console.log(erc + ' ETH = 1 cETH');
    // -----------------------------------------------------------------------------------------------------------------------------------



    // ( 6 )

    // -----------------------------------------------------------------------------------------------------------------------------------
    /*  Función que recupera los ETH que metimos en Compound, ahora añadido con los intereses.         
        The redeem underlying function converts cTokens into a specified quantity of the underlying asset, and returns them to the user.
        https://compound.finance/docs/ctokens#redeem-underlying
    */
    let cantidadETH_enWeis = web3.utils.toWei(bou); // const cantidadETH_enWeis = web3.utils.toWei(bou).toString();

    try {
        await compound_cETH_contractinstance.methods.redeemUnderlying(cantidadETH_enWeis).send({
            from: public_key,
            gasLimit: web3.utils.toHex(200000),
            gasPrice: web3.utils.toHex(53000000000)
        });
    }
    catch(error) {
        console.log(error);
    }
    // -----------------------------------------------------------------------------------------------------------------------------------



}




// Para que se ejecute le función.
main(); 


























