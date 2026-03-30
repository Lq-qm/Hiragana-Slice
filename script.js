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
let difficulty = 'normal';

document.getElementById('difficulty').addEventListener('change', (e) => {
    difficulty = e.target.value;
});

document.getElementById('themeBtn').addEventListener('click', () => {
    document.body.classList.toggle('dark');
    const btn = document.getElementById('themeBtn');
    btn.textContent = document.body.classList.contains('dark') ? '☀️' : '🌙';
});

function getNextIndex() {
    if (difficulty === 'random') {
        return Math.floor(Math.random() * kanjis.length);
    }
    return (currentKanjiIndex + 1) % kanjis.length;
}

function playCorrectSound() {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator1 = audioCtx.createOscillator();
    const oscillator2 = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    oscillator1.connect(gainNode);
    oscillator2.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    oscillator1.type = 'sine';
    oscillator2.type = 'sine';
    oscillator1.frequency.setValueAtTime(660, audioCtx.currentTime);
    oscillator1.frequency.setValueAtTime(880, audioCtx.currentTime + 0.08);
    oscillator2.frequency.setValueAtTime(880, audioCtx.currentTime);
    
    gainNode.gain.setValueAtTime(0.12, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
    
    oscillator1.start(audioCtx.currentTime);
    oscillator2.start(audioCtx.currentTime);
    oscillator1.stop(audioCtx.currentTime + 0.3);
    oscillator2.stop(audioCtx.currentTime + 0.3);
}

function playWrongSound() {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(300, audioCtx.currentTime);
    gainNode.gain.setValueAtTime(0.2, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.2);
    
    oscillator.start(audioCtx.currentTime);
    oscillator.stop(audioCtx.currentTime + 0.2);
}

function displayKanji() {
    const kanjiDisplay = document.getElementById("kanjiDisplay");
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
    } else {
        kanjiItem.classList.add("wrong");
        playWrongSound();
    }

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
createKanjiList();
displayKanji();
displayOptions();
