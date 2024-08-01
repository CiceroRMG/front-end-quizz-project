import { Toaster } from "../../../../components/toaster/toaster.js";
import { takeSubjectIdByParams } from "../../../../scripts/alunoFlowPages/disciplinasPage/takeSubjectIdByParams.js";
import { editDisciplina, getOnBackDisciplinaById } from "../../../../scripts/fetchDbFunctions.js";
import { inputEmptyValidation } from "../../register/subjectsRegister/subjectsFormValidations.js";

const successToaster = {
    title: "Sucesso!",
    image: "/components/toaster/img/checkCircle.svg",
    subtitle: "Sucesso na edição da disciplina.",
}

const existsToaster = {
    title: "Erro!",
    image: "/components/toaster/img/infoCircle.svg",
    subtitle: "Essa disciplina já existe.",
    style: "info"
}

const errorToaster = {
    title: "Erro!",
    image: "/components/toaster/img/errorCircle.svg",
    subtitle: "Ocorreu algum erro ao criar a disciplina.",
    style: "error"
}

const semesterErrorToaster = {
    title: "Campo Vazio!",
    image: "/components/toaster/img/errorCircle.svg",
    subtitle: "Selecione um semestre!",
    style: "error"
}

let selectedProfessorValue = ""
let selectedSemesterValue = ""

export async function displayValuesOnInputs(){
    const inputSubjectName = document.querySelector('#inputName')
    const inputYear = document.querySelector('#inputYear')
    const selectProfessor = document.querySelector('#selectProfessor')
    const textOfProfessorSelect = selectProfessor.querySelector('.p-select')
    const selectYear = document.querySelector('#selectSemester')
    const textOfSelectYear = selectYear.querySelector('.p-select')

    const takeDisciplinaById = await getOnBackDisciplinaById(takeSubjectIdByParams())

    inputSubjectName.value = takeDisciplinaById.disciplina.nome
    inputYear.value = takeDisciplinaById.disciplina.ano
    selectedSemesterValue = takeDisciplinaById.disciplina.semestre
    textOfSelectYear.innerText = takeDisciplinaById.disciplina.semestre

    if (takeDisciplinaById.disciplina.prof_id) {
        selectedProfessorValue = takeDisciplinaById.disciplina.prof_id._id
        textOfProfessorSelect.innerText = takeDisciplinaById.disciplina.prof_id.nome
    } else{
        selectedProfessorValue = ""
    }
    
}

document.addEventListener('selectProfessor', (event) => {
    selectedProfessorValue = event.detail.values[0];
});

document.addEventListener('selectSemester', (event) => {
    selectedSemesterValue = event.detail.values[0];
});

export async function formEditEvent(){
    await displayValuesOnInputs()

    const form = document.querySelector(".register-form")
        
    form.addEventListener('submit', async (event)=>{
        event.preventDefault()
        let req = {}
    
        const inputSubjectName = document.querySelector('#inputName')
        const inputYear = document.querySelector('#inputYear')
        
        // validações dos formulários
        if(
            !inputEmptyValidation(inputSubjectName.value, '#inputName', '#inputNameError') ||
            !inputEmptyValidation(inputYear.value, '#inputYear', '#inputYearError')
        ) {
            return console.log('Algum dado invalido')
        }

        if(!selectedSemesterValue){
            document.body.append(Toaster(semesterErrorToaster))
            return console.log('Semestre não selecionado');
        }

        // validando se tem professor ou não
        req = {
            nome: inputSubjectName.value,
            prof_id: selectedProfessorValue,
            ano: inputYear.value,
            semestre: selectedSemesterValue
        }
    
        const criandoDisciplina = await editDisciplina(req, takeSubjectIdByParams())
        console.log(criandoDisciplina);
        if(criandoDisciplina.status === 200){
            document.body.append(Toaster(successToaster))
        } else if(criandoDisciplina.status === 409){
            document.body.append(Toaster(existsToaster))
        } else{
            document.body.append(Toaster(errorToaster))
        }
    })
}