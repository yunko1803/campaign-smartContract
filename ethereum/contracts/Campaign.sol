pragma solidity ^0.4.17;


contract CampaignFactory {
    address[] public deployedCampaigns;

    function createCampaign(uint256 minimum) public {
        address newCampaign = new Campaign(minimum, msg.sender);
        deployedCampaigns.push(newCampaign);
    }

    function getDeployedCampaigns() public view returns (address[]) {
        return deployedCampaigns;
    }
}


contract Campaign {
    struct Request {
        string description;
        uint256 value;
        address receipient;
        bool complete;
        uint256 approvalCnt;
        mapping(address => bool) approvals;
    }
    address public manager;
    uint256 public minimumContribution;
    Request[] public requests;
    mapping(address => bool) public approvers;
    uint256 public approversCnt;

    function Campaign(uint256 minimum, address creator) public {
        manager = creator;
        minimumContribution = minimum;
    }

    modifier restricted() {
        require(msg.sender == manager);
        _;
    }

    function contribute() public payable {
        require(msg.value > minimumContribution);
        approvers[msg.sender] = true;
        approversCnt++;
    }

    function createRequest(
        string description,
        uint256 value,
        address receipient
    ) public restricted {
        Request memory newRequest = Request({
            description: description,
            value: value,
            receipient: receipient,
            complete: false,
            approvalCnt: 0
        });
        requests.push(newRequest);
    }

    function approveRequest(uint256 index) public {
        Request storage request = requests[index];
        require(approvers[msg.sender]);
        require(!request.approvals[msg.sender]);
        request.approvalCnt++;
        request.approvals[msg.sender] = true;
    }

    function finalizeRequest(uint256 index) public restricted {
        Request storage request = requests[index];
        require(!request.complete);
        require(request.approvalCnt / approversCnt > (approversCnt / 2));

        request.receipient.transfer(request.value);
        request.complete = true;
    }

    function getSummary()
        public
        view
        returns (uint256, uint256, uint256, uint256, address)
    {
        return (
            minimumContribution,
            this.balance,
            requests.length,
            approversCnt,
            manager
        );
    }

    function getRequestCount() public view returns (uint256) {
        return (requests.length);
    }
}
