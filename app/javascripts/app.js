// Import the page's CSS. Webpack will know what to do with it.
import "../stylesheets/app.css";
import "bootstrap/dist/css/bootstrap.css";
import sleep from 'sleep-promise';

// Import libraries we need.
import { default as Web3 } from 'web3';
import { default as contract } from 'truffle-contract'

// Import our contract artifacts and turn them into usable abstractions.
import CashFlowManagement_artifacts from '../../build/contracts/CashFlowManagement.json'

// MetaCoin is our usable abstraction, which we'll use through the code below.
var CashFlowManagement = contract(CashFlowManagement_artifacts);

// The following code is simple to show off interacting with your contracts.
// As your needs grow you will likely need to change its form and structure.
// For application bootstrapping, check out window.addEventListener below.
var accounts;
var account;
var sellingInvoice;
var buyingInvoice;
var BalanceDate=[];
var ProductInventryDate=[];
var ComponentsDate=[];


window.App = {
  start: function () {
    var self = this;

    // Bootstrap the MetaCoin abstraction for Use.
    CashFlowManagement.setProvider(web3.currentProvider);

    // Get the initial account balance so it can be displayed.
    web3.eth.getAccounts(function (err, accs) {
      if (err != null) {
        alert("There was an error fetching your accounts.");
        return;
      }

      console.log("accounts",accs);
      if (accs.length == 0) {
        alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
        return;
      }

      accounts = accs;
      account = accounts[0];
      
      web3.personal.unlockAccount(web3.eth.accounts[0], "testing");
      var CashFlowManagement_instance;
      CashFlowManagement.deployed().then(function (instance) {
        CashFlowManagement_instance = instance;
        return CashFlowManagement_instance.SME_name();

      }).then(function (result) {
        document.getElementById("SME_name").innerHTML = result;
      }).then(function () {
        return CashFlowManagement_instance.SME_balance();
      }).then(function (result) {
        document.getElementById("SME_balance").innerHTML = result.toNumber();
      }).then(function () {
        return CashFlowManagement_instance.productInventry();
      }).then(function (result) {
        document.getElementById("productInventry").innerHTML = result.toNumber();
      }).then(function () {
        return CashFlowManagement_instance.component1_Inventry();
      }).then(function (result) {
        document.getElementById("component1_inventry").innerHTML = result.toNumber();
      }).then(function () {
        return CashFlowManagement_instance.component2_Inventry();
      }).then(function (result) {
        document.getElementById("component2_inventry").innerHTML = result.toNumber();
      })

    });
  },

  showCharts: function () {
    // charts
    //chart 1
    google.charts.load('current', { 'packages': ['corechart'] });
    google.charts.setOnLoadCallback(drawChart);

    function drawChart() {

      var data = new google.visualization.DataTable();
      data.addColumn('date', 'Time of Day');
      data.addColumn('number', 'Balance');
      BalanceDate.sort(function(a,b){
        var c=new Date(a[0]);
        var d=new Date(b[0]);
        return c-d;
      });

      data.addRows(BalanceDate);


      var options = {
        title: 'Cash Balance',

        hAxis: {
          format: 'M/d/yy',
          gridlines: { count: 5 }
        },
        vAxis: {
          gridlines: { color: 'none' },
          minValue: 0
        }
      };

      var chart = new google.visualization.LineChart(document.getElementById('curve_chart1'));

      chart.draw(data, options);


    }


    //charts 2
    google.charts.load('current', { 'packages': ['corechart'] });
    google.charts.setOnLoadCallback(drawChart2);

    function drawChart2() {

      var data = new google.visualization.DataTable();
      data.addColumn('date', 'Time of Day');
      data.addColumn('number', 'Product');
      ProductInventryDate.sort(function(a,b){
        var c=new Date(a[0]);
        var d=new Date(b[0]);
        return c-d;
      });
      data.addRows(ProductInventryDate);


      var options = {
        title: 'Product Inventry',

        hAxis: {
          format: 'M/d/yy',
          gridlines: { count: 5 }
        },
        vAxis: {
          gridlines: { color: 'none' },
          minValue: 0
        }
      };

      var chart = new google.visualization.LineChart(document.getElementById('curve_chart2'));

      chart.draw(data, options);

    }

    //charts 3
    google.charts.load('current', { 'packages': ['corechart'] });
    google.charts.setOnLoadCallback(drawChart3);

    function drawChart3() {

      var data = new google.visualization.DataTable();
      data.addColumn('date', 'Time of Day');
      data.addColumn('number', 'Component 1');
      data.addColumn('number', 'Component 2');

      ComponentsDate.sort(function(a,b){
        var c=new Date(a[0]);
        var d=new Date(b[0]);
        return c-d;
      });
      

      data.addRows(ComponentsDate);

      
      var options = {
        title: 'Components Inventry',

        hAxis: {
          format: 'M/d/yy',
          gridlines: { count: 5 }
        },
        vAxis: {
          gridlines: { color: 'none' },
          minValue: 0
        }
      };

      var chart = new google.visualization.LineChart(document.getElementById('curve_chart3'));

      chart.draw(data, options);

    }
  },

  addSalesDetails: function () {

    document.getElementById("spinner").removeAttribute("hidden");


    var SMEName = document.getElementById("SME_name").innerText;
    var sellQuantity = parseInt(document.getElementById("sellQuantity").value);
    var sellPricePerQuantity = parseInt(document.getElementById("sellPricePerQuantity").value);
    var sellDate = document.getElementById("sellDate").value;
    var salesInvoice = sellingInvoice;

    //console.log(SMEName + " " + sellQuantity + " " + sellPricePerQuantity + " " + sellDate + " " + salesInvoice);

    web3.personal.unlockAccount(web3.eth.accounts[0], "testing");

    var CashFlowManagement_instance;

    CashFlowManagement.deployed().then(function (instance) {

      CashFlowManagement_instance = instance;

      return CashFlowManagement_instance.addSelling(SMEName, sellQuantity, sellPricePerQuantity, sellDate, salesInvoice, { from: account, gas: 90000000 });

    }).then(function (result) {
      //console.log(result);
      document.getElementById("spinner").setAttribute("hidden","hidden");
     try{
      document.getElementById("salesAddedAlert").removeAttribute("hidden");
    }catch(e){
      document.getElementById("sellPricePerQuantity").value=null;
      document.getElementById("sellDate").value=null;
      document.getElementById("sellInvoice").value=null;
      document.getElementById("sellQuantity").value=null;
      document.getElementById("salesInvoice").src=null;
      App.start();
    }
      document.getElementById("sellPricePerQuantity").value=null;
      document.getElementById("sellDate").value=null;
      document.getElementById("sellInvoice").value=null;
      document.getElementById("sellQuantity").value=null;
      document.getElementById("salesInvoice").src=null;
      App.start();
    })


  },

  addPurchaseDetails: function () {

    document.getElementById("spinner").removeAttribute("hidden");
    

    var SMEName = document.getElementById("SME_name").innerText;
    var buyQuantity1 = parseInt(document.getElementById("buyQuantity1").value);
    var buyPricePerQuantity1 = parseInt(document.getElementById("buyPricePerQuantity1").value);
    var buyQuantity2 = parseInt(document.getElementById("buyQuantity2").value);
    var buyPricePerQuantity2 = parseInt(document.getElementById("buyPricePerQuantity2").value);
    var buyDate = document.getElementById("buyDate").value;
    var buysInvoice = buyingInvoice;
    web3.personal.unlockAccount(web3.eth.accounts[0], "testing");

    var CashFlowManagement_instance;
    //console.log(SMEName+" "+buyQuantity1+" "+buyPricePerQuantity1+" "+buyQuantity2+" "+buyPricePerQuantity2+" "+buyDate+" "+buysInvoice);
    CashFlowManagement.deployed().then(function (instance) {

      CashFlowManagement_instance = instance;

      return CashFlowManagement_instance.addBuying(SMEName, buyQuantity1, buyPricePerQuantity1, buyQuantity2, buyPricePerQuantity2,buyDate,buysInvoice, { from: account, gas: 90000000 });

    }).then(function (result) {
      //console.log(result);
      document.getElementById("spinner").setAttribute("hidden","hidden");
      try{
       document.getElementById("buysAddedAlert").removeAttribute("hidden");
      }catch(e){
        document.getElementById("buyQuantity1").value=null;
        document.getElementById("buyPricePerQuantity1").value=null;
        document.getElementById("buyQuantity2").value=null;
        document.getElementById("buyPricePerQuantity2").value=null;
        document.getElementById("buyDate").value=null;
        document.getElementById("buyInvoice").value=null;
        document.getElementById("purchaseInvoice").src=null;
        App.start();
      }
      document.getElementById("buyQuantity1").value=null;
      document.getElementById("buyPricePerQuantity1").value=null;
      document.getElementById("buyQuantity2").value=null;
      document.getElementById("buyPricePerQuantity2").value=null;
      document.getElementById("buyDate").value=null;
      document.getElementById("buyInvoice").value=null;
      document.getElementById("purchaseInvoice").src=null;
      App.start();
    })
  },

  uploadSalesInvoice: function () {
    const reader = new FileReader();
    reader.onloadend = function () {
      const ipfs = window.IpfsApi('localhost', 5001) // Connect to IPFS
      const buf = buffer.Buffer(reader.result) // Convert data into buffer
      ipfs.files.add(buf, (err, result) => { // Upload buffer to IPFS
        if (err) {
          //console.error(err)
          return
        }
        let url = `https://ipfs.io/ipfs/${result[0].hash}`
        //console.log(`Url --> ${url}`)
        document.getElementById("url").href = url
        document.getElementById("salesInvoice").src = url
        sellingInvoice = result[0].hash;
      })
    }
    const photo = document.getElementById("sellInvoice");
    reader.readAsArrayBuffer(photo.files[0]); // Read Provided File

  },

  uploadPurchaseInvoice: function () {
    const reader = new FileReader();
    reader.onloadend = function () {
      const ipfs = window.IpfsApi('localhost', 5001) // Connect to IPFS
      const buf = buffer.Buffer(reader.result) // Convert data into buffer
      ipfs.files.add(buf, (err, result) => { // Upload buffer to IPFS
        if (err) {
          //console.error(err)
          return
        }
        let url = `https://ipfs.io/ipfs/${result[0].hash}`
        //console.log(`Url --> ${url}`)
        document.getElementById("url").href = url
        document.getElementById("purchaseInvoice").src = url
        buyingInvoice = result[0].hash;
      })
    }
    const photo = document.getElementById("buyInvoice");
    reader.readAsArrayBuffer(photo.files[0]); // Read Provided File

  },


  getSMEDetails: function(){
    
   

    document.getElementById("spinner1").removeAttribute("hidden");

    web3.personal.unlockAccount(web3.eth.accounts[0], "testing");
        var SME_name=document.getElementById("SME_name").value;
        var CashFlowManagement_instance;
        
        CashFlowManagement.deployed().then(function (instance) {
    
          CashFlowManagement_instance = instance;
    
          return CashFlowManagement_instance.getSellingQuantity(SME_name);
    
        }).then(function(res){

           var SellingQuantity=res[1].toNumber();

            for(var i=1;i<=SellingQuantity;i++){
              
              App.getSellingDetails(SME_name,i); 
              App.selling_Details(SME_name,i);
            }

            
          }).then(function(){
              return CashFlowManagement_instance.getBuyingQuantity(SME_name);
          }).then(function(rest){
             var BuyingQuantity=rest[1].toNumber();
              for(var i=1;i<=BuyingQuantity;i++){
                App.getBuyingDetails(SME_name,i);
                App.buying_Details(SME_name,i);
              }

              
          }).then(function(){
             
            document.getElementById("spinner1").setAttribute("hidden","hidden");
            App.showCharts();

            
          });
  },

  getSellingDetails:function(SME_name,i){
   
    web3.personal.unlockAccount(web3.eth.accounts[0], "testing");
    var CashFlowManagement_instance;
    
    
    CashFlowManagement.deployed().then(function (instance) {
        CashFlowManagement_instance = instance;

      return CashFlowManagement_instance.getsellingDetailsForGraph(SME_name,i);

    }).then(function(res){
      var date=res[0].split("-");
      //console.log(date);

      var balanceVSdate=[new Date(date[0],date[1]-1,date[2]), res[1].toNumber()];
      var productVSdate=[new Date(date[0],date[1]-1,date[2]), res[2].toNumber()];
      BalanceDate.push(balanceVSdate);
      ProductInventryDate.push(productVSdate);

    })
  },

  getBuyingDetails:function(SME_name,i){
    web3.personal.unlockAccount(web3.eth.accounts[0], "testing");
    var CashFlowManagement_instance;
    
    
    CashFlowManagement.deployed().then(function (instance) {
        CashFlowManagement_instance = instance;

      return CashFlowManagement_instance.getBuyingDetailsForGraph(SME_name,i);

    }).then(function(res){
      var date=res[0].split("-");
      //console.log("buy "+res);

      var balanceVSdate=[new Date(date[0],date[1]-1,date[2]), res[1].toNumber()];
      var componentsVsDate=[new Date(date[0],date[1]-1,date[2]), res[2].toNumber(),res[3].toNumber()];
      BalanceDate.push(balanceVSdate);
      ComponentsDate.push(componentsVsDate);
      
    })
  },
  selling_Details: function(SME_name,i){
    var CashFlowManagement_instance;
    
    
    CashFlowManagement.deployed().then(function (instance) {
        CashFlowManagement_instance = instance;

      return CashFlowManagement_instance.sellingDetails(SME_name,i);

    }).then(function(res){
        //console.log("verma "+res);

        var sellrow=document.getElementById("salesID");
        console.log(i);
        var row=sellrow.insertRow(i);
        row.insertCell(0).innerHTML=SME_name;
        row.insertCell(1).innerHTML=res[0];
        row.insertCell(2).innerHTML=res[1];
        row.insertCell(3).innerHTML=res[2];

        let url = `https://ipfs.io/ipfs/${res[3]}`;

        row.insertCell(4).innerHTML='<a href='+url+' target='+'_blank'+'><img src='+url+' height='+'50px'+' width='+'50px'+'></a>'

    });
  },

  buying_Details: function(SME_name,i){
    var CashFlowManagement_instance;
    
    
    CashFlowManagement.deployed().then(function (instance) {
        CashFlowManagement_instance = instance;

      return CashFlowManagement_instance.buyingDetails(SME_name,i);

    }).then(function(res){
      var sellrow=document.getElementById("buysID");
      var row=sellrow.insertRow(i);
      row.insertCell(0).innerHTML=SME_name;
      row.insertCell(1).innerHTML=res[0];
      row.insertCell(2).innerHTML=res[1];
      row.insertCell(3).innerHTML=res[2];
      row.insertCell(4).innerHTML=res[3];
      row.insertCell(5).innerHTML=res[4];
     
      let url = `https://ipfs.io/ipfs/${res[5]}`;

      row.insertCell(6).innerHTML='<a href='+url+' target='+'_blank'+'><img src='+url+' height='+'50px'+' width='+'50px'+'></a>'

    });
  }




};

window.addEventListener('load', function () {
  // Checking if Web3 has been injected by the browser (Mist/MetaMask)
  if (typeof web3 !== 'undefined') {
    //console.warn("Using web3 detected from external source. If you find that your accounts don't appear or you have 0 MetaCoin, ensure you've configured that source properly. If using MetaMask, see the following link. Feel free to delete this warning. :) http://truffleframework.com/tutorials/truffle-and-metamask")
    // Use Mist/MetaMask's provider
    window.web3 = new Web3(web3.currentProvider);
  } else {
    //console.warn("No web3 detected. Falling back to http://127.0.0.1:9545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask");
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    window.web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:8545"));
  }

  App.start();
});
