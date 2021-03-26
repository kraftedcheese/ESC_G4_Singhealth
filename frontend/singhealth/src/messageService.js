import Message from "./Messages";

const chat_data = [{
    from_staff: true,
    body: "heyyy this is from the staff",
    timestamp: new Date().getTime(),
    tag: "textonly"
  },
  {
    from_staff: false,
    body: "from da tenant",
    timestamp: new Date().getTime(),
    tag: "textonly"
  },
  {
    from_staff: true,
    body: "this is gonna be a long piece of text to test qwrap LYRICS Can't count the years one hand  That we've been together  I need the other one to hold you. Make you feel, make you feel better.  It's not a walk in the park  To love each other.  But when our fingers interlock,  Can't eny, can't deny you're worth it  Cause after all this time.  I'm still into you I should be over all the butterflies But i'm into you (I'm in to you) And baby even on our worst nights I'm into you (I'm into you) Let em wonder how we got this far Cause I don't really need to wonder at all Yeah after all this time I'm still into you",
    timestamp: new Date().getTime(),
    tag: "textimage"
  },
  {
    from_staff:true,
    body:"Miusov, as a man man of breeding and deilcacy, could not but feel some inwrd qualms, when he reached the Father Superior's with Ivan: he felt ashamed of havin lost his temper. He felt that he ought to have disdaimed that despicable wretch, Fyodor Pavlovitch, too much to have been upset by him in Father Zossima's cell, and so to have forgotten himself. 'Teh monks were not to blame, in any case,' he reflceted, on the steps. 'And if they're decent people here (and the Father Superior, I understand, is a nobleman) why not be friendly and courteous withthem? I won't argue, I'll fall in with everything, I'll win them by politness, and show them that I've nothing to do with that Aesop, thta buffoon, that Pierrot, and have merely been takken in over this affair, just as they have.'",
    timestamp: new Date().getTime(),
    tag: "textonly"
  },
  {
    from_staff: false,
    body: new Date().getTime(),
    timestamp: new Date().getTime(),
    tag: "timeextension",
    info: "pending",
  }];

export function clearMessages(){
  localStorage.setItem("chat_data", JSON.stringify([]));
}

export function defaultMessages(){
  localStorage.setItem("chat_data",JSON.stringify(chat_data));
}

export function sendMessage(data,isStaff){ //data gotten is the text itself
    let chat_data = getAllMessages();
    //alert("from msgservice"+data);
    //chat_data.push(data);
    chat_data.push({
      from_staff: isStaff,
      body: data,
      timestamp: new Date().getTime(),
      tag: "textonly"
    })
    localStorage.setItem("chat_data", JSON.stringify(chat_data));
}

export function sendTimeExtReq(date){ //data gotten is the text itself
  let chat_data = getAllMessages();
  //alert("from msgservice"+data);
  //chat_data.push(data);
  //alert("is sendtimeextreq" + date);
  chat_data.push({
    from_staff: false,
    body: date,
    timestamp: new Date().getTime(),
    tag: "timeextension",
    info: "pending",
  })
  localStorage.setItem("chat_data", JSON.stringify(chat_data));
  //console.log(JSON.stringify(chat_data))
}

export function approveReq(msgid,date){
  let chat_data = getAllMessages();
  
}

export function getAllMessages() {
    if (localStorage.getItem("chat_data") == null)
        localStorage.setItem("chat_data", JSON.stringify([]))
    let chat_data = JSON.parse(localStorage.getItem("chat_data"));
    return (chat_data);
}