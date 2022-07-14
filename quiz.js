let questions;
let current_question = 0;
let total_questions;

let correct_answers = 0;
let wrong_answers = [];

let stocks;
let stocks_lost = 0;
let hero;
let hero_power;
let current_hp;
let hero_powers_used = 0;


let levels_5 = ["Newbie", "Rookie", "Skilled", "Intermediate", "Advanced", "Expert"];
let levels_3 = ["Newbie", "Skilled", "Intermediate", "Expert"];
let level = 0;
let levels_no = 3;
let level_step;



let galaga = "<iframe src='https://www.retrogames.cc/embed/40995-galaga.html' width='600' height='450' frameborder='no' allowfullscreen='true' webkitallowfullscreen='true' mozallowfullscreen='true' scrolling='no'></iframe>";
let qbert = "<iframe src='https://www.retrogames.cc/embed/34147-q-bert-us-set-1.html' width='600' height='450' frameborder='no' allowfullscreen='true' webkitallowfullscreen='true' mozallowfullscreen='true' scrolling='no'></iframe>";
let asteroid = "<iframe src='https://www.retrogames.cc/embed/18373-asteroids-usa-europe.html' width='600' height='450' frameborder='no' allowfullscreen='true' webkitallowfullscreen='true' mozallowfullscreen='true' scrolling='no'></iframe>";
let tetris = "<iframe src='https://www.retrogames.cc/embed/17612-tetris-usa.html' width='600' height='450' frameborder='no' allowfullscreen='true' webkitallowfullscreen='true' mozallowfullscreen='true' scrolling='no'></iframe>";
let pac_man = "<iframe src='https://www.retrogames.cc/embed/9406-pac-man-midway-1.html' width='600' height='450' frameborder='no' allowfullscreen='true' webkitallowfullscreen='true' mozallowfullscreen='true' scrolling='no'></iframe>";

let games = [pac_man, tetris, qbert, galaga, asteroid];
let game_names = ["Pac Man", "Tetris", "Q*bert", "Galaga", "Asteroid"];
let game_counter = -1;

let time_out;
let game_timer;
let seconds = 120;

let final_answer;

const upload = document.getElementById('upload');
upload.onclick = function() {
	const files = document.getElementById('selectFile').files;
    if (files.length <= 0) {
        return false;
    }
  
    const fr = new FileReader();
  
    fr.onload = function(e) { 
        const result = JSON.parse(e.target.result);

        questions = GenerateQuestions(result);

        total_questions = questions.length;

        StartGame();

    }

    fr.readAsText(files.item(0));

    DestroyUpload();  
};

function ShowFormatClicked() {
    let button = document.getElementById("show_format_btn");
    if(button.innerHTML == "Show format") {
        button.innerHTML = "Hide format";
    }
    else {
        button.innerHTML = "Show format";
    }
    let img = document.getElementById("json_format");
    if (img.style.display === "none") {
        img.style.display = "block";
    } else {
        img.style.display = "none";
    }
}


function DestroyContentsOfDiv(id) {
    let div = document.getElementById(id);
    while (div.firstChild) {
        div.removeChild(div.firstChild);
    }
}

function DestroyLeftRight() {
    document.getElementById("left").className = "col-sm-0 col-md-0";
    document.getElementById("middle").className = "col-sm-12 col-md-12";
    document.getElementById("right").className = "col-sm-0 col-md-0";
}

function RepairLeftRight() {
    document.getElementById("left").className = "col-sm-12 col-md-3";
    document.getElementById("middle").className = "col-sm-12 col-md-6";
    document.getElementById("right").className = "col-sm-12 col-md-3";
}


function GenerateQuestions(a) {
    return a.questions;
}

function CreateOutterQuestion(questions) {
    let outer_question = document.createElement("div");
    outer_question.id = "outer_question";
    document.getElementById('middle').appendChild(outer_question);

    let question = document.createElement("div");
    question.id = "question";
    document.getElementById('outer_question').appendChild(question);

    let answers = document.createElement("div");
    answers.id = "answers";
    document.getElementById('outer_question').appendChild(answers);

        
    let answer_0 = document.createElement("button");
    answer_0.id = "answer_0";
    answer_0.className = "answers";
    answer_0.onclick = function(){AnswerClicked(0)};
    document.getElementById('answers').appendChild(answer_0);

    let answer_1 = document.createElement("button");
    answer_1.id = "answer_1";
    answer_1.className = "answers";
    answer_1.onclick = function(){AnswerClicked(1)};
    document.getElementById('answers').appendChild(answer_1);

    let answer_2 = document.createElement("button");
    answer_2.id = "answer_2";
    answer_2.className = "answers";
    answer_2.onclick = function(){AnswerClicked(2)};
    document.getElementById('answers').appendChild(answer_2);

    let answer_3 = document.createElement("button");
    answer_3.id = "answer_3";
    answer_3.className = "answers";
    answer_3.onclick = function(){AnswerClicked(3)};
    document.getElementById('answers').appendChild(answer_3);

    let confirm_answer = document.createElement("button");
    confirm_answer.innerHTML = "Confirm Answer";
    confirm_answer.id = "confirm_answer";
    confirm_answer.onclick = function(){ConfirmAnswerClicked()};
    confirm_answer.disabled = true;
    document.getElementById('outer_question').appendChild(confirm_answer);
}

function ConfirmAnswerClicked() {
    confirm_answer.disabled = "true";
    if(final_answer == questions[current_question].correct) {
        correct_answers++;
        NextQuestion();
    }
    else {
        if((stocks - 1) == 0) {
            stocks--;
            stocks_lost++;
            wrong_answers.push(current_question + 1);
            GameOver();
        }
        else {
            wrong_answers.push(current_question + 1);
            UpdateStocks();
            NextQuestion();
        }
    }
}

function HideAll() {
    document.getElementById('progress').style.display = "none";

    let left_kids = document.getElementById('left').childNodes;
    for(let i = 0; i < left_kids.length; i++) {
        left_kids[i].style.display = "none";
    }

    document.getElementById('question').style.display = "none";
    document.getElementById('answer_0').style.display = "none";
    document.getElementById('answer_1').style.display = "none";
    document.getElementById('answer_2').style.display = "none";
    document.getElementById('answer_3').style.display = "none";
    document.getElementById('confirm_answer').style.display = "none";

    let right_kids = document.getElementById('right').childNodes;
    for(let i = 0; i < right_kids.length; i++) {
        right_kids[i].style.display = "none";
    }
}

function UnHideAll() {
    document.getElementById('progress').style.display = "block";

    let left_kids = document.getElementById('left').childNodes;
    for(let i = 0; i < left_kids.length; i++) {
        left_kids[i].style.display = "block";
    }

    document.getElementById('question').style.display = "block";
    document.getElementById('answer_0').style.display = "block";
    document.getElementById('answer_1').style.display = "block";
    document.getElementById('answer_2').style.display = "block";
    document.getElementById('answer_3').style.display = "block";
    document.getElementById('confirm_answer').style.display = "inline-block";

    let right_kids = document.getElementById('right').childNodes;
    for(let i = 0; i < right_kids.length; i++) {
        right_kids[i].style.display = "block";
    }
    document.getElementById('hp').style.display = "inline-block";
}

function DestroyLevelUp() {
    document.getElementById('middle').removeChild(document.getElementById('lvl_up_info'));
    document.getElementById('middle').removeChild(document.getElementById('play_game'));
    document.getElementById('middle').removeChild(document.getElementById('continue_btn'));
}

function Continue2Clicked() {
    document.body.style.backgroundImage = "url('images/back_2.jpg')";

    DestroyGame();
    UnHideAll();
    clearTimeout(time_out);
    clearInterval(game_timer);
}

function DisplayGame() {
    let game = document.createElement("div");
    game.id = "game";
    game.innerHTML = games[game_counter];
    game.style.display = "block";
    document.getElementById('middle').appendChild(game);

    let continue_btn = document.createElement("button");
    continue_btn.id = "continue_btn";
    continue_btn.innerHTML = "Continue to Quiz";
    continue_btn.className = "NavButtons";
    continue_btn.title = "Continue to Quiz.";
    continue_btn.onclick = function(){Continue2Clicked()};
    document.getElementById('middle').appendChild(continue_btn);
}

function DestroyGame() {
    document.getElementById('middle').removeChild(document.getElementById('timer'));
    document.getElementById('middle').removeChild(document.getElementById('game'));
    document.getElementById('middle').removeChild(document.getElementById('continue_btn'));

    RepairLeftRight();
}

function ContinueClicked() {
    document.body.style.backgroundImage = "url('images/back_2.jpg')";
    DestroyLevelUp();
    UnHideAll();
}

function SetTimer() {
    if(seconds <= 120) { 
        document.getElementById("timer").innerHTML = seconds + " seconds left...<br>" +
                                                    "<b>Controls:</b> Shift (Insert coin), Space or Enter (Start)<br>" + 
                                                    "Arrow keys (Navigation), z - x - a - s (Do things)";
    }
    if (seconds > 0) {
        seconds--;
    } else {
        clearInterval(game_timer);
    }
}

function DisplayTimer() {
    let timer = document.createElement("div");
    timer.id = "timer";
    document.getElementById('middle').appendChild(timer);
}

function PlayGameClicked() {
    document.body.style.backgroundImage = "url('images/back_1.jpg')";
    seconds = 120;
    time_out = setTimeout(Continue2Clicked, 122000);

    DestroyLeftRight();

    DisplayTimer();

    game_timer = setInterval(function(){SetTimer();}, 1000);

    
    DestroyLevelUp();
    DisplayGame();
    
}

function DisplayLevelUp() {

    HideAll();

    let lvl_up_info = document.createElement("div");
    lvl_up_info.id = "lvl_up_info";

    if(levels_no == 3) {
        lvl_up_info.innerHTML = "<b>Congratulations!</b><br>" + 
                                "You <b>leveled up</b> from <b>" + 
                                levels_3[level - 1] + 
                                "</b> to <b>" +
                                levels_3[level] +
                                "</b>.<br> You have unlocked the game: <b>" +
                                game_names[game_counter] +
                                "</b>!<br>" +
                                "You can play the game for a limited amount of time,<br>" +
                                "or u can continue the Quiz.<br>" +
                                "What will u do?";
    }
    else {
        lvl_up_info.innerHTML = "<b>Congratulations!</b><br>" + 
                                "You <b>leveled up</b> from <b>" + 
                                levels_5[level - 1] + 
                                "</b> to <b>" +
                                levels_5[level] +
                                "</b>.<br> You have unlocked the game: <b>" +
                                game_names[game_counter] +
                                "</b>!<br>" +
                                "You can play the game for a limited amount of time,<br>" +
                                "or u can continue the Quiz.<br>" +
                                "What will u do?";
    }
    
    document.getElementById('middle').appendChild(lvl_up_info);

    let play_game = document.createElement("button");
    play_game.id = "play_game";
    play_game.innerHTML = "Play Game";
    play_game.className = "NavButtons";
    play_game.title = "Test run the game you unlocked for a limited amount of time.";
    play_game.onclick = function(){PlayGameClicked()};
    document.getElementById('middle').appendChild(play_game);

    let continue_btn = document.createElement("button");
    continue_btn.id = "continue_btn";
    continue_btn.innerHTML = "Continue to Quiz";
    continue_btn.className = "NavButtons";
    continue_btn.title = "Continue to Quiz.";
    continue_btn.onclick = function(){ContinueClicked()};
    document.getElementById('middle').appendChild(continue_btn);
}

function LevelUp() {
    level++;
    game_counter++;
    if(levels_no == 3) {
        document.getElementById('current_lvl').innerHTML = "Current Level: " + levels_3[level];
        document.getElementById('next_lvl').innerHTML = "Next Level: " + levels_3[level + 1];
    }
    else {
        document.getElementById('current_lvl').innerHTML = "Current Level: " + levels_5[level];
        document.getElementById('next_lvl').innerHTML = "Next Level: " + levels_5[level + 1];
    }

    DisplayLevelUp();
}

function ManageLevelUp() {
    if(levels_no == 3) {
        if(current_question == (level + 1) * level_step && levels_3[(level + 1)] != "Expert") {
            LevelUp();
        }
    }
    else {
        if(current_question == (level + 1) * level_step && levels_5[(level + 1)] != "Expert") {
            LevelUp();
        }
    }
}

function UpdateProgress() {
    document.getElementById('progress').innerHTML = "Question#: " + (current_question + 1) + " / " + total_questions;

    if(levels_no != 0) {
        if(levels_no == 3) {
            if(levels_3[(level + 1)] == "Expert") {
                document.getElementById('xp_to_lvl').innerHTML = "Questions until next level up: <b>" + (total_questions - current_question) + "</b>";
            }
            else {
                document.getElementById('xp_to_lvl').innerHTML = "Questions until next level up: <b>" + (((level + 1) * level_step) - current_question) + "</b>";
            }
        }
        else {
            if(levels_5[(level + 1)] == "Expert") {
                document.getElementById('xp_to_lvl').innerHTML = "Questions until next level up: <b>" + (total_questions - current_question) + "</b>";
            }
            else {
                document.getElementById('xp_to_lvl').innerHTML = "Questions until next level up: <b>" + (((level + 1) * level_step) - current_question) + "</b>";
            }
        }

        if(hero != "Cat") {
            document.getElementById("av_hp").innerHTML = "Available Hero Powers: <b>" + current_hp + "</b>";
        }
    }
}

function NextQuestion() {
    current_question++;

    if(levels_no == 0) {
        if(current_question == total_questions) {
            GameOver();
        }
        else {
            UpdateProgress();
            DisplayCurrentQuestion();
        }
    }
    else {
        if(current_question == total_questions) {
            level++;
            game_counter++;
            GameOver();
        }
        else {
            if(current_question >= 10 && current_question % 10 == 0 && hero_power > 0) {
                current_hp++;
                if(hero == "Owl") {
                    current_hp++;
                }
                if(hero == "Cat" ) {
                    stocks++;
                    let stock_img = document.createElement("img");
                    stock_img.src = "cat_stock_img.png";
                    stock_img.id = "stock_img";
                    stock_img.className = "img-responsive";
                    document.getElementById("stocks_label").appendChild(stock_img);
                    hero_power--;
                }
            }

            if(current_hp > 0 && hero != "Cat") {
                document.getElementById("hp").disabled = false;
            }
        
           if(hero == "Owl") {
                let answers = document.getElementById('answers').childNodes;
                for(let i = 0; i < answers.length; i++){
                    if(answers[i].style.display == "none"){
                        answers[i].style.display = "block";
                    } 
                }
           }
        
            ManageLevelUp();
            UpdateProgress();
            DisplayCurrentQuestion();
        }
    }
}

function ResetVariables() {
    current_question = 0;
    correct_answers = 0;
    levels_no = 3;
    level = 0;
    level_step = 0;
    stocks_lost = 0;
    hero_powers_used = 0;
    wrong_answers = [];
    game_counter = -1;
    seconds= 120; 
    current_hp = 1;
}

function DestroyAll() {
    DestroyContentsOfDiv("header");
    DestroyContentsOfDiv("left");
    DestroyContentsOfDiv("middle");
    DestroyContentsOfDiv("right");
}

function DestroyEndgame() {
    DestroyContentsOfDiv("middle");
}

function DestroyPlayUnlocked() {
    DestroyContentsOfDiv("middle");
}

function RestartClicked() {

    RepairLeftRight();

    if(levels_no == 0) {
        DestroyAll();
        ResetVariables();
        StartGame();
    }
    else {
        DestroyContentsOfDiv("middle");
        ResetVariables();
        LoadGameData();
        DisplayHeroButtons();
    }
}

function BackClicked() {
    let middle = document.getElementById('middle');
    while (middle.firstChild) {
        middle.removeChild(middle.firstChild);
    }

    for(let i = 0; i <= game_counter; i++) {
        let btn = document.createElement("button");
        btn.innerHTML = game_names[i];
        btn.id = "game" + i;
        btn.className = "NavButtons";
        btn.title = "Play the game " + game_names[i] + "!";
        btn.onclick = function(){GameClicked(btn.id)};
        document.getElementById('middle').appendChild(btn);
    }

    let restart = document.createElement("button");
    restart.innerHTML = "Restart Quiz";
    restart.id = "restart";
    restart.className = "NavButtons";
    restart.title = "This restarts the game!";
    restart.onclick = function(){RestartClicked()};
    document.getElementById('middle').appendChild(restart);
}

function GameClicked(id) {
    let middle = document.getElementById('middle');
    while (middle.firstChild) {
        middle.removeChild(middle.firstChild);
    }
    
    let game = document.createElement("div");
    game.id = "game";
    
    switch(id) {
        case "game0":
            game.innerHTML = games[0];
        break;
        case "game1":
            game.innerHTML = games[1];
        break;
        case "game2":
            game.innerHTML = games[2];
        break;
        case "game3":
            game.innerHTML = games[3];
        break;
        case "game4":
            game.innerHTML = games[4];
        break;
        default:
            console.log("Game clicked error.");
    }
    document.getElementById('middle').appendChild(game);

    let back = document.createElement("button");
    back.innerHTML = "Back";
    back.id = "back";
    back.className = "NavButtons";
    back.title = "Go Back!";
    back.onclick = function(){BackClicked()};
    document.getElementById('middle').appendChild(back);

    let restart = document.createElement("button");
    restart.innerHTML = "Restart Quiz";
    restart.id = "restart";
    restart.className = "NavButtons";
    restart.title = "This restarts the game!";
    restart.onclick = function(){RestartClicked()};
    document.getElementById('middle').appendChild(restart);
}

function PlayUnlockedClicked() {
    document.body.style.backgroundImage = "url('images/back_1.jpg')";
    DestroyEndgame();
    DestroyLeftRight();

    for(let i = 0; i <= game_counter; i++) {
        let btn = document.createElement("button");
        btn.innerHTML = game_names[i];
        btn.id = "game" + i;
        btn.className = "NavButtons";
        btn.title = "Play the game " + game_names[i] + "!";
        btn.onclick = function(){GameClicked(btn.id)};
        document.getElementById('middle').appendChild(btn);
    }

    let restart = document.createElement("button");
    restart.innerHTML = "Restart Quiz";
    restart.id = "restart";
    restart.className = "NavButtons";
    restart.title = "This restarts the game!";
    restart.onclick = function(){RestartClicked()};
    document.getElementById('middle').appendChild(restart);
}

function DisplayEndgameData() {
    

    if (levels_no == 0) {

        if(stocks == 0) {
            let game_over = document.createElement("div");
            game_over.id = "game_over";
            game_over.innerHTML = "<b>Game Over</b>.";
            document.getElementById('middle').appendChild(game_over);
        }
        else {
            let quiz_completed = document.createElement("div");
            quiz_completed.id = "quiz_completed";
            quiz_completed.innerHTML = "<b>Congratulations!!!</b><br> You completed the Quiz.";
            document.getElementById('middle').appendChild(quiz_completed);
        }

        document.body.style.backgroundImage = "url('images/back_1.jpg')";
        let summary = document.createElement("div");
        summary.id = "summary";
        summary.innerHTML = "<b>Quiz Summary</b>"
        document.getElementById('middle').appendChild(summary);

        let total_correct = document.createElement("div");
        total_correct.id = "total_correct";
        total_correct.innerHTML = "Total correct answers: <b>" + correct_answers + "/" + total_questions +"</b>"; 
        document.getElementById('middle').appendChild(total_correct);

        let stocks_info = document.createElement("div");
        stocks_info.id = "stocks_info";
        if(stocks_lost == 0) {
            stocks_info.innerHTML = "Perfect! Answered all questions correctly!";

        }
        else {
            stocks_info.innerHTML = "You lost at question: <b>" + wrong_answers[0] + "</b>";
        }
        document.getElementById('middle').appendChild(stocks_info);

        let restart = document.createElement("button");
        restart.innerHTML = "Restart Quiz";
        restart.id = "restart";
        restart.className = "NavButtons";
        restart.title = "This restarts the game!";
        restart.onclick = function(){RestartClicked()};
        document.getElementById('middle').appendChild(restart);
    }
    else {
        if(stocks == 0) {
            let game_over = document.createElement("div");
            game_over.id = "game_over";
            game_over.innerHTML = "<b>Game Over</b><br> You lost all your stocks.";
            document.getElementById('middle').appendChild(game_over);
        }
        else {
            let quiz_completed = document.createElement("div");
            quiz_completed.id = "quiz_completed";
            quiz_completed.innerHTML = "<b>Congratulations!!!</b><br> You completed the Quiz.";
            document.getElementById('middle').appendChild(quiz_completed);
        }

        let summary = document.createElement("div");
        summary.id = "summary";
        summary.innerHTML = "<b>Quiz Summary</b>";
        document.getElementById('middle').appendChild(summary);

        let hero_picked = document.createElement("div");
        hero_picked.id = "hero_picked";
        hero_picked.innerHTML = "Hero picked: <b>" + hero + "</b>";
        document.getElementById('middle').appendChild(hero_picked);

        let lvl_reached = document.createElement("div");
        lvl_reached.id = "lvl_reached";
        if(levels_no == 3) {
            lvl_reached.innerHTML = "Level reached: <b>" + levels_3[level] + "</b>";
        }
        else {
            lvl_reached.innerHTML = "Level reached: <b>" + levels_5[level] + "</b>";
        }
        document.getElementById('middle').appendChild(lvl_reached);

        let total_correct = document.createElement("div");
        total_correct.id = "total_correct";
        total_correct.innerHTML = "Total correct answers: <b>" + correct_answers + "/" + total_questions +"</b>"; 
        document.getElementById('middle').appendChild(total_correct);

        let stocks_info = document.createElement("div");
        stocks_info.id = "stocks_info";
        if(stocks_lost > 0) {
            let x = "";
            for(let i = 0; i < wrong_answers.length; i++) {
                if(i == (wrong_answers.length - 1)) {
                    x += wrong_answers[i];
                    break;
                }
                x += wrong_answers[i] + ", ";
            }
            stocks_info.innerHTML = "Lost a total of <b>" + stocks_lost + "</b> stocks at questions: <b>" + x  + "</b>";

        }
        else {
            stocks_info.innerHTML = "Lost a total of <b>0</b> stocks.";
        }
    
        document.getElementById('middle').appendChild(stocks_info);

        if(hero != "Cat") {
            let hps_used = document.createElement("div");
            hps_used.id = "hps_used";
            hps_used.innerHTML = "Total Hero Powers used: <b>" + hero_powers_used + "</b>"; 
            document.getElementById('middle').appendChild(hps_used);
        }
        

        let games_unlocked = document.createElement("div");
        games_unlocked.id = "games_unlocked";
        if(game_counter >= 0) {
            let y = "";
            for(let i = 0; i <= game_counter; i++) {
                if(i == game_counter) {
                    y += game_names[i];
                    break;
                }
                y += game_names[i] + ", ";
            }
            games_unlocked.innerHTML = "Games unlocked: <b>" + y + "</b>";
        }
        else {
            games_unlocked.innerHTML = "No Games unlocked.";
        }
     
        document.getElementById('middle').appendChild(games_unlocked);

        if(game_counter >= 0) {
            let play_unlocked = document.createElement("button");
            play_unlocked.innerHTML = "Play unlocked Games";
            play_unlocked.id = "play_unlocked";
            play_unlocked.className = "NavButtons";
            play_unlocked.title = "Play one of the games you unlocked!";
            play_unlocked.onclick = function(){PlayUnlockedClicked()};
            document.getElementById('middle').appendChild(play_unlocked);
        }

        let restart = document.createElement("button");
        restart.innerHTML = "Restart Quiz";
        restart.id = "restart";
        restart.className = "NavButtons";
        restart.title = "This restarts the game!";
        restart.onclick = function(){RestartClicked()};
        document.getElementById('middle').appendChild(restart);
    }
    
}

function GameOver() {
    DestroyAll();
    DisplayEndgameData();
}

function UpdateStocks() {
    stocks--;
    stocks_lost++;
    document.getElementById("stocks_label").removeChild(document.getElementById("stocks_label").lastChild);
}

function AnswerClicked(answer_no) {
    final_answer = answer_no;
    document.getElementById("confirm_answer").disabled = false;
}

function DisplayCurrentQuestion() {
    document.getElementById('question').innerHTML = questions[current_question].question;
    document.getElementById('answer_0').innerHTML = questions[current_question].answers[0];
    document.getElementById('answer_1').innerHTML = questions[current_question].answers[1];
    document.getElementById('answer_2').innerHTML = questions[current_question].answers[2];
    document.getElementById('answer_3').innerHTML = questions[current_question].answers[3];
}

function DestroyUpload() {
    DestroyContentsOfDiv("middle");
    
}

function DestroyHeroButtons() {
    DestroyContentsOfDiv("header");
    DestroyContentsOfDiv("middle");
}

function DisplayStocks() {
    if(levels_no != 0) {
        if (hero == "Cat") {
            stocks++;
            hero_power--;
        }
    }
    
    let stocks_label = document.createElement("div");
    stocks_label.id = "stocks_label";
    document.getElementById('right').appendChild(stocks_label);

    let heart_stock_img = document.createElement("img");
    heart_stock_img.id = "heart_stock_img";
    heart_stock_img.className = "StockImages";
    heart_stock_img.src = "images/stock_img.png";
    document.getElementById("stocks_label").appendChild(heart_stock_img);

    let arrow_img = document.createElement("img");
    arrow_img.id = "arrow_img";
    arrow_img.className = "StockImages";
    arrow_img.src = "images/arrow_img.png";
    document.getElementById("stocks_label").appendChild(arrow_img);

    

    for(let i = 0; i < stocks; i++) {
        let stock_img = document.createElement("img");
        stock_img.id = "stock_img";
        stock_img.className = "img-responsive";

        switch(hero) {
            case "Cat":
                stock_img.src = "images/cat_stock_img.png";
            break;

            case "Fox":
                stock_img.src = "images/fox_stock_img.png";
            break;

            case "Owl":
                stock_img.src = "images/owl_stock_img.png";
            break;
        }
        document.getElementById("stocks_label").appendChild(stock_img);
    }
}

function AdjustLevels() {
    if(total_questions <= 9) {
        levels_no = 0;
    }
    else {
        if(total_questions > 20) {
            levels_no = 5;
        }
    
        let mod = total_questions % levels_no;
        level_step = ((total_questions - mod) / levels_no);
    }
}

function AdjustStocks() {
    if(levels_no == 0) {
        stocks = 1;
    }
    else {
        stocks = Math.round(total_questions / 10);
    }
}

function AdjustHP() {
    hero_power = Math.round(total_questions / 10);
    if(hero == "Owl") {
        hero_power += hero_power;
        current_hp = 2;
    }
    else {
        current_hp = 1;
    }
}

function LoadGameData() {
    AdjustLevels();
    AdjustStocks();
}

function RemoveRandomAnswer(x, y, z) {
    switch(Math.floor(Math.random() * 3)) {
        case 0:
            switch(x) {
                case 0:
                    document.getElementById('answer_0').style.display = "none";
                break;
                case 1:
                    document.getElementById('answer_1').style.display = "none";
                break;
                case 2:
                    document.getElementById('answer_2').style.display = "none";
                break;
                case 3:
                    document.getElementById('answer_3').style.display = "none";
                break;
                default:
                    console.log("RemoveRandomAnswer error");
                    console.log(x);
            }
        break;
        case 1:
            switch(y) {
                case 0:
                    document.getElementById('answer_0').style.display = "none";
                break;
                case 1:
                    document.getElementById('answer_1').style.display = "none";
                break;
                case 2:
                    document.getElementById('answer_2').style.display = "none";
                break;
                case 3:
                    document.getElementById('answer_3').style.display = "none";
                break;
                default:
                    console.log("RemoveRandomAnswer error");
                    console.log(y);
            }
        break;
        case 2:
            switch(z) {
                case 0:
                    document.getElementById('answer_0').style.display = "none";
                break;
                case 1:
                    document.getElementById('answer_1').style.display = "none";
                break;
                case 2:
                    document.getElementById('answer_2').style.display = "none";
                break;
                case 3:
                    document.getElementById('answer_3').style.display = "none";
                break;
                default:
                    console.log("RemoveRandomAnswer error");
                    console.log(z);
            }
        break;
    }
}

function HPClicked() {
    current_hp--;
    hero_power--;
    hero_powers_used++;

    document.getElementById("hp").disabled = true;
    document.getElementById("av_hp").innerHTML = "Available Hero Powers: <b>" + current_hp + "</b>";

    if(hero == "Fox") {
        correct_answers++;
        NextQuestion();
    }
    else {
        switch(questions[current_question].correct) {
            case 0:
                RemoveRandomAnswer(1, 2, 3);
            break;
            case 1:
                RemoveRandomAnswer(0, 2, 3);
            break;
            case 2:
                RemoveRandomAnswer(1, 0, 3);
            break;
            case 3:
                RemoveRandomAnswer(1, 2, 0);
            break;
            default:
                console.log("HPClicked error");
        }
    }
}

function DisplayHPButton() {
    let hp = document.createElement("button");
    hp.innerHTML = "Hero Power";
    hp.id = "hp";
    hp.title = "This activates the unique power of ur hero!";
    hp.onclick = function(){HPClicked()};
    document.getElementById('right').appendChild(hp);

    let av_hp = document.createElement("div");
    av_hp.innerHTML = "Available Hero Powers: <b>" + current_hp + "</b>";
    av_hp.id = "av_hp";
    document.getElementById('left').appendChild(av_hp);

}

function DisplayProgress() {
    if(levels_no == 0) {
        let progress = document.createElement("div");
        progress.id = "progress";
        progress.innerHTML = "Question#: " + (current_question + 1) + " / " + total_questions; 
        document.getElementById('header').appendChild(progress);
    }
    else {
        let progress = document.createElement("div");
        progress.id = "progress";
        progress.innerHTML = "Question#: " + (current_question + 1) + " / " + total_questions; 
        document.getElementById('header').appendChild(progress);

        let progress_label = document.createElement("div");
        progress_label.id = "progress_label";
        progress_label.innerHTML = "Progress"; 
        document.getElementById('left').appendChild(progress_label);

        let current_lvl = document.createElement("div");
        current_lvl.id = "current_lvl";
        let next_lvl = document.createElement("div");
        next_lvl.id = "next_lvl";

        if(levels_no == 3) {
            current_lvl.innerHTML = "Current Level: <b>" + levels_3[level] + "</b>";
            next_lvl.innerHTML = "Next Level: <b>" + levels_3[level + 1] + "</b>"; 
        }
        else {
            current_lvl.innerHTML = "Current Level: <b>" + levels_5[level] + "</b>"; 
            next_lvl.innerHTML = "Next Level: <b>" + levels_5[level + 1] + "</b>"; 
        }
        document.getElementById('left').appendChild(current_lvl);
        document.getElementById('left').appendChild(next_lvl);

        let xp_to_lvl = document.createElement("div");
        xp_to_lvl.id = "xp_to_lvl";
        xp_to_lvl.innerHTML = "Questions until next level up: <b>" + (level_step - current_question) + "</b>";
        document.getElementById('left').appendChild(xp_to_lvl);
    }
}

function StartGame() {
    LoadGameData();
    if(levels_no == 0) {
        document.body.style.backgroundImage = "url('images/back_2.jpg')";
        DestroyContentsOfDiv("header");
        DisplayProgress();
        CreateOutterQuestion();
        DisplayCurrentQuestion();
    }
    else {
        DisplayHeroButtons();
    }
}

function HeroClicked(id) {
    hero = id;
    document.getElementById("confirm_hero").disabled = false;
}

function ConfirmHeroClicked() {
    document.body.style.backgroundImage = "url('images/back_2.jpg')";
    DestroyHeroButtons();
    AdjustHP();
    DisplayStocks();
    DisplayProgress();
    CreateOutterQuestion();
    DisplayCurrentQuestion();

    if(hero != "Cat") {
        DisplayHPButton();
    }
}

function DisplayHeroButtons() {
    document.body.style.backgroundImage = "url('images/back_1.jpg')";
    document.getElementById("header").innerHTML = "Choose you hero!";

    let above_heros_txt = document.createElement("div");
    above_heros_txt.id = "above_heros_txt"
    above_heros_txt.innerHTML = "Each one has a unique hero power described below.";
    document.getElementById('middle').appendChild(above_heros_txt);


    let img_row = document.createElement("div");
    img_row.id = "img_row";
    img_row.className = "row";
    document.getElementById('middle').appendChild(img_row);

    let btn_row = document.createElement("div");
    btn_row.id = "btn_row";
    btn_row.className = "row";
    document.getElementById('middle').appendChild(btn_row);

    let txt_row = document.createElement("div");
    txt_row.id = "txt_row";
    txt_row.className = "row";
    document.getElementById('middle').appendChild(txt_row);
   
    let cat_img = document.createElement("img");
    cat_img.src = "images/cat_img.png";
    cat_img.id = "cat_img";
    cat_img.className = "img-responsive";
    document.getElementById('img_row').appendChild(cat_img);

    let fox_img = document.createElement("img");
    fox_img.src = "images/fox_img.png";
    fox_img.id = "fox_img";
    fox_img.className = "img-responsive";
    document.getElementById('img_row').appendChild(fox_img);

    let owl_img = document.createElement("img");
    owl_img.src = "images/owl_img.png";
    owl_img.id = "owl_img";
    owl_img.className = "img-responsive";
    document.getElementById('img_row').appendChild(owl_img);

    let cat = document.createElement("button");
    cat.innerHTML = "Cat";
    cat.id = "Cat";
    cat.className = "HeroButtons";
    cat.title = "This hero is the Cat and as cats go having 9 lives and stuff, she has one extra stock...";
    cat.onclick = function(){HeroClicked(cat.id)};
    document.getElementById('btn_row').appendChild(cat);

    let fox = document.createElement("button");
    fox.innerHTML = "Fox";
    fox.id = "Fox";
    fox.className = "HeroButtons";
    fox.title = "This hero is the Fox and as foxes go being cunning and evasive, she can skip a question every now and then...";
    fox.onclick = function(){HeroClicked(fox.id)};
    document.getElementById('btn_row').appendChild(fox);

    let owl = document.createElement("button");
    owl.innerHTML = "Owl";
    owl.id = "Owl";
    owl.className = "HeroButtons";
    owl.title = "This hero is the Owl and as owls go being wise and smart, she can reduce the number of possible answers by 1...";
    owl.onclick = function(){HeroClicked(owl.id)};
    document.getElementById('btn_row').appendChild(owl);

    let cat_txt = document.createElement("p");
    cat_txt.id = "cat_txt";
    cat_txt.className = "HeroTxts";
    cat_txt.innerHTML = "<b>Cat's</b> unique power allows her to <b>passivelly gain 1 bonus stock</b> every 10 questions.";
    document.getElementById("txt_row").appendChild(cat_txt);

    let fox_txt = document.createElement("p");
    fox_txt.id = "fox_txt";
    fox_txt.className = "HeroTxts";
    fox_txt.innerHTML = "<b>Fox's</b> unique power allows her to <b>skip one</b> every 10 questions.";
    document.getElementById("txt_row").appendChild(fox_txt);

    let owl_txt = document.createElement("p");
    owl_txt.id = "owl_txt";
    owl_txt.className = "HeroTxts";
    owl_txt.innerHTML = "<b>Owl's</b> unique power allows her to <b>remove one of the wrong answers</b> twice every 10 questions.";
    document.getElementById("txt_row").appendChild(owl_txt);

    let confirm_hero = document.createElement("button");
    confirm_hero.innerHTML = "Confirm hero";
    confirm_hero.id = "confirm_hero";
    confirm_hero.onclick = function(){ConfirmHeroClicked()};
    confirm_hero.disabled = true;
    document.getElementById('middle').appendChild(confirm_hero);
}
