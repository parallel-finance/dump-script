import * as cs from '../cs.json'
import * as dumpCs from '../contributed.json'

const cts = cs.data.contributions

const accounts = Array.from((new Set((cts.nodes.map(node => node.account)))))
const amounts = cts.nodes.map(node => node.amount)

let subqlTotalAmount = BigInt(0)
amounts.forEach((item) => { subqlTotalAmount += BigInt(item) })

let dumpTotalAmount = BigInt(0)
console.log(dumpCs.contributions.length)

dumpCs.contributions.forEach((item) => { dumpTotalAmount += BigInt(item.data[0]) })

console.log(`subql totalAmount is ${subqlTotalAmount}`)
console.log(`dump totalAmount is ${dumpTotalAmount}`)
console.log(`subquery accounts is ${(accounts.length)}`)
console.log(`dump accounts is ${(dumpCs.contributions.length)}`)
