import { useState, useEffect } from "react";
import styled from "styled-components";
import { getMyAccountBalance, myAddress, flexibleInfo, makeDeposit, doWithdraw } from './sdk';
import { sendFunds } from './send-funds';


const Home = () => {

	const [loading, setLoading] = useState(false);

	const [address, setAddress] = useState('');
	const [accountBalance, setAccountBalance] = useState(0)

	const [info, setInfo] = useState({ shareBalance: '0', balance: '0' })
	const [amountToFund, setAmountToFund] = useState('0');
	const [amountToDeposit, setAmountToDeposit] = useState('0');
	const [shareToWithdraw, setShareToWithdraw] = useState('0');




	useEffect(() => {
		getMyAccountBalance(setAccountBalance, setLoading);
		getInfo();
		(async () => {
			const ad: any = await myAddress();
			setAddress(ad);
		})()
	}, [])

	const fund = async () => {
		await sendFunds(amountToFund, () => {
			getMyAccountBalance(setAccountBalance, setLoading);
		})
		setAmountToFund('0')
	}

	const getInfo = async () => {
		const x: any = await flexibleInfo();
		if (x && Object.keys(x).length > 0) {
			setInfo(x)
		}
	}


	const deposit = async () => {
		await makeDeposit(amountToDeposit, setLoading);
		getMyAccountBalance(setAccountBalance, setLoading);
		getInfo();
		setAmountToDeposit('0')
	}


	const withdraw = async () => {
		await doWithdraw(shareToWithdraw, setLoading);
		getMyAccountBalance(setAccountBalance, setLoading);
		getInfo();
		setShareToWithdraw('0')
	}




	return (
		<Wrapper>
			<h1>uglyapp</h1>

			<ActiveWallet>
				<p>Active Wallet</p>
				<span>{address}</span>
			</ActiveWallet>

			<hr style={{ opacity: 0.1 }} />

			<InfoCard>
				<div className="wallet-balance">
					<span>Wallet Balance</span>
					<p>{addComma(Number(accountBalance))} BUSD</p>
				</div>

				<div className="savings">
					<span>Savings Balance</span>
					<p>{addComma(Number(info.balance))} BUSD</p>
					<br />
					<span>Share Balance</span>
					<p>{addComma(Number(info.shareBalance) * Math.pow(10, -8))} VBUSD</p>
				</div>

			</InfoCard>

			<div style={{ textAlign: 'center', marginTop: 20, color: 'gray' }}>
				{loading && <i className="fa fa-spinner fa-spin"></i>}
			</div>

			<Actions>
				<div className="fund">
					<input
						value={amountToFund}
						onChange={e => setAmountToFund(e.target.value)} />

					<button
						onClick={() => fund()}>Fund</button>

				</div>
				<div className="deposit">
					<input
						value={amountToDeposit}
						onChange={e => setAmountToDeposit(e.target.value)} />

					<button
						onClick={() => deposit()}>Deposit</button>

				</div>
				<div className="withdraw">
					<input
						value={shareToWithdraw}
						onChange={e => setShareToWithdraw(e.target.value)} />

					<button
						onClick={() => withdraw()}>Withdraw</button>

				</div>
			</Actions>

		</Wrapper>
	)
}


export default Home;

const addComma = (x: number) => {
	// @ts-ignore
	return parseFloat(String(x).match(/^-?\d+(?:\.\d{0,2})?/)[0]).toLocaleString('en', { maximumFractionDigits: 2, minimumFractionDigits: 2 });
}


const Wrapper = styled.div`
	max-width: 500px;
	margin: 100px auto;
`;

const ActiveWallet = styled.section`
	margin-top: 50px;

	& p {
		font-size: 0.8rem;
		font-weight: 600;
		color: gray;
		margin-bottom: 5px;
	}

	& span {
		display: inline-block;
		padding: 5px;
		border: 1px solid #eee;
		font-weight: 600;
		color: #2ab42a;
	}
`;

const InfoCard = styled.section`
	border: 1px solid #eee;
	padding: 20px;

	& span {
		font-size: 0.9rem;
	}

	& .wallet-balance {

		& p {
			font-weight: 800;
			font-size: 2.5rem;
		}
	}

	& .savings {
		margin-top: 20px;

		& p {
			font-weight: 800;
			font-size: 1rem;
		}
	}
`;

const Actions = styled.section`
	display: flex;
	flex-wrap: wrap;

	& input {
		box-sizing: border-box;
		display: block;
		height: 50px;
		font-size: 1.3rem;
	}

	& button {
		height: 30px;
	}

	& > div {
		width: 50%;
		padding: 20px;
		display: flex;
		flex-direction: column;
	}

`;