const kinds = ["Coat","Pant","Sweat","T-shirt"];
const prices = [[[14.34, 5.71, 11.23], [14.83, 15.07, 7.49]], [[18.34, 9.89, 12.58], [19.64, 13.82, 12.01]], [[11.61, 7.8, 19.16], [15.88, 8.97, 15.08]], [[13.54, 5.63, 11.46], [10.82, 19.28, 8.61]]];
const genders = ["men","women"];
const allsizes = ["XS","S","M","ML","L","XL","XXL"];
const sizes = [[[['XL', 'M', 'S', 'ML', 'XS', 'L', 'XXL'], ['L', 'ML', 'M'], ['XS', 'M', 'XL', 'L']], [['M', 'L'], ['ML', 'XS', 'M', 'XXL', 'S', 'XL'], ['M', 'XS', 'XXL']]], [[['M', 'XS'], ['M', 'S', 'XL', 'XXL', 'ML'], ['ML', 'L', 'XS', 'M']], [['XL', 'S', 'ML', 'XXL'], ['XXL', 'L', 'ML', 'M'], ['S', 'L']]], [[['XS', 'S', 'XL'], ['L', 'XXL', 'XS', 'XL', 'ML', 'M'], ['XXL', 'XL', 'XS', 'S', 'ML']], [['S', 'XL', 'L', 'XXL', 'ML'], ['XXL', 'XL', 'S', 'ML', 'XS', 'M', 'L'], ['M', 'S', 'L', 'XL', 'XXL', 'XS', 'ML']]], [[['L', 'S', 'XXL'], ['M', 'L', 'XL', 'XS', 'S', 'XXL', 'ML'], ['S', 'ML', 'XL']], [['XS', 'S', 'ML', 'M', 'L', 'XL', 'XXL'], ['S', 'XL', 'M'], ['XXL', 'XL', 'M']]]];
const freeShipping = [[[0, 1, 1], [1, 1, 0]], [[0, 0, 0], [1, 0, 1]], [[0, 0, 1], [0, 1, 0]], [[0, 1, 0], [1, 0, 0]]];

let cart = [];

function onlyNumberKey(item,event) {
    let bool = true;
    let code = (event.which) ? event.which : evt.keyCode;
    if ((code > 31 && (code < 48 || code > 57)) || code==13){
        bool = false;
    }
    if (code==46){
        bool = true;
        for (let i of item.value){
            if (i=="."){
                bool = false;
                break;
            }
        }
        if (item.value.length==0){
            bool = false;
        }
    }
    /*if (bool){        
        item.value += event.key;
    }*/
    return bool;
}
let filtersize = [];
let filtercategories = [];
let filtergenders = [];
let minprice = -1;
let maxprice = -1;
let filterfreeshipping = false;

function SearchAllProducts(){
    let found = [];    
    for (let kind=0;kind<kinds.length;kind++){
        for (let gender=0;gender<2;gender++){
            for (let i=0;i<3;i++){
                if ((filtersize.length==0 || compareSizes(kind,gender,i)) && (!filterfreeshipping || (filterfreeshipping && freeShipping[kind][gender][i]))){
                    let bool = filtercategories.length==0;
                    for (let targetkind of filtercategories){
                        if (targetkind==kinds[kind]){
                            bool = true;
                            break;
                        }
                    }
                    if (bool){
                        bool = filtergenders.length==0;
                        for (let targetgender of filtergenders){
                            if (targetgender==genders[gender]){
                                bool = true;
                                break;
                            }
                        }
                        if (bool && (minprice==-1 || prices[kind][gender][i]>=minprice) && (maxprice==-1 || prices[kind][gender][i]<=maxprice)){
                            found.push([kind,gender,i,kinds[kind]+" "+genders[gender]+"/t"+(i+1)+".png",prices[kind][gender][i]]);
                        }
                    }
                }                
            }
        }
    }
    productcontainer.innerHTML = '<h2 style="margin-left: 0;margin-top: 70px;">' + found.length + ' Product(s) found</h2>';
    for (let object of found){
        let text = "";
        text += '<div class="product" id="'+object[0]+object[1]+object[2]+'">'
        +'<img style="object-fit: cover;" width="300" height="400px" src="'+object[3]+'">'
        +'<div class="productname">'
            +kinds[object[0]]+' '+genders[object[1]]+' '+object[2]
        +'</div>'
        +'<div class="productprice">'
            +'$ '+object[4]
        +'</div>'
        +'<div class="addtocart" onclick="AddToCart(this)">'
            +'Add to cart'
        +'</div>';
        if (freeShipping[object[0]][object[1]][object[2]]==1){
            text += '<div class="freeshipping">'
            +'Free shipping'
            +'</div>';
        }
        productcontainer.innerHTML += text+'</div>';
    }
    
    return found;
}

function compareSizes(kind,gender,index){
    for (let targetsize of sizes[kind][gender][index]){
        for (let size of filtersize){
            if (targetsize==size)return true;
        }
    }
    return false;
}

function AddSize(type){
    for (let i=0;i<filtersize.length;i++){
        if (type==filtersize[i]){
            filtersize.splice(i,1);
            //SearchAllProducts();
            document.querySelectorAll(".filtersize")[allsizes.indexOf(type)].style["opacity"]=0.4;
            return;
        }
    }    
    filtersize.push(type);    
    //SearchAllProducts();
    document.querySelectorAll(".filtersize")[allsizes.indexOf(type)].style["opacity"]=1;
}

function AddCategory(type){
    for (let i=0;i<filtercategories.length;i++){
        if (type==filtercategories[i]){
            filtercategories.splice(i,1);
            //SearchAllProducts();
            document.querySelectorAll(".filtercategory")[kinds.indexOf(type)].style["opacity"]=0.4;
            return;
        }
    }    
    filtercategories.push(type);    
    //SearchAllProducts();
    document.querySelectorAll(".filtercategory")[kinds.indexOf(type)].style["opacity"]=1;
}

function AddGender(type){
    for (let i=0;i<filtergenders.length;i++){
        if (type==filtergenders[i]){
            filtergenders.splice(i,1);
            //SearchAllProducts();
            document.querySelectorAll(".filtergender")[genders.indexOf(type)].style["opacity"]=0.4;
            return;
        }
    }    
    filtergenders.push(type);    
    //SearchAllProducts();
    document.querySelectorAll(".filtergender")[genders.indexOf(type)].style["opacity"]=1;
}

function Filter(){
    let min = document.querySelector("#minprice").value;
    let max = document.querySelector("#maxprice").value;
    let free = document.querySelector("#freeshipping").checked;
    if (min!=""){
        minprice = parseFloat(min);
    }
    else{
        minprice = -1;
    }
    if (max!=""){
        maxprice = parseFloat(max);
    }
    else{
        maxprice = -1;
    }
    filterfreeshipping = free==1;
    console.log(min,max,free);
    SearchAllProducts();
}

function OpenCart(){
    let items = document.querySelectorAll(".cartmenu");
    for (item of items){
        if (item.classList.contains("display")){
            item.classList.remove("display");
        }
        else{
            item.classList.add("display");
        }
    }
}

function AddToCart(button){
    let parent = button.parentElement;
    let kind = parent.id[0];
    let gender = parent.id[1];
    let index = parent.id[2];
    cart.push([kind,gender,index]);
    UpdateCart();
}

function UpdateCart(){
    document.querySelector("#cartcount").innerHTML = cart.length;
    document.querySelector("#cartproducts").innerHTML = "";
    let text = '<h2 style="font-size: 30px;">Prices:</h2>';
    let total = 0;
    let shipping = 0;
    for (let index=0;index<cart.length;index++){
        text += '<div class="price">'
        +'$ '+prices[cart[index][0]][cart[index][1]][cart[index][2]]
        +'</div>';
        total += prices[cart[index][0]][cart[index][1]][cart[index][2]];
        document.querySelector("#cartproducts").innerHTML += '<div id="'+index+'" class="cartproduct" style="overflow: auto;min-width: 874px;margin-bottom: 20px;">'
        +'<div style="width: 8%; height: 100%;float: left;text-align: center;line-height: 150px;">'
        +'<i style="text-align: center;color: rgb(218, 69, 69);font-size: 25px;" class="fa-solid fa-trash deletebutton" onclick="DeleteFromCart(this)"></i>'
        +'</div>'
        +'<div style="float: left;width: 12%;height: 150px;overflow: hidden;">'
        +'<img style="height: 100%;" src="'+kinds[cart[index][0]]+' '+genders[cart[index][1]]+'/t'+(parseInt(cart[index][2])+1)+'.png" alt="">'
        +'</div>'
        +'<div style="width: 60%;float: left; height: 100%;line-height: 150px;font-size: 16px;font-family: "Gill Sans", "Gill Sans MT", Calibri, "Trebuchet MS", sans-serif;box-sizing: border-box;padding-left: 3%;overflow: hidden;">'
        +kinds[cart[index][0]]+' '+genders[cart[index][1]]+' '+cart[index][2]
        +'</div>'
        +'<div style="text-align: center;width: 20%;float: left; height: 100%;line-height: 150px;font-size: 30px;font-family: "Gill Sans", "Gill Sans MT", Calibri, "Trebuchet MS", sans-serif;box-sizing: border-box;padding-left: 3%;overflow: hidden;">'
        +'$ '+prices[cart[index][0]][cart[index][1]][cart[index][2]]
        +'</div>'
        +'</div>';
        if (!freeShipping[cart[index][0]][cart[index][1]][cart[index][2]]){
            shipping += 0.37;
        }
    }
    text += '<br>'
    +'<hr style="border-top: 2px dashed rgb(128, 128, 128);">'
    +'<div class="price" id="shippingprice">'
    +'Shipping: $ '+round(shipping,2)
    +'</div><br><br>'
    +'<div class="price" id="totalprice">'
    +'Total: $ '+round(total,2)
    +'</div>'
    +'<br>'
    +'<button style="width: 40%; height: 5%; position: relative;left: 30%;background-color: rgb(255, 205, 6);border-radius: 3px;">Pay</button><br><br>';
    document.querySelector("#priceresult").innerHTML = text;
    text = ""
}

function DeleteFromCart(item){
    let index = parseInt(item.parentElement.id);
    cart.splice(index,1);
    UpdateCart();
}

function round(num,count){
    return Math.round(num*Math.pow(10,count))/Math.pow(10,count);
}