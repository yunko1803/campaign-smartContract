import React, { Component } from 'react';
import Layout from '../../components/Layout';
import { Button, Form, Input, Message } from 'semantic-ui-react';
import factory from '../../ethereum/factory';
import web3 from '../../ethereum/web3';
import { Router } from '../../routes';

class CampaignNew extends Component {
	state = {
		minimumContribution: '',
		errorMessage: '',
		isLoading: false,
	};
	onSubmit = async (e) => {
		e.preventDefault();
		this.setState({ isLoading: true, errorMessage: '' });
		try {
			const accounts = await web3.eth.getAccounts();
			await factory.methods
				.createCampaign(this.state.minimumContribution)
				.send({
					from: accounts[0],
				})
				.on('confirmation', (confirmationNumber, receipt) => {
					// If first confirmation...
					if (confirmationNumber === 1)
						// ... navigate to root URL
						Router.pushRoute('/');
				});
			// Router.pushRoute('/');
		} catch (e) {
			this.setState({
				errorMessage: e.message,
			});
		}
		this.setState({ isLoading: false });
	};
	render() {
		return (
			<Layout>
				<h3>Create a Campaign</h3>

				<Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
					<Form.Field>
						<label>Minimum Contribution</label>
						<Input
							label="wei"
							labelPosition="right"
							value={this.state.minimumContribution}
							onChange={(e) => this.setState({ minimumContribution: e.target.value })}
						/>
					</Form.Field>
					<Message error header="Oops!" content={this.state.errorMessage} />
					<Button primary loading={this.state.isLoading}>
						Create
					</Button>
				</Form>
			</Layout>
		);
	}
}

export default CampaignNew;
