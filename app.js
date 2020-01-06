//Module Pattern in JS

/*var datacontroller=(function(){
    var a=34;
    var add=function(b){
        return a+b;
    }
    return {
        publicadd:function(b){
            return add(b);
        }
    }
})();

var uicontroller=(function(){
    
})();

var controller=(function(datactrl,uictrl){
    var z=datactrl.publicadd(5);
     console.log(z);
})(datacontroller,uicontroller);*/


var dataController=(function(){

    
    function createItem(id,desc,value)
    {
        this.id=id;
        this.desc=desc;
        this.value=value;
    }
    
    var all_Items={
        items:{
            income:[],
            expense:[]
        },
        ID:{
            incID:0,
            expID:0
        },
        totalbudget:{
            tinc:0,
            texp:0,
            abudget:0,
            epecentage:-1
        },
    };
    var calcBudgetLogic=function(){
        all_Items.totalbudget.tinc=0;
        all_Items.totalbudget.texp=0;
        for(var key in all_Items.items.income){
            all_Items.totalbudget.tinc+=all_Items.items.income[key].value;
        }
        for(var key in all_Items.items.expense){
            all_Items.totalbudget.texp+=all_Items.items.expense[key].value;
        }
    }
    var calcExpPercentages=function(){    
        var expensespercentages=[];
        for(var i in all_Items.items.expense){
            expensespercentages.push(Math.round((all_Items.items.expense[i].value/all_Items.totalbudget.tinc)*100));
        }
        return expensespercentages;
    }
    return {
        addItem:function(userdata){
            if(userdata.operator==="+"){
                all_Items.items.income[all_Items.ID.incID]=new createItem(all_Items.ID.incID,userdata.desc,userdata.amount);
                all_Items.ID.incID++;
                return (all_Items.items.income[all_Items.ID.incID-1]);
            }
            else{
                all_Items.items.expense[all_Items.ID.expID]=new createItem(all_Items.ID.expID,userdata.desc,userdata.amount);
                all_Items.ID.expID++;
                return (all_Items.items.expense[all_Items.ID.expID-1]);
            }
        },
        calcBudget:function(){
            calcBudgetLogic();
            all_Items.totalbudget.abudget=all_Items.totalbudget.tinc-all_Items.totalbudget.texp;
            if(all_Items.totalbudget.tinc>0){
                all_Items.totalbudget.epecentage=Math.round((all_Items.totalbudget.texp/all_Items.totalbudget.tinc)*100);
            }
            else
                all_Items.totalbudget.epecentage=-1;
        },
        getBudget:function(){
            return{
                budget:all_Items.totalbudget.abudget,
                totalIncome:all_Items.totalbudget.tinc,
                totalExpenses:all_Items.totalbudget.texp,
                ePercentage:all_Items.totalbudget.epecentage
            }
        },
        deleteItemData:function(type,id){
            all_Items.items[type].forEach(function(current,index,array){
                if(id===current.id){
                    array.splice(index,1);
                    return;
                }
            });
        },
        getExpPencentage:function(){
            return calcExpPercentages(); 
        },
        testing:function(){
            console.log(all_Items.items.income);
        }
    };
})();

var uiController=(function(){
    var DOMstrings={
        inputOperator:document.querySelector(".operation"),
        inputDesc:document.querySelector(".add_description"),
        inputAmount:document.querySelector(".value"),
        addBtn:document.querySelector(".add_btn"),
        incomeList:document.querySelector(".income-list"),
        expensesList:document.querySelector(".expenses-list"),
        totalIncome:document.querySelector(".iamount"),
        totalExpenses:document.querySelector(".eamount"),
        totalBudget:document.querySelector(".available-budget"),
        totalExpensePercent:document.querySelector(".epercent"),
        section3:document.querySelector(".section-3")
        //don't use query selectors here , assign only classnames to variables here like inputOperator:".operation"
    };
    formatNumber=function(num,type){
        num=num.toFixed(2);
        num=num.split(".");
        var int =num[0];
        if(int.length>5)
            int=int.substr(0,int.length-5)+","+int.substr(int.length-5,2)+","+int.substr(int.length-3,3);
        else if(int.length>3)
            int=int.substr(0,int.length-3)+","+int.substr(int.length-3,int.length);
        var dec=num[1];
        return (type+" "+int+"."+dec);
    }
    //creating forEach Method for NodeList which is returned by querySelectorAll instead of using slice method of Array object
        var nodeListforEach=function(list,callback){
            for(var i=0;i<list.length;i++)
                callback(list[i],i);
        }
    return {
        getInputData:function(){
            return {
                operator:DOMstrings.inputOperator.value,
                desc:DOMstrings.inputDesc.value,
                amount:parseFloat(DOMstrings.inputAmount.value)
            };
        },
        getDomStrings:function(){
            return DOMstrings;
        },
        insertItemInUI:function(obj,operator){
            var html,element,newhtml;
            if(operator==="+"){
                element=DOMstrings.incomeList;
                html='<div class="income--%id% item"><p><span>%description%</span><span class="amount">%amount%<i class="fa fa-times-circle"></i></span></p></div>'
            }
            else{
                element=DOMstrings.expensesList;
                html='<div class="expense--%id% item"><p><span>%description%</span><span class="amount">%amount%<span class="expense-percent">23%</span><i class="fa fa-times-circle"></i></span></p></div>'
            }
            newhtml=html.replace("%id%",obj.id);
            newhtml=newhtml.replace("%description%",obj.desc);
            newhtml=newhtml.replace("%amount%",formatNumber(obj.value,operator));
            
            
            element.insertAdjacentHTML("beforeend",newhtml);
        },
        clearFields:function(){
            var fieldsList,fieldsArr;
            fieldsList=document.querySelectorAll(".add_description,.value");
            fieldsArr=Array.prototype.slice.call(fieldsList);
            //forEach loop
            fieldsArr.forEach(function(current,index,array){
                current.value="";
            });
            fieldsArr[0].focus();
        },
        displayBudget:function(obj){
            DOMstrings.totalIncome.textContent=formatNumber(obj.totalIncome,"+");
            if(obj.budget>=0)
                DOMstrings.totalBudget.textContent="+ "+obj.budget.toFixed(2);
            else
                DOMstrings.totalBudget.textContent="- "+obj.budget;
            DOMstrings.totalExpenses.textContent=formatNumber(obj.totalExpenses,"-");
            if(obj.totalIncome>0)
                DOMstrings.totalExpensePercent.textContent=obj.ePercentage+"%";
            else
                DOMstrings.totalExpensePercent.textContent="---";   
        },
        deleteItemFromUI:function(selectorClass){
            var el=document.querySelector("."+selectorClass);
            el.parentNode.removeChild(el);
        },
        setExpPercentages:function(percentages){
            var expPercents=document.querySelectorAll(".expense-percent");
            nodeListforEach(expPercents,function(current,index){
                if(percentages[index]!=Infinity)
                    current.textContent=percentages[index]+"%";
                else
                    current.textContent="---";
            });
        },
        displayMonth:function(){
            var date =new Date();
            var year=date.getFullYear();
            var month=date.getMonth();
            var months=["january","February","March","April","May","June","july","August","September","October","November","December"];
            document.querySelector(".month-year").textContent="Available Budget in "+months[month]+" "+year;
        },
        changeInputBorder:function(){
            var fields;
            fields=document.querySelectorAll(".operation,.add_description,.value");
            nodeListforEach(fields,function(current,index){
                current.classList.toggle("red-focus");
                console.log(current);
            });
            document.querySelector(".add_btn").classList.toggle("red-btn");
        }
    };
})();

var controller=(function(datactrl,uictrl){
    var setUpEventListeners=function(){
        
        var DOMstring=uictrl.getDomStrings();
        DOMstring.addBtn.addEventListener("click",add_Income_Expenes);
        document.addEventListener("keypress",function(event){
            if(event.keyCode===13)
                add_Income_Expenes();
        });

        DOMstring.section3.addEventListener("click",deleteItem);
        DOMstring.inputOperator.addEventListener("change",uictrl.changeInputBorder);
    }
    var updateBugdet=function(){
        //5.calculate the budget
        datactrl.calcBudget();
        //return the budget
        var budget=datactrl.getBudget();
        
        //6.display the udget on UI
        uictrl.displayBudget(budget);
    }
    var updateExpensePecentages=function(){
        //1.calculate & return the Expenses Percentages
        var expPercentages = datactrl.getExpPencentage();
        //2.display the percentages in UI
        uictrl.setExpPercentages(datactrl.getExpPencentage());    
        
    }
    var add_Income_Expenes=function(){
        //1.get the data from UI
        var userData=uictrl.getInputData();
        if(userData.desc!=="" && userData.amount>0){
            //2.store the data in datacontroller
            var newData=datactrl.addItem(userData);
            //3.Add the item to UI
            uictrl.insertItemInUI(newData,userData.operator);
            //4.clearing the inpit fields
            uictrl.clearFields();
            
            updateBugdet();
            
            updateExpensePecentages();
        }
        
        
    }
    var deleteItem=function(event){
        var itemClass,itemClassArr;
        itemClass=event.target.parentNode.parentNode.parentNode.className;
        itemClass=itemClass.split(" ");
        itemClassArr=itemClass[0].split("--");
        if(itemClassArr[0]==="income"||itemClassArr[0]==="expense"){
            //1.delete the item from datacontroller
            datactrl.deleteItemData(itemClassArr[0],parseInt(itemClassArr[1]));
            //2.delete Item from UI
            uictrl.deleteItemFromUI(itemClass);
            //3.Update the Budget
            updateBugdet();
            
            updateExpensePecentages();
        }
        /*//another method to find a itemClass
        itemClass=event.target.parentNode;
        while(itemClass.parentNode && (itemClass.parentNode.className!="income-list" && itemClass.parentNode.className!="expenses-list")){
            itemClass=itemClass.parentNode;
        }
        if(itemClass.parentNode!=null)
            console.log(itemClass.className);*/
    }
    return {
        init:function(){
            uictrl.displayBudget({
                budget:0,
                totalIncome:0,
                totalExpenses:0,
                ePercentage:"--"
            });
            uictrl.displayMonth();
            return setUpEventListeners();
        }
    };
})(dataController,uiController);

controller.init();