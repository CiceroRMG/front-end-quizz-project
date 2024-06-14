import { getOnBackQuizzesById } from "../fetchDbFunctions.js"
import { takeQuizzIdByParams } from "./takeQuizzIdByParams.js"
import { backPage } from "../disciplinasPage/backBtn.js"
import { informationsPageOfQuizzModifier } from "./informationsPageOfQuizzModifier.js"

import { getTokenOnLocalStorage } from "../getTokenOnLocalStorage.js"
import { checkUserQuizzRelation } from "./checkIfUserHaveQuizz.js"
import { checkIfValidToken } from "../pushToLoginPage.js"


const loading = document.querySelector('.loader')
const content = document.querySelector('.main')

window.addEventListener('load', ()=>{
    setTimeout(()=>{
        loading.classList.add('hidden')
        content.classList.remove('hidden')
        content.classList.add('fade-in')
    }, 500)
})

document.addEventListener('DOMContentLoaded', async () => {
    console.log("Verificando token na inicialização");
    await checkIfValidToken();
});

const token = getTokenOnLocalStorage()
backPage()

// verifica se o usuario possui a disciplina que contem o quizz em questão
checkUserQuizzRelation(token)


// pega o quizz no BD por ID parametro e coloca todas as informações na página do quiz
const takeQuizzById = getOnBackQuizzesById(takeQuizzIdByParams())
takeQuizzById.then(objeto => informationsPageOfQuizzModifier(objeto.quizz))


