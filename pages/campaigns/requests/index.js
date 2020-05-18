import React, { Component } from 'react';
import { Button, Table } from 'semantic-ui-react';
import { Link } from '../../../routes';
import Layout from '../../../components/Layout';
import Campaign from '../../../ethereum/campaign';
import web3 from '../../../ethereum/web3';
import RequestRow from '../../../components/RequestRow';

export default class RequestIndex extends Component {
	static async getInitialProps(props) {
		const { address } = props.query;
		const campaign = new Campaign(address);
		const requestCount = await campaign.methods.getRequestCount().call();
		const approversCnt = await campaign.methods.approversCnt().call();

		const requests = await Promise.all(
			Array(parseInt(requestCount))
				.fill()
				.map((element, i) => {
					return campaign.methods.requests(i).call();
				})
		);
		return {
			address,
			requests,
			requestCount: parseInt(requestCount),
			approversCnt,
		};
	}
	renderRows() {
		const { requests, requestCount, approversCnt, address } = this.props;

		const rows = requests.map((element, i) => (
			<RequestRow key={i} id={i} data={element} totalCnt={approversCnt} address={address} />
		));

		return rows;
	}
	render() {
		const { Header, Row, HeaderCell, Body, Cell } = Table;
		console.log(this.props.requests[0]);
		return (
			<Layout>
				<h1>Requests Index</h1>
				<Link route={`/campaigns/${this.props.address}/requests/new`}>
					<a>
						<Button primary floated="right" style={{ marginBottom: 10 }}>
							Add Request
						</Button>
					</a>
				</Link>
				<Table>
					<Header>
						<Row>
							<HeaderCell>ID</HeaderCell>
							<HeaderCell>Description</HeaderCell>
							<HeaderCell>Amount</HeaderCell>
							<HeaderCell>Recipient</HeaderCell>
							<HeaderCell>Approval Count</HeaderCell>
							<HeaderCell>Approve</HeaderCell>
							<HeaderCell>Finalize</HeaderCell>
						</Row>
					</Header>
					<Body>{this.renderRows()}</Body>
				</Table>
				<div>Found {this.props.requestCount} requests</div>
			</Layout>
		);
	}
}
