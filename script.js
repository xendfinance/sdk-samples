require('dotenv').config();
const web3 = require('web3')
const busdAbi = require('./busd-abi.json')

const w3 = new web3("http://localhost:8545")
const busdAddress = "0xe9e7cea3dedca5984780bafc599bd69add087d56"
const busd = new w3.eth.Contract(busdAbi, busdAddress);


// Values to Change
const receiver = pkToAddress(process.env.PRIVATE_KEY); // create .env file and save the PRIVATE_KEY copy from ganache
const unlockedAddress = process.env.UNLOCKED_ADDRESS;




const sendFunds = async () => {
	Promise.all([
		busd.methods.balanceOf(unlockedAddress).call(),
		busd.methods.balanceOf(receiver).call()
	]).then(async ([unlockedBal, receiverBal]) => {
		const prev = { unlocked: unlockedBal, receiver: receiverBal }
		console.table(prev)


		console.log('* sending... *')
		const amount = BigInt(1000) * BigInt(Math.pow(10, 18))
		await busd.methods.transfer(receiver, amount).send({ from: unlockedAddress })
		console.log('* sent *\n')


		Promise.all([
			busd.methods.balanceOf(unlockedAddress).call(),
			busd.methods.balanceOf(receiver).call()
		]).then(([unlockedBal, receiverBal]) => {
			const after = { unlocked: unlockedBal, receiver: receiverBal }
			console.table(after)
		})



	})


}

sendFunds();


function pkToAddress(pk) {
	const account = w3.eth.accounts.privateKeyToAccount(pk)
	return account.address;
}

// async function getBalance() {
// 	const bal = await w3.eth.getBalance(pkToAddress(process.env.PRIVATE_KEY))
// 	const x = w3.utils.fromWei(bal.toString(), 'ether')
// 	console.log(x, ' the balance')
// }

// getBalance();