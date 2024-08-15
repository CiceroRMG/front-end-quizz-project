import { AppLayout } from "../../../../components/appLayout/appLayout.js"
import { buttom } from "../../../../components/button/buttom.js"
import { Header } from "../../../../components/header/header.js"
import { Input } from "../../../../components/input/input.js"
import { MainLayout } from "../../../../components/mainLayout/mainLayout.js"
import { Select } from "../../../../components/select/select.js"
import { getOnBackAllProfessor, getOnBackDisciplinaById } from "../../../../scripts/fetchDbFunctions.js"
import { checkIfValidToken } from "../../../../scripts/pushToLoginPage.js"
import { checkTypeUser } from "../../../../scripts/checkTypeUser.js"
import { NavBarAdmin } from "../../navBarAdm.js"
import { eventFocusInputs } from "../../register/subjectsRegister/subjectsFormValidations.js"
import { displayValuesOnInputs, formEditEvent } from "./formEditEvent.js"
import { takeSubjectIdByParams } from "../../../../scripts/alunoFlowPages/disciplinasPage/takeSubjectIdByParams.js"
import { takeIdByParams } from "../studentsEdit/formEditStudent.js"




const subjectsHeader = {
    title: "Edição da Disciplina",
    backBtn: {
        onclick:()=>{
            window.location.href = "/pages/admin/painel/subjectsPainel/subjectsPainel.html"
        }
    }

}

const inputSubjectName = {
    label: "Nome",
    placeholder: "Digite o nome da disciplina",
    id: "inputName",
    error: "Digite um nome válido",
    style: "outline"
}

const selectProfessor = {
    label : "Professor", 
    info : "A disciplina não precisa ter um professor", 
    id : "selectProfessor", 
    placeholder : "Selecione um professor", 
    options : await createProfessorOptions(),
    preSelectedOptions: await preSelectedProfessorValues()
}

const inputSubjectYear = {
    label: "Ano",
    placeholder: "Digite o ano: 2024...",
    id: "inputYear",
    error: "Digite um ano válido",
    style: "outline"
}

const selectYear = {
    label : "Semestre",  
    id : "selectSemester", 
    placeholder : "Selecione um semestre", 
    options : [
        {
            text: "Primeiro" ,
            value: 1
        },
        {
            text: "Segundo" ,
            value: 2
        }
    ],
    preSelectedOptions: await preSelectedSemesterValues() 
}

const submitBtn = {
    text: "Editar", 
    type: "primary-l",
}

function createSideBySideInputsDiv(){
    const div = document.createElement('div')
    div.style.display = "flex"
    div.style.widht = "100%"
    div.style.alignItems = "center"
    div.style.gap = "2rem"
    div.style.paddingLeft = "2.4rem"
    return div
}

function createFormLayout(){
    const form = document.createElement('form')
    form.classList.add('register-form')
    form.style.width = "100%"
    form.style.height = "100%"
    form.style.display = "flex"
    form.style.flexDirection = "column"
    form.style.gap = "3rem"
    return form
}

async function createProfessorOptions(){
    let array = []
    const nullProfessor = {
        text: "Nenhum Professor",
        value: "",
    }
    array.push(nullProfessor)

    const allProfessor = await getOnBackAllProfessor()
    allProfessor.professores.forEach((professor)=>{
        const object = {
            text: professor.nome,
            value: professor._id
        }
        array.push(object)
    })
    return array
}

async function preSelectedProfessorValues() {
    const subjectReq = await getOnBackDisciplinaById(takeIdByParams())
    const subject = subjectReq.disciplina
    
    if(subject.prof_id){

        let professorsValue = []
        let professorsContent = []
    
        professorsValue.push(subject.prof_id._id)
        professorsContent.push(subject.prof_id.nome)
    
        const object = 
        {
            content: professorsContent,
            values: professorsValue
        }
    
        return object

    }   
}

async function preSelectedSemesterValues() {
    const subjectReq = await getOnBackDisciplinaById(takeIdByParams())
    const subject = subjectReq.disciplina
    
    let professorsValue = []
    let professorsContent = []

    professorsValue.push(subject.semestre)
    if(subject.semestre === 1){
        professorsContent.push("Primeiro")
    } else{
        professorsContent.push("Segundo")
    }

    const object = 
    {
        content: professorsContent,
        values: professorsValue
    }

    return object
}

document.addEventListener('DOMContentLoaded', async () => {
    await checkIfValidToken();
    await checkTypeUser('admin')
});

function subjectsEditPage(){
    const div = AppLayout()

    div.append(NavBarAdmin)
    const main = MainLayout()
    div.append(main)

    const headDiv = document.createElement('div')
    headDiv.append(Header(subjectsHeader))
    main.append(headDiv)

    const form = createFormLayout()
    
    const aboveInputDiv = createSideBySideInputsDiv()
    aboveInputDiv.append(Input(inputSubjectName))
    aboveInputDiv.append(Select(selectProfessor))

    const downInputDiv = createSideBySideInputsDiv()
    downInputDiv.append(Input(inputSubjectYear))
    downInputDiv.append(Select(selectYear))

    const submitBtnDiv = document.createElement('div')
    submitBtnDiv.style.display = "flex"
    submitBtnDiv.style.justifyContent = "center"
    submitBtnDiv.style.margin = "auto 0 0 0"
    submitBtnDiv.append(buttom(submitBtn))

    form.append(aboveInputDiv)
    form.append(downInputDiv)
    form.append(submitBtnDiv)
    main.append(form)

    document.body.append(div)
}

subjectsEditPage()

formEditEvent()

eventFocusInputs()
