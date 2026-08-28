let __damionCardFields = null;
let __damionCardRendered = false;
let __damionPayPalButtons = null;
let __damionPayPalRendered = false;

function validateCheckoutDetails(){
  const form = byId("checkoutForm");
  if(!form) return false;
  if(!cart.length){ toast("Your cart is empty"); return false; }
  return form.reportValidity();
}

function setPaymentChoice(mode){
  const paypalChoice = byId("payChoicePayPal");
  const cardChoice = byId("payChoiceCard");
  const paypalWrap = byId("paypalWrap");
  const cardWrap = byId("cardWrap");
  paypalChoice?.classList.toggle("active", mode === "paypal");
  cardChoice?.classList.toggle("active", mode === "card");
  if(paypalWrap) paypalWrap.hidden = mode !== "paypal";
  if(cardWrap) cardWrap.hidden = mode !== "card";
}

async function loadPayPal(){
  paypalConfig = await apiCall("damion-paypal", {action:"config"});
  if(!paypalConfig?.clientId){
    throw new Error("PayPal Client ID is missing in the connected Supabase project.");
  }

  if(window.paypal?.Buttons && window.paypal?.CardFields) return;

  const old = document.querySelector('script[data-damion-paypal]');
  if(old) old.remove();
  try { delete window.paypal; } catch(_) { window.paypal = undefined; }

  await new Promise((resolve,reject)=>{
    const script = document.createElement("script");
    script.src = `https://www.paypal.com/sdk/js?client-id=${encodeURIComponent(paypalConfig.clientId)}&currency=EUR&intent=capture&commit=true&components=buttons,card-fields&enable-funding=paypal`;
    script.dataset.damionPaypal = "1";
    script.async = true;
    script.onload = resolve;
    script.onerror = () => reject(new Error("PayPal could not load. Check that the Client ID belongs to the correct Live PayPal REST app."));
    document.head.appendChild(script);
  });
}

async function createDamionOrder(paymentMethod){
  const result = await apiCall("damion-paypal", {
    action:"create",
    payment_method:paymentMethod,
    cart,
    ...checkoutDetails()
  });
  if(!result?.orderID) throw new Error("PayPal did not return an order ID.");
  return result.orderID;
}

async function captureDamionOrder(orderID){
  setCheckoutStatus("Confirming payment…");
  const result = await apiCall("damion-paypal", {action:"capture", orderID});
  if(result.status !== "COMPLETED") throw new Error("Payment was not completed.");
  cart = [];
  saveCart();
  closeModal("checkoutModal");
  showReceipt(result);
}

async function payWithPayPal(){
  if(!validateCheckoutDetails()) return;
  setPaymentChoice("paypal");

  const wrap = byId("paypalWrap");
  const buttonsContainer = byId("paypalButtons");
  if(!wrap || !buttonsContainer) return;

  try{
    setCheckoutStatus("Loading PayPal…");
    await loadPayPal();

    if(paypalConfig?.environment !== "live"){
      setCheckoutStatus("PayPal is connected to Sandbox. Use Live credentials for real payments.", "warn");
    }else if(!paypalConfig?.hasClientSecret){
      throw new Error("The Live PayPal Client Secret is missing in Supabase.");
    }

    if(!window.paypal?.Buttons){
      throw new Error("The PayPal button component did not load.");
    }

    if(!__damionPayPalRendered){
      buttonsContainer.innerHTML = "";
      __damionPayPalButtons = window.paypal.Buttons({
        fundingSource: window.paypal.FUNDING?.PAYPAL,
        style:{layout:"vertical",shape:"rect",label:"paypal",height:48,tagline:false},
        createOrder: async () => {
          try{
            setCheckoutStatus("Creating secure PayPal order…");
            return await createDamionOrder("paypal");
          }catch(err){
            console.error(err);
            setCheckoutStatus(err?.message || "Could not create the PayPal order.", "error");
            throw err;
          }
        },
        onApprove: async data => {
          try{
            await captureDamionOrder(data.orderID);
          }catch(err){
            console.error(err);
            setCheckoutStatus(err?.message || "Could not confirm the PayPal payment.", "error");
          }
        },
        onCancel: () => setCheckoutStatus("PayPal checkout was cancelled. Nothing was charged.", "warn"),
        onError: err => {
          console.error(err);
          const current = byId("checkoutStatus")?.textContent || "";
          if(!current || current.includes("Loading PayPal") || current.includes("PayPal Live is ready")){
            setCheckoutStatus("PayPal could not open the checkout. Please try again or use card payment.", "error");
          }
        }
      });

      if(typeof __damionPayPalButtons.isEligible === "function" && !__damionPayPalButtons.isEligible()){
        throw new Error("PayPal account checkout is not available for this PayPal app/account right now.");
      }

      await __damionPayPalButtons.render("#paypalButtons");
      __damionPayPalRendered = true;
    }

    if(paypalConfig?.environment === "live"){
      setCheckoutStatus("PayPal Live is ready. Click the PayPal button below.", "ok");
    }
  }catch(err){
    console.error(err);
    setCheckoutStatus(err?.message || "PayPal checkout is temporarily unavailable.", "error");
  }
}

async function showCardPayment(){
  if(!validateCheckoutDetails()) return;
  setPaymentChoice("card");
  const paypalWrap = byId("paypalWrap");
  const cardWrap = byId("cardWrap");
  const payBtn = byId("cardPayButton");
  if(paypalWrap) paypalWrap.hidden = true;
  if(cardWrap) cardWrap.hidden = false;

  try{
    setCheckoutStatus("Loading secure card fields…");
    if(payBtn) payBtn.disabled = true;
    await loadPayPal();

    if(paypalConfig?.environment !== "live"){
      setCheckoutStatus("Card checkout is connected to PayPal Sandbox. Use Live credentials for real payments.", "warn");
    }
    if(!paypalConfig?.hasClientSecret){
      throw new Error("The PayPal Client Secret is missing in Supabase.");
    }
    if(!window.paypal?.CardFields){
      throw new Error("Card fields are not available for this PayPal integration.");
    }

    if(!__damionCardFields){
      __damionCardFields = window.paypal.CardFields({
        createOrder: async () => {
          setCheckoutStatus("Creating secure card order…");
          return await createDamionOrder("card");
        },
        onApprove: async data => {
          try{
            await captureDamionOrder(data.orderID);
          }catch(err){
            setCheckoutStatus(err?.message || "Could not confirm card payment.", "error");
          }
        },
        onError: err => {
          console.error(err);
          setCheckoutStatus("The card payment could not be completed. Try PayPal or another card.", "error");
        }
      });
    }

    if(!__damionCardFields.isEligible()){
      setCheckoutStatus("Credit/debit card checkout is not enabled for this PayPal merchant account yet. You can still use the PayPal button.", "warn");
      if(payBtn) payBtn.disabled = true;
      return;
    }

    if(!__damionCardRendered){
      await Promise.all([
        __damionCardFields.NameField().render("#card-name-field-container"),
        __damionCardFields.NumberField().render("#card-number-field-container"),
        __damionCardFields.ExpiryField().render("#card-expiry-field-container"),
        __damionCardFields.CVVField().render("#card-cvv-field-container")
      ]);
      __damionCardRendered = true;
    }

    if(payBtn){
      payBtn.disabled = false;
      payBtn.onclick = async () => {
        try{
          payBtn.disabled = true;
          setCheckoutStatus("Opening secure card verification…");
          await __damionCardFields.submit();
        }catch(err){
          console.error(err);
          setCheckoutStatus(err?.message || "Check the card details and try again.", "error");
          payBtn.disabled = false;
        }
      };
    }

    if(paypalConfig?.environment === "live"){
      setCheckoutStatus("Secure card checkout is ready. Card details are handled directly by PayPal.", "ok");
    }
  }catch(err){
    console.error(err);
    setCheckoutStatus(err?.message || "Card checkout is temporarily unavailable.", "error");
    if(payBtn) payBtn.disabled = true;
  }
}

const __damionResetCheckoutPayment = resetCheckoutPayment;
resetCheckoutPayment = function(){
  __damionResetCheckoutPayment();
  const cardWrap = byId("cardWrap");
  if(cardWrap) cardWrap.hidden = true;
  byId("payChoicePayPal")?.classList.remove("active");
  byId("payChoiceCard")?.classList.remove("active");
  __damionPayPalRendered = false;
  __damionPayPalButtons = null;
};
