pragma solidity ^0.4.11;

   contract CashFlowManagement{
       
             string public SME_name;
             int public SME_balance;
             int public productInventry;
             int public component1_Inventry;
             int public component2_Inventry;
             
        function  CashFlowManagement(){
            
             SME_name="SME";
             SME_balance=100000;
             productInventry=1000;
             component1_Inventry=1000;
             component2_Inventry=1000;
        }
         
         struct Selling{
             int quantity;
             int price_per_quantity;
             int sme_balance;
             int product_inventry;
             string date;
             string invoice;
         }
         
         struct Buying{
             int quantity1;
             int price_per_quantity1;
             int quantity2;
             int price_per_quantity2;
             string invoice;
             int component1_inventry;
             int component2_inventry;
             int sme_balance;
             string date;
             
         }
         
         
         struct SME_for_Selling{
             string name;
             int sellingId;
             mapping(int => Selling) map2;
         }
         
         
         struct SME_for_Buying{
             string name;
             int buyingId;
             mapping(int => Buying) map2;
         }
         
         mapping(string => SME_for_Selling) mapSell;
         
         mapping(string => SME_for_Buying) mapBuy;
         
         function addSelling(string SME_name, int quantity, int price_per_quantity, string date, string invoice){
             mapSell[SME_name].name=SME_name;
             mapSell[SME_name].sellingId++;
             mapSell[SME_name].map2[mapSell[SME_name].sellingId].quantity=quantity;
             mapSell[SME_name].map2[mapSell[SME_name].sellingId].price_per_quantity=price_per_quantity;
             mapSell[SME_name].map2[mapSell[SME_name].sellingId].date=date;
             mapSell[SME_name].map2[mapSell[SME_name].sellingId].invoice=invoice;
             SME_balance=SME_balance+(quantity*price_per_quantity);
             productInventry=productInventry-quantity;
             mapSell[SME_name].map2[mapSell[SME_name].sellingId].sme_balance=SME_balance;
             mapSell[SME_name].map2[mapSell[SME_name].sellingId].product_inventry=productInventry;
             
         }
         
         
         function addBuying(string SME_name, int quantity1, int price_per_quantity1, int quantity2, int price_per_quantity2,string date, string invoice){
             mapBuy[SME_name].name=SME_name;
             mapBuy[SME_name].buyingId++;
             mapBuy[SME_name].map2[mapBuy[SME_name].buyingId].quantity1=quantity1;
             mapBuy[SME_name].map2[mapBuy[SME_name].buyingId].price_per_quantity1=price_per_quantity1;
             mapBuy[SME_name].map2[mapBuy[SME_name].buyingId].quantity2=quantity2;
             mapBuy[SME_name].map2[mapBuy[SME_name].buyingId].price_per_quantity2=price_per_quantity2;
             mapBuy[SME_name].map2[mapBuy[SME_name].buyingId].date=date;
             mapBuy[SME_name].map2[mapBuy[SME_name].buyingId].invoice=invoice;
             component1_Inventry=component1_Inventry+quantity1;
             component2_Inventry=component2_Inventry+quantity2;
             SME_balance=SME_balance -((quantity1*price_per_quantity1)+(quantity2*price_per_quantity2));
             mapBuy[SME_name].map2[mapBuy[SME_name].buyingId].component1_inventry=component1_Inventry;
             mapBuy[SME_name].map2[mapBuy[SME_name].buyingId].component2_inventry=component2_Inventry;
             mapBuy[SME_name].map2[mapBuy[SME_name].buyingId].sme_balance=SME_balance;
         }
         
         
         
         
         function getSellingQuantity(string name) constant returns(string _name, int sellingId){
             return (name, mapSell[name].sellingId);
         }
         
         function getBuyingQuantity(string name) constant returns(string _name,int buyingId ){
             return (name, mapBuy[name].buyingId);
         }
         
         function sellingDetails(string name, int id) constant returns(int quantity, int price_per_quantity, string date, string invoice ,int sellbalance, int productinventry){
             return (mapSell[name].map2[id].quantity,mapSell[name].map2[id].price_per_quantity,mapSell[name].map2[id].date,mapSell[name].map2[id].invoice,mapSell[name].map2[id].sme_balance,mapSell[name].map2[id].product_inventry);
         }
         
         function buyingDetails(string name, int id) constant returns(int quantity1, int price_per_quantity1, int quantity2, int price_per_quantity2,string date, string invoice){
             
             return (mapBuy[name].map2[id].quantity1,mapBuy[name].map2[id].price_per_quantity1,mapBuy[name].map2[id].quantity2,mapBuy[name].map2[id].price_per_quantity2,mapBuy[name].map2[id].date,mapBuy[name].map2[id].invoice);
         }
         
         
         function getsellingDetailsForGraph(string name, int id) constant returns( string date ,int sellbalance, int productinventry){
             return (mapSell[name].map2[id].date,mapSell[name].map2[id].sme_balance,mapSell[name].map2[id].product_inventry);
         }
         
         
         
         function getBuyingDetailsForGraph(string name, int id) constant returns(string date, int smeBalance, int component1inventry, int component2inventry){
             
             return (mapBuy[name].map2[id].date,mapBuy[name].map2[id].sme_balance,mapBuy[name].map2[id].component1_inventry,mapBuy[name].map2[id].component2_inventry);
         }
         
         
         
         
         
   
  }