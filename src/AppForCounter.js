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

    constructor(props, context) {
        super(props);
        this.state = {
            aionweb3: null,
            aiwa: false,
            account: null, //user account,
            value: " ",
            result: "",
            ctAddress: "0xa084b42efa079ad85b2c5b6c3d8a3fc6165cb13d06553ca566c29d89e94b80d2", //contract address,
            httpProvider: "https://aion.api.nodesmith.io/v1/avmtestnet/jsonrpc?apiKey=ec13c1ff5f65488fa6432f5f79e595f6"
        };
    }


    //send transaction to the smart contract
    sendTransactionFunction = async (mystring) => {

        //set web3
        let web3 = new Web3(
            new Web3.providers.HttpProvider(this.httpProvider)
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
        let data = web3.avm.contract.method('setString').inputs(['string'],[mystring]).encode();


        const txObject = {
            from: this.state.account,
            to: this.ctAddress,
            data: data,
            gas: 2000000,
            type: "0x1"  //for any transaction except for java contract deployment
        };

        try {
            const signedTx = await window.aionweb3.sendTransaction(txObject);
        } catch (err) {
            console.log(err);
        }
    };


    //call smart contract method
    getFunction = async () => {
        let web3 = new Web3(
            new Web3.providers.HttpProvider(this.httpProvider)
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
            to: this.ctAddress,
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
        this.setState({ value: event.target.value });
    };

    handleSubmit = event => {
        //alert('A name was submitted: ' + this.state.value);
        this.sendTransactionFunction(this.state.value);
        event.preventDefault();
    };

    render() {
        return (
            <div >
                <div>
                    <Form onSubmit={this.handleSubmit}>
                        <label>
                            Set String:
                            <input
                                type="text"
                                value={this.state.value}
                                onChange={this.handleChange}
                            />
                        </label>
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
