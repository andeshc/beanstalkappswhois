import React, { Component } from "react";
import "../static/site.css"

import Head from "next/head";

export default class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            whois: undefined
        }    
    }

    onKeyDown(e) {
        if (e.key === "Enter") {
            this.search();
        }
    }


    search() {
        let domainName = document.querySelector("#searchterm").value;
        let url=`/api/whois/${domainName}`

        fetch(url).then((response) => {
            response.json().then((whoisData) => {
                let data = `${whoisData.WhoisRecord.rawText || ""}\n----------------------------------\n${whoisData.WhoisRecord.registryData.rawText}`;
                this.setState({
                    whois: data
                });    
            });
        });
    }

    render() {
        return (
            <div className="container">
                <Head>
                    <title>WhoIs - BeanstalkApps</title>
                </Head>

                <div className="searchbar">
                    <div className="searchbar-item">
                        <input type="text" id="searchterm" name="searchterm" className="searchterm" onKeyDown={this.onKeyDown.bind(this)}></input>
                    </div>
                    <div className="searchbar-item">
                        <button className="search" onClick={this.search.bind(this)}>WhoIs Search</button>
                    </div>
                </div>

                {
                    this.state.whois && (
                        <div className="whoisdata">
                            <pre>
                                {this.state.whois}
                            </pre>
                        </div>
                    )
                }
            </div>
        );
    }
}
