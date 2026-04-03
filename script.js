let kanjis = [
    { kanji: 'あ', meaning: 'A' },
    { kanji: 'い', meaning: 'I' },
    { kanji: 'う', meaning: 'U' },
    { kanji: 'え', meaning: 'E' },
    { kanji: 'お', meaning: 'O' },
    { kanji: 'か', meaning: 'Ka' },
    { kanji: 'き', meaning: 'Ki' },
    { kanji: 'く', meaning: 'Ku' },
    { kanji: 'け', meaning: 'Ke' },
    { kanji: 'こ', meaning: 'Ko' },
    { kanji: 'さ', meaning: 'Sa' },
    { kanji: 'し', meaning: 'Shi' },
    { kanji: 'す', meaning: 'Su' },
    { kanji: 'せ', meaning: 'Se' },
    { kanji: 'そ', meaning: 'So' },
    { kanji: 'た', meaning: 'Ta' },
    { kanji: 'ち', meaning: 'Chi' },
    { kanji: 'つ', meaning: 'Tsu' },
    { kanji: 'て', meaning: 'Te' },
    { kanji: 'と', meaning: 'To' },
    { kanji: 'な', meaning: 'Na' },
    { kanji: 'に', meaning: 'Ni' },
    { kanji: 'ぬ', meaning: 'Nu' },
    { kanji: 'ね', meaning: 'Ne' },
    { kanji: 'の', meaning: 'No' },
    { kanji: 'は', meaning: 'Ha' },
    { kanji: 'ひ', meaning: 'Hi' },
    { kanji: 'ふ', meaning: 'Fu' },
    { kanji: 'へ', meaning: 'He' },
    { kanji: 'ほ', meaning: 'Ho' },
    { kanji: 'ま', meaning: 'Ma' },
    { kanji: 'み', meaning: 'Mi' },
    { kanji: 'む', meaning: 'Mu' },
    { kanji: 'め', meaning: 'Me' },
    { kanji: 'も', meaning: 'Mo' },
    { kanji: 'や', meaning: 'Ya' },
    { kanji: 'ゆ', meaning: 'Yu' },
    { kanji: 'よ', meaning: 'Yo' },
    { kanji: 'ら', meaning: 'Ra' },
    { kanji: 'り', meaning: 'Ri' },
    { kanji: 'る', meaning: 'Ru' },
    { kanji: 'れ', meaning: 'Re' },
    { kanji: 'ろ', meaning: 'Ro' },
    { kanji: 'わ', meaning: 'Wa' },
    { kanji: 'を', meaning: 'Wo' },
    { kanji: 'ん', meaning: 'N' },
    
]; 

let currentKanjiIndex = 0;
let difficulty = localStorage.getItem('hiragana_difficulty') || 'normal';
let audioContext = null;
let correctCount = parseInt(localStorage.getItem('hiragana_correct')) || 0;
let wrongCount = parseInt(localStorage.getItem('hiragana_wrong')) || 0;

document.getElementById('difficultyBtn').textContent = difficulty === 'normal' ? 'Normal' : 'Difícil';

function updateScoreDisplay() {
    document.getElementById('correctCount').textContent = correctCount;
    document.getElementById('wrongCount').textContent = wrongCount;
    document.getElementById('scoreDisplay').textContent = correctCount - wrongCount;
}

function saveScore() {
    localStorage.setItem('hiragana_correct', correctCount);
    localStorage.setItem('hiragana_wrong', wrongCount);
}

function getAudioContext() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    return audioContext;
}

document.getElementById('difficultyBtn').addEventListener('click', () => {
    difficulty = difficulty === 'normal' ? 'random' : 'normal';
    document.getElementById('difficultyBtn').textContent = difficulty === 'normal' ? 'Normal' : 'Difícil';
    localStorage.setItem('hiragana_difficulty', difficulty);
});

document.getElementById('themeBtn').addEventListener('click', () => {
    document.body.classList.toggle('dark');
    const btn = document.getElementById('themeBtn');
    btn.textContent = document.body.classList.contains('dark') ? '☀️' : '🌙';
});

document.getElementById('resetBtn').addEventListener('click', () => {
    correctCount = 0;
    wrongCount = 0;
    updateScoreDisplay();
    saveScore();
    currentKanjiIndex = 0;
    displayKanji();
    displayOptions();
    resetKanjiList();
});

document.getElementById('difficultyBtn').addEventListener('click', () => {
    if (difficulty === 'normal') {
        difficulty = 'random';
        document.getElementById('difficultyBtn').textContent = 'Difícil';
    } else {
        difficulty = 'normal';
        document.getElementById('difficultyBtn').textContent = 'Normal';
    }
    localStorage.setItem('hiragana_difficulty', difficulty);
    if (difficulty === 'normal') {
        correctCount = 0;
        wrongCount = 0;
        updateScoreDisplay();
        saveScore();
        currentKanjiIndex = 0;
        displayKanji();
        displayOptions();
        resetKanjiList();
    }
});

document.addEventListener('click', () => {
    if (audioContext && audioContext.state === 'suspended') {
        audioContext.resume();
    }
}, { once: true });

function getNextIndex() {
    if (difficulty === 'random') {
        return Math.floor(Math.random() * kanjis.length);
    }
    return (currentKanjiIndex + 1) % kanjis.length;
}

function playCorrectSound() {
    const audioCtx = getAudioContext();
    const osc1 = audioCtx.createOscillator();
    const osc2 = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    
    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(audioCtx.destination);
    
    osc1.type = 'triangle';
    osc2.type = 'sine';
    osc1.frequency.setValueAtTime(523, audioCtx.currentTime);
    osc1.frequency.setValueAtTime(659, audioCtx.currentTime + 0.05);
    osc1.frequency.setValueAtTime(784, audioCtx.currentTime + 0.1);
    osc2.frequency.setValueAtTime(1047, audioCtx.currentTime + 0.05);
    
    gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.15);
    
    osc1.start(audioCtx.currentTime);
    osc2.start(audioCtx.currentTime + 0.05);
    osc1.stop(audioCtx.currentTime + 0.15);
    osc2.stop(audioCtx.currentTime + 0.2);
}

function playWrongSound() {
    const audioCtx = getAudioContext();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(311, audioCtx.currentTime);
    osc.frequency.setValueAtTime(277, audioCtx.currentTime + 0.1);
    
    gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.2);
    
    osc.start(audioCtx.currentTime);
    osc.stop(audioCtx.currentTime + 0.2);
}

function displayKanji() {
    const kanjiDisplay = document.getElementById("kanjiDisplay");
    kanjiDisplay.style.animation = 'none';
    kanjiDisplay.offsetHeight;
    kanjiDisplay.style.animation = 'bounceIn 0.4s ease-out';
    kanjiDisplay.innerText = kanjis[currentKanjiIndex].kanji;
}

function shuffleOptions() {
    const shuffledOptions = [...kanjis];
    const correctOption = shuffledOptions.splice(currentKanjiIndex, 1)[0];
    shuffledOptions.sort(() => Math.random() - 0.5);
    shuffledOptions.length = 3;
    const randomPosition = Math.floor(Math.random() * 4);
    shuffledOptions.splice(randomPosition, 0, correctOption);
    return shuffledOptions;
}

function displayOptions() {
    const optionsContainer = document.getElementById("options");
    optionsContainer.innerHTML = "";
   
    const shuffledOptions = shuffleOptions();  

    shuffledOptions.forEach(option => {
        const button = document.createElement("button");
        button.innerText = option.meaning;
        button.addEventListener("click", () => checkAnswer(option));
        optionsContainer.appendChild(button);
    });
}

function checkAnswer(option) {
    const kanjiList = document.getElementById("kanjiList");
    const kanjiItem = kanjiList.children[currentKanjiIndex];
    const isCorrect = option.meaning === kanjis[currentKanjiIndex].meaning;

    if (isCorrect) {
        kanjiItem.classList.add("active");
        playCorrectSound();
        correctCount++;
    } else {
        kanjiItem.classList.add("wrong");
        playWrongSound();
        wrongCount++;
        
        if (difficulty === 'random') {
            resetKanjiList();
        }
    }

    updateScoreDisplay();
    saveScore();
    currentKanjiIndex = getNextIndex();
    displayKanji();
    displayOptions(); 
}

function createKanjiList() {
    const kanjiList = document.getElementById("kanjiList");
    kanjis.forEach((kanji, index) => {
        const listItem = document.createElement("li");
        listItem.innerText = kanji.kanji;
        listItem.addEventListener("click", () => {
            currentKanjiIndex = index;
            displayKanji();
            displayOptions();
        });
        kanjiList.appendChild(listItem);
    });
}

function resetKanjiList() {
    const kanjiList = document.getElementById("kanjiList");
    Array.from(kanjiList.children).forEach(item => {
        item.classList.remove("active", "wrong");
    });
}

createKanjiList();
displayKanji();
displayOptions();
updateScoreDisplay();
