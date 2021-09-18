
import XF from '@xend-finance/web-sdk';
import protocols from './addresses.json';






const setupSdk = async () => {
	const chainID = 0; // ganache
	const PK: any = process.env.REACT_APP_PRIVATE_KEY;
	return await XF(chainID, PK, { env: 'local', protocols });
}









export const getMyAccountBalance = async (
	setAmount: any,
	setLoading: Function) => {
	try {
		setLoading(true)
		const sdk: any = await setupSdk();

		const acct = await sdk.walletBalance();

		setLoading && setLoading(false)
		setAmount && setAmount(acct)
		return acct;
	} catch (e) {
		console.error(e)
		setLoading && setLoading(false)
		setAmount && setAmount('0')

	}
}








export const flexibleInfo = async () => {
	try {
		const { Personal } = await setupSdk();

		const info = await Personal.flexibleInfo();

		return info;
	} catch (e) {
		console.log(e)
		return null
	}
}













export const makeDeposit = async (
	amount: any,
	setLoading: Function) => {
	try {
		setLoading(true)
		const { Personal } = await setupSdk();

		const x = await Personal.flexibleDeposit(String(amount));

		setLoading(false)
		return x
	} catch (e) {
		setLoading(false)
		return null
	}
}







export const doWithdraw = async (
	amount: any,
	setLoading: Function) => {
	try {
		setLoading(true)
		const { Personal } = await setupSdk();

		// let amountToPass = Number(amount) * Math.pow(10, -8)

		//@ts-ignore
		const finalAmount = String(amount.toString().match(/^-?\d+(?:\.\d{0,4})?/)[0])

		const x = await Personal.withdrawFlexible(finalAmount); // we withdraw share balance, not the busd value
		console.log(x)
		setLoading(false)
	} catch (error) {
		console.log(error)
		setLoading(false)
	}
}







export const myAddress = async () => {
	try {
		const xf = await setupSdk();
		const result = await xf.retrieveWallet(); // we withdraw share balance, not the busd value
		return result.address;
	} catch (error) {
		return null
	}

}