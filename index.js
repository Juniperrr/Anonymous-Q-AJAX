// TODO 
// Add client side JavaScript
//
// 7
function createAnswer(questionID) {
  const xhr = new XMLHttpRequest();
  // answer text = input box value
  const answer = document.querySelector('#answer-text').value;
  console.log('answer', answer);
  // configure: open post to json
  const url = "http://localhost:3000/questions/" + questionID + "/answers/";
  xhr.open('POST', url, true); // send the a to the server
  // 3. what to do on success (and error)
  xhr.addEventListener("load", () => {
    if (xhr.status >= 200 && xhr.status < 300) {
      getQnA();
    }
    else {
      alert('ERROR: could not save your answer!');
    }
  });
  // another option (below)
  // xhr.onreadystatechange = () => {
  //   if (xhr.readyState === XMLHttpRequest.DONE) {
  //     if (xhr.status >= 200 && xhr.status < 300) {
  //       getQnA();
  //     }
  //     else {
  //       alert('ERROR: could not save your answer!');
  //     }
  //   }
  // };
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
  // send as key=value string
  xhr.send('answer=' + encodeURIComponent(answer));
}

// 6
function interfaceQnA(QnAresult) { //QnAresult = json > str parsed
  const displayDiv = document.querySelector('.display');
  displayDiv.innerHTML = ""; // clears client side = reset

  // May have to repeat this FOR EACH QUESTION (need an index)
  for (let i = 0; i < QnAresult.length; i++) {
    const questionDiv = document.createElement('div');
    questionDiv.className='questionDiv';
    const questionText = document.createElement('h3');	
    questionText.className='questionText';
    questionDiv.appendChild(questionText);
    questionText.textContent = QnAresult[i].question;
    
    // get all answers (each element of an array)
    for (let j = 0; j < QnAresult[i].answers.length; j++) {
      const answerDiv = document.createElement('div');
      answerDiv.className='answerDiv';
      const answerText = document.createElement('p');	
      answerText.className='answerText';
      answerText.textContent = QnAresult[i].answers[j];
    
      answerDiv.appendChild(answerText);
      questionDiv.appendChild(answerDiv);
    }
    const addAnswerBtn = document.createElement("button");
    addAnswerBtn.textContent = "Add Answer";
    questionDiv.appendChild(addAnswerBtn);

    displayDiv.appendChild(questionDiv);

    addAnswerBtn.addEventListener("click", function() {
      document.getElementById("modal-answer").style.display = "block";
      document.getElementById("cancel-create-answer").addEventListener("click",function(){
        document.getElementById("modal-answer").style.display = "none";
      });
      document.getElementById("create-answer").addEventListener("click",function(){
        createAnswer(QnAresult[i]._id);
        document.getElementById("modal-answer").style.display = "none"
        //console.log(question.id)
      });
    });
  }    
}
// 5
function getQnA() { // = init
  // 1. crate a new xhr object (your request)
  const xhr = new XMLHttpRequest();
  const QnAurl = "http://localhost:3000/questions";
  // 2. configure (does not actually send)
  xhr.open('GET', QnAurl, false); // not async
  // 3. what to do on success (and error)
  xhr.addEventListener('load', function() {
    if (xhr.status >= 200 && xhr.status < 300) {
      const QnAresult = JSON.parse(xhr.responseText); //json rersponse parsed into str
      console.log('before interface');
      interfaceQnA(QnAresult);
      console.log('after interface');
    } 
    else {
      alert('ERROR: did not get status code 200!');
    }
  });
  // 4. req.sendto actually make rquest
  xhr.send(); // call without any params.
}
// 3
function createQuestion() {
  var xhr= new XMLHttpRequest();
  // question text = input box value
  const question = document.querySelector("#question-text").value;
  console.log('question', question);
  // configure: open post to json
  const url = "http://localhost:3000/questions";
  xhr.open('POST', url, true); // send the q to the server
  // 3. what to do on success (and error)
  xhr.addEventListener("load", () => {
    if (xhr.status >= 200 && xhr.status < 300) {
      getQnA();
    }
    else {
      alert('ERROR: could not save your question!');
    }
  });
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
  // send as key=value string
  xhr.send('question=' + encodeURIComponent(question)); // 'component': not for the entire url
  // getQnA();
}
/*
  const url = "http://localhost:3000/questions";
  xhr.open('POST', url, true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  // send as json..?
  let obj = {data: question};
  xhr.send(JSON.stringify(obj));
  */

// 2
function handleAsk(evt) {
  createQuestion();
  console.log('created question');
  document.getElementById("modal-question").style.display = "none"; // hide input after clicking 'ASK'
}
// 4
function handleCancel(evt) {
  document.getElementById("modal-question").style.display = "none" // hide input after clicking 'CANCEL'
}
// 1
function main() {
  // Once the first button is clicked, decide to ASK or CANCEL.
  document.getElementById("btn-show-modal-question").addEventListener("click", function() { // Proceed to the next step.
    
    document.getElementById("modal-question").style.display = "block";
    document.getElementById("create-question").addEventListener("click",handleAsk); // Create a question if pressed 'ASK'
    document.getElementById("cancel-create-question").addEventListener("click",handleCancel); // Cancel it if pressed 'CANCEL'
  });
  getQnA();
}

document.addEventListener("DOMContentLoaded", main);
