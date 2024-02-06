'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = '';
  // .textContent=0;
  const mov = sort ? movements.slice().sort((a, b) => a - b) : movements;

  mov.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const html = ` <div class="movements__row">
    <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
    <div class="movements__value">${mov}€</div>
    `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};
// displayMovements(account1.movements);
// console.log(containerMovements.innerHTML);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, cur) => acc + cur, 0);
  labelBalance.textContent = `${acc.balance} EUR`;
};
// calcDisplayBalance(account1.movements);

const calcDisplaySummary = function (acc) {
  const income = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${income} €`;

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(out)}€`;

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      // console.log(arr);
      return int >= 1;
    })
    .reduce((acc, mov) => acc + mov, 0);
  labelSumInterest.textContent = `${interest}€`;
};
// calcDisplaySummary(account1.movements);

// creating username////////////////////////////
const createUserName = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .split(' ')
      .map(user => user[0])
      .join('')
      .toLowerCase();

    // console.log(userShortName);
  });
};

createUserName(accounts);

// updateUI

const updateUI = function (acc) {
  // DISPLAY MOVEMENTS
  displayMovements(acc.movements);

  // DISPLAY BALANCE
  calcDisplayBalance(acc);

  // DISPLAY SUMMARY
  calcDisplaySummary(acc);
};

////event handlers
let currentAccount;

btnLogin.addEventListener('click', function (e) {
  // prevent from reloading page (which is default in html (as button in form refers to submitting means reloading of page ))
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // console.log('login');
    // DISPLAY UI AND MESSAGE
    labelWelcome.textContent = `Welcome back , ${
      currentAccount.owner.split(' ')[0]
    }`;

    containerApp.style.opacity = 100;
    inputLoginPin.blur();
    inputLoginUsername.blur();

    //Clear Input Field
    inputLoginUsername.value = inputLoginPin.value = '';

    updateUI(currentAccount);
  }
});
// inputTransferTo
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  console.log(amount, receiverAcc);

  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    // doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    // updateUI
    updateUI(currentAccount);
  }
});

// close account handler
btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    console.log(index);
    // delete account
    accounts.splice(index, 1);
    // hide UI
    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = inputClosePin.value = '';
});

// request loan
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);
  const anyDeposit = currentAccount.movements.some(mov => mov >= amount * 0.1);
  if (amount > 0 && anyDeposit) {
    currentAccount.movements.push(amount);
    // UPDATE UI
    updateUI(currentAccount);
  }
  inputLoanAmount.value = '';
});
// sort button functionality

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();

  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});

//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////
// LECTURES

///////////////////////////
// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);

/////////////////////////////////////////////////

// Simple array methods
/*
  // Slice (does not mutates = does not changes)
  let arr = ['a', 'b', 'c', 'd', 'e'];
  
  console.log(arr.slice(2));
  console.log(arr.slice(2, 4));
  console.log(arr.slice(-2));
  console.log(arr.slice(1, -2));
  console.log(arr.slice());
  console.log([...arr]);
  
  //Splice (mutates =changes)
  
  // console.log(arr.splice(2));
  arr.splice(-1);
  console.log(arr);
  arr.splice(1, 2);
console.log(arr);

// Reverse (mutates =changes)
arr = ['a', 'b', 'c', 'd', 'e'];
const arr2 = ['j', 'i', 'h', 'g', 'f'];

console.log(arr2.reverse());
console.log(arr2);

//  Concat method
const letters = arr.concat(arr2);
console.log(letters);
console.log(arr2);
console.log([...arr, ...arr2]);

//  Join
console.log(letters.join('-'));
*/
/////////////////  The new at method//////////////we use at method for (method chaining)
/*
const arr = [23, 11, 64];
console.log(arr[0]);
console.log(arr.at(0));

// getting last element out of array
console.log(arr[arr.length - 1]);
console.log(arr.slice(-1)[0]);
console.log(arr.at(-1));
*/
// for each loop
/*
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// for (const movement of movements) {
  for (const [i, movement] of movements.entries()) {
    // for of loop continue and break statement do work in for each loop
    
    if (movement > 0) {
      console.log(`movement ${i + 1} : you deposited ${movement}`);
    } else {
      console.log(`movement ${i + 1} : you withdrew ${Math.abs(movement)}`);
    }
  }
  console.log('--------For Each----------');
  // continue and break statement do not work in for each loop
  movements.forEach(function (movement, index, array) {
    if (movement > 0) {
      console.log(`movement ${index + 1} :  you deposited ${movement}`);
    } else {
      console.log(`movement ${index + 1} :  you withdrew ${Math.abs(movement)}`);
    }
  });
  */
// for each fot maps and sets
/*
 // maps
 const currencies = new Map([
   ['USD', 'United States dollar'],
   ['EUR', 'Euro'],
   ['GBP', 'Pound sterling'],
  ]);
  
  currencies.forEach(function (value, key, array) {
    console.log(`${key} : ${value}`);
  });
  
  // set
  // for sets value is equal to key 
  const currenciesUnique = new Set(['USD', 'GBP', 'USD', 'EUR', 'EUR']);
  
  console.log(currenciesUnique);
  currenciesUnique.forEach(function (value, key, map) {
    console.log(`${key} : ${value}`);
  });
  */

////////////coding challenge//////////
// Coding Challenge #1

/* 
 Julia and Kate are doing a study on dogs. So each of them asked 5 dog owners about their dog's age, and stored the data into an array (one array for each). For now, they are just interested in knowing whether a dog is an adult or a puppy. A dog is an adult if it is at least 3 years old, and it's a puppy if it's less than 3 years old.
 
 Create a function 'checkDogs', which accepts 2 arrays of dog's ages ('dogsJulia' and 'dogsKate'), and does the following things:
 
 1. Julia found out that the owners of the FIRST and the LAST TWO dogs actually have cats, not dogs! So create a shallow copy of Julia's array, and remove the cat ages from that copied array (because it's a bad practice to mutate function parameters)
 2. Create an array with both Julia's (corrected) and Kate's data
 3. For each remaining dog, log to the console whether it's an adult ("Dog number 1 is an adult, and is 5 years old") or a puppy ("Dog number 2 is still a puppy 🐶")
 4. Run the function for both test datasets
 
 HINT: Use tools from all lectures in this section so far 😉
 
 TEST DATA 1: Julia's data [3, 5, 2, 12, 7], Kate's data [4, 1, 15, 8, 3]
 TEST DATA 2: Julia's data [9, 16, 6, 8, 3], Kate's data [10, 5, 6, 1, 4]
 
 GOOD LUCK 😀
 */
/*
const checkDogs = function (dogsJulia, dogsKate) {
  const dogsJuliaCorrected = dogsJulia.slice(); // for shallow copy
  dogsJuliaCorrected.splice(0, 1);
  dogsJuliaCorrected.splice(-2);
  // dogsJulia.slice(1, 3);
  const dogs = dogsJuliaCorrected.concat(dogsKate);
  console.log(dogs);
  
  dogs.forEach(function (dog, i) {
    if (dog >= 3) {
      console.log(`Dog number ${i + 1} is an adult, and is ${dog} years old`);
    } else {
      console.log(`dog number ${i + 1} is still a puppy🐶 `);
    }
  });
};
checkDogs([3, 5, 2, 12, 7], [4, 1, 15, 8, 3]);
checkDogs([9, 16, 6, 8, 3], [10, 5, 6, 1, 4]);
*/

/////////////map method at arrays///////////
/*
const euroToUsd = 1.1;

// const movementsUsd = movements.map(function (mov) {
  //   return mov * euroToUsd;
  // });
  
  const movementsUsd = movements.map(mov => mov * euroToUsd);
  console.log(movements);
  console.log(movementsUsd);
  
  const movementsToUsd = [];
  for (let mov of movements) {
    movementsToUsd.push(mov * euroToUsd);
  }
  console.log(movementsToUsd);
  
  //////////////////////////////////////////////////// filter method//////////////////////////
  /*
  const deposits = movements.filter(function (mov) {
    return mov > 0;
  });
  
  console.log(movements);
  console.log(deposits);
  
  const withdrawal = movements.filter(mov2 => mov2 < 0);
  console.log(withdrawal);
  */

////////////reduce method//////////
/*
 // accumulator is like a snow ball
 // const balance = movements.reduce((acc, cur) => acc + cur, 0);
 // console.log(balance);
 
 let balance2 = 0;
 for (const mov of movements) {
   balance2 = balance2 + mov;
  }
  console.log(balance2);
  
  //////////finding maximum using REDUCE METHOD///////////
  
  const max = movements.reduce((acc, mov) => {
    if (acc > mov) return acc;
  else return mov;
}, movements[0]);
console.log(max);
console.log(movements);
*/
/////////////////////coding challenge 2//////////////////////
/*
const calcAverageAge = function (ages) {
  const humanAge = ages.map(age => (age <= 2 ? 2 * age : 16 + age * 4));
  console.log(humanAge);
  const adults = humanAge.filter(curr => curr > 18);
  console.log(adults);
  
  const average = adults.reduce((acc, age) => acc + age / adults.length, 0);
  console.log(average);
  
  return average;
};
*/
///////////////method chaining///////////////////////
/*
const euroToUsd = 1.1;
const totalDeposits = movements
  .filter(mov => mov > 0)
  .map(mov => mov * euroToUsd)
  .reduce((acc, mov, i, arr) => acc + mov, 0);
console.log(totalDeposits);
*/
/////////////////////////////coding challenge 3////////////////////
// const calcAverageAge = ages => {
//   const average = ages
//     .map(age => (age <= 2 ? 2 * age : 16 + age * 4))
//     .filter((curr, i, arr) => curr > 18)
//     .reduce((acc, age, i, arr) => acc + age / arr.length, 0);

//   return average;
// };

// const avg1 = calcAverageAge([5, 2, 4, 1, 15, 8, 3]);
// const avg2 = calcAverageAge([16, 6, 10, 5, 6, 1, 4]);

// console.log(avg1, avg2);

//////////////Find method///////////////////
/*
const withdrawal = movements.find(mov => mov < 0);
console.log(withdrawal);

const account = accounts.find(account => account.owner === 'Jessica Davis');
console.log(account);

for (const account of accounts) {
  if (account.owner === 'Jessica Davis') console.log(account);
}
*/
// const account = accounts.find(account => account.owner === 'Jessica Davis');
// console.log(account);

/////flat and flatMap

/*
const arr = [[1, 2, 3], [4, 5, 6], 7, 8];
console.log(arr.flat());

const arrDeep = [[[1, 2], 3], [4, [5, 6]], 7, 8];
console.log(arrDeep.flat(3));

// flat

const overalbalance = accounts
  .map(acc => acc.movements)
  .flat()
  .reduce((acc, mov) => acc + mov, 0);
console.log(overalbalance);

///flatmap
const overalbalance2 = accounts
  .flatMap(acc => acc.movements)
  .reduce((acc, mov) => acc + mov, 0);

console.log(overalbalance2);
*/

// ///////////////////sorting arrays //mutates  the original array
/*
const owners = ['jonas', 'zach', 'adam', 'martha'];

console.log(owners.sort());
console.log(owners);

// numbers
console.log(movements);

movements.sort((a, b) => a - b);
console.log(movements);

// descending

console.log(movements.sort((a, b) => b - a));
*/
const arr = [1, 2, 3, 4, 5, 6, 7];

//  empty arrays + fill method
const x = new Array(7);
console.log(x);

// console.log(x.map(()=>5));
x.fill(1, 3, 5);
x.fill(1);
console.log(x);

arr.fill(23, 2, 6);

console.log(arr);

// array from method

const y = Array.from({ length: 7 }, () => 1);
console.log(y);

const z = Array.from({ length: 7 }, (curr, i) => i + 1);
console.log(z);

// 100 RANDOM DICE ROLL
const diceRoll = Array.from(
  { length: 100 },
  () => Math.floor(Math.random() * 100) + 1
);
console.log(diceRoll.sort((a, b) => a - b));

// ARRAY LIKE STRUCTURE INTO ARRAY

labelBalance.addEventListener('click', function () {
  const movementsUI = Array.from(
    document.querySelectorAll('.movements__value'),
    el => Number(el.textContent.replace('€', ''))
  );
  console.log(movementsUI);
});
movements.sort((a, b) => a - b);
console.log(movements.sort((a, b) => a - b));

console.log('...............................');

const arr1 = [1, 2, 3, 4, 5, 6, 7];
console.log(new Array(1, 2, 3, 4, 5, 6, 7));
console.log(new Array(2, 23, 45, 6, 6, 9));

const m = new Array(7);
console.log(m);
// console.log(new Array(7));
console.log(m.fill(5, 3, 5));

const l = Array.from({ length: 7 }, (_, i) => 5 + i);
console.log(l);

const r = Array.from({ length: 100 }, (_, i) =>
  Math.floor(Math.random() * 100 + 1)
);
console.log(r.sort((a, b) => a - b));

////////////////Array method practice//////////////////////

const bankDepositSum = accounts
  .flatMap(acc => acc.movements)
  .filter(mov => mov > 0)
  .reduce((acc, i) => acc + i, 0);

console.log(bankDepositSum);

//2.
const numDeposit1000 = accounts
  .flatMap(acc => acc.movements)
  .filter(mov => mov > 1000).length;

console.log(numDeposit1000);
