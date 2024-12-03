'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// VaultPro APP

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2023-11-18T21:31:17.178Z',
    '2023-12-23T07:42:02.383Z',
    '2024-01-28T09:15:04.904Z',
    '2024-04-01T10:17:24.185Z',
    '2024-11-26T14:11:59.604Z',
    '2024-11-27T17:01:17.194Z',
    '2024-11-30T23:36:17.929Z',
    '2024-12-02T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2023-11-01T13:15:33.035Z',
    '2023-11-30T09:48:16.867Z',
    '2023-12-25T06:04:23.907Z',
    '2024-01-25T14:18:46.235Z',
    '2024-02-05T16:33:06.386Z',
    '2024-04-10T14:43:26.374Z',
    '2024-06-25T18:49:59.371Z',
    '2024-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

// Data
// const account1 = {
//   owner: 'Jonas Schmedtmann',
//   movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
//   interestRate: 1.2, // %
//   pin: 1111,
// };

// const account2 = {
//   owner: 'Jessica Davis',
//   movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
//   interestRate: 1.5,
//   pin: 2222,
// };

// const account3 = {
//   owner: 'Steven Thomas Williams',
//   movements: [200, -200, 340, -300, -20, 50, 400, -460],
//   interestRate: 0.7,
//   pin: 3333,
// };

// const account4 = {
//   owner: 'Sarah Smith',
//   movements: [430, 1000, 700, 50, 90],
//   interestRate: 1,
//   pin: 4444,
// };

// const accounts = [account1, account2, account3, account4];

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


const formatMovementDate = function(date){
  const calcDaysPassed =(date1, date2)=>
    Math.round(Math.abs(date2-date1)/(1000*60*60*24));

  const daysPassed=calcDaysPassed(new Date(),date);
  if(daysPassed===0) return 'Today';
  if(daysPassed===1) return 'Yesterday';
  if(daysPassed<=7) return `${daysPassed} days ago`;
  else{
    const day = `${date.getDate()}`.padStart(2,0);
    const month=`${date.getMonth()+1}`.padStart(2,0);
    const year=date.getFullYear();
    return `${day}/${month}/${year}`;
  }


}
const displayMovements = function(acc, sort=false){
    containerMovements.innerHTML='';

    const movs = sort ? acc.movements.slice().sort((a,b)=>
    a-b) : acc.movements;

    movs.forEach(function(mov,i){
      const type = mov>0? 'deposit' : 'withdrawal';

      const date = new Date(acc.movementsDates[i]);
      const displayDate=formatMovementDate(date);

     const html=
        `
        <div class="movements__row">
          <div class="movements__type 
          movements__type--${type}">${i+1} ${type}</div>
          <div class="movements__date">${displayDate}</div>
          <div class="movements__value">${mov.toFixed(2)} &#8377; </div>
        </div>
        `;

        containerMovements.insertAdjacentHTML('afterbegin',html);
    });
};


const calcDisplayBalance=function(acc){
  acc.balance = acc.movements.reduce((acc,mov)=>acc+ mov,0);
    
    labelBalance.textContent=`${acc.balance.toFixed(2)} \u20B9`
}

const calcDisplaySummary = function(acc){

     const incomes = acc.movements.filter(mov=> mov>0).
     reduce((acc,mov)=>acc+mov,0);
     labelSumIn.textContent=`${incomes.toFixed(2)} \u20B9`;

     const out = acc.movements.filter(mov=> mov<0).
     reduce((acc,mov)=>(acc+mov),0);
     labelSumOut.textContent=`${Math.abs(out).toFixed(2)} \u20B9`;

     const interest=acc.movements.filter(mov=>mov>0)
     .map(deposit => (deposit*acc.interestRate)/100)
     .filter((int,i,arr)=>int>=1)
     .reduce((acc,int)=>acc+int,0);
     labelSumInterest.textContent=`${interest.toFixed(2)} \u20B9`;

}

const createUsernames = function (accs) {
    accs.forEach(function(acc){
        acc.username = acc.owner.toLowerCase()
        .split(' ')
        .map(name =>  name[0]).join('');
});
};

createUsernames(accounts);

const updateUI=function(acc){

  // Display movements
  displayMovements(acc);
  // Display balance
  calcDisplayBalance(acc);
  // Display summary
  calcDisplaySummary(acc);

}

/////////////////////////////////////////////////

let currentAccount;

//fake login
// currentAccount = account1;
// updateUI(currentAccount);
// containerApp.style.opacity=100;

//////////////////////////////////////////


btnLogin.addEventListener('click',function(e){
    e.preventDefault();
    currentAccount=accounts.find(
        acc=>acc.username===inputLoginUsername.value);
    if(currentAccount?.pin=== +inputLoginPin.value) {
        // Display UI and message
        labelWelcome.textContent=`Welcome back,${currentAccount.owner.split(' ')[0]

        }`;
        containerApp.style.opacity=100;

        // Create current Date and time

       // Experimenting API

       const now = new Date();
       const options={
         hour:'numeric',
         minute:'numeric',
         day:'numeric',
         month:'long',
         year:'numeric',
         weekday:'long'
       };
      const locale=currentAccount.locale;
       labelDate.textContent = new Intl.DateTimeFormat(
         locale,
         options
       ).format(now)
       console.log(locale)
        // const day=`${now.getDate()}`.padStart(2,0);
        // const month=`${now.getMonth()+1}`.padStart(2,0);
        // const year=now.getFullYear();
        // const hour=now.getHours();
        // const min= now.getMinutes();
        // labelDate.textContent=`${day}/${month}/${year}, ${hour}:${min}`;
       

        // clear input fields
        inputLoginUsername.value = inputLoginPin.value = '';
        inputLoginPin.blur();
        
        // Update UI
        updateUI(currentAccount);
    }
});

btnTransfer.addEventListener('click', function(e){
  e.preventDefault();
  const amount=Number(inputTransferAmount.value);
  const receiverAcc=accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value=inputTransferTo.value='';
  if (amount>0 && 
    receiverAcc &&
    currentAccount.balance>=amount && 
    receiverAcc?.username !== currentAccount.username){
      currentAccount.movements.push(-amount);
      receiverAcc.movements.push(amount);

      // Add transfer date
      currentAccount.movementsDates.push(new Date().toISOString());
      receiverAcc.movementsDates.push(new Date().toISOString());
      updateUI(currentAccount);
  }
});

btnLoan.addEventListener('click',function(e){
  e.preventDefault();

  const amount = Math.floor(inputLoanAmount.value);

  if(amount>0 &&
    currentAccount.movements.some(mov => mov >= amount*0.1)){

      // Add loan Date
      currentAccount.movementsDates.push(new Date().toISOString());

      currentAccount.movements.push(amount);
      updateUI(currentAccount);
    }
    inputLoanAmount.value='';
   
})



btnClose.addEventListener('click',function(e){
  e.preventDefault();
  if(inputCloseUsername.value===currentAccount.username && 
    Number(inputClosePin.value) === currentAccount.pin ){
    console.log("Delete")
  };
  const index=accounts.findIndex(
    acc => acc.username === currentAccount.username
  );
  accounts.splice(index,1);
  containerApp.style.opacity=0;
  inputClosePin.value=inputCloseUsername.value='';

  labelWelcome.textContent=`Log in to get started`;


});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  sorted = !sorted;
  displayMovements(currentAccount.movements, sorted);

  // Update the sort button symbol
  const sortButton = document.querySelector('.btn--sort');
  const symbol = sorted ? '↑' : '↓'; // Change the symbol based on sorting order
  sortButton.innerHTML = `${symbol} SORT`;
});


/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////
/*
const eurToUSD=1.2;
const movementsUSD=movements.map( mov=> mov * eurToUSD) ;

const movementUSDfor=[];
for (const mov of movements) movementUSDfor.push(mov*eurToUSD);

movements.forEach(function(mov,i,arr){
    if (mov>0){
        console.log(`Movement ${i+1}: You deposited ${mov}`)
    }
    else{
        console.log(`Movement ${i+1}: You withdrew ${Math.abs(mov)}`)
    }
});

const movementsDescription = movements.map(
    (mov,i) =>
        `Movement ${i+1}: You ${ mov>0 ? 'deposited':
             'withdrew'} ${Math.abs(mov)}`
    );


    const deposits=movements.filter(function(mov){
        return mov > 0;
    });
    const depositsFor = [];;
    for (const mov of movements) if (mov>0) depositsFor.push(mov);


    const withdrawals=movements.filter(function(mov){
        return mov < 0;
    });
    const withdrawalsFor = [];;
    for (const mov of movements) if (mov<0) withdrawalsFor.push(mov);
   
    max value in movements
    const max = movements.reduce((acc,mov) => {
        if(acc>mov)
            return acc;
        else return mov;
    },movements[0])
*/    

/*
const  depositedAmount1 = accounts.
flatMap(acc=>acc.movements).
filter(acc => acc>0).
reduce((acc,mov)=>acc+mov,0);
console.log(depositedAmount1)

const  depositedAmount2 = accounts.
flatMap(acc=>acc.movements).
reduce((acc,mov)=>(mov>0?++acc:acc),0);
console.log(depositedAmount2)

const sums = accounts.
flatMap(acc=>acc.movements).
reduce(
  (sums,cur)=>{
  //   cur>0?(sums.deposits+=cur):
  // (sums.withdrawals+=cur);
  sums[cur>0?'deposits':'withdrawals']+=cur;
  return sums;
  }, 
  {deposits:0, withdrawals:0}
);
console.log(sums)

const convertTitleCase=function(title){
  const capitalize = str=> str[0].toUpperCase()+str.slice(1)
  const exceptions=['a','an','the','but','or','on','in','with'];
  const titleCase=title
  .toLowerCase()
  .split(' ')
  .map(word => (exceptions.includes(word)?word:capitalize(word)))
  .join(' ');

  return capitalize(titleCase);
}
console.log(convertTitleCase('How are you? i am here in the bog'));

*/

