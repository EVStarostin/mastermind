
const stepsNode = document.getElementById('steps');
const formNode = document.getElementById('form');
const guessNode = document.getElementById('guess');
const bullsNode = document.getElementById('bulls');
const cowsNode = document.getElementById('cows');
const errorNode = document.getElementById('error');
let possibleCodes = generate();
let step = 0;
let error = '';

formNode.addEventListener('submit', hadleFormSubmit);
renderStep(possibleCodes);

function hadleFormSubmit(e) {
    e.preventDefault();

    const guess = guessNode.value.split('').map(Number);
    const bulls = Number(bullsNode.value);
    const cows = Number(cowsNode.value);

    if (/^\d{4}$/.test(guessNode.value) === false) {
        error += 'Число должно состоять из 4 цифр\n';
    }

    if (/^[0, 1, 2, 3, 4]$/.test(bullsNode.value) === false) {
        error += 'Быков должно быть от 0 до 4\n';
    }

    if (/^[0, 1, 2, 3, 4]$/.test(cowsNode.value) === false) {
        error += 'Коров должно быть от 0 до 4\n';
    }

    errorNode.innerText = error;

    if (error) {
        error = '';
        return;
    }

    possibleCodes = getPossibleCodes(possibleCodes, guess, { bulls, cows });
    step++;
    renderStep(possibleCodes);

    e.target.reset();
}

function generate() {
    const a = [];

    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            if (j === i) continue;

            for (let k = 0; k < 9; k++) {
                if (k === i || k === j) continue;

                for (let l = 0; l < 9; l++) {
                    if (l === i || l === j || l === k) continue;

                    a.push([i, j, k, l]);
                }
            }
        }
    }

    return a;
}

function getPossibleCodes(codes, lastGuess, lastResult) {
    const { bulls: lastResultBulls, cows: lastResultCows } = lastResult;
    const possibleCodes = [];

    codes.forEach((code, i) => {
        const { bulls, cows } = checkGuess(lastGuess, code);

        if (bulls === lastResultBulls && cows === lastResultCows) {
            possibleCodes.push(code);
        }

    });

    return possibleCodes;
}

function checkGuess(guess, number) {
    let bulls = 0;
    let cows = 0;

    guess.forEach((digit, i) => {
        const isBull = digit === number[i];
        const isCow = !isBull && number.includes(digit);

        bulls += Number(isBull);
        cows += Number(isCow);
    });

    return { bulls, cows }
}

function renderStep(choices) {
    const firstLine = step > 0 ? `Попытка ${step} (число: ${guessNode.value}, быков: ${bullsNode.value}, коров: ${cowsNode.value}).\n` : 'Начало.\n';
    const secondLine = 'Оставшиеся варианты (' + choices.length + '):\n' + choices.map(code => code.join('')).join('; ') + '\n\n';

    stepsNode.innerText = firstLine + secondLine + stepsNode.innerText;
}