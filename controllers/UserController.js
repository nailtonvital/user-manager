class UserController{ 

    constructor(formId, tableId){
        this.formEl = document.getElementById(formId);
        this.tableId = document.getElementById(tableId);

        this.onSubmit()
    }

    onSubmit(){

        this.formEl.addEventListener("submit", (e)=>{
            e.preventDefault();

            let btn = this.formEl.querySelector("[type=submit]")

            btn.disabled = true

            let values = this.getValues();

            this.getPhoto()
            .then((content)=>{
                values.photo = content;

                this.addline(values)

                this.formEl.reset();

                btn.disabled = true;

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

            fileReader.readAsDataURL(file);

        })

        
    }

    getValues(){

        let user = {};

        [...this.formEl.elements].forEach((field, index)=>{
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
    
        tr.innerHTML = `
            <tr>
                <td><img src="dist/img/user1-128x128.jpg" alt="User Image" class="img-circle img-sm"></td>
                <td>${dataUser.name}</td>
                <td>${dataUser.email}</td>
                <td>${dataUser.admin ? "Sim" : "Não"}</td>
                <td>${dataUser.register}</td>
                <td>
                <button type="button" class="btn btn-primary btn-xs btn-flat">Editar</button>
                <button type="button" class="btn btn-danger btn-xs btn-flat">Excluir</button>
                </td>
            </tr>
        `

        this.tableId.appendChild(tr)
    }
}