import {
  db,
  ref,
  push,
  set,
  onValue,
  remove
} from "./firebase.js";

// COUNTDOWN
const targetDate = new Date("December 1, 2026 00:00:00").getTime();

setInterval(() => {
  const now = new Date().getTime();
  const distance = targetDate - now;

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const mins = Math.floor(
    (distance % (1000 * 60 * 60)) / (1000 * 60)
  );

  document.getElementById("countdown").innerHTML =
    `${days} hari ${hours} jam ${mins} menit`;
}, 1000);


// LETTER
function openLetter(type) {
  const popup = document.getElementById("letter-popup");
  const text = document.getElementById("letter-text");

  const letters = {
    capek: "Aku tau hari ini berat, tapi kamu hebat banget 🤍",
    kangen: "Kalau lagi kangen, inget ya aku juga selalu mikirin kamu 🌙",
    sedih: "Gapapa nangis dulu, aku tetap di sini buat kamu ❤️"
  };

  text.innerText = letters[type];
  popup.classList.remove("hidden");
}

function closePopup() {
  document.getElementById("letter-popup")
    .classList.add("hidden");
}

// CALENDAR
function showMessage(day) {
  const messages = {
    25: "Semoga hari ini kamu bahagia 🤍",
    30: "Jangan lupa makan yaaa 🥹",
    10: "10 Juni: Special surprise for you 🎁"
  };

  document.getElementById("calendar-message")
    .innerText = messages[day];
}
// SECRET CALENDAR
// SECRET CALENDAR FIREBASE

window.saveMessage = function () {

  const title =
    document.getElementById("title").value;

  const message =
    document.getElementById("message").value;

  const unlockTime =
    document.getElementById("unlockTime").value;

  if (!title || !message || !unlockTime) {
    alert("Isi semua dulu 🤍");
    return;
  }

  const newRef =
    push(ref(db, "messages"));

  set(newRef, {
    title,
    message,
    unlockTime
  });

  document.getElementById("title").value = "";
  document.getElementById("message").value = "";
  document.getElementById("unlockTime").value = "";
};

window.deleteMessage = function(id){

  if(!confirm("Hapus pesan?"))
    return;

  remove(
    ref(db, "messages/" + id)
  );
};

function loadMessages() {

  const messagesList =
    document.getElementById("messagesList");

  onValue(
    ref(db, "messages"),
    (snapshot) => {

      messagesList.innerHTML = "";

      const data =
        snapshot.val();

      if (!data) return;

      Object.entries(data)
      .forEach(([id, msg]) => {

        const unlockDate =
          new Date(msg.unlockTime);

        const unlocked =
          new Date() >= unlockDate;

        const div =
          document.createElement("div");

        div.classList.add("message-card");

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
              📅 ${unlockDate.toLocaleString()}
            </div>

            <button
              class="delete-btn"
              onclick="deleteMessage('${id}')"
            >
              🗑️
            </button>

          </div>
        `;

        messagesList.appendChild(div);

      });

    }
  );
}

loadMessages();

populateYears();

function populateYears() {

  const filterYear =
    document.getElementById("filterYear");

  const currentYear =
    new Date().getFullYear();

  for(let year = 2024;
      year <= currentYear + 5;
      year++) {

    const option =
      document.createElement("option");

    option.value = year;
    option.textContent = year;

    filterYear.appendChild(option);
  }

}
// MEMORY CALENDAR

loadMemories();

function saveMemory() {

  const date =
    document.getElementById("memoryDate").value;

  const title =
    document.getElementById("memoryTitle").value;

  const text =
    document.getElementById("memoryText").value;

  if (!date || !text) {
    alert("Isi dulu kenangannya 🤍");
    return;
  }

  const memories =
    JSON.parse(
      localStorage.getItem("memories")
    ) || [];

  memories.push({
    date,
    title,
    text
  });

  localStorage.setItem(
    "memories",
    JSON.stringify(memories)
  );

  loadMemories();

  document.getElementById(
    "memoryDate"
  ).value = "";

  document.getElementById(
    "memoryTitle"
  ).value = "";

  document.getElementById(
    "memoryText"
  ).value = "";

  function deleteMemory(index){

  const confirmDelete =
    confirm(
      "Hapus kenangan ini? 🥺"
    );

  if(!confirmDelete) return;

  const memories =
    JSON.parse(
      localStorage.getItem(
        "memories"
      )
    ) || [];

  memories.splice(index, 1);

  localStorage.setItem(
    "memories",
    JSON.stringify(memories)
  );

  loadMemories();
}
}
// Fitur simpan pesan Memories Calender
function loadMemories() {

  const container =
    document.getElementById(
      "memoryCalendar"
    );

  const memories =
    JSON.parse(
      localStorage.getItem("memories")
    ) || [];

  container.innerHTML = "";

  memories.forEach((memory) => {

    const box =
      document.createElement("div");

    box.classList.add(
      "memory-box"
    );

    const formatDate =
      new Date(memory.date)
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

    box.onclick = function() {

      alert(
`${memory.title || "Our Memory"} ❤️

${memory.text}`
      );
    };

    container.appendChild(box);
  });
}
// mood tracker
// ===== MOOD TRACKER =====

loadMood();

function setMood(emoji, mood){

  const moodData = {
    emoji,
    mood,
    time: new Date()
      .toLocaleString("id-ID")
  };

  localStorage.setItem(
    "dailyMood",
    JSON.stringify(moodData)
  );

  loadMood();
}

function loadMood(){

  const mood =
    JSON.parse(
      localStorage.getItem(
        "dailyMood"
      )
    );

  if(!mood) return;

  document.getElementById(
    "moodDisplay"
  ).innerHTML =
    `${mood.emoji} ${mood.mood}`;

  document.getElementById(
    "moodTime"
  ).innerHTML =
    `Update terakhir:
    ${mood.time}`;
}
