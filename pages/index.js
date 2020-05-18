import React, { useEffect, useState } from 'react';
import factory from '../ethereum/factory';
import { Card, Button } from 'semantic-ui-react';
import Layout from '../components/Layout';
import { Link } from '../routes';
// import 'semantic-ui-css/semantic.min.css';

// const CampaignIndex = () => {
// 	const [campaigns, setCampaigns] = useState([]);

// 	useEffect(() => {
// 		const getCampaigns = async () => {
// 			let campaignsList = await factory.methods.getDeployedCampaigns().call();
// 			setCampaigns(campaignsList);
// 		};
// 		getCampaigns();
// 	}, []);
// 	console.log('campaign: ', campaigns);

// 	return <h1>campaignsindex </h1>;
// };

class CampaignIndex extends React.Component {
	static async getInitialProps() {
		const campaigns = await factory.methods.getDeployedCampaigns().call();

		return { campaigns };
	}

	renderCampaigns() {
		const items = this.props.campaigns.map((address, i) => {
			return {
				header: address,
				description: (
					<Link route={`/campaigns/${address}`}>
						<a>View Campaign</a>
					</Link>
				),
				fluid: true,
			};
		});
		return <Card.Group items={items} />;
	}

	render() {
		return (
			<Layout>
				<div>
					<h3>Open Campaigns</h3>

					<Link route="/campaigns/new">
						<a>
							<Button floated="right" content="Create Compaign" icon="add circle" primary />
						</a>
					</Link>

					{this.renderCampaigns()}
				</div>
			</Layout>
		);
	}
}

export default CampaignIndex;
