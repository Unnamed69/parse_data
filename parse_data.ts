// Require file system library
const fs = require("fs");

// Read file as text
function read_file(file_path: string): string {
  let contain: string = fs.readFileSync(file_path);
  return contain;
}

function sell(bids: [number, number][], eth_ammount: number, acc = 0): number {
  for (let each_transaction of bids) {
    if (eth_ammount == 0) {
      return acc;
    } else {
      if (eth_ammount > each_transaction[1]) {
        acc = acc + each_transaction[1] * each_transaction[0];
        eth_ammount = eth_ammount - each_transaction[1];
      } else {
        acc = acc + each_transaction[0] * eth_ammount;
        eth_ammount = 0;
      }
    }
  }
}

function buy(asks: [number, number][], usd_ammount: number, acc = 0): number {
  for (let each_transaction of asks) {
    if (usd_ammount == 0) {
      return acc;
    } else {
      let max_available_ammount = usd_ammount / each_transaction[0];
      if (max_available_ammount > each_transaction[1]) {
        acc = acc + each_transaction[1];
        usd_ammount = usd_ammount - each_transaction[0] * each_transaction[1];
      } else {
        acc = acc + max_available_ammount;
        usd_ammount = 0;
      }
    }
  }
}
/* Recusion from:

function sell(bids: [number, number][], eth_ammount: number, acc = 0): number {
  let [head, ...tail] = bids;
  // Stop condition
  if (bids.length == 0 || eth_ammount <= 0) {
    return acc;
  } else {
    if (eth_ammount > head[1]) {
      // Using recursion
      return sell(tail, eth_ammount - head[1], acc + head[1] * head[0]);
    } else {
      return sell(tail, 0, acc + head[0] * eth_ammount);
    }
  }
}


function buy(asks: [number, number][], usd_ammount: number, acc = 0): number {
  let [head, ...tail] = asks;
  if (asks.length == 0 || usd_ammount <= 0) {
    return acc;
  } else {
    let max_available_ammount = usd_ammount / head[0];
    if (max_available_ammount > head[1]) {
      return buy(tail, usd_ammount - head[0] * head[1], acc + head[1]);
    } else {
      return buy(
        tail,
        usd_ammount - head[0] * max_available_ammount,
        acc + max_available_ammount
      );
    }
  }
}

*/

function calculateBuyingRate(
  file_path: string,
  usd_ammount: number
): Array<number> {
  let file_contain = read_file(file_path);
  /* Convert read data to objects like this:
{
  level: 30,
  time: 1569421556164,
  pid: 14345,
  hostname: 'ip-172-31-28-244',
  local: {
    bids: [
      [Array], [Array], [Array], [Array], [Array], [Array], [Array],
      [Array], [Array], [Array], [Array], [Array], [Array], [Array],
      [Array], [Array], [Array], [Array], [Array], [Array], [Array],
      [Array], [Array], [Array], [Array], [Array], [Array], [Array],
      [Array], [Array], [Array], [Array], [Array], [Array], [Array],
      [Array], [Array], [Array], [Array], [Array], [Array], [Array],
      [Array], [Array], [Array], [Array], [Array], [Array], [Array],
      [Array], [Array], [Array], [Array], [Array], [Array], [Array],
      [Array], [Array], [Array], [Array], [Array], [Array], [Array],
      [Array], [Array], [Array], [Array], [Array], [Array], [Array],
      [Array], [Array], [Array], [Array], [Array], [Array], [Array],
      [Array], [Array], [Array], [Array], [Array], [Array], [Array],
      [Array], [Array], [Array], [Array], [Array], [Array], [Array],
      [Array], [Array], [Array], [Array], [Array], [Array], [Array],
      [Array], [Array],
      ... 15 more items
    ],
    asks: [
      [Array], [Array], [Array], [Array], [Array], [Array], [Array],
      [Array], [Array], [Array], [Array], [Array], [Array], [Array],
      [Array], [Array], [Array], [Array], [Array], [Array], [Array],
      [Array], [Array], [Array], [Array], [Array], [Array], [Array],
      [Array], [Array], [Array], [Array], [Array], [Array], [Array],
      [Array], [Array], [Array], [Array], [Array], [Array], [Array],
      [Array], [Array], [Array], [Array], [Array], [Array], [Array],
      [Array], [Array], [Array], [Array], [Array], [Array], [Array],
      [Array], [Array], [Array], [Array], [Array], [Array], [Array],
      [Array], [Array], [Array], [Array], [Array], [Array], [Array],
      [Array], [Array], [Array], [Array], [Array], [Array], [Array],
      [Array], [Array], [Array], [Array], [Array], [Array], [Array],
      [Array], [Array], [Array], [Array], [Array], [Array], [Array],
      [Array], [Array], [Array], [Array], [Array], [Array], [Array],
      [Array], [Array],
      ... 1 more item
    ],
    nonce: 729559249,
    timestamp: 1569421555662,
    datetime: '9/25/2019, 11:25:55 PM'
  },
  remote: {
    bids: [
      [Array], [Array], [Array], [Array], [Array], [Array],
      [Array], [Array], [Array], [Array], [Array], [Array],
      [Array], [Array], [Array], [Array], [Array], [Array],
      [Array], [Array], [Array], [Array], [Array], [Array],
      [Array], [Array], [Array], [Array], [Array], [Array],
      [Array], [Array], [Array], [Array], [Array], [Array],
      [Array], [Array], [Array], [Array], [Array], [Array],
      [Array], [Array], [Array], [Array], [Array], [Array],
      [Array], [Array], [Array], [Array], [Array], [Array],
      [Array], [Array], [Array], [Array], [Array], [Array],
      [Array], [Array], [Array], [Array], [Array], [Array],
      [Array], [Array], [Array], [Array], [Array], [Array],
      [Array], [Array], [Array], [Array], [Array], [Array],
      [Array], [Array], [Array], [Array], [Array], [Array],
      [Array], [Array], [Array], [Array], [Array], [Array],
      [Array], [Array], [Array], [Array], [Array], [Array],
      [Array], [Array], [Array], [Array]
    ],
    asks: [
      [Array], [Array], [Array], [Array], [Array], [Array],
      [Array], [Array], [Array], [Array], [Array], [Array],
      [Array], [Array], [Array], [Array], [Array], [Array],
      [Array], [Array], [Array], [Array], [Array], [Array],
      [Array], [Array], [Array], [Array], [Array], [Array],
      [Array], [Array], [Array], [Array], [Array], [Array],
      [Array], [Array], [Array], [Array], [Array], [Array],
      [Array], [Array], [Array], [Array], [Array], [Array],
      [Array], [Array], [Array], [Array], [Array], [Array],
      [Array], [Array], [Array], [Array], [Array], [Array],
      [Array], [Array], [Array], [Array], [Array], [Array],
      [Array], [Array], [Array], [Array], [Array], [Array],
      [Array], [Array], [Array], [Array], [Array], [Array],
      [Array], [Array], [Array], [Array], [Array], [Array],
      [Array], [Array], [Array], [Array], [Array], [Array],
      [Array], [Array], [Array], [Array], [Array], [Array],
      [Array], [Array], [Array], [Array]
    ],
    nonce: 729559275
  },
  v: 1
}
  */
  let parsed_contain = JSON.parse(file_contain);
  // Destructuring parsed object
  let {
    local: { bids: local_bids, asks: local_asks },
    remote: { bids: remote_bids, asks: remote_asks }
  } = parsed_contain;
  let [buying_rate_local, buying_rate_remote] = [
    buy(local_asks, usd_ammount),
    buy(remote_asks, usd_ammount)
  ];
  return [buying_rate_local, buying_rate_remote];
}

function calculateSellingRate(
  file_path: string,
  eth_ammount: number
): Array<number> {
  let file_contain = read_file(file_path);
  // Convert read data to objects
  let parsed_contain = JSON.parse(file_contain);
  // Destructuring parsed objects
  let {
    local: { bids: local_bids, asks: local_asks },
    remote: { bids: remote_bids, asks: remote_asks }
  } = parsed_contain;
  let [selling_rate_local, selling_rate_remote] = [
    sell(local_bids, eth_ammount),
    sell(remote_bids, eth_ammount)
  ];
  return [selling_rate_local, selling_rate_remote];
}

// Testing calculateSellingRate => result = [ 3358.6000000000004, 3358.6171200000003 ]
let test = calculateSellingRate("test.json", 20);
console.log(test);

// Testing calculateBuyingRate => result = [ 5.95335181558426, 5.952742369188642 ]
let test2 = calculateBuyingRate("test.json", 1000);
console.log(test2);
