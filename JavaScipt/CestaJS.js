const token = "5e040aa11910c";

var checkout = () => {};

class Gafas{
    constructor(id,amount){
        this.id = id;
        this.amount = amount;
        this.title = "";
        this.price = "";
        this.image = "";
    }

    async loadGlasses(){
        await fetch("http://puigpedros.salle.url.edu/pwi/glasses/api/detail/"+token+"/"+this.id)
        .then((r) => r.json()).then((r)=>{
            this.title = r["data"]["title"];
            this.price = r["data"]["price"];
            this.image = r["data"]["images"][0];
        });
    }

    getInnerHTML(){
        return "<section class=\"data\" itemprop=\"orderedItem\" itemscope itemtype=\"http://schema.org/OrderItem\" >"+
            "<input class=\"amount\" type=\"number\" step=\"1\" min=\"0\" value="+this.amount+" itemprop=\"orderQuantity\" id="+this.id+"_input />"+
            "<img class=\"picutre\" src="+this.image+" alt="+this.title+" itemprop=\"image\" />"+
            "<h3 class=\"title name\" itemprop=\"name\">"+this.title+"</h3>"+
            "<p  class=\"title price\" itemprop=\"price\">"+this.price+"€</p>"+
        "</section>"
    }
    
    updateTriggers(){
        document.getElementById(this.id+"_input").addEventListener("onchange",this.updateAmount,false);
    }

    updateAmount(am){
        this.amount  = am.value;
    }

    getTotalPrice(){
        return this.price*this.amount;
    }
    
}

try{
    let localData = JSON.parse(localStorage.getItem("Cesta"));
    let gafas = [];
    let promises = [];

    //SANDRA
    if (localData != null) {
        localData.forEach((gafa) => {
            var gaf = new Gafas(gafa.id,gafa.qty);
            promises.push(gaf.loadGlasses());
            gafas.push(gaf);
        });
    }

    Promise.all(promises).then(()=>{
        let items = document.getElementById("CartElements");
        let price = 0;
        gafas.forEach((gafa) => {
            price += gafa.getTotalPrice();
            items.innerHTML +=  gafa.getInnerHTML();
            gafa.updateTriggers();
        });

        document.getElementById("total").value = ""+price;
        document.getElementById("check").addEventListener("click",()=>{
            gafas.forEach((gafa) => {
                fetch("http://puigpedros.salle.url.edu/pwi/glasses/api/remove/" + token, {
                    method: "POST",
                    body: "{\"id\": \"" + gafa.id + "\"}"
                });
            });
            checkout();
            localStorage.setItem('precioTotal', JSON.stringify(price));

        });
    });



}catch(exception){
    console.log(exception);
    //TODO sacar de esta página
}
