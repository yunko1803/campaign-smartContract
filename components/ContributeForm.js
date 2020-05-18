import React, { Component } from 'react';
import { Form, Input, Message, Button } from 'semantic-ui-react';
import web3 from '../ethereum/web3';
import Campaign from '../ethereum/campaign';
import { Router } from '../routes';

class ContributeForm extends Component {
	state = {
		value: '',
		errorMsg: '',
		isLoading: false,
	};
	onSubmit = async (e) => {
		e.preventDefault();
		const campaign = Campaign(this.props.address);
		this.setState({ isLoading: true, errorMsg: '' });
		try {
			const accounts = await web3.eth.getAccounts();
			await campaign.methods.contribute().send({
				from: accounts[0],
				value: web3.utils.toWei(this.state.value, 'ether'),
			});
			Router.replaceRoute(`/campaigns/${this.props.address}`);
		} catch (e) {
			this.setState({
				errorMsg: e.message,
			});
		}
		this.setState({ isLoading: false });
	};
	render() {
		return (
			<Form onSubmit={this.onSubmit} error={!!this.state.errorMsg}>
				<Form.Field>
					<label>Amount to Contribute</label>
					<Input
						value={this.state.value}
						label="ether"
						labelPosition="right"
						onChange={(e) => this.setState({ value: e.target.value })}
					/>
				</Form.Field>
				<Message error header="Oops!" content={this.state.errorMsg} />
				<Button primary loading={this.state.isLoading}>
					Contribute
				</Button>
			</Form>
		);
	}
}

export default ContributeForm;
