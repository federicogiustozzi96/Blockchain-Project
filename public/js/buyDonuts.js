let input1 = document.getElementById("input1") 
let risultato = document.getElementById("risultato1")
let buyButton = document.getElementById("buttonBuy")
let sellButton = document.getElementById("buttonSell")
let regex = /^[a-zA-Z]+$/; 
let buy = null
let sell = null

input1.addEventListener("input", Buy);

buyButton.addEventListener("click",buyContract)
sellButton.addEventListener("click",sellContract)

function buyContract()
{
    

    if(buy!=null)
    {
    fetch("/buy", { 
		method: "POST", 
		headers: { 
			'Content-Type': 'application/json', 
		}, 
		body: JSON.stringify({ "price":buy }) 
		})
        buy=null;
    }
    
}

function sellContract()
{
    if(sell!=null)
        {
    
        
        fetch("/sell", { 
            method: "POST", 
            headers: { 
                'Content-Type': 'application/json', 
            }, 
            body: JSON.stringify({ "price":sell }) 
            })
        sell=null;
        }
}


let input2 = document.getElementById("input2") 
let risultato2 = document.getElementById("risultato2")

input2.addEventListener("input", Sell);
let flag= /^\d+$/.test(e.target.value)
    

function Buy(e)
{   
    let flag= /^\d+$/.test(e.target.value)
    risultato.innerHTML=""
    if (e.target.value=="")
        risultato.innerHTML="<p><p>" 
    else if(!flag && !(e.target.value.includes("."))) 
    {   
        risultato.innerHTML="<p id=\"invalid\">invalid input<p>" 
            
    }
    else if (e.target.value <1)
    risultato.innerHTML="<p id=\"minimum\">Minimum of 1 Donuts<p>" 
    else
    {
        risultato.innerHTML="<p id=\"valid\">≅ "+e.target.value/1000000+" ETH<p>" 
        buy=e.target.value/1000000
    }
}

function Sell(e)
{   
    let flag= /^\d+$/.test(e.target.value)
    risultato2.innerHTML=""
    if (e.target.value=="")
        risultato2.innerHTML="<p><p>" 
    else if(!flag && !(e.target.value.includes("."))) 
    {   
        risultato2.innerHTML="<p id=\"invalid\">invalid input<p>" 
            
    }
    else if (e.target.value <1)
    risultato2.innerHTML="<p id=\"minimum\">Minimum of 0.001 ETH<p>" 
    else
    {
        risultato2.innerHTML="<p id=\"valid2\">≅ "+e.target.value/1000000+" ETH<p>"
        sell=e.target.value
    }
}
