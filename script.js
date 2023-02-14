let addBtn = document.querySelector(".add-btn");
let remBtn = document.querySelector(".remove-btn");
let mainCont = document.querySelector(".main-cont");
let button = document.querySelector(".addBtn");
let addFlag = false;
let removeFlag = false;
let modelCont = document.querySelector(".modal-cont");
let textArea = document.querySelector("textarea");
let colors = ["red", "pink", "gold", "cyan"];
let AllpriorityColor = document.querySelectorAll(".priority-color");
let modalPriorityColor = colors[colors.length - 1];
let lock = "fa-lock";
let unlock = "fa-lock-open";
let toolBoxColors = document.querySelectorAll(".color");
let ticketArr = [];

if (localStorage.getItem("Jira_Tickets")) {
  // retrieve and display ticket
  ticketArr = localStorage.getItem("Jira_Tickets");
  ticketArr = JSON.parse(ticketArr);

  ticketArr.forEach((ticketObj) => {
    createTicket(
      ticketObj.ticketColor,
      ticketObj.ticketTask,
      ticketObj.ticketId
    );
  });
}
// this event will listen that someone click on + button on screen to add a task
addBtn.addEventListener("click", function (e) {
  // modelCont.classList.toggle("hidden");
  // addFlag true --> Modal Display
  // addFlag false---> Modal Hidden
  addFlag = !addFlag;
  console.log("addFlage --> " + addFlag);
  if (addFlag) {
    console.log("modal on ....");
    modelCont.style.display = "flex";
    addBtn.classList.add("redBox");
  } else {
    console.log("modal off ....");
    modelCont.style.display = "none";
    addBtn.classList.remove("redBox");
  }
});

remBtn.addEventListener("click", function (e) {
  removeFlag = !removeFlag;
  if (removeFlag == true) {
    remBtn.classList.add("redBox");
  } else {
    remBtn.classList.remove("redBox");
  }
});

// this function will create new ticket and add it html using DOM
function createTicket(ticketColor, ticketTask, ticketId) {
  let id = ticketId || shortid();
  let ticketCont = document.createElement("div");
  ticketCont.setAttribute("class", "ticket-cont");
  ticketCont.innerHTML = `<div class="ticket-color ${ticketColor}"></div>
  <div class="ticket-id">#${id}</div>
  <div class="task-area">${ticketTask}</div>
  <div class="ticket-lock">
          <i class="fa-solid fa-lock"></i>
        </div>`;

  mainCont.appendChild(ticketCont);
  // create object of ticket add to ticketArr
  if (!ticketId) {
    ticketArr.push({ ticketColor, ticketTask, ticketId: id });
    localStorage.setItem("Jira_Tickets", JSON.stringify(ticketArr));
  }
  // console.log(typeof id);
  handleRemovel(ticketCont, id);
  handleColor(ticketCont, id);
  handleLock(ticketCont, id);
}

function handleColor(ticket, id) {
  // console.log("handle color called for ", ticket, id);

  let ticketColor = ticket.querySelector(".ticket-color");
  ticketColor.addEventListener("click", function (e) {
    // get ticketIdx from ticketArr
    let ticketIdx = getTicketIdx(id);
    let currTicketColor = ticketColor.classList[1];
    // get ticketColor index
    let currTicketColorIdx = colors.findIndex((color) => {
      return currTicketColor === color;
    });
    console.log(currTicketColor, currTicketColorIdx);
    let newTicketColorIdx = (currTicketColorIdx + 1) % 4;
    let newTicketColor = colors[newTicketColorIdx];
    ticketColor.classList.remove(currTicketColor);
    ticketColor.classList.add(newTicketColor);

    // modify data in local storage
    ticketArr[ticketIdx].ticketColor = newTicketColor;
    localStorage.setItem("Jira_Tickets", JSON.stringify(ticketArr));
  });
}

function getTicketIdx(id) {
  let ticketIdx = ticketArr.findIndex((ticketObj) => {
    return id === ticketObj.ticketId;
  });

  return ticketIdx;
}

function handleLock(ticket, id) {
  // console.log("handle lock called for ", ticket, id);

  let ticketLockElem = ticket.querySelector(".ticket-lock");
  let ticketLock = ticketLockElem.children[0];
  console.log(ticketLock);
  let ticketTaskArea = ticket.querySelector(".task-area");
  ticketLock.addEventListener("click", function (e) {
    let ticketIdx = getTicketIdx(id);
    if (ticketLock.classList.contains(lock)) {
      ticketLock.classList.remove(lock);
      ticketLock.classList.add(unlock);
      ticketTaskArea.setAttribute("contenteditable", "true");
    } else {
      ticketLock.classList.remove(unlock);
      ticketLock.classList.add(lock);
      ticketTaskArea.setAttribute("contenteditable", "false");
      // Modify data in local Storage (ticket task)
      ticketArr[ticketIdx].ticketTask = ticketTaskArea.textContent;
      localStorage.setItem("Jira_Tickets", JSON.stringify(ticketArr));
    }
  });
}

function handleRemovel(ticket, id) {
  // if remove-btn contain class red and ticket was clicked then remove ticket
  ticket.addEventListener("click", function (e) {
    // console.log("handle removel called for ", ticket, id);
    if (removeFlag) {
      let ticketIdx = getTicketIdx(id);
      console.log(ticketIdx);
      //DB removel
      ticketArr.splice(ticketIdx, 1);
      localStorage.setItem("Jira_Tickets", JSON.stringify(ticketArr));
      // UI removel
      ticket.remove();
    }
  });
}

// filter operation

// for (let i = 0; i < toolBoxColors.length; i++) {
//   toolBoxColors[i].addEventListener("click", (e) => {
//     let currToolBoxColor = toolBoxColors[i].classList[0];
//     let filterTickets = ticketArr.filter((ticketObj) => {
//       return ticketObj.ticketColor === currToolBoxColor;
//     });
//     // remove all ticket
//     let allTicketCont = document.querySelectorAll(".ticket-cont");

//     for (let i = 0; i < allTicketCont.length; i++) {
//       allTicketCont[i].remove();
//     }
//     // display all ticket
//     filterTickets.forEach((ticketObj) => {
//       createTicket(
//         ticketObj.ticketColor,
//         ticketObj.ticketTask,
//         ticketObj.ticketId
//       );
//     });
//   });

//   toolBoxColors[i].addEventListener("dblclick", (e) => {
//     // let currToolBoxColor = toolBoxColors[i].classList[0];
//     // let filterTickets = ticketArr.filter((ticketObj) => {
//     //   return ticketObj.ticketColor === currToolBoxColor;
//     // });
//     // remove all ticket
//     let allTicketCont = document.querySelectorAll(".ticket-cont");

//     for (let i = 0; i < allTicketCont.length; i++) {
//       allTicketCont[i].remove();
//     }
//     // display all ticket
//     ticketArr.forEach((ticketObj) => {
//       createTicket(
//         ticketObj.ticketColor,
//         ticketObj.ticketTask,
//         ticketObj.ticketId
//       );
//     });
//   });
// }

toolBoxColors.forEach((toolColor) => {
  toolColor.addEventListener("click", function (e) {
    let currToolBoxColor = toolColor.classList[0];

    let filterTickets = ticketArr.filter((ticketObj) => {
      return ticketObj.ticketColor === currToolBoxColor;
    });
    // remove all ticket
    mainCont.innerHTML = "";

    filterTickets.forEach((ticketObj) => {
      createTicket(
        ticketObj.ticketColor,
        ticketObj.ticketTask,
        ticketObj.ticketId
      );
    });
    // display new filterd ticket
  });

  toolColor.addEventListener("dblclick", function (e) {
    // let currToolBoxColor = toolColor.classList[0];

    // let filterTickets = ticketArr.filter((ticketObj) => {
    //   return ticketObj.ticketColor === currToolBoxColor;
    // });
    // remove all ticket
    mainCont.innerHTML = "";

    ticketArr.forEach((ticketObj) => {
      createTicket(
        ticketObj.ticketColor,
        ticketObj.ticketTask,
        ticketObj.ticketId
      );
    });
    // display new filterd ticket
  });
});

// this event will listen that some one click shift when modalCont is appear on screnn if yes then task will created and create task function will get called
button.addEventListener("click", function (e) {
  let key = e.key;

  if (textArea.value !== "" && addFlag == true) {
    console.log(textArea.value);
    createTicket(modalPriorityColor, textArea.value);
    addFlag = false;
    setModalToDefault();
    // modelCont.classList.toggle("hidden");
  }
});

// this code will rearrange black border to selected color as priority as set value of modalpriorityColor value when user selct any color as priority if not last color is default set
AllpriorityColor.forEach((colorElem) => {
  colorElem.addEventListener("click", (e) => {
    //it will remove border from all color boxes

    AllpriorityColor.forEach((priorityColorElem) => {
      priorityColorElem.classList.remove("border");
    });

    // it will add black border to selectes color
    colorElem.classList.add("border");

    // it will set modalPriorityColor
    modalPriorityColor = colorElem.classList[0];
  });
});

function setModalToDefault() {
  AllpriorityColor.forEach((priorityColorElem) => {
    priorityColorElem.classList.remove("border");
  });

  AllpriorityColor[3].classList.add("border");
  modelCont.style.display = "none";
  textArea.value = "";
  addBtn.classList.remove("redBox");
  modalPriorityColor = colors[colors.length - 1];
}
