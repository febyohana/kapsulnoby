import {
  db,
  ref,
  push,
  set,
  onValue,
  remove,
  update
} from "./firebase.js";

// ====================
// COUNTDOWN
// ====================

const targetDate =
new Date(
  "December 1, 2026 00:00:00"
).getTime();

setInterval(() => {

  const now =
  new Date().getTime();

  const distance =
  targetDate - now;

  const days =
  Math.floor(
    distance /
    (1000 * 60 * 60 * 24)
  );

  const hours =
  Math.floor(
    (
      distance %
      (1000 * 60 * 60 * 24)
    ) /
    (1000 * 60 * 60)
  );

  const mins =
  Math.floor(
    (
      distance %
      (1000 * 60 * 60)
    ) /
    (1000 * 60)
  );

  const countdown =
  document.getElementById(
    "countdown"
  );

  if(countdown){
    countdown.innerHTML =
    `${days} hari
     ${hours} jam
     ${mins} menit`;
  }

}, 1000);


// ====================
// LETTER
// ====================

window.openLetter =
function(type){

  const popup =
  document.getElementById(
    "letter-popup"
  );

  const text =
  document.getElementById(
    "letter-text"
  );

  const letters = {
    capek:
    "Aku tau hari ini berat, tapi kamu hebat banget 🤍",

    kangen:
    "Kalau lagi kangen, inget ya aku juga selalu mikirin kamu 🌙",

    sedih:
    "Gapapa nangis dulu, aku tetap di sini buat kamu ❤️"
  };

  text.innerText =
  letters[type];

  popup.classList.remove(
    "hidden"
  );
};

window.closePopup =
function(){

  document
    .getElementById(
      "letter-popup"
    )
    .classList.add(
      "hidden"
    );
};


// ====================
// SECRET CALENDAR
// ====================

window.saveMessage =
function(){

  const title =
  document
  .getElementById(
    "title"
  ).value;

  const message =
  document
  .getElementById(
    "message"
  ).value;

  const unlockTime =
  document
  .getElementById(
    "unlockTime"
  ).value;

  if(
    !title ||
    !message ||
    !unlockTime
  ){
    alert(
      "Isi semua dulu 🤍"
    );
    return;
  }

  const newRef =
  push(
    ref(
      db,
      "messages"
    )
  );

  set(newRef,{
    title,
    message,
    unlockTime
  });

  document.getElementById(
    "title"
  ).value = "";

  document.getElementById(
    "message"
  ).value = "";

  document.getElementById(
    "unlockTime"
  ).value = "";
};


window.deleteMessage =
function(id){

  if(
    !confirm(
      "Hapus pesan?"
    )
  ) return;

  remove(
    ref(
      db,
      "messages/" + id
    )
  );
};


function loadMessages(){

  const messagesList =
  document.getElementById(
    "messagesList"
  );

  if(!messagesList)
    return;

  onValue(
    ref(db,"messages"),
    (snapshot)=>{

      messagesList.innerHTML =
      "";

      const data =
      snapshot.val();

      if(!data) return;

      Object.entries(data)
      .forEach(
        ([id,msg])=>{

        const unlockDate =
        new Date(
          msg.unlockTime
        );

        const unlocked =
        new Date() >=
        unlockDate;

        const div =
        document.createElement(
          "div"
        );

        div.classList.add(
          "message-card"
        );

        div.innerHTML = `
          <div class="message-content">

            <h3>${msg.title}</h3>

            ${
              unlocked
              ? `<p>${msg.message}</p>`
              : `
              <div class="hidden-message">
              🔒 Isi pesan masih terkunci
              </div>
              `
            }

            <div class="message-date">
            📅
            ${unlockDate.toLocaleString("id-ID")}
            </div>

            <button
            class="delete-btn"
            onclick="deleteMessage('${id}')">
            🗑️
            </button>

          </div>
        `;

        messagesList.appendChild(
          div
        );

      });

    }
  );
}

loadMessages();


// ====================
// FILTER YEAR
// ====================

populateYears();

function populateYears(){

  const selects = [

    document.getElementById(
      "filterYear"
    ),

    document.getElementById(
      "memoryFilterYear"
    )

  ];

  const currentYear =
  new Date()
  .getFullYear();

  selects.forEach(
    (select)=>{

    if(!select)
      return;

    for(
      let year = 2024;
      year <=
      currentYear + 5;
      year++
    ){

      const option =
      document.createElement(
        "option"
      );

      option.value =
      year;

      option.textContent =
      year;

      select.appendChild(
        option
      );
    }

  });

}


// ====================
// MEMORIES
// ====================

loadMemories();

window.saveMemory =
function(){

  const date =
  document.getElementById(
    "memoryDate"
  ).value;

  const title =
  document.getElementById(
    "memoryTitle"
  ).value;

  const text =
  document.getElementById(
    "memoryText"
  ).value;

  if(
    !date ||
    !text
  ){
    alert(
      "Isi dulu kenangannya 🤍"
    );
    return;
  }

  const newRef =
  push(
    ref(
      db,
      "memories"
    )
  );

  set(newRef,{
    date,
    title,
    text
  });

  document.getElementById(
    "memoryDate"
  ).value = "";

  document.getElementById(
    "memoryTitle"
  ).value = "";

  document.getElementById(
    "memoryText"
  ).value = "";
};


function loadMemories(){

  const container =
  document.getElementById(
    "memoryCalendar"
  );

  if(!container)
    return;

  onValue(
    ref(db,"memories"),
    (snapshot)=>{

      container.innerHTML =
      "";

      const data =
      snapshot.val();

      if(!data) return;

      Object.entries(data)
      .forEach(
        ([id,memory])=>{

        const box =
        document.createElement(
          "div"
        );

        box.classList.add(
          "memory-box"
        );

        const formatDate =
        new Date(
          memory.date
        )
        .toLocaleDateString(
          "id-ID",
          {
            day:"numeric",
            month:"long",
            year:"numeric"
          }
        );

        box.innerHTML = `
          <h3>📅</h3>
          <p>${formatDate}</p>
        `;

        container.appendChild(
          box
        );

      });

    }
  );
}


// ====================
// MOOD TRACKER
// ====================

loadMood();

window.setMood =
function(
emoji,
mood
){

  const moodData = {
    emoji,
    mood,
    time:
    new Date()
    .toLocaleString(
      "id-ID"
    )
  };

  localStorage.setItem(
    "dailyMood",
    JSON.stringify(
      moodData
    )
  );

  loadMood();
};


function loadMood(){

  const mood =
  JSON.parse(
    localStorage.getItem(
      "dailyMood"
    )
  );

  if(!mood)
    return;

  document
  .getElementById(
    "moodDisplay"
  ).innerHTML =
  `${mood.emoji}
   ${mood.mood}`;

  document
  .getElementById(
    "moodTime"
  ).innerHTML =
  `Update terakhir:
  ${mood.time}`;
}
