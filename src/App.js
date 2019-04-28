import React, { Component } from 'react';
import { Button, Form} from 'reactstrap';
import Web3 from 'aion-web3';
import './App.css';

class App extends Component {
    componentDidMount = () => {

        setInterval(
            function() {
                if (window.aionweb3 ) {
                    this.setState({
                        aionweb3: window.aionweb3, //detect aiwa
                    });

                }

            }.bind(this),
            1000
        );

        setInterval(
            this.getFunction,
            1000
        );
    };

    constructor(props) {
        super(props);
        this.state = {
            aionweb3: null,
            aiwa: false,
            account: null, //user account,
            value: " ",
            result: "",
            ctAddress: "0b2260914e069f3c38e1974bbdf0b7d7cfa3ecaf08622f917bed06f5d06cc194", //contract address,
            httpProvider: "https://aion.api.nodesmith.io/v1/avmtestnet/jsonrpc?apiKey=5948f82b62a34969a0e5d4b8c0acdfc9"
        };
    }


    //send transaction to the smart contract
    sendTransactionFunction = async (toWallet,value) => {

        //set web3
        let web3 = new Web3(
            new Web3.providers.HttpProvider(this.state.httpProvider)
        );

        //set aiwa accouunt
        try {
            this.setState({
                account:  window.aionweb3.account[0]
            })
        } catch(e) {
            console.error("no account for sending", e.message);
        }

        //the contract method you want to call
        //let data = web3.avm.contract.method('setString').inputs(['string'],[mystring]).encode();

        //let data = web3.avm.contract.method('TransferAion').inputs([to],[value]).encode();
        //let data = web3.avm.contract.method('TransferAion').inputs([this.state.to],[this.state.value]).encode();
        //let data = web3.avm.contract.method('TransferAion').inputs({[to: '0xa04c6c91f510730693101573aaa039da97474c898b24dd22a4b61ee7e5306d55'],[value: '10']}).encode();

/*
        let data = web3.avm.contract.method('TransferAion').inputs([{
                type: 'string',
                name: 'toWallet'
            },{
                type: 'uint256',
                name: 'value'
            }]).encode();

        console.log(data)
*/

        const txObject = {
            from: this.state.account,
            toWallet: this.state.ctAddress,

            data: data,
            gas: 2000000,
            type: "0x1"  //for any transaction except for java contract deployment
        };

        try {
             await window.aionweb3.sendTransaction(txObject);
        } catch (err) {
            console.log(err);
        }
    };


    //call smart contract method
    getFunction = async () => {
        let web3 = new Web3(
            new Web3.providers.HttpProvider(this.state.httpProvider)
        );

        //set aiwa accouunt
        try {
            this.setState({
                account:  window.aionweb3.account[0]
            })
        } catch(e) {
            console.error("no account for sending", e.message);
        }

        let data = web3.avm.contract.method('getString').encode();

        let txObject = {
            from:this.account,
            to: this.state.ctAddress,
            gas: 100000,
            gasPrice: 1,
            data: data
        };

        try {
            let res = await web3.eth.call(txObject); //call a method
            let returnValue = await web3.avm.contract.decode('string', res);
            this.setState({
                result: returnValue
            });
        } catch (err) {
            console.log("fail calling");
        }
    };

    //get user input
    handleChange = event => {
        this.setState({ to: event.target.to, value: event.target.value });
    };

    handleSubmit = event => {
        //alert('A name was submitted: ' + this.state.value);
        this.sendTransactionFunction( this.state.to, this.state.value );
        event.preventDefault();
    };

    render() {
        return (
            <div >
                <div>
                    Bite-Coin Daily Contracted Transfer to Kid Screen
                    <Form onSubmit={this.handleSubmit}>
                        <label>
                            From Contract:
                            <input
                                id="from"
                                type="text"
                                value="0xa002148274f401ac0cfdcae813d65cf0f309c23a90a126d4734b5097d9e94b27"
                                //value={this.state.value}
                                //onChange={this.handleChange}
                            />
                        </label>
                        <br/>
                        <label>
                             To Kids Wallet:
                             <input
                                id = "toWallet"
                                type="text"
                                value="0xa04c6c91f510730693101573aaa039da97474c898b24dd22a4b61ee7e5306d55"
                                value={this.state.ctAddress}
                                onChange={this.handleChange}
                              />
                        </label>
                        <br/>
                        <label>
                             Amount:
                             <input
                                id = "value"
                                type="text"
                                value="10"
                                value={this.state.value}
                                onChange={this.handleChange}
                              />
                        </label>
                        <br/>
                        <Button type="submit" value="Submit">
                            Submit
                        </Button>
                    </Form>

                    <h1>Current String: {this.state.result}</h1>

                </div>
            </div>
        );
    }
}

export default App;
