// ==========================================
// StudyArc Engine v3
// Part 1 - Focus Timer
// ==========================================

let timer = null;
let totalTime = 25 * 60;
let timeLeft = totalTime;

function updateDisplay() {

    const timerBox = document.getElementById("timer");

    if (timerBox) {

        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;

        timerBox.innerHTML =
            minutes + ":" +
            (seconds < 10 ? "0" : "") +
            seconds;
    }

    updateProgressRing();

}

function updateProgressRing() {

    const circle =
        document.getElementById("progressCircle");

    if (!circle) return;

    const circumference = 722;

    const progress =
        timeLeft / totalTime;

    circle.style.strokeDashoffset =
        circumference -
        circumference * progress;

}

function setTime(minutes) {

    pauseTimer();

    totalTime = minutes * 60;

    timeLeft = totalTime;

    updateDisplay();

}

function startTimer() {

    if (timer) return;

    timer = setInterval(function () {

        if (timeLeft > 0) {

            timeLeft--;

            updateDisplay();

        } else {

            pauseTimer();

            finishSession();

        }

    }, 1000);

}

function pauseTimer() {

    clearInterval(timer);

    timer = null;

}

function resetTimer() {

    pauseTimer();

    totalTime = 25 * 60;

    timeLeft = totalTime;

    updateDisplay();

}

updateDisplay();
// ==========================================
// Part 2 - Task Manager
// ==========================================

// Load Tasks
let tasks = JSON.parse(localStorage.getItem("studyarc_tasks")) || [];

// Save Tasks
function saveTasks() {
    localStorage.setItem("studyarc_tasks", JSON.stringify(tasks));
}

// Render Tasks
function renderTasks() {

    const taskList = document.getElementById("taskList");

    if (!taskList) return;

    taskList.innerHTML = "";

    let completed = 0;

    tasks.forEach(function(task, index){

        if(task.done) completed++;

        const card = document.createElement("div");
        card.className = "task-card";

        card.innerHTML = `
            <button class="task-toggle ${task.done ? "done" : ""}"
                onclick="toggleTask(${index})"
                aria-label="${task.done ? "Mark incomplete" : "Mark complete"}">
                ${task.done ? "✓" : ""}
            </button>

            <span class="task-text ${task.done ? "done" : ""}">${task.text}</span>

            <button class="task-delete"
                onclick="deleteTask(${index})"
                aria-label="Delete task">
                <span class="material-symbols-rounded" style="font-size:16px;">delete</span>
            </button>
        `;

        taskList.appendChild(card);

    });

    updateTaskProgress(completed);

}

// Add Task
function addTask(){

    const input = document.getElementById("taskInput");

    if(!input) return;

    const text = input.value.trim();

    if(text === "") return;

    tasks.push({
        text: text,
        done: false
    });

    input.value = "";

    saveTasks();

    renderTasks();

}

// Toggle Task
function toggleTask(index){

    tasks[index].done = !tasks[index].done;

    saveTasks();

    renderTasks();

}

// Delete Task
function deleteTask(index){

    tasks.splice(index,1);

    saveTasks();

    renderTasks();

}

// Progress
function updateTaskProgress(completed){

    const fill = document.getElementById("taskProgress");
    const text = document.getElementById("taskPercent");

    if(!fill || !text) return;

    let percent = 0;

    if(tasks.length > 0){

        percent = Math.round(
            (completed / tasks.length) * 100
        );

    }

    fill.style.width = percent + "%";

    text.innerHTML = percent + "% Completed";

}

// Initialize
renderTasks();
// ==========================================
// Part 3 - XP, Level, Streak & Study System
// ==========================================

// ---------- Load Data ----------

let xp = Number(localStorage.getItem("studyarc_xp")) || 0;
let level = Number(localStorage.getItem("studyarc_level")) || 1;
let streak = Number(localStorage.getItem("studyarc_streak")) || 0;
let totalStudy = Number(localStorage.getItem("studyarc_totalStudy")) || 0;

// ---------- Save ----------

function saveStats(){

    localStorage.setItem("studyarc_xp", xp);
    localStorage.setItem("studyarc_level", level);
    localStorage.setItem("studyarc_streak", streak);
    localStorage.setItem("studyarc_totalStudy", totalStudy);

}

// ---------- Level ----------

function calculateLevel(){

    level = Math.floor(xp / 100) + 1;

}

// ---------- XP ----------

function addXP(points){

    xp += points;

    calculateLevel();

    saveStats();

    updateStats();

}

// ---------- Streak ----------

function increaseStreak(){

    streak++;

    saveStats();

    updateStats();

}

// ---------- Study Time ----------

function addStudy(minutes){

    totalStudy += minutes;

    saveStats();

    updateStats();

}

// ---------- Update UI ----------

function updateStats(){

    calculateLevel();

    const xpBox = document.getElementById("xp");
    const levelBox = document.getElementById("level");
    const streakBox = document.getElementById("streak");
    const studyBox = document.getElementById("totalStudy");

    if(xpBox){

        xpBox.innerHTML =
        (xp % 100) + " / 100 XP";

    }

    if(levelBox){

        levelBox.innerHTML =
        "Level " + level;

    }

    if(streakBox){

        streakBox.innerHTML =
        "🔥 " + streak + " Day Streak";

    }

    if(studyBox){

        const hours = Math.floor(totalStudy / 60);
        const mins = totalStudy % 60;

        studyBox.innerHTML =
        hours + "h " + mins + "m";

    }

    const xpFillBox = document.getElementById("xpFill");

    if(xpFillBox){

        xpFillBox.style.width = (xp % 100) + "%";

    }

}

// ---------- Session Complete ----------

function finishSession(){

    addStudy(totalTime / 60);

    logDailyStudy(totalTime / 60);

    addXP(25);

    increaseStreak();

    alert("🎉 Focus Session Complete!\n\n+25 XP");

}

// ---------- Initialize ----------

updateStats();
// ==========================================
// Part 4 - Daily Goal, Achievements & Theme
// ==========================================

// ---------- Daily Goal ----------

let dailyGoal =
Number(localStorage.getItem("studyarc_goal")) || 360;

function updateGoal(){

    const goalTime =
    document.getElementById("goalTime");

    const goalPercent =
    document.getElementById("goalPercent");

    const goalFill =
    document.getElementById("goalFill");

    let percent =
    Math.min(
        Math.round((totalStudy / dailyGoal) * 100),
        100
    );

    let hours =
    Math.floor(totalStudy / 60);

    let mins =
    totalStudy % 60;

    if(goalTime){

        goalTime.innerHTML =
        hours + "h " + mins +
        "m / " +
        Math.floor(dailyGoal / 60) +
        "h";

    }

    if(goalPercent){

        goalPercent.innerHTML =
        percent + "% Completed";

    }

    if(goalFill){

        goalFill.style.width =
        percent + "%";

    }

}

// ---------- Achievements ----------

function updateAchievements(){

    const badge1 =
    document.getElementById("badge1");

    const badge2 =
    document.getElementById("badge2");

    const badge3 =
    document.getElementById("badge3");

    if(badge1){

        badge1.innerHTML =
        totalStudy >= 25
        ? "✅ First Session"
        : "🔒 Locked";

    }

    if(badge2){

        badge2.innerHTML =
        streak >= 7
        ? "✅ 7 Day Streak"
        : "🔒 Locked";

    }

    if(badge3){

        badge3.innerHTML =
        level >= 10
        ? "✅ Level 10"
        : "🔒 Locked";

    }

}

// ---------- Theme ----------

function setTheme(theme){

    document.body.setAttribute(
        "data-theme",
        theme
    );

    localStorage.setItem(
        "studyarc_theme",
        theme
    );

}

function loadTheme(){

    const savedTheme =
    localStorage.getItem("studyarc_theme") ||
    "dark";

    document.body.setAttribute(
        "data-theme",
        savedTheme
    );

}

// ---------- Reset ----------

function resetStudyArc(){

    const confirmReset =
    confirm(
        "Reset all StudyArc data?"
    );

    if(!confirmReset) return;

    localStorage.clear();

    location.reload();

}

// ---------- Sync ----------

function refreshDashboard(){

    updateStats();

    updateGoal();

    updateAchievements();

}
// ==========================================
// Part 5 - Initialization & Auto Sync
// ==========================================

// ---------- Initialize App ----------

function initializeStudyArc(){

    updateDisplay();

    renderTasks();

    updateStats();

    updateGoal();

    updateAchievements();

    renderCalendar();

    loadTheme();

    console.log("🚀 StudyArc Loaded");

}

// ---------- Auto Refresh ----------

function refreshAll(){

    updateDisplay();

    renderTasks();

    updateStats();

    updateGoal();

    updateAchievements();

    renderCalendar();

}

// ---------- Safe Startup ----------

window.addEventListener("load", function(){

    initializeStudyArc();

});

// ---------- Page Visibility ----------

document.addEventListener("visibilitychange", function(){

    if(!document.hidden){

        refreshAll();

    }

});

// ---------- Keyboard Shortcut ----------

document.addEventListener("keydown", function(e){

    if(e.code === "Space"){

        e.preventDefault();

        if(timer){

            pauseTimer();

        }else{

            startTimer();

        }

    }

});

// ---------- Auto Save ----------

window.addEventListener("beforeunload", function(){

    saveTasks();

    saveStats();

});

console.log("✅ StudyArc Engine Ready");
// ==========================================
// Part 6 - Install Prompt
// ==========================================

let deferredInstallPrompt = null;

window.addEventListener("beforeinstallprompt", function(e){

    e.preventDefault();

    deferredInstallPrompt = e;

    const installBtn = document.getElementById("installButton");

    if(installBtn){

        installBtn.style.display = "flex";

        installBtn.onclick = function(){

            installBtn.style.display = "none";

            deferredInstallPrompt.prompt();

        };

    }

});

window.addEventListener("appinstalled", function(){

    deferredInstallPrompt = null;

    const installBtn = document.getElementById("installButton");

    if(installBtn) installBtn.style.display = "none";

});
// ==========================================
// Part 5 - Notification System
// ==========================================

// Load Notifications
let notifications =
JSON.parse(
localStorage.getItem("studyarc_notifications")
) || [];

// Save Notifications
function saveNotifications(){

    localStorage.setItem(

        "studyarc_notifications",

        JSON.stringify(notifications)

    );

}

// Add Notification
function addNotification(title,message){

    notifications.unshift({

        title:title,

        message:message,

        time:new Date().toLocaleString(),

        read:false

    });

    saveNotifications();

    renderNotifications();

    updateNotificationBadge();

}

// Render Notifications
function renderNotifications(){

    const list =
    document.getElementById("notificationList");

    if(!list) return;

    list.innerHTML="";

    if(notifications.length===0){

        list.innerHTML=`

        <div class="card">

            <h3>No Notifications</h3>

            <p>You're all caught up.</p>

        </div>

        `;

        return;

    }

    notifications.forEach((note,index)=>{

        list.innerHTML += `

        <div class="card">

            <h3>${note.title}</h3>

            <p>${note.message}</p>

            <small>${note.time}</small>

        </div>

        `;

    });

}

// Notification Badge
function updateNotificationBadge(){

    const badge =
    document.getElementById("notificationBadge");

    if(!badge) return;

    const unread =
    notifications.filter(n=>!n.read).length;

    if(unread===0){

        badge.style.display="none";

    }else{

        badge.style.display="flex";

        badge.innerHTML=unread;

    }

}

// Mark All Read
function markAllRead(){

    notifications.forEach(note=>{

        note.read=true;

    });

    saveNotifications();

    renderNotifications();

    updateNotificationBadge();

}

// Clear Notifications
function clearNotifications(){

    if(!confirm("Delete all notifications?")) return;

    notifications=[];

    saveNotifications();

    renderNotifications();

    updateNotificationBadge();

}

// Initialize
renderNotifications();

updateNotificationBadge();
// ==========================================
// Part 7 - Calendar
// ==========================================

function pad2(n){
    return n < 10 ? "0" + n : "" + n;
}

function dateKey(date){
    return date.getFullYear() + "-" + pad2(date.getMonth() + 1) + "-" + pad2(date.getDate());
}

function getDailyLog(){
    return JSON.parse(localStorage.getItem("studyarc_daily_log")) || {};
}

// Called automatically when a focus session finishes
function logDailyStudy(minutes){

    const log = getDailyLog();
    const key = dateKey(new Date());

    log[key] = (log[key] || 0) + minutes;

    localStorage.setItem("studyarc_daily_log", JSON.stringify(log));

}

let calendarMonthOffset = 0;

function prevMonth(){
    calendarMonthOffset--;
    renderCalendar();
}

function nextMonth(){
    calendarMonthOffset++;
    renderCalendar();
}

function renderCalendar(){

    const grid = document.getElementById("calendarGrid");

    if(!grid) return;

    const label = document.getElementById("calendarLabel");
    const summary = document.getElementById("calendarSummary");

    const today = new Date();
    const viewDate = new Date(today.getFullYear(), today.getMonth() + calendarMonthOffset, 1);
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();

    const monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];

    if(label){
        label.innerHTML = monthNames[month] + " " + year;
    }

    const firstWeekday = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const log = getDailyLog();
    const isCurrentMonth = (year === today.getFullYear() && month === today.getMonth());

    let html = "";

    ["S","M","T","W","T","F","S"].forEach(function(d){
        html += '<div class="cal-dow">' + d + '</div>';
    });

    for(let i = 0; i < firstWeekday; i++){
        html += '<div class="cal-day muted"></div>';
    }

    let monthMinutes = 0;
    let activeDays = 0;

    for(let d = 1; d <= daysInMonth; d++){

        const key = dateKey(new Date(year, month, d));
        const minutes = log[key] || 0;

        if(minutes > 0){
            monthMinutes += minutes;
            activeDays++;
        }

        let cls = "cal-day";

        if(minutes >= 480) cls += " level-high";
        else if(minutes >= 240) cls += " level-mid";
        else if(minutes > 0) cls += " level-low";

        if(isCurrentMonth && d === today.getDate()) cls += " today";

        html += '<div class="' + cls + '">' + d + '</div>';

    }

    grid.innerHTML = html;

    if(summary){

        const hrs = Math.floor(monthMinutes / 60);
        const mins = monthMinutes % 60;

        summary.innerHTML =
            hrs + "h " + mins + "m total &middot; " +
            activeDays + " study day" + (activeDays === 1 ? "" : "s");

    }

}
// ==========================================
// Service Worker Registration
// ==========================================

if ("serviceWorker" in navigator) {

    window.addEventListener("load", function () {

        navigator.serviceWorker.register("sw.js")

            .then(function (registration) {

                console.log("✅ Service Worker Registered");

            })

            .catch(function (error) {

                console.log("❌ Service Worker Registration Failed", error);

            });

    });

}