const EXERCISES = {
  A: [
    { name: 'Elevação Pélvica', sets: 4, reps: '12 repetições', focus: 'Glúteos', art: 'hip', description: 'A elevação pélvica trabalha principalmente os glúteos. Apoie as costas no banco e mantenha os pés firmes no chão enquanto eleva o quadril.', tip: 'Suba até alinhar o tronco às coxas. Contraia os glúteos no alto e desça com controle, sem arquear a lombar.' },
    { name: 'Leg Press', sets: 3, reps: '12 repetições', focus: 'Quadríceps e glúteos', art: 'press', description: 'No leg press, a plataforma se afasta do corpo enquanto você empurra com os pés. Posicione-os na largura dos ombros.', tip: 'Mantenha os joelhos acompanhando a direção dos pés. Desça só até onde conseguir preservar as costas apoiadas.' },
    { name: 'Cadeira Extensora', sets: 3, reps: '15 repetições', focus: 'Quadríceps', art: 'extension', description: 'Sentada na máquina, estenda os joelhos para levantar o apoio acolchoado e trabalhe a parte da frente das coxas.', tip: 'Ajuste o rolo sobre o peito do pé. Estenda sem dar impulso e retorne devagar, sem deixar o peso cair.' },
    { name: 'Cadeira Abdutora', sets: 3, reps: '20 repetições', focus: 'Glúteos laterais', art: 'abduction', description: 'Na cadeira abdutora, empurre as almofadas para fora com os joelhos para ativar a lateral dos glúteos.', tip: 'Mantenha as costas apoiadas e abra as pernas com controle. Faça uma breve pausa na abertura antes de voltar.' },
    { name: 'Agachamento no Smith', sets: 3, reps: '8–10 repetições', focus: 'Pernas e glúteos', art: 'squat', description: 'O Smith guia a barra em um trilho vertical enquanto você agacha. Posicione a barra sobre a parte alta das costas.', tip: 'Desça dobrando os joelhos e levando o quadril para trás. Mantenha os calcanhares apoiados e o tronco firme.' },
    { name: 'Elevação de Pernas na Barra', sets: 4, reps: 'Até a falha', focus: 'Abdômen', art: 'raise', description: 'Pendure-se na barra e eleve os joelhos ou as pernas, usando o abdômen para controlar o movimento.', tip: 'Evite embalar o corpo. Suba as pernas com controle e desça devagar; pare quando não conseguir manter a técnica.' },
  ],
  B: [
    { name: 'Supino na máquina', sets: 3, reps: '12 repetições', focus: 'Peito', art: 'chest', description: 'A máquina de supino conduz o movimento à frente do peito para trabalhar a musculatura peitoral.', tip: 'Ajuste os pegadores na altura do peito. Empurre sem travar os cotovelos e retorne devagar.' },
    { name: 'Remada baixa', sets: 4, reps: '12 repetições', focus: 'Costas', art: 'row', description: 'Sentada diante da polia baixa, traga o pegador em direção ao abdômen e trabalhe as costas.', tip: 'Sente-se ereta, mantenha o peito aberto e conduza os cotovelos para trás. Evite balançar o tronco.' },
    { name: 'Remada pronada', sets: 3, reps: '12 repetições', focus: 'Costas', art: 'bentrow', description: 'Com pegada pronada, puxe o peso em direção ao tronco. A pegada pronada mantém as palmas das mãos voltadas para baixo.', tip: 'Incline o tronco com a coluna neutra. Traga os cotovelos para trás e abaixe o peso sem arredondar as costas.' },
    { name: 'Elevação lateral com haltere', sets: 2, reps: '15 repetições', focus: 'Ombros', art: 'lateral', description: 'Em pé, eleve os halteres pelas laterais até próximo da altura dos ombros para trabalhar a região lateral dos ombros.', tip: 'Use um peso que permita controlar a descida. Mantenha os cotovelos levemente dobrados e os ombros longe das orelhas.' },
    { name: 'Rosca Martelo com haltere', sets: 3, reps: '12 repetições', focus: 'Braços', art: 'curl', description: 'Com os halteres ao lado do corpo e as palmas voltadas uma para a outra, flexione os cotovelos para levar os pesos até os ombros.', tip: 'Mantenha os cotovelos perto do corpo e o punho neutro. Suba sem balançar o tronco e desça com calma.' },
    { name: 'Tríceps na polia com corda', sets: 3, reps: '12 repetições', focus: 'Tríceps', art: 'pushdown', description: 'Na polia alta com corda, estenda os cotovelos para levar as mãos para baixo e ativar o tríceps.', tip: 'Prenda os cotovelos junto ao corpo. Estenda os braços e separe as pontas da corda ao final do movimento.' },
  ],
};

const KEY = 'ritmo-aline-progress-v1';
const app = document.querySelector('#app');
const dialog = document.querySelector('#exercise-dialog');
let currentWorkout = null;
let progress = loadProgress();
let lastCompletion = '';
let celebrationOpen = false;

function localDayKey(date = new Date()) {
  return [date.getFullYear(), String(date.getMonth() + 1).padStart(2, '0'), String(date.getDate()).padStart(2, '0')].join('-');
}

function loadProgress() {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY) || '{}');
    const today = localDayKey();
    if (saved.date !== today) return { date: today, workouts: {} };
    return { date: today, workouts: saved.workouts && typeof saved.workouts === 'object' ? saved.workouts : {} };
  } catch { return { date: localDayKey(), workouts: {} }; }
}

function persistProgress() {
  progress.date = localDayKey();
  try { localStorage.setItem(KEY, JSON.stringify(progress)); } catch { /* App continues if the browser blocks storage. */ }
}

function freshWorkout(key) {
  return EXERCISES[key].map(() => 0);
}

function counts(key) {
  const saved = progress.workouts[key];
  const values = saved && saved.length === EXERCISES[key].length ? saved : freshWorkout(key);
  const completedExercises = values.reduce((sum, sets, index) => sum + (sets >= EXERCISES[key][index].sets ? 1 : 0), 0);
  const completedSets = values.reduce((sum, sets) => sum + Math.max(0, Number(sets) || 0), 0);
  const totalSets = EXERCISES[key].reduce((sum, item) => sum + item.sets, 0);
  return { values, completedExercises, completedSets, totalSets, complete: completedExercises === EXERCISES[key].length };
}

function icon(type) {
  const paths = {
    dumbbell: '<path d="M5 9v6m14-6v6M3 10v4m18-4v4M5 12h14M8 8v8m8-8v8"/>',
    muscle: '<path d="M7 8c1-2 2-3 4-3h2l2 2 2 1 2 3-2 2-2-1-2 3-3 1-2-2-2 1-2-3 1-3 2-1Z"/><path d="m10 8 2 2 3-1"/>',
    timer: '<circle cx="12" cy="13" r="8"/><path d="M12 9v4l3 2M9 2h6M12 2v3"/>',
    arrow: '<path d="M5 12h14m-6-6 6 6-6 6"/>',
    calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/>',
    check: '<path d="m5 12 4 4L19 6"/>',
    back: '<path d="M19 12H5m7 7-7-7 7-7"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>',
    save: '<path d="M12 21s-8-4.3-8-11a5 5 0 0 1 8-4 5 5 0 0 1 8 4c0 6.7-8 11-8 11Z"/><path d="M12 8v7m-3.5-3.5h7"/>',
    bolt: '<path d="m13 2-9 12h7l-1 8 10-13h-7l1-7z"/>',
  };
  return `<svg data-icon="${type}" viewBox="0 0 24 24" aria-hidden="true">${paths[type] || paths.check}</svg>`;
}

function logo() {
  return `<header class="topbar"><a class="brand" href="#inicio" aria-label="Ritmo, início"><span class="brand-mark">${icon('dumbbell')}</span><span class="brand-name">ritmo<span style="color:#d6464b">.</span></span></a><span class="topbar-note"><span class="live-dot"></span> seu espaço, seu ritmo</span></header>`;
}

function dateText() {
  const now = new Date();
  return { weekday: new Intl.DateTimeFormat('pt-BR', { weekday: 'long' }).format(now), date: new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'long' }).format(now) };
}

function homeCard(key, index) {
  const info = counts(key);
  const totalExercises = EXERCISES[key].length;
  const lower = key === 'A';
  const picture = lower
    ? `<svg viewBox="0 0 200 150" role="img" aria-label="Ilustração de treino de pernas e glúteos"><ellipse class="glow" cx="116" cy="105" rx="76" ry="35"/><path class="machine" d="M136 126h43M143 123V77h12v46m-62 3h35M101 123v-15h40M54 124h59m-3 0V87h40m-39 14h32"/><path class="figure" d="m98 88-24-5-19 18m19-18-14-14m14 14 12 11 11 4m-42 4 21 9 18-1"/><circle class="head" cx="62" cy="64" r="8"/><path class="highlight" d="m92 96 12 4m-44 6 20 8"/><path class="machine" d="M64 30v22m74-20v31m-12-31v31m-8-24h27m-27 13h27"/></svg>`
    : `<svg viewBox="0 0 200 150" role="img" aria-label="Ilustração de treino de membros superiores"><ellipse class="glow" cx="111" cy="112" rx="78" ry="30"/><path class="machine" d="M35 125h133m-96 0V66h8v59m44 0V66h8v59m-58-58h69m-61 41h49M52 31V18m88 13V18M45 18h18m68 0h18"/><circle class="head" cx="98" cy="40" r="9"/><path class="figure" d="M98 50v37m-17-28-20 13-11-6m48-7 19 13 14-8m-33 22-18 27-13 14m31-41 17 24 14 11"/><path class="highlight" d="m81 61-20 12m37-11 19 13m-37 38-13 14"/><path class="machine" d="m49 34-2-9m0 0h7m96 8 2-8m0 0h-7"/></svg>`;
  const stats = `${EXERCISES[key].length} exercícios`;
  return `<article class="workout-card ${key === 'B' ? 'card-b' : 'card-a'}" data-action="card-start" data-workout="${key}" tabindex="0" role="group" aria-label="Abrir o Treino ${key}">
    <div class="card-topline"><span class="workout-tag">${icon(lower ? 'muscle' : 'dumbbell')} ${lower ? 'Inferiores' : 'Superiores'}</span><span class="workout-number">TREINO 0${index + 1}</span></div>
    <div class="card-main"><div class="card-copy"><h2 id="card-title-${key}">Treino ${key}</h2><p>${lower ? 'Pernas e glúteos' : 'Costas, peito e braços'}</p></div><div class="card-illustration">${picture}</div></div>
    <div class="card-progress"><div class="progress-label"><span>${info.completedExercises ? 'Seu progresso hoje' : 'Uma série de cada vez'}</span><strong>${info.completedExercises}/${totalExercises} exercícios</strong></div><div class="progress-track" aria-label="${info.completedExercises} de ${totalExercises} exercícios concluídos"><div class="progress-fill" style="width:${(info.completedExercises / totalExercises) * 100}%"></div></div></div>
    <div class="card-footer"><div class="card-stats"><span class="stat">${icon('timer')}${stats}</span><span class="stat">${icon('dumbbell')}${info.totalSets} séries</span></div><button class="start-button" data-action="start" data-workout="${key}">${info.complete ? 'Rever treino' : info.completedSets ? 'Continuar' : 'Começar treino'}${icon('arrow')}</button></div>
  </article>`;
}

function renderHome() {
  currentWorkout = null;
  const date = dateText();
  app.innerHTML = `<main class="app-shell" id="inicio">${logo()}
    <section class="home-heading" aria-labelledby="greeting"><div><span class="eyebrow">UM BOM DIA COMEÇA COM VOCÊ</span><h1 id="greeting">Olá, <span>Aline!</span></h1><p class="home-subtitle">Seu treino de hoje, no seu ritmo.</p></div><div class="today-pill"><span class="date-icon">${icon('calendar')}</span><span class="today-copy"><strong>Hoje</strong><span>${date.weekday}, ${date.date}</span></span></div></section>
    <section class="workout-grid" aria-label="Escolha seu treino">${homeCard('A', 0)}${homeCard('B', 1)}</section>
    <aside class="welcome-note"><span class="note-bolt">${icon('save')}</span><p>Suas séries ficam salvas neste aparelho durante o dia. Amanhã é uma nova chance de se superar ✨</p></aside>
  </main>`;
}

function renderWorkout(key) {
  currentWorkout = key;
  const exercises = EXERCISES[key];
  const info = counts(key);
  const isDone = info.complete;
  const focus = key === 'A' ? 'Pernas, glúteos e abdômen' : 'Peito, costas, ombros e braços';
  app.innerHTML = `<main class="app-shell" id="inicio">${logo()}
    <div class="session-header"><button type="button" class="back-button" data-action="home">${icon('back')} Voltar aos treinos</button><span class="session-badge">${icon(key === 'A' ? 'muscle' : 'dumbbell')} Treino ${key}</span></div>
    <section class="session-titlebar"><div><span class="eyebrow">${key === 'A' ? 'INFERIORES' : 'SUPERIORES'}</span><h1>Treino <span>${key}</span></h1></div><span class="session-summary">${icon('timer')}<span>${exercises.length} exercícios</span><span aria-hidden="true">·</span><span>${info.totalSets} séries</span></span></section>
    <section class="session-overview" aria-label="Progresso do treino"><div class="session-overview-copy"><span class="overview-icon" aria-hidden="true">${icon(isDone ? 'check' : key === 'A' ? 'muscle' : 'dumbbell')}</span><span class="overview-text"><strong>${isDone ? 'Treino concluído. Você arrasou!' : 'No seu ritmo, uma série de cada vez.'}</strong><span>${focus}</span></span></div><span class="session-count"><strong>${info.completedSets}</strong> <span>/ ${info.totalSets} séries</span></span></section>
    <div class="progress-track" style="margin:0 0 16px"><div class="progress-fill" style="width:${(info.completedSets / info.totalSets) * 100}%"></div></div>
    <section class="exercise-list" aria-label="Exercícios do treino">${exercises.map((exercise, index) => exerciseCard(key, exercise, index, info.values[index])).join('')}</section>
    <p class="session-footer">${icon('save')} Progresso salvo automaticamente durante o dia</p>
  </main>`;
  if (isDone && lastCompletion === key && !celebrationOpen) showCelebration(key);
}

function exerciseCard(key, exercise, index, completedSets) {
  const complete = completedSets >= exercise.sets;
  const title = exercise.reps === 'Até a falha' ? `Até a falha · ${exercise.sets} séries` : `${exercise.sets} × ${exercise.reps.replace(' repetições', '')}`;
  const setDots = Array.from({ length: exercise.sets }, (_, i) => `<span class="set-dot ${i < completedSets ? 'done' : ''}" aria-hidden="true"></span>`).join('');
  return `<article class="exercise-card ${complete ? 'is-complete' : ''}" aria-label="${exercise.name}, ${complete ? 'concluído' : `${completedSets} de ${exercise.sets} séries`}" data-exercise="${key}-${index}">
    <div class="exercise-card-head"><span class="exercise-index">${complete ? icon('check') : String(index + 1).padStart(2, '0')}</span><div class="exercise-name-wrap"><h2 class="exercise-name">${exercise.name}</h2><p class="exercise-meta"><strong>${title}</strong> &nbsp;·&nbsp; ${exercise.focus}</p></div><button type="button" class="help-button" data-action="help" data-workout="${key}" data-index="${index}" aria-label="Ver explicação de ${exercise.name}">${icon('info')}<span>Como fazer</span></button></div>
    <div class="exercise-card-bottom"><span class="set-counter ${complete ? 'complete-copy' : ''}">${complete ? 'Concluído' : `Série <strong>${completedSets + 1}</strong> de ${exercise.sets}`}</span><div class="set-dots" aria-label="${completedSets} de ${exercise.sets} séries concluídas">${setDots}</div><button type="button" class="set-button" data-action="set" data-workout="${key}" data-index="${index}" ${complete ? 'disabled' : ''}>${complete ? `${icon('check')} Tudo feito` : `${icon('check')} Marcar série ${completedSets + 1}`}</button></div>
  </article>`;
}

const artParts = {
  hip: { equipment: '<path class="machine" d="M105 159h196m-160-3v-51h93v51m-75-50h72"/>', body: '<circle class="head" cx="111" cy="83" r="13"/><path class="figure" d="m124 91 46 5 45 21m-83-26-23 23-35 9m99-6 23 31 34 7m-97-30 14 25 34 3"/><path class="highlight" d="m145 95 28 4 35 17"/><path class="arrow" d="M135 126v-18m-5 5 5-5 5 5"/>', muscle: '<path class="muscle" d="M156 94q11-4 19 3l13 8-10 12-24-7Z"/>' },
  press: { equipment: '<path class="machine" d="m224 40 46 94m-23-107 46 93m-64-69 41-20m-29 59 39-18m-89 84h113M185 80l28 49m-51-7h53v-45"/>', body: '<circle class="head" cx="133" cy="71" r="13"/><path class="figure" d="m137 85 28 21 6 29m-34-43-23 19 31 21m0 0 43 3 23 16m-67-16 26 16h35m-39-43 37-23 40 3m-10-8 11 8-10 8"/><path class="highlight" d="m144 109 12 17m0 18 30 2"/><path class="arrow" d="m247 81-19-7m15 13 4-6-7-3"/>', muscle: '<path class="muscle" d="M151 99q11 3 17 11l-4 14-16-6Z"/>' },
  extension: { equipment: '<path class="machine" d="M101 152h196m-158-3V80h87v69m-84-65h79m-70 40 69 3m4-1v42m4-43h57v10h-55"/>', body: '<circle class="head" cx="136" cy="56" r="13"/><path class="figure" d="m131 70-7 39m7-35-24 15-17 15m41 5 27 14-21 20m21-20 37 4 24 0m-60-4 30-6 22 0"/><path class="highlight" d="m164 134 27 3 19 0"/><path class="arrow" d="M204 111h31m-7-5 7 5-7 5"/>', muscle: '<path class="muscle" d="m163 128 21 1 14 4-2 9-30-1Z"/>' },
  abduction: { equipment: '<path class="machine" d="M98 154h202m-158-5V84h92v65m-91-66h90m-73 18 62 10m-52 11 36 0m-22 0v43m-30 0h60"/>', body: '<circle class="head" cx="147" cy="56" r="13"/><path class="figure" d="m143 70-5 39m5-35-24 18-18 5m43 12 23 20-27 4m27-4 34 11m-84-46-20-8m20 8 21 21m15-5-25 13-23 0m23 0 25 12"/><path class="highlight" d="m122 115-16 0m33-1 19 0"/><path class="arrow" d="M105 105l-19-6m13 1-5-1-1 5m76 0 20-6m-13 1 5-1 1 5"/>', muscle: '<path class="muscle" d="m114 109 19-1 3 12-22 2-8-5Z"/><path class="muscle" d="m146 108 20 2 6 7-12 7-18-3Z"/>' },
  squat: { equipment: '<path class="machine" d="M88 34v122m15-122v122m114-122v122m15-122v122M79 39h165m-76-4v-11m-25 0h51m-67 0h83m-98 0h113M96 157h132"/>', body: '<circle class="head" cx="166" cy="61" r="13"/><path class="figure" d="m166 74 4 35m-4-30-27-13-20 3m50 10 26-13 21 2m-43 41 29 21 31-2m-60-19-25 22-20 2m25-47 21 0"/><path class="highlight" d="m170 110 28 21 24-2m-80-2-23 19"/><path class="arrow" d="M121 104v-19m-5 6 5-6 5 6"/>', muscle: '<path class="muscle" d="m164 111 12 1 22 16-12 10-23-18Z"/><path class="muscle" d="m129 130 19-6 8 7-16 16-17-1Z"/>' },
  raise: { equipment: '<path class="machine" d="M80 49v-14h180v14M88 35v35m164-35v35m-82-36v-9m-12 0h24m-89 10h178"/>', body: '<circle class="head" cx="168" cy="68" r="12"/><path class="figure" d="m168 82v38m0-27-36-4m36 4 37-4m-37 31-10 29m10-29 21 21m-21-21-37 26m37-26 20 23m-51-54-13-17m50 17 17-17"/><path class="highlight" d="m161 118-8 24 15 5 16-15"/><path class="arrow" d="m187 139 9-20m-8 8 8-8 2 10"/>', muscle: '<path class="muscle" d="m158 116 14 2v11l-10 18-11-8Z"/>' },
  chest: { equipment: '<path class="machine" d="M97 155h190m-149-2V66h83v87m-81-84h80M116 83h-27m-2-9h14v30H87m102-21h27m2-9h-14v30h14m-43-52h23v12h-23Z"/>', body: '<circle class="head" cx="161" cy="58" r="12"/><path class="figure" d="m161 71-5 42m5-31-24-7-21 0m21 0-13-7-6-2m48 16 25-7 19 0m-19 0 13-7 6-2m-48 49-24 28-12 4m36-32 24 28 11 4"/><path class="highlight" d="m142 78 15 6 15-6"/><path class="arrow" d="M111 68h-20m7-5-7 5 7 5m82-5h20m-7-5 7 5-7 5"/>', muscle: '<path class="muscle" d="m143 74 15 3 2 11-15 0-9-5Z"/><path class="muscle" d="m160 77 15-4 8 8-9 7-14-1Z"/>' },
  row: { equipment: '<path class="machine" d="M81 155h208m-177-1 28-32h104l28 32m-176-39v39m151-70h28m-2-4v16m-22 22h49m-47-22 47 0"/>', body: '<circle class="head" cx="139" cy="74" r="12"/><path class="figure" d="m149 83 29 21m-29-21-22 30 22 20m29-29 29-5 22 0m-51 5 32 8 20-5m-52 6-15 21-14 14m32-30 26 25 20 2m-61-27-25-3"/><path class="highlight" d="m178 102 25-4 21 0m-53 13 26 8"/><path class="arrow" d="M214 94h24m-8-5 8 5-8 5"/>', muscle: '<path class="muscle" d="m164 89 18 9 8 11-14 7-13-13Z"/>' },
  bentrow: { equipment: '<path class="machine" d="M80 150h212m-111-66H84m12-7v14m149-14v14m-28-7h40m-169 0H74"/>', body: '<circle class="head" cx="143" cy="73" r="12"/><path class="figure" d="m151 83 30 18m-30-18-27 16m57 2 26 3 25-4m-51 1 24 14 24 0m-48-16-24 27-13 22m36-33 33 22 17 0m-80-38-18 6"/><path class="highlight" d="m166 90 16 11 23 3m-18 10 24 9"/><path class="arrow" d="M226 91H202m8-5-8 5 8 5"/>', muscle: '<path class="muscle" d="m159 86 16 7 16 10-12 10-20-15Z"/>' },
  lateral: { equipment: '<path class="machine" d="M98 156h160m-84-3V71m-45-7-11-9m85 9 11-9"/><rect class="machine" x="45" y="48" width="21" height="9" rx="3"/><rect class="machine" x="234" y="48" width="21" height="9" rx="3"/>', body: '<circle class="head" cx="174" cy="53" r="13"/><path class="figure" d="m174 67v51m-2-39-41-21-35 4m0 0-13-6m85 23 41-21 33 4m0 0 13-6m-81 62-22 27-11 8m33-35 22 28 10 6"/><path class="highlight" d="m172 80-41-21m45 21 41-21"/><path class="arrow" d="M104 83 91 66m2 11-2-11 10 5m127 12 13-17m-2 11 2-11-10 5"/>', muscle: '<path class="muscle" d="m159 72 14 0 3 13-10 5-10-9Z"/><path class="muscle" d="m178 72 14 0 4 9-10 9-9-5Z"/>' },
  curl: { equipment: '<path class="machine" d="M97 156h152m-76-2V70m-13-3h25m-34 67h45"/>', body: '<circle class="head" cx="174" cy="53" r="13"/><path class="figure" d="m174 67v53m-1-40-20 24 13 20m7-44 22 23-11 21m-11-4-13 23-7 7m30-30 18 22 4 10m-45-84-17-7-17 3m78 4 15-6"/><path class="highlight" d="m154 104 13 20m18-20-9 20"/><path class="arrow" d="m148 107 1-20m-5 7 5-7 5 7m28 13 2-20m-5 7 5-7 5 7"/>', muscle: '<path class="muscle" d="m149 99 10 2 10 15-8 7-15-17Z"/><path class="muscle" d="m179 103 10-4 5 7-9 14-9-7Z"/>' },
  pushdown: { equipment: '<path class="machine" d="M89 44v-12h105v12m-93-11v24m84-24v24m-44-23v27m-12-1h24m-42 4h61m-41 2 0 18m-12 0h24"/>', body: '<circle class="head" cx="155" cy="56" r="13"/><path class="figure" d="m155 70v48m-1-36-20-2m20 2 20-2m-40 0 5 32 9 15m27-47-5 34-9 13m-8-11-15 32-8 8m27-40 14 32 9 8"/><path class="highlight" d="m174 83-5 32-9 12"/><path class="arrow" d="M190 84v28m-5-7 5 7 5-7"/>', muscle: '<path class="muscle" d="m163 92 11-9 9 7-4 22-10 7-9-7Z"/>' },
};

function exerciseArt(exercise) {
  const parts = artParts[exercise.art] || artParts.squat;
  return `<svg class="exercise-illustration" viewBox="0 0 360 205" role="img" aria-label="Ilustração de ${exercise.name}"><ellipse class="glow" cx="180" cy="155" rx="126" ry="39"/><path class="machine" d="M45 170h270"/>${parts.equipment}<g>${parts.body}</g>${parts.muscle}<path d="M40 36h3m274 0h3M40 45h3m274 0h3" stroke="#d54e54" stroke-width="2" opacity=".65" stroke-linecap="round"/></svg>`;
}

function openHelp(key, index) {
  const exercise = EXERCISES[key][index];
  document.querySelector('#dialog-art').innerHTML = exerciseArt(exercise);
  document.querySelector('#dialog-muscle').textContent = exercise.focus;
  document.querySelector('#dialog-title').textContent = exercise.name;
  document.querySelector('#dialog-description').textContent = exercise.description;
  document.querySelector('#dialog-tip').textContent = exercise.tip;
  if (dialog.showModal) dialog.showModal();
}

function showCelebration(key) {
  celebrationOpen = true;
  const overlay = document.createElement('div');
  overlay.className = 'celebration';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-labelledby', 'celebration-title');
  const pieces = Array.from({ length: 54 }, (_, i) => {
    const hue = [0, 3, 9, 345, 26][i % 5];
    const left = (Math.random() * 100).toFixed(2);
    const delay = (Math.random() * .8).toFixed(2);
    const drift = `${Math.round(Math.random() * 150 - 75)}px`;
    const duration = (2.8 + Math.random() * 1.8).toFixed(2);
    return `<span class="confetti-piece" aria-hidden="true" style="left:${left}%;background:hsl(${hue} 75% ${52 + Math.random() * 18}%);--delay:${delay}s;--drift:${drift};--fall-time:${duration}s;transform:rotate(${Math.round(Math.random() * 360)}deg)"></span>`;
  }).join('');
  overlay.innerHTML = `${pieces}<div class="celebration-card"><div class="celebration-mark">${icon('check')}</div><span class="eyebrow">VOCÊ CONSEGUIU</span><h2 id="celebration-title">Treino concluído!</h2><p>Você se dedicou até o fim. Que orgulho do que você fez hoje, Aline 💪</p><button class="start-button" type="button" data-action="celebration-home">Voltar aos treinos ${icon('arrow')}</button></div>`;
  app.append(overlay);
  overlay.querySelector('button').focus({ preventScroll: true });
}

function addSet(key, index) {
  const state = counts(key);
  if (state.values[index] >= EXERCISES[key][index].sets) return;
  state.values[index] += 1;
  progress.workouts[key] = state.values;
  persistProgress();
  const now = counts(key);
  if (now.complete && !state.complete) lastCompletion = key;
  renderWorkout(key);
}

app.addEventListener('click', (event) => {
  const control = event.target.closest('[data-action]');
  if (!control) return;
  const { action, workout, index } = control.dataset;
  if (action === 'start' || action === 'card-start') renderWorkout(workout);
  if (action === 'home' || action === 'celebration-home') {
    if (action === 'celebration-home') {
      app.querySelector('.celebration')?.remove();
      celebrationOpen = false;
      lastCompletion = '';
    }
    renderHome();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  if (action === 'set') addSet(workout, Number(index));
  if (action === 'help') openHelp(workout, Number(index));
});

app.addEventListener('keydown', (event) => {
  const card = event.target.closest('.workout-card[data-workout]');
  if (!card || event.target !== card || !['Enter', ' '].includes(event.key)) return;
  event.preventDefault();
  renderWorkout(card.dataset.workout);
});

document.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', (event) => { if (event.target === dialog) dialog.close(); });
dialog.addEventListener('close', () => document.activeElement?.blur?.());
window.addEventListener('storage', (event) => {
  if (event.key === KEY) {
    progress = loadProgress();
    if (currentWorkout) renderWorkout(currentWorkout); else renderHome();
  }
});
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible' && progress.date !== localDayKey()) {
    progress = { date: localDayKey(), workouts: {} };
    persistProgress();
    if (currentWorkout) renderWorkout(currentWorkout); else renderHome();
  }
});

renderHome();

if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
  window.addEventListener('load', () => navigator.serviceWorker.register('/sw.js').catch(() => {}));
}
