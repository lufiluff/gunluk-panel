window.GeminiAI = (() => {
  // Stable free-tier friendly models prioritized FIRST
  const PRIORITY_MODELS = [
    'gemini-2.5-flash',
    'gemini-2.5-flash-lite',
    'gemini-2.0-flash',
    'gemini-2.0-flash-lite',
    'gemini-flash-latest'
  ];

  let activeModel = localStorage.getItem('kisisel_panel_gemini_model') || '';

  const USER_CONTEXT = `Kullanıcı Profili:
- 25 yaşında, 174 cm, 70 kg, Kimya Mühendisliği mezunu (2 yıl üretim mühendisliği deneyimi), Ocak ayında IELTS Academic sınavından 6.5-7.0 hedefliyor, ardından İtalya'da Management Engineering yüksek lisansı planlıyor.
- Spor: Her gün evde az da olsa spor yapıyor. Ekipman: 2 adet 5 kg dambıl, sandalye, duvar, vücut ağırlığı. Hedef: Göbek ve göğüs bölgesindeki hafif yağlanmayı toparlayıp aşırıya kaçmadan fit kaslanmak ve dik duruş (postür) kazanmak.
- Beslenme: Hedef ~2100 kcal ve ~140g protein (body recomposition). Evde genelde sabah kahvaltı, akşam ev yemeği ve gün içi laktozsuz süt, süzme yoğurt, konserve mısır, turşu, salata malzemeleri, ton balığı, tavuk bulunuyor. Alerji yok.`;

  function getApiKey() {
    return (localStorage.getItem('kisisel_panel_gemini_key') || '').trim();
  }

  async function discoverModels(key) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${encodeURIComponent(key)}`;
      const res = await fetch(url);
      if (!res.ok) return PRIORITY_MODELS;
      const data = await res.json();
      const available = (data.models || [])
        .filter(m => Array.isArray(m.supportedGenerationMethods) && m.supportedGenerationMethods.includes('generateContent'))
        .map(m => (m.name || '').replace(/^models\//, ''))
        .filter(name =>
          /^(gemini-|gemma-)/i.test(name) &&
          !/(embedding|tts|image|audio|vision|aqa|robotics|computer-use|omni|live|veo|lyria|learnlm)/i.test(name)
        );

      // Put PRIORITY_MODELS that exist in available first, then other flash models, then gemma
      const prioritized = PRIORITY_MODELS.filter(p => available.includes(p));
      const otherFlash = available.filter(n => /flash/i.test(n) && !/exp/i.test(n) && !prioritized.includes(n));
      const gemma = available.filter(n => /^gemma-3/i.test(n) && !prioritized.includes(n));
      const rest = available.filter(n => !prioritized.includes(n) && !otherFlash.includes(n) && !gemma.includes(n));

      const ordered = [...new Set([...prioritized, ...otherFlash, ...gemma, ...rest, ...PRIORITY_MODELS])];
      return ordered.length ? ordered : PRIORITY_MODELS;
    } catch {
      return PRIORITY_MODELS;
    }
  }

  async function requestModel(modelName, key, body) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${encodeURIComponent(key)}`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    const text = await res.text();
    let json = null;
    try { json = JSON.parse(text); } catch { /* ignore */ }
    return { ok: res.ok, status: res.status, json, raw: text };
  }

  async function callGemini(prompt, { systemInstruction = '', jsonMode = false, history = [] } = {}) {
    const key = getApiKey();
    if (!key) throw new Error('NO_KEY');

    const contents = [
      ...history.map(m => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.text }]
      })),
      { role: 'user', parts: [{ text: prompt }] }
    ];

    const body = {
      contents,
      generationConfig: { temperature: jsonMode ? 0.3 : 0.7 }
    };
    if (systemInstruction) {
      body.systemInstruction = { parts: [{ text: systemInstruction }] };
    }
    if (jsonMode) {
      body.generationConfig.responseMimeType = 'application/json';
    }

    let candidates = activeModel ? [activeModel] : [];
    let lastErr = '';

    for (let phase = 0; phase < 2; phase++) {
      if (phase === 1) {
        const discovered = await discoverModels(key);
        candidates = discovered.filter(m => m !== activeModel).slice(0, 10);
      }

      for (const modelName of candidates) {
        // Gemma models don't support systemInstruction or responseMimeType
        const reqBody = /^gemma-/i.test(modelName)
          ? {
            contents: [{ role: 'user', parts: [{ text: `${systemInstruction ? systemInstruction + '\n\n' : ''}${prompt}` }] }],
            generationConfig: { temperature: jsonMode ? 0.3 : 0.7 }
          }
          : body;

        const r = await requestModel(modelName, key, reqBody);
        if (r.ok) {
          activeModel = modelName;
          localStorage.setItem('kisisel_panel_gemini_model', modelName);
          const outText = r.json?.candidates?.[0]?.content?.parts?.[0]?.text || '';
          if (jsonMode) {
            const match = outText.match(/\{[\s\S]*\}/);
            if (match) {
              try {
                return JSON.parse(match[0]);
              } catch {
                // fall through to next model if JSON malformed
                lastErr = `[${modelName}] JSON formatı okunamadı`;
                continue;
              }
            }
            lastErr = `[${modelName}] JSON döndürmedi`;
            continue;
          }
          return outText.trim();
        }

        const apiMsg = r.json?.error?.message || r.raw.slice(0, 180);
        lastErr = `[${modelName}] (${r.status}) ${apiMsg}`;

        if (r.status === 400 && /API_KEY_INVALID|API key not valid/i.test(apiMsg)) {
          throw new Error('API anahtarı geçersiz. Google AI Studio\'dan kopyalarken eksik veya boşluk kalmadığından emin ol.');
        }
        if (r.status === 403) {
          throw new Error('API anahtarı yetkisiz (403). Google AI Studio\'da yeni bir ücretsiz anahtar oluşturmayı dene.');
        }
      }
    }

    throw new Error(`Gemini bağlantısı başarısız: ${lastErr}`);
  }

  async function testConnection(overrideKey) {
    const key = (overrideKey !== undefined ? overrideKey : getApiKey()).trim();
    if (!key) return { ok: false, message: 'Lütfen önce bir API anahtarı yapıştır.' };

    const discovered = await discoverModels(key);
    const body = { contents: [{ role: 'user', parts: [{ text: 'Reply with OK' }] }] };
    let lastErr = '';

    for (const modelName of discovered.slice(0, 10)) {
      try {
        const r = await requestModel(modelName, key, body);
        if (r.ok) {
          activeModel = modelName;
          localStorage.setItem('kisisel_panel_gemini_model', modelName);
          return { ok: true, message: `Bağlantı başarılı! Aktif model: ${modelName}` };
        }
        const apiMsg = r.json?.error?.message || r.raw.slice(0, 160);
        lastErr = `[${modelName}] (${r.status}) ${apiMsg}`;
        if (r.status === 400 && /API_KEY_INVALID|API key not valid/i.test(apiMsg)) {
          return { ok: false, message: 'API anahtarı geçersiz. "AIza..." ile başlayan anahtarını kontrol et.' };
        }
      } catch (e) {
        return { ok: false, message: `Ağ hatası: ${e.message}` };
      }
    }
    return { ok: false, message: `Ücretsiz kota veya bağlantı hatası: ${lastErr}` };
  }

  async function parseMeal(sentence) {
    const sys = `${USER_CONTEXT}
Kullanıcının yazdığı yemek cümlesini analiz et ve gerçekçi Türk mutfağı porsiyonlarına göre kalori/makro hesapla.
SADECE şu JSON formatında dön:
{
  "items": [
    { "name": "Kısa yemek adı", "cal": 250, "pro": 20, "carb": 15, "fat": 10 }
  ],
  "comment": "1 cümlelik kısa, samimi değerlendirme"
}`;
    return callGemini(`Yenilen öğün: "${sentence}"`, { systemInstruction: sys, jsonMode: true });
  }

  async function getDietAdvice(totals, targets, mealsToday) {
    const sys = `${USER_CONTEXT}
Kısa, sade, pratik Türkçe öneri ver. Evdeki malzemeleri (laktozsuz süt, süzme yoğurt, konserve mısır, turşu, salata, ton balığı, tavuk vb.) önceliklendir. Madde madde 3-4 satırda özetle.`;
    const prompt = `Bugün şu ana kadar yediklerim: ${mealsToday.length ? mealsToday.map(m => `${m.name} (${m.cal} kcal)`).join(', ') : 'Henüz bir şey yemedim'}.
Toplam: ${totals.cal} / ${targets.calTarget} kcal, Protein: ${totals.pro}g / ${targets.proTarget}g, Karb: ${totals.carb}g, Yağ: ${totals.fat}g.
Günün geri kalanı için ne yememi önerirsin?`;
    return callGemini(prompt, { systemInstruction: sys });
  }

  async function evaluateEnglish(mode, question, answer) {
    const sys = `${USER_CONTEXT}
Sen bir IELTS Academic eğitmenisin. Kullanıcının ${mode} cevabını değerlendir.
SADECE şu JSON formatında dön:
{
  "band": "6.0",
  "feedback": "Türkçe kısa ve yapıcı değerlendirme (güçlü yön + geliştirilecek yön)",
  "improved": "Aynı fikrin IELTS Band 7.0-7.5 seviyesinde İngilizce yazılmış hali",
  "mistakes": [
    { "wrong": "kullanıcının yaptığı hata", "right": "doğru kullanım", "note": "kısa Türkçe kural açıklaması" }
  ],
  "vocab": [
    { "word": "Önerilen akademik kelime", "meaning": "Türkçe anlamı", "example": "Kısa İngilizce örnek cümle" }
  ]
}`;
    return callGemini(`Soru: ${question}\nKullanıcı cevabı: ${answer}`, { systemInstruction: sys, jsonMode: true });
  }

  async function generateIeltsQuestion(type) {
    const sys = `Sen bir IELTS Academic eğitmenisin. Mühendislik, teknoloji, yapay zeka, yönetim, çevre veya günlük yaşam konularında tek bir net İngilizce IELTS ${type} sorusu yaz. Sadece soruyu ver, ekstra açıklama yazma.`;
    return callGemini(`Bana yeni bir IELTS ${type} sorusu üret.`, { systemInstruction: sys });
  }

  async function generateGrammarLesson(level) {
    const sys = `Sen bir IELTS İngilizce öğretmenisin. Kullanıcının seçtiği seviyeye (${level}) uygun, IELTS'te çok işe yarayan TEK bir gramer konusu seç.
Format:
1. Konu Başlığı
2. Kısa ve net Türkçe anlatım (3-4 madde)
3. 2 örnek cümle
4. 3 adet alıştırma sorusu (cevapları en altta ver).`;
    return callGemini(`Seviye: ${level}. Bugün için yeni ve faydalı bir gramer dersi hazırla.`, { systemInstruction: sys });
  }

  async function generateListening() {
    const sys = `Generate a short IELTS Academic Listening mini-monologue (about 80-110 words, clear natural English about engineering, business, university life, or sustainability) and 3 multiple-choice questions.
Return ONLY valid JSON:
{
  "title": "Short English title",
  "script": "The spoken monologue text...",
  "questions": [
    { "q": "Question text?", "options": ["Option A", "Option B", "Option C"], "answerIndex": 0 }
  ]
}`;
    return callGemini('Create a fresh IELTS Listening practice.', { systemInstruction: sys, jsonMode: true });
  }

  async function suggestWorkout(requestText) {
    const sys = `${USER_CONTEXT}
Sadece evde 2x5 kg dambıl, duvar, sandalye ve vücut ağırlığıyla yapılabilecek hareketler öner. Spor salonu makinesi ASLA önerme.
SADECE şu JSON formatında dön:
{
  "message": "Kısa Türkçe koç tavsiyesi",
  "exercises": [
    { "name": "Hareket adı", "weight": 5, "sets": 3, "reps": 12 }
  ]
}`;
    return callGemini(`Kullanıcı isteği: ${requestText}`, { systemInstruction: sys, jsonMode: true });
  }

  async function parseWorkoutLog(sentence) {
    const sys = `${USER_CONTEXT}
Kullanıcı bugün yaptığı spor/egzersizleri cümleyle yazdı. 25 yaşında, 174 cm, 70 kg bir kişi için gerçekçi yakılan kalori (kcal) hesabı yap.
SADECE şu JSON formatında dön:
{
  "entries": [
    { "name": "Kısa aktivite/hareket adı", "details": "3x15 · 5 kg veya 30 dk gibi özet", "burnedCal": 120 }
  ],
  "comment": "1 cümlelik kısa, motive edici Türkçe değerlendirme"
}`;
    return callGemini(`Bugün yapılan spor: "${sentence}"`, { systemInstruction: sys, jsonMode: true });
  }

  async function coachChat(userMessage, chatHistory, contextSummary) {
    const sys = `${USER_CONTEXT}
Sen sitenin içine entegre edilmiş daimi kişisel koçusun. Kullanıcıyla samimi, kısa ve net Türkçe konuş.
Bugünün tarihi: ${contextSummary.today} | Seçili tarih: ${contextSummary.selectedDate}.
Kullanıcı senden siteye bir şey eklemeni isterse bunu "actions" dizisine ekle.

SADECE şu JSON formatında yanıt ver:
{
  "reply": "Kullanıcıya vereceğin doğal Türkçe yanıt",
  "actions": [
    // İhtiyaç yoksa boş [] bırak. Desteklenen aksiyonlar:
    // { "type": "add_task", "date": "YYYY-MM-DD", "text": "Görev metni" }
    // { "type": "add_meal", "date": "YYYY-MM-DD", "mealType": "Öğle", "name": "Yemek", "cal": 300, "pro": 25, "carb": 20, "fat": 10 }
    // { "type": "add_vocab", "word": "Resilient", "meaning": "Dayanıklı, esnek", "example": "Supply chains must be resilient." }
    // { "type": "add_exercise", "date": "YYYY-MM-DD", "name": "Hareket", "weight": 5, "sets": 3, "reps": 12 }
    // { "type": "log_workout", "date": "YYYY-MM-DD", "name": "30 dk tempolu yürüyüş", "details": "30 dk", "burnedCal": 160 }
  ]
}`;
    const recent = chatHistory.slice(-14);
    return callGemini(userMessage, { systemInstruction: sys, jsonMode: true, history: recent });
  }

  return {
    getApiKey,
    testConnection,
    parseMeal,
    getDietAdvice,
    evaluateEnglish,
    generateIeltsQuestion,
    generateGrammarLesson,
    generateListening,
    suggestWorkout,
    parseWorkoutLog,
    coachChat
  };
})();
