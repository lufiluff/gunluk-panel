(() => {
  const STORAGE_KEY = 'kisisel_panel_v2';
  const THEME_KEY = 'kisisel_panel_theme';
  const GEMINI_KEY_STORAGE = 'kisisel_panel_gemini_key';
  const FB_CONFIG_STORAGE = 'kisisel_panel_fb_config';
  const FB_ROOM_STORAGE = 'kisisel_panel_fb_room';

  // --- Personalized Defaults ---
  const DEFAULT_VOCAB = [
    { id: 'v1', word: 'Leverage', meaning: 'Bir imkandan maksimum verimle yararlanmak, avantaja dönüştürmek', example: 'I leverage AI to analyze large datasets.', mastered: false },
    { id: 'v2', word: 'Procurement', meaning: 'Satın alma, tedarik yönetimi', example: 'I asked to review the procurement processes.', mastered: false },
    { id: 'v3', word: 'Oversee', meaning: 'Yönetmek, baştan sona denetlemek', example: 'My goal is to oversee operations and lead teams.', mastered: false },
    { id: 'v4', word: 'Mitigate', meaning: 'Bir riski veya hatayı azaltmak, hafifletmek', example: 'We took precautions to mitigate machine downtime.', mastered: false },
    { id: 'v5', word: 'Streamline', meaning: 'Bir süreci sadeleştirip daha hızlı ve verimli hale getirmek', example: 'Automation helped streamline our daily reporting.', mastered: false },
    { id: 'v6', word: 'Discrepancy', meaning: 'İki veri veya durum arasındaki uyumsuzluk, sapma', example: 'There was a discrepancy between actual and target cycle times.', mastered: false }
  ];

  const DEFAULT_MISTAKES = [
    { id: 'm1', wrong: 'better on management', right: 'better at management', note: 'good / better fiillerinden sonra "at" edatı kullanılır.' },
    { id: 'm2', wrong: 'responsible the area', right: 'responsible for the area', note: 'responsible daima "for" edatı alır.' },
    { id: 'm3', wrong: 'the big datas', right: 'big data / large datasets', note: 'data kelimesine -s çoğul eki gelmez.' }
  ];

  const IELTS_TASKS = [
    { id: 'ie_read', label: 'Reading: 1 akademik pasaj + analiz' },
    { id: 'ie_write', label: 'Writing: Günün sorusunu yaz & değerlendir' },
    { id: 'ie_gram', label: 'Gramer: 1 kademeli konu çalışması' },
    { id: 'ie_speak', label: 'Speaking / Listening pratiği' },
    { id: 'ie_vocab', label: 'Kelime kartları + günlük kelime sınavı' }
  ];

  // Home Workouts: 2x5kg dumbbells, chair, wall, floor (Posture + Lean Muscle)
  const WORKOUT_PROGRAMS = {
    upper_posture: {
      title: 'Üst Vücut & Dik Duruş',
      focus: 'Omuzları geriye alma, sırt sıkılaştırma ve göğüs formu',
      exercises: [
        { name: 'Wall Angels (Duvarda Postür Açma)', weight: 0, sets: 3, reps: 12 },
        { name: 'Bent-Over Dumbbell Row (2x5kg)', weight: 5, sets: 4, reps: 15 },
        { name: 'Sandalye Destekli Eğimli Şınav (Incline Push-up)', weight: 0, sets: 3, reps: 12 },
        { name: 'Dumbbell Reverse Fly (Arka Omuz & Duruş)', weight: 5, sets: 3, reps: 12 },
        { name: 'Dumbbell Lateral Raise (Yan Omuz)', weight: 5, sets: 3, reps: 15 }
      ]
    },
    lower_core: {
      title: 'Bacak & Göbek (Core)',
      focus: 'Alt vücut güç ve göbek çevresi sıkılaştırma',
      exercises: [
        { name: 'Goblet Squat (5kg Dambıl)', weight: 5, sets: 4, reps: 15 },
        { name: 'Sandalye Bulgarian Split Squat', weight: 5, sets: 3, reps: 10 },
        { name: 'Duvar Oturuşu (Wall Sit)', weight: 0, sets: 3, reps: 45 },
        { name: 'Dead Bug (Alt Karın & Bel Dostu)', weight: 0, sets: 3, reps: 12 },
        { name: 'Plank (sn)', weight: 0, sets: 3, reps: 60 }
      ]
    },
    push_chest: {
      title: 'Göğüs, Omuz & Arka Kol',
      focus: 'Göğüs toparlama ve üst vücut şekillendirme',
      exercises: [
        { name: 'Dumbbell Floor Press (Yerde Göğüs Pres)', weight: 5, sets: 4, reps: 15 },
        { name: 'Klasik Şınav veya Diz Üstü Şınav', weight: 0, sets: 3, reps: 12 },
        { name: 'Dumbbell Shoulder Press', weight: 5, sets: 3, reps: 12 },
        { name: 'Sandalye Dips (Chair Dips)', weight: 0, sets: 3, reps: 12 },
        { name: 'Dumbbell Floor Fly', weight: 5, sets: 3, reps: 15 }
      ]
    },
    pull_back: {
      title: 'Sırt, Postür & Ön Kol',
      focus: 'Kamburluğu önleme, dik duruş ve kol formu',
      exercises: [
        { name: 'Sandalye Destekli Tek Kol Dumbbell Row', weight: 5, sets: 4, reps: 15 },
        { name: 'Superman Hold (Yerde Sırt/Bel Açma)', weight: 0, sets: 3, reps: 15 },
        { name: 'Dumbbell Biceps Curl', weight: 5, sets: 3, reps: 15 },
        { name: 'Hammer Curl', weight: 5, sets: 3, reps: 15 },
        { name: 'Kapı/Duvar Göğüs Esnetme (sn)', weight: 0, sets: 2, reps: 40 }
      ]
    },
    fullbody_fit: {
      title: 'Full Body & Yağ Yakımı',
      focus: 'Nabız yükseltme ve tüm vücut sıkılaştırma',
      exercises: [
        { name: 'Dumbbell Thruster (Squat + Press)', weight: 5, sets: 3, reps: 12 },
        { name: 'Şınav (Push-up)', weight: 0, sets: 3, reps: 12 },
        { name: 'Bent-Over Dumbbell Row', weight: 5, sets: 3, reps: 15 },
        { name: 'Mountain Climbers', weight: 0, sets: 3, reps: 24 },
        { name: 'Plank (sn)', weight: 0, sets: 3, reps: 50 }
      ]
    },
    mobility_light: {
      title: 'Hafif Mobilite & Core',
      focus: 'Yorgun günlerde hareketi koruma',
      exercises: [
        { name: 'Wall Angels (Duvar Postür)', weight: 0, sets: 3, reps: 12 },
        { name: 'Cat-Cow (Omurga Esnetme)', weight: 0, sets: 3, reps: 10 },
        { name: 'Glute Bridge (Köprü)', weight: 0, sets: 3, reps: 15 },
        { name: 'Plank (sn)', weight: 0, sets: 2, reps: 45 }
      ]
    }
  };

  const WEEKDAY_SPLIT = ['mobility_light', 'upper_posture', 'lower_core', 'push_chest', 'pull_back', 'fullbody_fit', 'lower_core'];

  const EXERCISE_SUGGESTIONS = {
    posture: [
      { name: 'Wall Angels (Duvar Açma)', weight: 0, sets: 3, reps: 12, note: 'Omuzları geriye alır, dik duruş' },
      { name: 'Dumbbell Reverse Fly', weight: 5, sets: 3, reps: 12, note: 'Üst sırt ve arka omuz' },
      { name: 'Superman Hold', weight: 0, sets: 3, reps: 15, note: 'Omurga ve bel güçlendirme' },
      { name: 'Tek Kol Sandalye Row', weight: 5, sets: 3, reps: 15, note: 'Sırt sıkılaştırma' }
    ],
    chest: [
      { name: 'Sandalye Incline Şınav', weight: 0, sets: 3, reps: 15, note: 'Alt göğüs toparlama' },
      { name: 'Dumbbell Floor Press', weight: 5, sets: 4, reps: 15, note: 'Evde güvenli göğüs pres' },
      { name: 'Dumbbell Floor Fly', weight: 5, sets: 3, reps: 15, note: 'Göğüs içi sıkılaştırma' },
      { name: 'Sandalye Dips', weight: 0, sets: 3, reps: 12, note: 'Alt göğüs & arka kol' }
    ],
    core: [
      { name: 'Dead Bug', weight: 0, sets: 3, reps: 12, note: 'Göbek çevresi derin kaslar' },
      { name: 'Plank (sn)', weight: 0, sets: 3, reps: 60, note: 'Tüm karın stabilitesi' },
      { name: 'Mountain Climbers', weight: 0, sets: 3, reps: 24, note: 'Yağ yakımı + alt karın' },
      { name: 'Bicycle Crunch', weight: 0, sets: 3, reps: 20, note: 'Yan karın (oblik)' }
    ],
    legs: [
      { name: 'Duvar Oturuşu (Wall Sit - sn)', weight: 0, sets: 3, reps: 45, note: 'Ön bacak dayanıklılık' },
      { name: 'Sandalye Step-Up', weight: 5, sets: 3, reps: 12, note: 'Kalça ve bacak formu' },
      { name: 'Sandalye Bulgarian Split Squat', weight: 5, sets: 3, reps: 10, note: 'Denge ve güç' },
      { name: 'Goblet Squat', weight: 5, sets: 4, reps: 15, note: 'Temel bacak hareketi' }
    ]
  };

  // --- Helpers ---
  function todayStr() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }

  function shiftDate(dateStr, deltaDays) {
    const [y, m, d] = dateStr.split('-').map(Number);
    const dt = new Date(y, m - 1, d);
    dt.setDate(dt.getDate() + deltaDays);
    return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}-${String(dt.getDate()).padStart(2, '0')}`;
  }

  function formatTurkishDate(dateStr) {
    const [y, m, d] = dateStr.split('-').map(Number);
    const dt = new Date(y, m - 1, d);
    const formatted = dt.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', weekday: 'short' });
    return dateStr === todayStr() ? `Bugün · ${formatted}` : formatted;
  }

  function uid() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  }

  function escapeHtml(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  const DEFAULT_ROUTINES = [
    { id: 'r_water', period: 'morning', label: 'Uyanınca su içme' },
    { id: 'r_brush_am', period: 'morning', label: 'Diş fırçalama (Sabah)' },
    { id: 'r_move', period: 'morning', label: 'Sabah açma-germe / hareketi' },
    { id: 'r_book', period: 'evening', label: 'Akşam 20 sayfa kitap okuma' },
    { id: 'r_brush_pm', period: 'evening', label: 'Diş fırçalama (Akşam)' }
  ];

  function defaultState() {
    return {
      updatedAt: Date.now(),
      profile: {
        ieltsDate: '2027-01-25',
        calTarget: 2100,
        proTarget: 140,
        carbTarget: 235,
        fatTarget: 65,
        waterIntervalMins: 75
      },
      vocab: DEFAULT_VOCAB,
      mistakes: DEFAULT_MISTAKES,
      routineDefs: DEFAULT_ROUTINES,
      chatHistory: [
        { role: 'assistant', text: 'Selam! Ben buradayım. Gününü planlamak, bir tarihe görev eklemek, yediğini kaydetmek veya IELTS çalışmak için bana istediğin an yazabilirsin.' }
      ],
      days: {}
    };
  }

  function loadLocalState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return defaultState();
      const parsed = JSON.parse(raw);
      return {
        ...defaultState(),
        ...parsed,
        routineDefs: Array.isArray(parsed.routineDefs) && parsed.routineDefs.length ? parsed.routineDefs : DEFAULT_ROUTINES,
        profile: { ...defaultState().profile, ...(parsed.profile || {}) }
      };
    } catch {
      return defaultState();
    }
  }

  let state = loadLocalState();
  let currentDate = todayStr();
  let vocabFilter = 'all';
  let flashcardIndex = 0;
  let currentListening = null;

  // --- Firebase Real-Time Sync ---
  let firestoreDoc = null;
  let unsubFirestore = null;
  let syncPushTimer = null;
  let ignoreRemoteEcho = false;

  function setSyncBadge(online, label) {
    const dot = document.getElementById('syncDot');
    const txt = document.getElementById('syncText');
    if (dot) dot.classList.toggle('online', online);
    if (txt) txt.textContent = label;
  }

  function initFirebaseSync() {
    if (unsubFirestore) {
      unsubFirestore();
      unsubFirestore = null;
    }
    firestoreDoc = null;

    const rawCfg = (localStorage.getItem(FB_CONFIG_STORAGE) || '').trim();
    const room = (localStorage.getItem(FB_ROOM_STORAGE) || '').trim();
    if (!rawCfg || !room || typeof firebase === 'undefined') {
      setSyncBadge(false, 'Yerel Kayıt');
      return;
    }

    try {
      const cfg = JSON.parse(rawCfg);
      const app = firebase.apps.length ? firebase.app() : firebase.initializeApp(cfg);
      const db = firebase.firestore(app);
      firestoreDoc = db.collection('kisisel_panel').doc(room);

      setSyncBadge(true, 'Bağlanıyor...');

      unsubFirestore = firestoreDoc.onSnapshot((snap) => {
        setSyncBadge(true, 'Bulut Senkronize');
        if (ignoreRemoteEcho) return;
        if (snap.exists) {
          const remote = snap.data();
          if (remote && remote.payload) {
            const parsed = JSON.parse(remote.payload);
            if ((parsed.updatedAt || 0) > (state.updatedAt || 0)) {
              state = { ...defaultState(), ...parsed, profile: { ...defaultState().profile, ...(parsed.profile || {}) } };
              localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
              renderAll();
            }
          }
        } else {
          pushToCloud();
        }
      }, () => {
        setSyncBadge(false, 'Bağlantı Hatası');
      });
    } catch {
      setSyncBadge(false, 'Ayar Geçersiz');
    }
  }

  function pushToCloud() {
    if (!firestoreDoc) return;
    clearTimeout(syncPushTimer);
    syncPushTimer = setTimeout(() => {
      ignoreRemoteEcho = true;
      firestoreDoc.set({ payload: JSON.stringify(state), updatedAt: state.updatedAt })
        .catch(() => setSyncBadge(false, 'Senkron Hatası'))
        .finally(() => setTimeout(() => { ignoreRemoteEcho = false; }, 400));
    }, 350);
  }

  function saveState() {
    state.updatedAt = Date.now();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    pushToCloud();
  }

  function getDay(dateStr = currentDate) {
    if (!state.days[dateStr]) {
      const [y, m, d] = dateStr.split('-').map(Number);
      const dow = new Date(y, m - 1, d).getDay();
      const progKey = WEEKDAY_SPLIT[dow] || 'upper_posture';
      const prog = WORKOUT_PROGRAMS[progKey];
      state.days[dateStr] = {
        tasks: [],
        ielts: {},
        routines: {},
        sleep: { bed: '', wake: '' },
        journalNote: '',
        workoutProgram: progKey,
        exercises: prog.exercises.map(ex => ({ id: uid(), ...ex, done: false })),
        workoutLogs: [],
        meals: []
      };
      saveState();
    }
    if (!Array.isArray(state.days[dateStr].workoutLogs)) state.days[dateStr].workoutLogs = [];
    if (!state.days[dateStr].routines) state.days[dateStr].routines = {};
    if (!state.days[dateStr].sleep) state.days[dateStr].sleep = { bed: '', wake: '' };
    if (typeof state.days[dateStr].journalNote !== 'string') state.days[dateStr].journalNote = '';
    return state.days[dateStr];
  }

  // --- Theme Toggle ---
  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_KEY, theme);
  }
  applyTheme(localStorage.getItem(THEME_KEY) || 'light');

  document.getElementById('themeToggleBtn').addEventListener('click', () => {
    const cur = document.documentElement.getAttribute('data-theme');
    applyTheme(cur === 'dark' ? 'light' : 'dark');
  });

  // --- Water Reminder Corner Toast ---
  const waterToast = document.getElementById('waterToast');
  let waterTimer = null;

  function scheduleWaterReminder() {
    clearTimeout(waterTimer);
    const mins = Math.max(15, Number(state.profile.waterIntervalMins) || 75);
    waterTimer = setTimeout(() => {
      waterToast.classList.remove('hidden');
    }, mins * 60 * 1000);
  }

  // Show a gentle first reminder 25 seconds after page load if not dismissed recently
  setTimeout(() => {
    if (!sessionStorage.getItem('water_seen')) {
      waterToast.classList.remove('hidden');
      sessionStorage.setItem('water_seen', '1');
    }
  }, 25000);

  document.getElementById('waterAckBtn').addEventListener('click', () => {
    waterToast.classList.add('hidden');
    scheduleWaterReminder();
  });
  document.getElementById('waterDismissBtn').addEventListener('click', () => {
    waterToast.classList.add('hidden');
    scheduleWaterReminder();
  });

  // --- Navigation & Date ---
  const navBtns = document.querySelectorAll('.nav-btn');
  const tabPanels = document.querySelectorAll('.tab-panel');

  function switchTab(tabName) {
    navBtns.forEach(b => b.classList.toggle('active', b.dataset.tab === tabName));
    tabPanels.forEach(p => p.classList.toggle('active', p.id === `tab-${tabName}`));
  }

  function switchEnglishSubtab(subName) {
    document.querySelectorAll('.subtab-btn').forEach(b => b.classList.toggle('active', b.dataset.engSub === subName));
    document.querySelectorAll('.subtab-panel').forEach(p => p.classList.toggle('active', p.id === `eng-${subName}`));
  }

  navBtns.forEach(btn => btn.addEventListener('click', () => switchTab(btn.dataset.tab)));

  document.querySelectorAll('.stat-card').forEach(c => c.addEventListener('click', (e) => {
    const subBtn = e.target.closest('[data-sub]');
    const targetTab = (subBtn && subBtn.dataset.jump) || c.dataset.jump;
    const targetSub = (subBtn && subBtn.dataset.sub) || c.dataset.sub;
    switchTab(targetTab);
    if (targetTab === 'english' && targetSub) {
      switchEnglishSubtab(targetSub);
      const focusEl = targetSub === 'vocab' ? document.getElementById('vocabList') : document.getElementById('mistakeList');
      if (focusEl) focusEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }));

  // English subtabs
  document.querySelectorAll('.subtab-btn').forEach(btn => {
    btn.addEventListener('click', () => switchEnglishSubtab(btn.dataset.engSub));
  });

  document.getElementById('prevDayBtn').addEventListener('click', () => { currentDate = shiftDate(currentDate, -1); renderAll(); });
  document.getElementById('nextDayBtn').addEventListener('click', () => { currentDate = shiftDate(currentDate, 1); renderAll(); });
  document.getElementById('todayBtn').addEventListener('click', () => { currentDate = todayStr(); renderAll(); });
  document.getElementById('datePicker').addEventListener('change', (e) => { if (e.target.value) { currentDate = e.target.value; renderAll(); } });

  // --- TAB 1: MAIN PAGE (COUNTDOWN + SIMPLE TO-DO) ---
  const taskForm = document.getElementById('taskForm');
  const taskInput = document.getElementById('taskInput');
  const taskList = document.getElementById('taskList');

  taskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = taskInput.value.trim();
    if (!text) return;
    getDay().tasks.push({ id: uid(), text, done: false });
    taskInput.value = '';
    saveState();
    renderMain();
  });

  taskList.addEventListener('click', (e) => {
    const toggleId = e.target.dataset.taskToggle;
    const delId = e.target.dataset.taskDel;
    const day = getDay();
    if (toggleId) {
      const t = day.tasks.find(x => x.id === toggleId);
      if (t) t.done = !t.done;
      saveState();
      renderMain();
    } else if (delId) {
      day.tasks = day.tasks.filter(x => x.id !== delId);
      saveState();
      renderMain();
    }
  });

  function renderCountdown() {
    const targetStr = state.profile.ieltsDate || '2027-01-25';
    const [ty, tm, td] = targetStr.split('-').map(Number);
    const target = new Date(ty, tm - 1, td);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const diffDays = Math.ceil((target - today) / (1000 * 60 * 60 * 24));

    const el = document.getElementById('ieltsCountdownText');
    if (diffDays > 0) {
      el.textContent = `Sınava ${diffDays} gün kaldı`;
    } else if (diffDays === 0) {
      el.textContent = 'Bugün sınav günü! Başarılar!';
    } else {
      el.textContent = 'Hedef tarih geçti (Ayarlardan güncelleyebilirsin)';
    }

    document.getElementById('ieltsDateBadge').textContent = target.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
  }

  function renderMain() {
    renderCountdown();
    const day = getDay();

    if (!day.tasks.length) {
      taskList.innerHTML = '<li class="empty-state">Bugün için yapılacak eklemedin. Sade bir liste ile güne başlayabilirsin.</li>';
    } else {
      taskList.innerHTML = day.tasks.map(t => `
        <li class="list-item ${t.done ? 'done' : ''}">
          <div class="item-left">
            <input type="checkbox" ${t.done ? 'checked' : ''} data-task-toggle="${t.id}" />
            <span class="item-title">${escapeHtml(t.text)}</span>
          </div>
          <button class="delete-btn" data-task-del="${t.id}" title="Sil">&times;</button>
        </li>
      `).join('');
    }

    const done = day.tasks.filter(t => t.done).length;
    document.getElementById('taskProgressBadge').textContent = `${done} / ${day.tasks.length}`;

    // Summary cards
    const mastered = state.vocab.filter(v => v.mastered).length;
    document.getElementById('sumEnglish').textContent = `${mastered} / ${state.vocab.length} kelime`;
    const mistakesBtn = document.getElementById('sumMistakesBtn');
    if (mistakesBtn) mistakesBtn.textContent = `${state.mistakes.length} hata kartı →`;

    const exDone = day.exercises.filter(e => e.done).length;
    const exPct = day.exercises.length ? Math.round((exDone / day.exercises.length) * 100) : 0;
    const burned = (day.workoutLogs || []).reduce((s, x) => s + (x.burnedCal || 0), 0);
    document.getElementById('sumWorkout').textContent = burned > 0 ? `${exPct}% · ${burned} kcal` : `${exPct}%`;
    document.getElementById('sumWorkoutName').textContent = (WORKOUT_PROGRAMS[day.workoutProgram] || {}).title || 'Ev Antrenmanı';

    const cal = day.meals.reduce((s, m) => s + (m.cal || 0), 0);
    const pro = day.meals.reduce((s, m) => s + (m.pro || 0), 0);
    document.getElementById('sumCalories').textContent = `${cal} / ${state.profile.calTarget}`;
    document.getElementById('sumProtein').textContent = `${pro} / ${state.profile.proTarget}g protein`;

    renderMainDailyWords();
    renderPerformance();
  }

  // --- Performance Score (0-100) ---
  function calculateDayScore(day) {
    if (!day) return 0;
    // 1. Tasks (20)
    const tasks = day.tasks || [];
    const taskPts = tasks.length ? Math.round((tasks.filter(t => t.done).length / tasks.length) * 20) : 0;

    // 2. English / IELTS (20)
    const ieltsDone = Object.values(day.ielts || {}).filter(Boolean).length;
    const engPts = Math.round((Math.min(ieltsDone, IELTS_TASKS.length) / IELTS_TASKS.length) * 20);

    // 3. Workout (20)
    const exList = day.exercises || [];
    const exDone = exList.filter(e => e.done).length;
    const hasLogs = (day.workoutLogs || []).length > 0;
    const workPts = hasLogs
      ? 20
      : (exList.length ? Math.round((exDone / exList.length) * 20) : 0);

    // 4. Nutrition (20)
    const meals = day.meals || [];
    let nutPts = 0;
    if (meals.length > 0) {
      const cal = meals.reduce((s, m) => s + (m.cal || 0), 0);
      nutPts = cal <= state.profile.calTarget + 250 ? 20 : 12;
    }

    // 5. Routines & Sleep (20)
    const rDefs = state.routineDefs || DEFAULT_ROUTINES;
    const rDone = rDefs.filter(r => day.routines && day.routines[r.id]).length;
    const rPts = rDefs.length ? Math.round((rDone / rDefs.length) * 15) : 0;
    const sleepPts = (day.sleep && day.sleep.bed && day.sleep.wake) ? 5 : 0;

    return Math.min(100, taskPts + engPts + workPts + nutPts + rPts + sleepPts);
  }

  function renderPerformance() {
    const todayScore = calculateDayScore(getDay(currentDate));
    document.getElementById('todayScoreBadge').textContent = `Seçili Gün: ${todayScore} / 100`;

    const allDates = Object.keys(state.days).sort();
    const scores = allDates.map(d => ({ date: d, score: calculateDayScore(state.days[d]) }));
    const avg = scores.length ? Math.round(scores.reduce((s, x) => s + x.score, 0) / scores.length) : 0;
    document.getElementById('avgScoreBadge').textContent = `Tüm Zamanlar Ort: ${avg} / 100`;

    const grid = document.getElementById('perfHistoryGrid');
    grid.innerHTML = scores.map(item => {
      const [, m, d] = item.date.split('-');
      const isCur = item.date === currentDate;
      return `
        <div class="perf-day-col ${isCur ? 'active-day' : ''}" data-perf-date="${item.date}" title="${item.date}: ${item.score}/100">
          <span class="perf-score-num">${item.score}</span>
          <div class="perf-bar-track">
            <div class="perf-bar-fill ${item.score >= 70 ? 'high' : ''}" style="height:${Math.max(6, item.score)}%"></div>
          </div>
          <span class="perf-date-lbl">${d}.${m}</span>
        </div>
      `;
    }).join('');
  }

  document.getElementById('perfHistoryGrid').addEventListener('click', (e) => {
    const col = e.target.closest('[data-perf-date]');
    if (!col) return;
    currentDate = col.dataset.perfDate;
    renderAll();
  });

  // --- Main Page: Today's 5 Words (Directly Visible) ---
  function renderMainDailyWords() {
    const listEl = document.getElementById('mainDailyWordsList');
    const unmastered = state.vocab.filter(v => !v.mastered);
    const five = unmastered.slice(0, 5);
    if (!five.length) {
      listEl.innerHTML = '<li class="empty-state">Tüm kelimeleri öğrendin! Yeni kelimeler ekleyebilir veya Pazar genel sınavına girebilirsin.</li>';
      return;
    }
    listEl.innerHTML = five.map(v => `
      <li class="list-item">
        <div class="item-meta">
          <span class="item-title">${escapeHtml(v.word)}</span>
          <span class="item-sub">${escapeHtml(v.meaning)}</span>
        </div>
      </li>
    `).join('');
  }

  document.getElementById('mainGoQuizBtn').addEventListener('click', () => {
    switchTab('english');
    switchEnglishSubtab('vocab');
    renderVocabQuiz();
    const el = document.getElementById('vocabQuizArea');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });

  // --- TAB 1.5: GÜNLÜK (SLEEP + ROUTINES + JOURNAL) ---
  const morningRoutineList = document.getElementById('morningRoutineList');
  const eveningRoutineList = document.getElementById('eveningRoutineList');
  const sleepBedTime = document.getElementById('sleepBedTime');
  const sleepWakeTime = document.getElementById('sleepWakeTime');
  const journalNote = document.getElementById('journalNote');
  const journalSavedStatus = document.getElementById('journalSavedStatus');

  function calcSleepMinutes(bed, wake) {
    if (!bed || !wake) return null;
    const [bh, bm] = bed.split(':').map(Number);
    const [wh, wm] = wake.split(':').map(Number);
    let diff = (wh * 60 + wm) - (bh * 60 + bm);
    if (diff <= 0) diff += 24 * 60;
    return diff;
  }

  function formatMinutes(mins) {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return `${h} sa ${m} dk`;
  }

  function handleSleepChange() {
    const day = getDay();
    day.sleep = { bed: sleepBedTime.value, wake: sleepWakeTime.value };
    saveState();
    renderJournal();
    renderMain();
  }

  sleepBedTime.addEventListener('change', handleSleepChange);
  sleepWakeTime.addEventListener('change', handleSleepChange);

  document.getElementById('clearSleepBtn').addEventListener('click', () => {
    const day = getDay();
    day.sleep = { bed: '', wake: '' };
    saveState();
    renderJournal();
    renderMain();
  });

  document.getElementById('sleepHistoryList').addEventListener('click', (e) => {
    const delDate = e.target.dataset.sleepDel;
    if (!delDate || !state.days[delDate]) return;
    state.days[delDate].sleep = { bed: '', wake: '' };
    saveState();
    renderJournal();
    renderMain();
  });

  let journalTimer;
  journalNote.addEventListener('input', () => {
    journalSavedStatus.textContent = 'Yazılıyor...';
    clearTimeout(journalTimer);
    journalTimer = setTimeout(() => {
      getDay().journalNote = journalNote.value;
      saveState();
      journalSavedStatus.textContent = 'Kaydedildi';
    }, 300);
  });

  document.getElementById('addRoutineForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const period = document.getElementById('newRoutinePeriod').value;
    const label = document.getElementById('newRoutineInput').value.trim();
    if (!label) return;
    state.routineDefs.push({ id: 'r_' + uid(), period, label });
    document.getElementById('newRoutineInput').value = '';
    saveState();
    renderJournal();
    renderMain();
  });

  function handleRoutineClick(e) {
    const toggleId = e.target.dataset.routineToggle;
    const delId = e.target.dataset.routineDel;
    if (toggleId) {
      const day = getDay();
      day.routines[toggleId] = e.target.checked;
      saveState();
      renderJournal();
      renderMain();
    } else if (delId) {
      state.routineDefs = state.routineDefs.filter(r => r.id !== delId);
      saveState();
      renderJournal();
      renderMain();
    }
  }

  morningRoutineList.addEventListener('click', handleRoutineClick);
  eveningRoutineList.addEventListener('click', handleRoutineClick);

  function renderJournal() {
    const day = getDay();
    const defs = state.routineDefs || DEFAULT_ROUTINES;

    const renderGroup = (period) => {
      const items = defs.filter(r => r.period === period);
      if (!items.length) return '<div class="empty-state">Henüz rutin eklenmedi.</div>';
      return items.map(r => {
        const checked = !!(day.routines && day.routines[r.id]);
        return `
          <div class="routine-row ${checked ? 'checked' : ''}">
            <label class="routine-left">
              <input type="checkbox" ${checked ? 'checked' : ''} data-routine-toggle="${r.id}" />
              <span class="routine-lbl">${escapeHtml(r.label)}</span>
            </label>
            <button class="delete-btn" data-routine-del="${r.id}" title="Rutini sil">&times;</button>
          </div>
        `;
      }).join('');
    };

    morningRoutineList.innerHTML = renderGroup('morning');
    eveningRoutineList.innerHTML = renderGroup('evening');

    const doneCount = defs.filter(r => day.routines && day.routines[r.id]).length;
    document.getElementById('routineProgressBadge').textContent = `${doneCount} / ${defs.length}`;

    // Sleep
    sleepBedTime.value = (day.sleep && day.sleep.bed) || '';
    sleepWakeTime.value = (day.sleep && day.sleep.wake) || '';
    const mins = calcSleepMinutes(sleepBedTime.value, sleepWakeTime.value);
    document.getElementById('sleepDurationBadge').textContent = mins !== null ? formatMinutes(mins) : '—';

    const sleepLogs = Object.entries(state.days)
      .map(([dKey, d]) => ({ date: dKey, bed: d.sleep?.bed, wake: d.sleep?.wake, mins: calcSleepMinutes(d.sleep?.bed, d.sleep?.wake) }))
      .filter(x => x.mins !== null)
      .sort((a, b) => b.date.localeCompare(a.date));

    if (sleepLogs.length) {
      const avgMins = Math.round(sleepLogs.reduce((s, x) => s + x.mins, 0) / sleepLogs.length);
      document.getElementById('sleepAvgText').textContent = `Ortalama uyku süren: ${formatMinutes(avgMins)} (${sleepLogs.length} gün kayıtlı)`;
      document.getElementById('sleepHistoryList').innerHTML = sleepLogs.slice(0, 5).map(x => `
        <li class="list-item">
          <span class="item-title">${escapeHtml(x.date)} <span class="muted small">(${x.bed} &rarr; ${x.wake})</span></span>
          <div class="inline-form">
            <span class="badge">${formatMinutes(x.mins)}</span>
            <button class="delete-btn" data-sleep-del="${x.date}" title="Uyku kaydını sil">&times;</button>
          </div>
        </li>
      `).join('');
    } else {
      document.getElementById('sleepAvgText').textContent = 'Uyku saatlerini girdiğinde ortalama süren burada görünecek.';
      document.getElementById('sleepHistoryList').innerHTML = '';
    }

    // Journal note
    journalNote.value = day.journalNote || '';
  }

  // --- TAB 2: ENGLISH (IELTS) ---
  const vocabForm = document.getElementById('vocabForm');
  const vocabList = document.getElementById('vocabList');
  const ieltsChecklist = document.getElementById('ieltsChecklist');
  const flashcard = document.getElementById('flashcard');
  const fcWord = document.getElementById('fcWord');
  const fcBack = document.getElementById('fcBack');
  const fcMeaning = document.getElementById('fcMeaning');
  const fcExample = document.getElementById('fcExample');

  vocabForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const word = document.getElementById('vocabWord').value.trim();
    const meaning = document.getElementById('vocabMeaning').value.trim();
    const example = document.getElementById('vocabExample').value.trim();
    if (!word || !meaning) return;
    state.vocab.unshift({ id: uid(), word, meaning, example, mastered: false });
    vocabForm.reset();
    saveState();
    renderEnglish();
    renderMain();
  });

  document.querySelectorAll('[data-vocab-filter]').forEach(btn => {
    btn.addEventListener('click', () => {
      vocabFilter = btn.dataset.vocabFilter;
      document.querySelectorAll('[data-vocab-filter]').forEach(b => b.classList.toggle('active', b === btn));
      renderEnglish();
    });
  });

  vocabList.addEventListener('click', (e) => {
    const toggleId = e.target.dataset.vocabToggle;
    const delId = e.target.dataset.vocabDel;
    if (toggleId) {
      const v = state.vocab.find(x => x.id === toggleId);
      if (v) v.mastered = !v.mastered;
      saveState();
      renderEnglish();
      renderMain();
    } else if (delId) {
      state.vocab = state.vocab.filter(x => x.id !== delId);
      saveState();
      renderEnglish();
      renderMain();
    }
  });

  function getFlashcardPool() {
    const learning = state.vocab.filter(v => !v.mastered);
    return learning.length ? learning : state.vocab;
  }

  function renderFlashcard() {
    const pool = getFlashcardPool();
    if (!pool.length) {
      fcWord.textContent = 'Henüz kelime yok';
      fcBack.classList.add('hidden');
      return;
    }
    const item = pool[flashcardIndex % pool.length];
    fcWord.textContent = item.word;
    fcMeaning.textContent = item.meaning;
    fcExample.textContent = item.example ? `"${item.example}"` : '';
    fcBack.classList.add('hidden');
  }

  flashcard.addEventListener('click', () => fcBack.classList.toggle('hidden'));
  document.getElementById('nextCardBtn').addEventListener('click', () => {
    flashcardIndex++;
    renderFlashcard();
  });

  document.getElementById('markCardMasteredBtn').addEventListener('click', () => {
    const pool = getFlashcardPool();
    if (!pool.length) return;
    const item = pool[flashcardIndex % pool.length];
    item.mastered = true;
    saveState();
    renderEnglish();
    renderMain();
  });

  // Daily Vocab Quiz + Auto-Master + Sunday Full Review Exam
  let sundayExamQueue = [];
  let sundayExamIndex = 0;
  let sundayExamCorrect = 0;

  function isSundaySelected() {
    const [y, m, d] = currentDate.split('-').map(Number);
    return new Date(y, m - 1, d).getDay() === 0;
  }

  document.getElementById('startQuizBtn').addEventListener('click', () => {
    if (isSundaySelected()) {
      sundayExamQueue = [...state.vocab].sort(() => Math.random() - 0.5);
      sundayExamIndex = 0;
      sundayExamCorrect = 0;
      renderSundayQuestion();
    } else {
      renderVocabQuiz();
    }
  });

  function renderSundayQuestion() {
    const area = document.getElementById('vocabQuizArea');
    if (state.vocab.length < 3) {
      area.innerHTML = '<p class="muted small">Sınav için en az 3 kelimen olmalı.</p>';
      return;
    }
    if (sundayExamIndex >= sundayExamQueue.length) {
      area.innerHTML = `<p><strong>Pazar Genel Sınavı Bitti!</strong></p><p class="muted small mt-8">Skorun: ${sundayExamCorrect} / ${sundayExamQueue.length} doğru. Yanlış yaptığın kelimeler tekrar "Öğreniliyor" listesine alındı.</p>`;
      return;
    }
    const target = sundayExamQueue[sundayExamIndex];
    const distractors = state.vocab.filter(v => v.id !== target.id).sort(() => Math.random() - 0.5).slice(0, 2);
    const options = [target, ...distractors].sort(() => Math.random() - 0.5);

    area.innerHTML = `
      <p class="muted small">Pazar Genel Tekrar · Soru ${sundayExamIndex + 1} / ${sundayExamQueue.length}</p>
      <p class="mt-8"><strong>${escapeHtml(target.word)}</strong> ne anlama gelir?</p>
      <div class="quiz-options">
        ${options.map(o => `<button class="quiz-opt" data-quiz-correct="${o.id === target.id}">${escapeHtml(o.meaning)}</button>`).join('')}
      </div>
      <div id="quizFeedbackMsg" class="small mt-8"></div>
    `;
    area.querySelectorAll('.quiz-opt').forEach(btn => {
      btn.addEventListener('click', () => {
        const isRight = btn.dataset.quizCorrect === 'true';
        btn.classList.add(isRight ? 'correct' : 'wrong');
        area.querySelectorAll('.quiz-opt').forEach(b => {
          b.disabled = true;
          if (b.dataset.quizCorrect === 'true') b.classList.add('correct');
        });
        const vocabItem = state.vocab.find(v => v.id === target.id);
        const msgEl = document.getElementById('quizFeedbackMsg');
        if (isRight) {
          sundayExamCorrect++;
          if (vocabItem) vocabItem.mastered = true;
          msgEl.className = 'small mt-8 status-ok';
          msgEl.textContent = '✓ Doğru!';
        } else {
          if (vocabItem) vocabItem.mastered = false;
          msgEl.className = 'small mt-8 status-err';
          msgEl.textContent = '✗ Tekrar etmen için "Öğreniliyor" listesine alındı.';
        }
        saveState();
        renderEnglish();
        renderMain();
        sundayExamIndex++;
        setTimeout(() => {
          if (document.getElementById('vocabQuizArea')) renderSundayQuestion();
        }, 1200);
      });
    });
  }

  function renderVocabQuiz() {
    const area = document.getElementById('vocabQuizArea');
    if (state.vocab.length < 3) {
      area.innerHTML = '<p class="muted small">Sınav için en az 3 kelimen olmalı.</p>';
      return;
    }
    if (isSundaySelected()) {
      sundayExamQueue = [...state.vocab].sort(() => Math.random() - 0.5);
      sundayExamIndex = 0;
      sundayExamCorrect = 0;
      renderSundayQuestion();
      return;
    }
    const pool = getFlashcardPool();
    const target = pool[Math.floor(Math.random() * pool.length)];
    const distractors = state.vocab
      .filter(v => v.id !== target.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 2);
    const options = [target, ...distractors].sort(() => Math.random() - 0.5);

    area.innerHTML = `
      <p><strong>${escapeHtml(target.word)}</strong> ne anlama gelir?</p>
      <div class="quiz-options">
        ${options.map(o => `<button class="quiz-opt" data-quiz-correct="${o.id === target.id}">${escapeHtml(o.meaning)}</button>`).join('')}
      </div>
      <div id="quizFeedbackMsg" class="small mt-8"></div>
    `;
    area.querySelectorAll('.quiz-opt').forEach(btn => {
      btn.addEventListener('click', () => {
        const isRight = btn.dataset.quizCorrect === 'true';
        btn.classList.add(isRight ? 'correct' : 'wrong');
        area.querySelectorAll('.quiz-opt').forEach(b => {
          b.disabled = true;
          if (b.dataset.quizCorrect === 'true') b.classList.add('correct');
        });
        const msgEl = document.getElementById('quizFeedbackMsg');
        if (isRight) {
          const vocabItem = state.vocab.find(v => v.id === target.id);
          if (vocabItem) vocabItem.mastered = true;
          saveState();
          renderEnglish();
          renderMain();
          msgEl.className = 'small mt-8 status-ok';
          msgEl.textContent = `✓ Doğru! "${target.word}" Öğrenildi listesine taşındı.`;
        } else {
          msgEl.className = 'small mt-8 status-err';
          msgEl.textContent = '✗ Yanlış — bu kelimeyi tekrar çalışacağız.';
        }
      });
    });
  }

  ieltsChecklist.addEventListener('change', (e) => {
    const id = e.target.dataset.ielts;
    if (!id) return;
    getDay().ielts[id] = e.target.checked;
    saveState();
    renderEnglish();
  });

  // Mistake Cards
  const mistakeForm = document.getElementById('mistakeForm');
  const mistakeList = document.getElementById('mistakeList');

  mistakeForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const wrong = document.getElementById('mistakeWrong').value.trim();
    const right = document.getElementById('mistakeRight').value.trim();
    const note = document.getElementById('mistakeNote').value.trim();
    if (!wrong || !right) return;
    state.mistakes.unshift({ id: uid(), wrong, right, note });
    mistakeForm.reset();
    saveState();
    renderEnglish();
    renderMain();
  });

  mistakeList.addEventListener('click', (e) => {
    const delId = e.target.dataset.mistakeDel;
    if (!delId) return;
    state.mistakes = state.mistakes.filter(m => m.id !== delId);
    saveState();
    renderEnglish();
    renderMain();
  });

  // Writing & Daily Question (AI)
  const writingAnswer = document.getElementById('writingAnswer');
  writingAnswer.addEventListener('input', () => {
    const words = writingAnswer.value.trim().split(/\s+/).filter(Boolean).length;
    document.getElementById('writingWordCount').textContent = `${words} kelime`;
  });

  function handleAiError(err, targetEl) {
    if (err.message === 'NO_KEY') {
      const msg = 'Önce sol alttaki "Ayarlar & Bağlantı" kısmından ücretsiz Gemini API anahtarını eklemelisin.';
      if (targetEl) {
        targetEl.classList.remove('hidden');
        targetEl.textContent = msg;
      } else {
        alert(msg);
      }
    } else {
      const msg = err.message || 'Bir hata oluştu.';
      if (targetEl) {
        targetEl.classList.remove('hidden');
        targetEl.textContent = msg;
      } else {
        alert(msg);
      }
    }
  }

  document.getElementById('genDailyQuestionBtn').addEventListener('click', async (e) => {
    const btn = e.target;
    const orig = btn.textContent;
    btn.disabled = true;
    btn.textContent = 'Üretiliyor...';
    try {
      const q = await window.GeminiAI.generateIeltsQuestion('Writing Task 2');
      document.getElementById('dailyIeltsPrompt').textContent = q;
    } catch (err) {
      handleAiError(err, document.getElementById('writingFeedback'));
    } finally {
      btn.disabled = false;
      btn.textContent = orig;
    }
  });

  async function runEnglishEval(mode, questionText, answerText, outputEl, btn) {
    if (!answerText.trim()) {
      outputEl.classList.remove('hidden');
      outputEl.textContent = 'Önce yukarıdaki kutuya İngilizce cevabını yazmalısın.';
      return;
    }
    btn.disabled = true;
    outputEl.classList.remove('hidden');
    outputEl.textContent = 'Değerlendiriliyor ve hata kartları çıkarılıyor...';
    try {
      const res = await window.GeminiAI.evaluateEnglish(mode, questionText, answerText);
      let savedMistakes = 0;
      if (Array.isArray(res.mistakes)) {
        res.mistakes.forEach(m => {
          if (m.wrong && m.right) {
            state.mistakes.unshift({ id: uid(), wrong: m.wrong, right: m.right, note: m.note || '' });
            savedMistakes++;
          }
        });
      }
      let savedVocab = 0;
      if (Array.isArray(res.vocab)) {
        res.vocab.forEach(v => {
          if (v.word && v.meaning && !state.vocab.some(x => x.word.toLowerCase() === v.word.toLowerCase())) {
            state.vocab.unshift({ id: uid(), word: v.word, meaning: v.meaning, example: v.example || '', mastered: false });
            savedVocab++;
          }
        });
      }
      saveState();
      renderEnglish();
      renderMain();

      outputEl.textContent = `Tahmini Band: ${res.band}\n\nDeğerlendirme:\n${res.feedback}\n\nBand 7+ Versiyonu:\n"${res.improved}"\n\n✓ ${savedMistakes} hata kartı ve ${savedVocab} yeni kelime otomatik kaydedildi.`;
    } catch (err) {
      handleAiError(err, outputEl);
    } finally {
      btn.disabled = false;
    }
  }

  document.getElementById('evaluateWritingBtn').addEventListener('click', (e) => {
    runEnglishEval(
      'Writing',
      document.getElementById('dailyIeltsPrompt').textContent,
      writingAnswer.value,
      document.getElementById('writingFeedback'),
      e.target
    );
  });

  // Grammar (AI)
  document.getElementById('genGrammarBtn').addEventListener('click', async (e) => {
    const btn = e.target;
    const level = document.getElementById('grammarLevel').value;
    const out = document.getElementById('grammarContent');
    btn.disabled = true;
    out.textContent = `${level} seviyesinde bugünün gramer konusu hazırlanıyor...`;
    try {
      const lesson = await window.GeminiAI.generateGrammarLesson(level);
      out.textContent = lesson;
    } catch (err) {
      handleAiError(err, out);
    } finally {
      btn.disabled = false;
    }
  });

  // Speaking (Web Speech API + AI)
  document.getElementById('newSpeakingQBtn').addEventListener('click', async (e) => {
    const btn = e.target;
    const orig = btn.textContent;
    btn.disabled = true;
    btn.textContent = 'Üretiliyor...';
    try {
      const q = await window.GeminiAI.generateIeltsQuestion('Speaking Part 2/3');
      document.getElementById('speakingPrompt').textContent = q;
    } catch (err) {
      handleAiError(err, document.getElementById('speakingFeedback'));
    } finally {
      btn.disabled = false;
      btn.textContent = orig;
    }
  });

  document.getElementById('readSpeakingQBtn').addEventListener('click', () => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(document.getElementById('speakingPrompt').textContent);
    u.lang = 'en-GB';
    u.rate = 0.95;
    window.speechSynthesis.speak(u);
  });

  const recordBtn = document.getElementById('recordSpeechBtn');
  let recognition = null;
  let isRecording = false;

  recordBtn.addEventListener('click', () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      alert('Tarayıcın sesli tanımayı desteklemiyor (Chrome veya Edge kullanabilirsin). Cevabını metin kutusuna da yazabilirsin.');
      return;
    }
    if (isRecording && recognition) {
      recognition.stop();
      return;
    }
    recognition = new SR();
    recognition.lang = 'en-US';
    recognition.continuous = true;
    recognition.interimResults = false;
    const box = document.getElementById('speakingTranscript');

    recognition.onstart = () => {
      isRecording = true;
      recordBtn.textContent = '⏹ Kaydı Durdur';
    };
    recognition.onresult = (ev) => {
      let text = '';
      for (let i = ev.resultIndex; i < ev.results.length; i++) {
        text += ev.results[i][0].transcript + ' ';
      }
      box.value = (box.value + ' ' + text).trim();
    };
    recognition.onend = () => {
      isRecording = false;
      recordBtn.textContent = '🎙️ Konuşmaya Başla';
    };
    recognition.start();
  });

  document.getElementById('evalSpeakingBtn').addEventListener('click', (e) => {
    runEnglishEval(
      'Speaking',
      document.getElementById('speakingPrompt').textContent,
      document.getElementById('speakingTranscript').value,
      document.getElementById('speakingFeedback'),
      e.target
    );
  });

  // Listening (AI + SpeechSynthesis)
  document.getElementById('genListeningBtn').addEventListener('click', async (e) => {
    const btn = e.target;
    const status = document.getElementById('listeningStatus');
    btn.disabled = true;
    status.textContent = 'IELTS dinleme parçası ve sorular hazırlanıyor...';
    try {
      currentListening = await window.GeminiAI.generateListening();
      status.textContent = `Hazır: ${currentListening.title}`;
      document.getElementById('listeningControls').classList.remove('hidden');
      const scriptBox = document.getElementById('listeningScriptBox');
      scriptBox.textContent = currentListening.script;
      scriptBox.classList.add('hidden');

      const qBox = document.getElementById('listeningQuestionsBox');
      qBox.innerHTML = (currentListening.questions || []).map((q, qi) => `
        <div class="mt-12">
          <p class="small"><strong>${qi + 1}. ${escapeHtml(q.q)}</strong></p>
          <div class="quiz-options">
            ${q.options.map((opt, oi) => `<button class="quiz-opt" data-lq="${qi}" data-lcorrect="${oi === q.answerIndex}">${escapeHtml(opt)}</button>`).join('')}
          </div>
        </div>
      `).join('');

      qBox.querySelectorAll('.quiz-opt').forEach(optBtn => {
        optBtn.addEventListener('click', () => {
          const qi = optBtn.dataset.lq;
          const isRight = optBtn.dataset.lcorrect === 'true';
          optBtn.classList.add(isRight ? 'correct' : 'wrong');
          qBox.querySelectorAll(`[data-lq="${qi}"]`).forEach(b => {
            b.disabled = true;
            if (b.dataset.lcorrect === 'true') b.classList.add('correct');
          });
        });
      });
    } catch (err) {
      status.textContent = err.message === 'NO_KEY'
        ? 'Önce "Ayarlar & Bağlantı" kısmından Gemini API anahtarını ekleyip kaydetmelisin.'
        : `Hata: ${err.message}`;
    } finally {
      btn.disabled = false;
    }
  });

  document.getElementById('playListeningBtn').addEventListener('click', () => {
    if (!currentListening || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(currentListening.script);
    u.lang = 'en-GB';
    u.rate = 0.92;
    window.speechSynthesis.speak(u);
  });

  document.getElementById('stopListeningBtn').addEventListener('click', () => {
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
  });

  document.getElementById('toggleScriptBtn').addEventListener('click', () => {
    document.getElementById('listeningScriptBox').classList.toggle('hidden');
  });

  function renderEnglish() {
    const filtered = state.vocab.filter(v => {
      if (vocabFilter === 'learning') return !v.mastered;
      if (vocabFilter === 'mastered') return v.mastered;
      return true;
    });

    vocabList.innerHTML = filtered.length
      ? filtered.map(v => `
        <li class="list-item ${v.mastered ? 'done' : ''}">
          <div class="item-left">
            <input type="checkbox" ${v.mastered ? 'checked' : ''} data-vocab-toggle="${v.id}" />
            <div class="item-meta">
              <span class="item-title">${escapeHtml(v.word)}</span>
              <span class="item-sub">${escapeHtml(v.meaning)}</span>
              ${v.example ? `<span class="item-sub"><em>"${escapeHtml(v.example)}"</em></span>` : ''}
            </div>
          </div>
          <button class="delete-btn" data-vocab-del="${v.id}">&times;</button>
        </li>
      `).join('')
      : '<li class="empty-state">Bu filtrede kelime yok.</li>';

    const day = getDay();
    ieltsChecklist.innerHTML = IELTS_TASKS.map(t => {
      const checked = !!day.ielts[t.id];
      return `
        <label class="habit-item ${checked ? 'checked' : ''}">
          <input type="checkbox" ${checked ? 'checked' : ''} data-ielts="${t.id}" />
          <span>${escapeHtml(t.label)}</span>
        </label>
      `;
    }).join('');

    mistakeList.innerHTML = state.mistakes.length
      ? state.mistakes.map(m => `
        <li class="list-item">
          <div class="item-meta">
            <div><span class="mistake-wrong">${escapeHtml(m.wrong)}</span> &rarr; <span class="mistake-right">${escapeHtml(m.right)}</span></div>
            ${m.note ? `<span class="item-sub">${escapeHtml(m.note)}</span>` : ''}
          </div>
          <button class="delete-btn" data-mistake-del="${m.id}">&times;</button>
        </li>
      `).join('')
      : '<li class="empty-state">Henüz hata kartı yok. Writing/Speaking değerlendirdikçe buraya otomatik eklenecek.</li>';

    renderFlashcard();
  }

  // --- TAB 3: WORKOUT (HOME DUMBBELLS + POSTURE + KG/SET/REP) ---
  const workoutProgramSelect = document.getElementById('workoutProgramSelect');
  const workoutList = document.getElementById('workoutList');
  const suggestionCategory = document.getElementById('suggestionCategory');
  const suggestionList = document.getElementById('suggestionList');
  const workoutHistory = document.getElementById('workoutHistory');

  workoutProgramSelect.addEventListener('change', () => {
    const key = workoutProgramSelect.value;
    const prog = WORKOUT_PROGRAMS[key];
    const day = getDay();
    day.workoutProgram = key;
    const completed = (day.exercises || []).filter(ex => ex.done);
    const completedNames = new Set(completed.map(ex => ex.name.toLowerCase()));
    const nextExercises = prog.exercises
      .filter(ex => !completedNames.has(ex.name.toLowerCase()))
      .map(ex => ({ id: uid(), ...ex, done: false }));
    day.exercises = [...completed, ...nextExercises];
    saveState();
    renderWorkout();
    renderMain();
  });

  document.getElementById('customExerciseForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('exName').value.trim();
    const weight = Number(document.getElementById('exWeight').value) || 0;
    const sets = Number(document.getElementById('exSets').value) || 3;
    const reps = Number(document.getElementById('exReps').value) || 12;
    if (!name) return;
    getDay().exercises.push({ id: uid(), name, weight, sets, reps, done: false });
    e.target.reset();
    document.getElementById('exSets').value = 3;
    document.getElementById('exReps').value = 12;
    saveState();
    renderWorkout();
    renderMain();
  });

  // --- Exercise Real Animated GIFs ---
  const openDemoIds = new Set();

  function getExerciseDemo(name) {
    const n = (name || '').toLowerCase();
    const ytUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(name + ' nasıl yapılır egzersiz')}`;

    if (/wall angel|wall slide|duvar.*açma|duvar.*postür|göğüs esnetme/.test(n)) {
      return {
        gif: 'https://fitnessprogramer.com/wp-content/uploads/2021/02/wall-slide.gif',
        tip: 'Sırtını ve başını duvara yasla. Kollarını "W" şeklinden "Y" şekline duvardan ayırmadan yavaşça yukarı kaydır.',
        ytUrl
      };
    }
    if (/row|sırt çekiş/.test(n)) {
      return {
        gif: 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Row.gif',
        tip: 'Sırtın düz olacak şekilde eğil. 5 kg dambılı dirseğini geriye çekerek beline doğru kaldır, kürek kemiklerini sıkıştır.',
        ytUrl
      };
    }
    if (/incline.*şınav|incline push|eğimli şınav/.test(n)) {
      return {
        gif: 'https://fitnessprogramer.com/wp-content/uploads/2021/06/Incline-Push-Up.gif',
        tip: 'Ellerini sabit bir sandalyeye veya yükseltiye koy. Gövden düz olsun, göğsünü yaklaştırıp nefes vererek it.',
        ytUrl
      };
    }
    if (/şınav|push-up|pushup/.test(n)) {
      return {
        gif: 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Push-Up.gif',
        tip: 'Vücudun baştan topuğa düz bir çizgi olsun. Göğsünü yere kontrollü indirip nefes vererek yukarı it.',
        ytUrl
      };
    }
    if (/reverse fly/.test(n)) {
      return {
        gif: 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Reverse-Fly.gif',
        tip: 'Öne hafif eğil, dirsekler hafif bükülü kalsın. Dambılları yana doğru açarken kürek kemiklerini birbirine yaklaştır.',
        ytUrl
      };
    }
    if (/lateral|yan omuz/.test(n)) {
      return {
        gif: 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Lateral-Raise.gif',
        tip: 'Dirseklerin hafif bükülü, dambılları omuz hizasına kadar kontrollü yana kaldırıp yavaşça indir.',
        ytUrl
      };
    }
    if (/floor fly|dumbbell fly|fly/.test(n)) {
      return {
        gif: 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Fly.gif',
        tip: 'Sırt üstü uzan, dirsekler hafif bükülü şekilde kollarını iki yana açıp göğsünü sıkarak ortada birleştir.',
        ytUrl
      };
    }
    if (/bulgarian|split squat/.test(n)) {
      return {
        gif: 'https://fitnessprogramer.com/wp-content/uploads/2021/05/Dumbbell-Bulgarian-Split-Squat.gif',
        tip: 'Arka ayağını sandalyeye koy, gövden dik kalsın. Ön dizini bükerek aşağı inip ön topuktan güç alarak kalk.',
        ytUrl
      };
    }
    if (/goblet|squat/.test(n)) {
      return {
        gif: 'https://fitnessprogramer.com/wp-content/uploads/2023/01/Dumbbell-Goblet-Squat.gif',
        tip: 'Dambılı göğsünde tut, göğsün dik olsun. Kalçanı sandalyeye oturur gibi geriye indirip topuklardan güç alarak kalk.',
        ytUrl
      };
    }
    if (/step-up/.test(n)) {
      return {
        gif: 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Step-up.gif',
        tip: 'Sağlam bir sandalyeye/basamağa tek ayağınla kontrollü çıkıp in, dizini içe kaçırmadan dengeyi koru.',
        ytUrl
      };
    }
    if (/wall sit|duvar oturuşu/.test(n)) {
      return {
        gif: 'https://fitnessprogramer.com/wp-content/uploads/2021/06/Wall-Sit.png',
        tip: 'Sırtını duvara yasla, dizlerin 90° bükülü olacak şekilde hayali bir sandalyede oturur pozisyonda bekle.',
        ytUrl
      };
    }
    if (/dead bug/.test(n)) {
      return {
        gif: 'https://fitnessprogramer.com/wp-content/uploads/2021/05/Dead-Bug.gif',
        tip: 'Belini yere bastır, ters kol ve ters bacağı yavaşça yere yaklaştırıp başlangıç pozisyonuna dön.',
        ytUrl
      };
    }
    if (/floor press/.test(n)) {
      return {
        gif: 'https://fitnessprogramer.com/wp-content/uploads/2022/07/Barbell-Floor-Press.gif',
        tip: 'Sırt üstü yere uzan, dirseklerin yere hafifçe değene kadar dambılları indir ve yukarı it.',
        ytUrl
      };
    }
    if (/shoulder press|omuz pres/.test(n)) {
      return {
        gif: 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Shoulder-Press.gif',
        tip: 'Belini çukurlaştırmadan dambılları omuz hizasından başının üstüne doğru kontrollü it ve indir.',
        ytUrl
      };
    }
    if (/dips/.test(n)) {
      return {
        gif: 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Bench-Dips.gif',
        tip: 'Ellerini sabit sandalyenin kenarına koy, dirseklerini geriye bükerek in ve arka kolunla yukarı it.',
        ytUrl
      };
    }
    if (/hammer curl/.test(n)) {
      return {
        gif: 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Hammer-Curl.gif',
        tip: 'Avuç içlerin birbirine baksın, dirseklerini gövdene sabitleyip dambılları omuzlarına doğru kaldır.',
        ytUrl
      };
    }
    if (/curl/.test(n)) {
      return {
        gif: 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Curl.gif',
        tip: 'Dirseklerini gövdene sabitle, sallanmadan dambılları omuzlarına doğru bükerek kaldır ve yavaşça indir.',
        ytUrl
      };
    }
    if (/superman/.test(n)) {
      return {
        gif: 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Superman-exercise.gif',
        tip: 'Yüz üstü uzan, kollarını ve bacaklarını aynı anda yerden hafifçe kaldırıp 2 saniye bekle ve indir.',
        ytUrl
      };
    }
    if (/thruster/.test(n)) {
      return {
        gif: 'https://fitnessprogramer.com/wp-content/uploads/2022/10/thruster.gif',
        tip: 'Dambıllar omuzdayken squat yap, yukarı kalkarken hızını kullanarak dambılları başının üstüne it.',
        ytUrl
      };
    }
    if (/mountain|climber/.test(n)) {
      return {
        gif: 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Mountain-climber.gif',
        tip: 'Şınav pozisyonunda karnını sık, dizlerini sırayla göğsüne doğru ritmik şekilde çek.',
        ytUrl
      };
    }
    if (/cat-cow|omurga/.test(n)) {
      return {
        gif: 'https://fitnessprogramer.com/wp-content/uploads/2021/02/cat-cow.gif',
        tip: 'Dört ayak üstünde nefes alırken belini hafif çukurlaştırıp karşıya bak, nefes verirken sırtını kambur yap.',
        ytUrl
      };
    }
    if (/bridge|köprü/.test(n)) {
      return {
        gif: 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Glute-Bridge-.gif',
        tip: 'Sırt üstü uzanıp dizlerini bük, topuklarından güç alarak kalçanı yukarı kaldırıp 1 saniye sık.',
        ytUrl
      };
    }
    if (/bicycle/.test(n)) {
      return {
        gif: 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Bicycle-Crunch.gif',
        tip: 'Sırt üstü uzan, pedal çevirir gibi ters dirseğini ters dizine doğru kontrollü yaklaştır.',
        ytUrl
      };
    }
    return {
      gif: 'https://fitnessprogramer.com/wp-content/uploads/2021/02/plank.gif',
      tip: 'Dirseklerin omuz hizasında, karnın ve kalçan sıkı olsun; belinin aşağı çökmesine izin vermeden düzenli nefes al.',
      ytUrl
    };
  }

  function renderDemoPanelHtml(name) {
    const demo = getExerciseDemo(name);
    return `
      <div class="ex-demo-panel">
        <div class="ex-gif-stage">
          <img src="${demo.gif}" alt="${escapeHtml(name)}" loading="lazy" />
        </div>
        <div class="ex-demo-info">
          <p>${escapeHtml(demo.tip)}</p>
          <a class="ex-video-link" href="${demo.ytUrl}" target="_blank" rel="noopener noreferrer">▶ YouTube'da Video Gör</a>
        </div>
      </div>
    `;
  }

  workoutList.addEventListener('click', (e) => {
    const toggleId = e.target.dataset.exToggle;
    const delId = e.target.dataset.exDel;
    const demoId = e.target.dataset.exDemo;
    const day = getDay();
    if (demoId) {
      if (openDemoIds.has(demoId)) openDemoIds.delete(demoId);
      else openDemoIds.add(demoId);
      renderWorkout();
    } else if (toggleId) {
      const ex = day.exercises.find(x => x.id === toggleId);
      if (ex) ex.done = !ex.done;
      saveState();
      renderWorkout();
      renderMain();
    } else if (delId) {
      day.exercises = day.exercises.filter(x => x.id !== delId);
      saveState();
      renderWorkout();
      renderMain();
    }
  });

  workoutList.addEventListener('change', (e) => {
    const id = e.target.dataset.exMetricId;
    const field = e.target.dataset.exField;
    if (!id || !field) return;
    const ex = getDay().exercises.find(x => x.id === id);
    if (ex) {
      ex[field] = Number(e.target.value) || 0;
      saveState();
    }
  });

  suggestionCategory.addEventListener('change', renderExerciseSuggestions);
  suggestionList.addEventListener('click', (e) => {
    const demoKey = e.target.dataset.sugDemo;
    if (demoKey) {
      if (openDemoIds.has(demoKey)) openDemoIds.delete(demoKey);
      else openDemoIds.add(demoKey);
      renderExerciseSuggestions();
      return;
    }
    const idx = e.target.dataset.addSugEx;
    if (idx === undefined) return;
    const item = EXERCISE_SUGGESTIONS[suggestionCategory.value][Number(idx)];
    if (!item) return;
    getDay().exercises.push({ id: uid(), name: item.name, weight: item.weight, sets: item.sets, reps: item.reps, done: false });
    saveState();
    renderWorkout();
    renderMain();
  });

  // AI Workout Log (Natural Language -> Burned Calories & Memory)
  const workoutLogList = document.getElementById('workoutLogList');

  document.getElementById('aiWorkoutLogForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const input = document.getElementById('aiWorkoutLogInput');
    const btn = document.getElementById('aiWorkoutLogBtn');
    const commentBox = document.getElementById('aiWorkoutLogComment');
    const sentence = input.value.trim();
    if (!sentence) return;

    btn.disabled = true;
    btn.textContent = 'Hesaplanıyor...';
    try {
      const res = await window.GeminiAI.parseWorkoutLog(sentence);
      const day = getDay();
      (res.entries || []).forEach(ent => {
        day.workoutLogs.push({
          id: uid(),
          name: ent.name,
          details: ent.details || '',
          burnedCal: Math.round(Number(ent.burnedCal) || 0)
        });
      });
      if (res.comment) {
        commentBox.classList.remove('hidden');
        commentBox.textContent = res.comment;
      }
      input.value = '';
      saveState();
      renderWorkout();
      renderNutrition();
      renderMain();
    } catch (err) {
      handleAiError(err, commentBox);
    } finally {
      btn.disabled = false;
      btn.textContent = 'Hesapla & Hafızaya Al (AI)';
    }
  });

  workoutLogList.addEventListener('click', (e) => {
    const delId = e.target.dataset.wlogDel;
    if (!delId) return;
    const day = getDay();
    day.workoutLogs = (day.workoutLogs || []).filter(x => x.id !== delId);
    saveState();
    renderWorkout();
    renderNutrition();
    renderMain();
  });

  // AI Workout Coach
  document.getElementById('aiWorkoutForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const input = document.getElementById('aiWorkoutInput');
    const btn = document.getElementById('aiWorkoutBtn');
    const out = document.getElementById('aiWorkoutResult');
    const q = input.value.trim();
    if (!q) return;
    btn.disabled = true;
    out.classList.remove('hidden');
    out.textContent = 'Ev ekipmanlarına göre antrenman hazırlanıyor...';
    try {
      const res = await window.GeminiAI.suggestWorkout(q);
      const day = getDay();
      if (Array.isArray(res.exercises) && res.exercises.length) {
        res.exercises.forEach(ex => {
          day.exercises.push({
            id: uid(),
            name: ex.name,
            weight: Number(ex.weight) || 0,
            sets: Number(ex.sets) || 3,
            reps: Number(ex.reps) || 12,
            done: false
          });
        });
        saveState();
        renderWorkout();
        renderMain();
      }
      out.textContent = `${res.message}\n\n✓ ${res.exercises?.length || 0} hareket bugünkü listene eklendi.`;
      input.value = '';
    } catch (err) {
      handleAiError(err, out);
    } finally {
      btn.disabled = false;
    }
  });

  function renderExerciseSuggestions() {
    const cat = suggestionCategory.value;
    const items = EXERCISE_SUGGESTIONS[cat] || [];
    suggestionList.innerHTML = items.map((item, i) => {
      const key = `sug_${cat}_${i}`;
      const isOpen = openDemoIds.has(key);
      return `
        <li class="list-item ex-card-item">
          <div class="ex-top-row">
            <div class="item-meta">
              <span class="item-title">${escapeHtml(item.name)}</span>
              <span class="item-sub">${item.weight ? item.weight + ' kg · ' : ''}${item.sets}x${item.reps} · ${escapeHtml(item.note)}</span>
            </div>
            <div class="ex-actions-right">
              <button class="mini-add-btn" data-sug-demo="${key}">${isOpen ? 'Gizle' : 'GIF'}</button>
              <button class="mini-add-btn" data-add-sug-ex="${i}">+ Ekle</button>
            </div>
          </div>
          ${isOpen ? renderDemoPanelHtml(item.name) : ''}
        </li>
      `;
    }).join('');
  }

  function renderWorkout() {
    const day = getDay();
    const prog = WORKOUT_PROGRAMS[day.workoutProgram] || WORKOUT_PROGRAMS.upper_posture;
    workoutProgramSelect.value = day.workoutProgram;
    document.getElementById('workoutDayTitle').textContent = prog.title;
    document.getElementById('workoutDayFocus').textContent = prog.focus;

    workoutList.innerHTML = day.exercises.length
      ? day.exercises.map(ex => `
          <li class="list-item ex-card-item ${ex.done ? 'done' : ''}">
            <div class="ex-top-row">
              <div class="item-left">
                <input type="checkbox" ${ex.done ? 'checked' : ''} data-ex-toggle="${ex.id}" />
                <div class="item-meta">
                  <span class="item-title">${escapeHtml(ex.name)}</span>
                  <div class="ex-inline-metrics">
                    <input type="number" class="ex-mini-input" value="${ex.weight ?? 0}" min="0" step="0.5" data-ex-metric-id="${ex.id}" data-ex-field="weight" title="Ağırlık (kg)" /> <span class="muted small">kg</span>
                    <input type="number" class="ex-mini-input" value="${ex.sets ?? 3}" min="1" data-ex-metric-id="${ex.id}" data-ex-field="sets" title="Set" /> <span class="muted small">set</span>
                    <input type="number" class="ex-mini-input" value="${ex.reps ?? 12}" min="1" data-ex-metric-id="${ex.id}" data-ex-field="reps" title="Tekrar" /> <span class="muted small">tekrar</span>
                  </div>
                </div>
              </div>
              <div class="ex-actions-right">
                <button class="delete-btn" data-ex-del="${ex.id}">&times;</button>
              </div>
            </div>
            ${renderDemoPanelHtml(ex.name)}
          </li>
        `).join('')
      : '<li class="empty-state">Bugün için egzersiz yok.</li>';

    renderExerciseSuggestions();

    // Render Workout Logs & Burned Calories
    const logs = day.workoutLogs || [];
    const totalBurned = logs.reduce((s, x) => s + (x.burnedCal || 0), 0);
    document.getElementById('workoutBurnedBadge').textContent = `${totalBurned} kcal yakıldı`;
    workoutLogList.innerHTML = logs.length
      ? logs.map(l => `
        <li class="list-item">
          <div class="item-meta">
            <span class="item-title">${escapeHtml(l.name)}</span>
            <span class="item-sub">${l.details ? escapeHtml(l.details) + ' · ' : ''}~${l.burnedCal} kcal</span>
          </div>
          <button class="delete-btn" data-wlog-del="${l.id}">&times;</button>
        </li>
      `).join('')
      : '<li class="empty-state">Yaptığın antrenmanları yukarıya yaz; kaloriyi hesaplayıp buraya kaydedeyim.</li>';

    const activeDays = Object.entries(state.days)
      .filter(([, d]) => (d.exercises && d.exercises.some(ex => ex.done)) || (d.workoutLogs && d.workoutLogs.length > 0))
      .sort((a, b) => b[0].localeCompare(a[0]));

    document.getElementById('workoutStreakBadge').textContent = `${activeDays.length} gün`;
    workoutHistory.innerHTML = activeDays.length
      ? activeDays.slice(0, 5).map(([dateKey, d]) => {
        const done = (d.exercises || []).filter(x => x.done).length;
        const bCal = (d.workoutLogs || []).reduce((s, x) => s + (x.burnedCal || 0), 0);
        const pName = (WORKOUT_PROGRAMS[d.workoutProgram] || {}).title || 'Ev Antrenmanı';
        const badgeText = bCal > 0 ? `${bCal} kcal` : `${done}/${(d.exercises || []).length}`;
        return `<li class="list-item"><div class="item-meta"><span class="item-title">${escapeHtml(pName)}</span><span class="item-sub">${escapeHtml(dateKey)}</span></div><span class="badge">${badgeText}</span></li>`;
      }).join('')
      : '<li class="empty-state">Tamamlanan antrenmanlar burada birikecek.</li>';
  }

  // --- TAB 4: NUTRITION (NATURAL LANGUAGE + DIET ADVISOR) ---
  const mealList = document.getElementById('mealList');
  const mealTypeSelect = document.getElementById('mealTypeSelect');

  document.getElementById('aiMealForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const input = document.getElementById('aiMealInput');
    const btn = document.getElementById('aiMealBtn');
    const sentence = input.value.trim();
    if (!sentence) return;
    btn.disabled = true;
    btn.textContent = 'Hesaplanıyor...';
    try {
      const res = await window.GeminiAI.parseMeal(sentence);
      const day = getDay();
      (res.items || []).forEach(it => {
        day.meals.push({
          id: uid(),
          mealType: mealTypeSelect.value,
          name: it.name,
          cal: Math.round(Number(it.cal) || 0),
          pro: Math.round(Number(it.pro) || 0),
          carb: Math.round(Number(it.carb) || 0),
          fat: Math.round(Number(it.fat) || 0)
        });
      });
      if (res.comment) {
        document.getElementById('dietAdviceBox').textContent = res.comment;
      }
      input.value = '';
      saveState();
      renderNutrition();
      renderMain();
    } catch (err) {
      handleAiError(err, document.getElementById('dietAdviceBox'));
    } finally {
      btn.disabled = false;
      btn.textContent = 'Hesapla ve Kaydet (AI)';
    }
  });

  document.getElementById('customFoodForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('cfName').value.trim();
    if (!name) return;
    getDay().meals.push({
      id: uid(),
      mealType: mealTypeSelect.value,
      name,
      cal: Number(document.getElementById('cfCal').value) || 0,
      pro: Number(document.getElementById('cfPro').value) || 0,
      carb: Number(document.getElementById('cfCarb').value) || 0,
      fat: Number(document.getElementById('cfFat').value) || 0
    });
    e.target.reset();
    saveState();
    renderNutrition();
    renderMain();
  });

  mealList.addEventListener('click', (e) => {
    const delId = e.target.dataset.mealDel;
    if (!delId) return;
    const day = getDay();
    day.meals = day.meals.filter(m => m.id !== delId);
    saveState();
    renderNutrition();
    renderMain();
  });

  document.getElementById('askDietAdviceBtn').addEventListener('click', async (e) => {
    const btn = e.target;
    const box = document.getElementById('dietAdviceBox');
    btn.disabled = true;
    box.textContent = 'Evdeki malzemelerine ve kalan kalorine göre öneri hazırlanıyor...';
    try {
      const day = getDay();
      const totals = getNutritionTotals(day);
      const advice = await window.GeminiAI.getDietAdvice(totals, state.profile, day.meals);
      box.textContent = advice;
    } catch (err) {
      handleAiError(err, box);
    } finally {
      btn.disabled = false;
    }
  });

  function getNutritionTotals(day) {
    return day.meals.reduce(
      (acc, m) => ({
        cal: acc.cal + (m.cal || 0),
        pro: acc.pro + (m.pro || 0),
        carb: acc.carb + (m.carb || 0),
        fat: acc.fat + (m.fat || 0)
      }),
      { cal: 0, pro: 0, carb: 0, fat: 0 }
    );
  }

  function renderNutrition() {
    const day = getDay();
    const p = state.profile;
    const totals = getNutritionTotals(day);
    const remainingCal = p.calTarget - totals.cal;
    const remainingPro = Math.max(0, p.proTarget - totals.pro);
    const pct = Math.min(100, Math.round((totals.cal / p.calTarget) * 100));

    document.getElementById('calTotal').textContent = totals.cal;
    document.getElementById('calTarget').textContent = p.calTarget;
    document.getElementById('macroProtein').textContent = totals.pro;
    document.getElementById('macroCarb').textContent = totals.carb;
    document.getElementById('macroFat').textContent = totals.fat;
    document.getElementById('targetProtein').textContent = p.proTarget;
    document.getElementById('targetCarb').textContent = p.carbTarget;
    document.getElementById('targetFat').textContent = p.fatTarget;

    const fill = document.getElementById('calProgressFill');
    fill.style.width = `${pct}%`;
    fill.classList.toggle('over', totals.cal > p.calTarget);

    const burned = (day.workoutLogs || []).reduce((s, x) => s + (x.burnedCal || 0), 0);
    const burnedNote = burned > 0 ? ` · Sporla yakılan: -${burned} kcal (Net: ${totals.cal - burned} kcal)` : '';
    document.getElementById('calorieRemainingText').textContent = remainingCal >= 0
      ? `Hedefine ${remainingCal} kcal ve ${remainingPro}g protein kaldı${burnedNote}.`
      : `Günlük kalori hedefini ${Math.abs(remainingCal)} kcal aştın${burnedNote}.`;

    mealList.innerHTML = day.meals.length
      ? day.meals.map(m => `
        <li class="list-item">
          <div class="item-meta">
            <span class="item-title"><span class="time-tag">${escapeHtml(m.mealType)}</span>${escapeHtml(m.name)}</span>
            <span class="item-sub">${m.cal} kcal · P: ${m.pro}g · K: ${m.carb}g · Y: ${m.fat}g</span>
          </div>
          <button class="delete-btn" data-meal-del="${m.id}">&times;</button>
        </li>
      `).join('')
      : '<li class="empty-state">Henüz öğün eklemedin. Yukarıya cümleyle yazıp hesaplatabilirsin.</li>';
  }

  // --- PERSISTENT AI COACH CHAT DRAWER ---
  const chatFab = document.getElementById('chatFab');
  const chatDrawer = document.getElementById('chatDrawer');
  const chatMessages = document.getElementById('chatMessages');
  const chatForm = document.getElementById('chatForm');
  const chatInput = document.getElementById('chatInput');

  chatFab.addEventListener('click', () => {
    chatDrawer.classList.remove('hidden');
    chatFab.classList.add('hidden');
    renderChat();
    chatInput.focus();
  });

  document.getElementById('closeChatBtn').addEventListener('click', () => {
    chatDrawer.classList.add('hidden');
    chatFab.classList.remove('hidden');
  });

  document.getElementById('clearChatBtn').addEventListener('click', () => {
    state.chatHistory = [{ role: 'assistant', text: 'Sohbet temizlendi. Nasıl yardımcı olabilirim?' }];
    saveState();
    renderChat();
  });

  function executeAiActions(actions) {
    const notes = [];
    if (!Array.isArray(actions)) return notes;

    actions.forEach(act => {
      const targetDate = /^\d{4}-\d{2}-\d{2}$/.test(act.date || '') ? act.date : currentDate;
      if (act.type === 'add_task' && act.text) {
        getDay(targetDate).tasks.push({ id: uid(), text: act.text, done: false });
        notes.push(`✓ ${targetDate} tarihine görev eklendi: "${act.text}"`);
      } else if (act.type === 'add_meal' && act.name) {
        getDay(targetDate).meals.push({
          id: uid(),
          mealType: act.mealType || 'Öğün',
          name: act.name,
          cal: Math.round(Number(act.cal) || 0),
          pro: Math.round(Number(act.pro) || 0),
          carb: Math.round(Number(act.carb) || 0),
          fat: Math.round(Number(act.fat) || 0)
        });
        notes.push(`✓ ${targetDate} beslenmeye eklendi: ${act.name} (${act.cal || 0} kcal)`);
      } else if (act.type === 'add_vocab' && act.word && act.meaning) {
        state.vocab.unshift({ id: uid(), word: act.word, meaning: act.meaning, example: act.example || '', mastered: false });
        notes.push(`✓ Kelime eklendi: ${act.word}`);
      } else if (act.type === 'add_exercise' && act.name) {
        getDay(targetDate).exercises.push({
          id: uid(),
          name: act.name,
          weight: Number(act.weight) || 0,
          sets: Number(act.sets) || 3,
          reps: Number(act.reps) || 12,
          done: false
        });
        notes.push(`✓ ${targetDate} antrenmana eklendi: ${act.name}`);
      } else if (act.type === 'log_workout' && act.name) {
        getDay(targetDate).workoutLogs.push({
          id: uid(),
          name: act.name,
          details: act.details || '',
          burnedCal: Math.round(Number(act.burnedCal) || 0)
        });
        notes.push(`✓ ${targetDate} spor kaydı eklendi: ${act.name} (~${act.burnedCal || 0} kcal)`);
      }
    });
    return notes;
  }

  chatForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const text = chatInput.value.trim();
    if (!text) return;
    const sendBtn = document.getElementById('chatSendBtn');

    state.chatHistory.push({ role: 'user', text });
    chatInput.value = '';
    saveState();
    renderChat();

    sendBtn.disabled = true;
    try {
      const res = await window.GeminiAI.coachChat(text, state.chatHistory.slice(0, -1), {
        today: todayStr(),
        selectedDate: currentDate
      });

      const actionNotes = executeAiActions(res.actions);
      if (res.reply) {
        state.chatHistory.push({ role: 'assistant', text: res.reply });
      }
      actionNotes.forEach(n => state.chatHistory.push({ role: 'system-action', text: n }));
      saveState();
      renderAll();
    } catch (err) {
      const msg = err.message === 'NO_KEY'
        ? 'Önce "Ayarlar & Bağlantı" kısmından ücretsiz Gemini API anahtarını eklemelisin.'
        : err.message;
      state.chatHistory.push({ role: 'assistant', text: msg });
      renderChat();
    } finally {
      sendBtn.disabled = false;
    }
  });

  function renderChat() {
    chatMessages.innerHTML = (state.chatHistory || []).map(m =>
      `<div class="chat-msg ${m.role}">${escapeHtml(m.text)}</div>`
    ).join('');
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  // --- SETTINGS & CLOUD MODAL ---
  const settingsModal = document.getElementById('settingsModal');
  function openSettings() {
    document.getElementById('geminiKeyInput').value = localStorage.getItem(GEMINI_KEY_STORAGE) || '';
    document.getElementById('syncRoomInput').value = localStorage.getItem(FB_ROOM_STORAGE) || '';
    document.getElementById('firebaseConfigInput').value = localStorage.getItem(FB_CONFIG_STORAGE) || '';
    document.getElementById('profIeltsDate').value = state.profile.ieltsDate || '2027-01-25';
    document.getElementById('profCalTarget').value = state.profile.calTarget;
    document.getElementById('profProTarget').value = state.profile.proTarget;
    document.getElementById('profWaterMins').value = state.profile.waterIntervalMins || 75;
    settingsModal.classList.remove('hidden');
  }

  document.getElementById('openSettingsBtn').addEventListener('click', openSettings);
  document.getElementById('mobileSettingsBtn').addEventListener('click', openSettings);
  document.getElementById('closeSettingsBtn').addEventListener('click', () => settingsModal.classList.add('hidden'));
  settingsModal.addEventListener('click', (e) => { if (e.target === settingsModal) settingsModal.classList.add('hidden'); });

  document.getElementById('testGeminiBtn').addEventListener('click', async (e) => {
    const btn = e.target;
    const statusEl = document.getElementById('geminiTestStatus');
    const key = document.getElementById('geminiKeyInput').value.trim();
    btn.disabled = true;
    statusEl.className = 'small mt-8 muted';
    statusEl.textContent = 'Bağlantı test ediliyor...';
    const res = await window.GeminiAI.testConnection(key);
    if (res.ok) {
      localStorage.setItem(GEMINI_KEY_STORAGE, key);
    }
    statusEl.className = `small mt-8 ${res.ok ? 'status-ok' : 'status-err'}`;
    statusEl.textContent = res.ok ? `${res.message} (Otomatik kaydedildi ✓)` : res.message;
    btn.disabled = false;
  });

  document.getElementById('saveSettingsBtn').addEventListener('click', () => {
    localStorage.setItem(GEMINI_KEY_STORAGE, document.getElementById('geminiKeyInput').value.trim());
    localStorage.setItem(FB_ROOM_STORAGE, document.getElementById('syncRoomInput').value.trim());
    localStorage.setItem(FB_CONFIG_STORAGE, document.getElementById('firebaseConfigInput').value.trim());

    const cal = Number(document.getElementById('profCalTarget').value) || 2100;
    const pro = Number(document.getElementById('profProTarget').value) || 140;
    const fat = Math.round((cal * 0.28) / 9);
    const carb = Math.max(50, Math.round((cal - pro * 4 - fat * 9) / 4));

    state.profile = {
      ...state.profile,
      ieltsDate: document.getElementById('profIeltsDate').value || '2027-01-25',
      calTarget: cal,
      proTarget: pro,
      carbTarget: carb,
      fatTarget: fat,
      waterIntervalMins: Number(document.getElementById('profWaterMins').value) || 75
    };

    saveState();
    settingsModal.classList.add('hidden');
    initFirebaseSync();
    scheduleWaterReminder();
    renderAll();
  });

  // Export & Import JSON
  document.getElementById('exportDataBtn').addEventListener('click', () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gunluk-panel-yedek-${todayStr()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  });

  document.getElementById('importDataInput').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const imported = JSON.parse(reader.result);
        if (imported && imported.days) {
          state = { ...defaultState(), ...imported };
          saveState();
          renderAll();
          settingsModal.classList.add('hidden');
          alert('Yedek yüklendi!');
        }
      } catch {
        alert('Geçersiz yedek dosyası.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  });

  // --- Master Render ---
  function renderAll() {
    document.getElementById('currentDateLabel').textContent = formatTurkishDate(currentDate);
    document.getElementById('datePicker').value = currentDate;

    const sunday = isSundaySelected();
    document.getElementById('quizTitle').textContent = sunday ? 'Pazar Genel Kelime Sınavı (Tümü)' : 'Günlük Kelime Sınavı';
    document.getElementById('quizSubtitle').textContent = sunday
      ? 'Bugün Pazar! Öğrendiklerin dahil tüm kelimelerinden genel tekrar.'
      : 'Doğru bildiklerin otomatik "Öğrenildi"ye taşınır';
    document.getElementById('startQuizBtn').textContent = sunday ? 'Genel Sınavı Başlat' : 'Yeni Soru';

    renderMain();
    renderJournal();
    renderEnglish();
    renderWorkout();
    renderNutrition();
    renderChat();
  }

  renderAll();
  scheduleWaterReminder();
  window.addEventListener('load', initFirebaseSync);
})();
