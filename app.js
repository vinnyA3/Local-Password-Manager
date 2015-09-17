console.log("Starting Password Manager...");

var storage = require("node-persist");
var crypto = require("crypto-js");

//allow for variable storage
storage.initSync();

var argv = require("yargs").command('create','Create an account',function(yargs){

    yargs.options({
        name:{
            demand: true,
            alias: 'n',
            description:'Your account name(ie: Facebook) goes here',
            type: 'string'
        },
        username:{
            demand: true,
            alias: 'u',
            description: 'Your username/email goes here',
            type:'string'
        },
        password:{
            demand: true,
            alias: 'p',
            description: 'Your password goes here',
            type: 'string'
        },
        masterpassword:{
            demand: true,
            alias: 'm',
            description: 'Enter the master decrytion password here',
            type: 'string'
        }
    })
.help('help');
})
      .command('get', 'Get your account information', function(yargs){
          yargs.options({
              name: {
                  demand: true,
                  alias: 'n',
                  description: 'Your account name goes here',
                  type: 'string'
              },
            masterpassword:{
            demand: true,
            alias: 'm',
            description: 'Enter the master decrytion password here',
            type: 'string'
        }
          }).help('help');
    })
   .help('help')
   .argv




var command = argv._[0];

//account will have a name ie. Facebook
//account will have a username ie.vinaceto@yahoo
//account will have a password ie. password123
function getAccounts(masterPassword){
    var encryptedAccounts = storage.getItemSync('accounts');
    var accounts = [];
    
    if(typeof encryptedAccounts !== 'undefined'){
    var decryptedAccounts = crypto.AES.decrypt(encryptedAccounts,masterPassword);
    accounts = JSON.parse(decryptedAccounts.toString(crypto.enc.Utf8));
    }
    return accounts;
}

function saveAccounts(accounts, masterPassword){
    var encryptAccounts = crypto.AES.encrypt(JSON.stringify(accounts),masterPassword);
    storage.setItemSync('accounts',encryptAccounts.toString());
    return accounts;
}

function createAccount(account, masterPassword){
    var accounts  = getAccounts(masterPassword);
    accounts.push(account);
    saveAccounts(accounts,masterPassword);
    return accounts;
}

function getAccount(accountName, masterPassword){
    var accounts = getAccounts(masterPassword);
    for(var i = 0; i < accounts.length; ++i){
        if(accountName === accounts[i].name){
            return accounts[i];
        }
    }
         return undefined;   
}
        
//create/get an account based on the centered command (create/get)

if(command === 'create'){
   try{
    var createdAccount = createAccount({
        name: argv.name,
        username: argv.username,
        password: argv.password,
    }, argv.masterpassword);
    console.log("Account Created!");
    console.log(createdAccount);
}catch (e){
    console.log("Unable to create account!");
}
}else if(command === 'get'){
    try{
        var grabbedAccount = getAccount(argv.name, argv.masterpassword);
        if(typeof grabbedAccount === 'undefined'){
            console.log("Account not found!");
        }else{
            console.log("Account Found ....");
            console.log(grabbedAccount);
        }
    }catch (e){
        console.log("Unable to fetch desired account!");
    }
}

