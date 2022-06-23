class UserController{ 

    constructor(formIdCreate, formIdUpdate, tableId){
        this.formEl = document.getElementById(formIdCreate);
        this.formUpdateEl = document.getElementById(formIdUpdate);
        this.tableId = document.getElementById(tableId);

        this.onSubmit()
        this.onEdit()
    }

    onEdit(){
        document.querySelector("#box-user-update .btn-cancel").addEventListener("click", e=>{
            this.showPanelCreate()
        })

        this.formUpdateEl.addEventListener("submit", e=>{
            e.preventDefault();
            let btn = this.formEl.querySelector("[type=submit]")

            btn.disabled = true

            let values = this.getValues(this.formUpdateEl);

            let index = this.formUpdateEl.dataset.trIndex 

            let tr = this.tableId.rows[index]

            tr.dataset.user = JSON.stringify(values)  

            tr.innerHTML = `
                <tr>
                    <td><img src="dist/img/user1-128x128.jpg" alt="User Image" class="img-circle img-sm"></td>
                    <td>${values.name}</td>
                    <td>${values.email}</td>
                    <td>${values.admin ? "Sim" : "Não"}</td>
                    <td>${Utils.dateFormat(values.register)}</td>
                    <td>
                    <button type="button" class="btn btn-primary btn-edit btn-xs btn-flat">Editar</button>
                    <button type="button" class="btn btn-danger btn-xs btn-flat">Excluir</button>
                    </td>
                </tr>
        `;
            this.addEventTr(tr)

            this.updateCount()
        })
    }

    onSubmit(){

        this.formEl.addEventListener("submit", (e)=>{
            e.preventDefault();

            let btn = this.formEl.querySelector("[type=submit]")

            btn.disabled = true

            let values = this.getValues(this.formEl);

            if(!values) return false;

            this.getPhoto()
            .then((content)=>{
                values.photo = content;

                this.addline(values)

                this.formEl.reset();

                btn.disabled = false;

            }, (e)=>{
                console.log(e)
            })
        });

    }

    getPhoto(callback){

        return new Promise((resolve,reject)=>{

            let fileReader = new FileReader();

            let elements = [...this.formEl.elements].filter(item=>{
                if (item.name === "photo"){
                    return item;
                }
            })

            let file = elements[0].files[0];

            fileReader.onload = ()=>{
                resolve(fileReader.result)
            }

            fileReader.onerror = (e)=>{
                reject(e)
            }
            if(file){
                fileReader.readAsDataURL(file);
            } else{
                resolve('dist/img/boxed.jpg')
            }
            

        })

        
    }

    getValues(formEl){

        let user = {};
        let isValid = true;

        [...formEl.elements].forEach(function(field, index){

            if(['name','email',"password"].indexOf(field.name) > -1 && !field.value){
                field.parentElement.classList.add('has-error');
                isValid = false;
            }

            if(field.name == "gender"){
                if(field.checked){
                    user[field.name] = field.value;
                }
            } else if(field.name == "admin"){
                user[field.name] = field.checked;
            } else{
                user[field.name] = field.value;
            }
        })

        if(!isValid){
            return false;
        }

        return new User(
            user.name,
            user.gender,
            user.birth,
            user.country,
            user.email,
            user.password,
            user.photo,
            user.admin
            );
    }

    addline(dataUser, tableId){

        let tr = document.createElement('tr')

        tr.dataset.user = JSON.stringify(dataUser)
    
        tr.innerHTML = `
            <tr>
                <td><img src="dist/img/user1-128x128.jpg" alt="User Image" class="img-circle img-sm"></td>
                <td>${dataUser.name}</td>
                <td>${dataUser.email}</td>
                <td>${dataUser.admin ? "Sim" : "Não"}</td>
                <td>${Utils.dateFormat(dataUser.register)}</td>
                <td>
                <button type="button" class="btn btn-primary btn-edit btn-xs btn-flat">Editar</button>
                <button type="button" class="btn btn-danger btn-xs btn-flat">Excluir</button>
                </td>
            </tr>
        `;

        this.addEventTr(tr)

        this.tableId.appendChild(tr)

        this.updateCount()
    }

    addEventTr(tr){
        tr.querySelector(".btn-edit").addEventListener("click", e=>{
            let json = JSON.parse(tr.dataset.user)
            let form = document.querySelector("#form-user-update");

            form.dataset.trIndex = tr.sectionRowIndex;

            for (let name in json){

                let field = form.querySelector("[name=" + name.replace("_","") + "]");

                if (field){
                    switch(field.type){
                        case 'file':
                            continue
                            break;

                        case 'radio':
                            field = form.querySelector("[name=" + name.replace("_","") + "][value="+ json[name] + "]");
                        
                        case 'checkbox':
                            field.checked = json[name]

                        default:
                            field.value = json[name];

                    }      
                    
                }
            }
            this.showPanelUpdate()
        })
    }

    showPanelCreate(){
        document.getElementById("box-user-create").style.display = "block"
        document.getElementById("box-user-update").style.display = "none"
    }

    showPanelUpdate(){
        document.getElementById("box-user-create").style.display = "none"
        document.getElementById("box-user-update").style.display = "block"
    }

    updateCount(){
        let numberUsers = 0;
        let numberAdmin = 0;

        [...this.tableId.children].forEach(tr=>{
            numberUsers++

            let user = JSON.parse(tr.dataset.user);

            if(user._admin) numberAdmin++; 
        })

        document.querySelector("#number-users").innerHTML = numberUsers
        document.querySelector("#number-users-admin").innerHTML = numberAdmin
    }
}