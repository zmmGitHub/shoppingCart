'use strict';

//   let cart=[];
   let cart= JSON.parse(localStorage.getItem("cart"))||[];
const cartDOM = document.querySelector(".cart");
const addToCarButtonDOM = document.querySelectorAll(
    '[data-action="ADD_TO_CART"]'
);
// console.log(addToCarButtonDOM)
//   console.log(cart);

//函数----被剪切走的

function addCartFooter(){
    if(document.querySelector(".cart-footer")===null){
        cartDOM.insertAdjacentHTML('afterend',`
        <div class="cart-footer">
                    <button class="btn btn-danger" data-action="CLEAR_CART">清空购物车</button>
                    <button class="btn btn-primary" data-action="CHECKOUT">支付</button>
                </div> 
        `);
    document
    .querySelector('[data-action="CLEAR_CART"]')
    .addEventListener('click',()=>clearCart());  

    document
    .querySelector('[data-action="CHECKOUT"]')
    .addEventListener('click',()=>checkout());
    }
}

function clearCart(){
 cartDOM.querySelectorAll(".cart-item").forEach(cartItemDOM=> {
     cartItemDOM.classList.add('cart-item-remove');
     setTimeout(() => cartItemDOM.remove(),250);
 });
 cart = [];
 //本地存储置为空
//  localStorage.removeItem('cart');
   saveCart();

 document.querySelector('.cart-footer').remove();

 addToCarButtonDOM.forEach(addToCarButtonDOM=>{
     addToCarButtonDOM.innerText='加入购物车';
     addToCarButtonDOM.disabled=false;
 })
}

function checkout(){
     //微信支付 支付宝支付----我们没有后端人员的配合所以我们使用一个叫PayPal的东西
     //PayPal
     let paypalForHtml=`
     <form action="https://www.paypal.com/cgi-bin/websrc" id="paypal-form" method="post">
		  <input type="hidden" name="cmd" value="_cart">
		  <input type="hidden" name="upload" value="1">
          <input type="hidden" name="business" value="242788199@qq.com">
     `;
     cart.forEach((cartItem,index)=>{
         ++index;
         paypalForHtml +=`
         <input type="hidden" name="item-name_${index}" value="${cartItem.name}">
         <input type="hidden" name="amount_${index}" value="${cartItem.price}">
         <input type="hidden" name="quantity_${index}" value="${cartItem.quantity}">
       
         `;
     });
     paypalForHtml +=`
     <input type="submit" value="paypal">
	</form>
     `;
    document.querySelector('body').insertAdjacentHTML('beforeend',paypalForHtml);
    document.getElementById('paypal-form').submit();
}


function insertItemToDOM(product){
    cartDOM.insertAdjacentHTML("beforeend",`
    <div class="cart-item">
    <img class="cart-item-image" src="${product.image}" alt="${product.name}">
    <h3 class="cart-item-name">${product.name}</h3>
    <h3 class="cart-item-price">${product.price}</h3>
    </button>
<button class="btn btn-primary  ${product.quantity===1?
  'btn-danger':''}
btn-small" data-action="DECREASE_ITEM">
&minus;
</button>
<h3 class="cart-item-quantity">${product.quantity}</h3>
<button class="btn btn-primary btn-small" data-action="INCREASE_ITEM">
&plus;
</button>
<button class="btn btn-primary btn-danger btn-small" data-action="REMOVE_ITEM">
&times;
</button>
</div>
    `);
  addCartFooter();
}

function increaseItem(product,cartItemDOM){
    cart.forEach(cartItem=>{
        if(cartItem.name===product.name){
            cartItemDOM.querySelector('.cart-item-quantity'
            ).innerText= ++cartItem.quantity;

            cartItemDOM.querySelector('[data-action="DECREASE_ITEM"]')
            .classList.remove('btn-danger');

            //本地存储
            // localStorage.setItem('cart',JSON.stringify(cart));
            saveCart();
        }
    });
}

function decreaseItem(product,cartItemDOM,addToCarButtonDOM){
    cart.forEach(cartItem=>{
        if(cartItem.name===product.name){
            if(cartItem.quantity>1){
                cartItemDOM.querySelector(
                    ".cart-item-quantity"
            ).innerText = --cartItem.quantity;
               //本地存储
            //    localStorage.setItem('cart',JSON.stringify(cart));
            saveCart();
            }else{
                cartItemDOM.classList.add('cart-item-remove');
                //删除dom元素
                setTimeout(() =>cartItemDOM.remove(), 250);
                //删除数组里的元素
                cart=cart.filter(cartItem=>cartItem.name!==product.name);
                //本地存储
                //  localStorage.setItem('cart',JSON.stringify(cart));
                 saveCart();

                addToCarButtonDOM.innerText="加入购物车";
                addToCarButtonDOM.disabled=false;
            }
            if(cartItem.quantity===1){
                cartItemDOM.querySelector('[data-action="DECREASE_ITEM"]')
                .classList.add('btn-danger');
            }
        }
    });
    //------------------------
    if(cart.length<1){
        document.querySelector(".cart-footer").remove();
    }

}

function removeItem(product,cartItemDOM,addToCarButtonDOM){

                cartItemDOM.classList.add('cart-item-remove');
                //删除dom元素
                setTimeout(() =>cartItemDOM.remove(), 250);
                //删除数组里的元素
                cart=cart.filter(cartItem=>cartItem.name!==product.name);
                //本地存储
                // localStorage.setItem('cart',JSON.stringify(cart));
                 saveCart();

                addToCarButtonDOM.innerText="加入购物车";
                addToCarButtonDOM.disabled=false;
          
                //反调footer
                if(cart.length<1){
                 document.querySelector(".cart-footer").remove();
                }
}

function handleActionButtons(addToCarButtonDOM,product){
    addToCarButtonDOM.innerText='已加入';
    addToCarButtonDOM.disabled=true;

    //拿到商品容器
    const cartItemDOM=cartDOM.querySelectorAll(".cart-item");
    cartItemDOM.forEach(cartItemDOM=>{
        if
        (cartItemDOM.querySelector('.cart-item-name').innerText===product.name)
        {
            //加号按钮
            cartItemDOM.
            querySelector('[data-action="INCREASE_ITEM"]')
            .addEventListener('click',()=>{
            increaseItem(product,cartItemDOM)
            });
            //减号按钮
         cartItemDOM.querySelector('[data-action="DECREASE_ITEM"]')
                .addEventListener('click',()=>{
                 decreaseItem(product,cartItemDOM,addToCarButtonDOM);
                });
            //删除按钮
            cartItemDOM.querySelector('[data-action="REMOVE_ITEM"]')
            .addEventListener('click',()=>{
              removeItem(product,cartItemDOM,addToCarButtonDOM);
            });

        }
    }); 
 
}


//如果localstorage里边有内容，就应该展示出来
if(cart.length>0){

    cart.forEach(cartItem=>{
        const product = cartItem;
    insertItemToDOM(product);

    addToCarButtonDOM.forEach(addToCarButtonDOM=>{
     const productDom = addToCarButtonDOM.parentNode;

     //判断当前商品在购物车是否存在
     if(productDom.querySelector(".product-name").innerText
     ===product.name){
         saveCart();
         handleActionButtons(addToCarButtonDOM,product);
         }
    });

 });
}

// //遍历添加事件
addToCarButtonDOM.forEach(addToCarButtonDOM=>{
    addToCarButtonDOM.addEventListener('click',()=>{
        const productDom = addToCarButtonDOM.parentNode;
        // console.log(productDom);
        const product={
            image:productDom.querySelector(".product-image").
            getAttribute('src'),
            name:productDom.querySelector(".product-name").
            innerText,
            price:productDom.querySelector(".product-price").
            innerText,
            quantity:1
        };

        // console.log(product);

        //处理购物车里的数据
        const isInCart=cart.filter(cartItem=>cartItem.name===product.name).
        length>0;
        //判断
        if(!isInCart){
            //将商品加入购物车数组
        insertItemToDOM(product);
        cart.push(product);

        //本地存储
        //  localStorage.setItem('cart',JSON.stringify(cart));
        saveCart();
        //    
        }
        handleActionButtons(addToCarButtonDOM,product);        
    });
});

//计算商品总价
function saveCart(){
    localStorage.setItem('cart',JSON.stringify(cart));
    countCartTotal();
}
function countCartTotal(){
    let cartTotal=0;
    cart.forEach(cartItem=>(cartTotal += cartItem.quantity*cartItem.price));
    document.querySelector('[data-action="CHECKOUT"]').innerText = `支付 ¥${cartTotal}`;
}