'use strict';

//Training Class: Represents a Training
class Training{
    constructor(menu, weight, times) {
        this.menu = menu;
        this.weight = weight;
        this.times = times;
    }
}
//UI Class: Handle UI Tasks
class UI{
    static displayTraining() {
        const trainings = Store.getTraining();

        trainings.forEach((training) => UI.addTrainingToList(training));
    }

    static addTrainingToList(training) {
        const list = document.querySelector('#training-list');

        const row = document.createElement('tr');

        row.innerHTML = `
        <td>${training.menu}</td>
        <td>${training.weight}</td>
        <td>${training.times}</td>
        <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
        `;

        list.appendChild(row);
    }

    static deleteTraining(el) {     //el:element
        if (el.classList.contains('delete')) {
            el.parentElement.parentElement.remove();
        }
    }



    static showAlert(message,className) {
        const div = document.createElement('div');
        div.className = `alert alert-${className}`; //<div class alert alert-(classname)></div>
        div.appendChild(document.createTextNode(message)); //<div class alert alert-(classname)>message</div>
        const container = document.querySelector('.container');
        const form = document.querySelector('#training-form');
        container.insertBefore(div, form); // <tbody id="book-list"><div class alert alert-(classname)>message</div></tbody>
        //Vanish in 3 seconds
        setTimeout(() => document.querySelector('.alert').remove(), 3000);
    }

    static clearFields() {
        document.querySelector('#menu').value = ''; 
        document.querySelector('#weight').value = ''; 
        document.querySelector('#times').value = ''; 
    }
}
//Store Class: Handles Storage
class Store{
    static getTraining() {
        let trainings;
        if (localStorage.getItem('trainings') === null) {  //localStorageからデータを取得するには、getItem()メソッドを使います。
            trainings = [];
        } else {
            trainings = JSON.parse(localStorage.getItem('trainings'));  //JSON.parse:JSONを解析する、JSONを読み込む,JSON→JavaScriptオブジェクトにする     
        }

        return trainings;
    }

    static addTraining(training) {
        const trainings = Store.getTraining();
        trainings.push(training);
        localStorage.setItem('trainings', JSON.stringify(trainings)); //JavaScriptのオブジェクトをJSONに変換するには、stringfyを使う。
    }

    static removeTraining(times) {
        const trainings = Store.getTraining();

        trainings.forEach((training, index) => {
            if (training.times === times) {
                trainings.splice(index, 1); //indexから1つ削除
            }
        });
        localStorage.setItem('trainings', JSON.stringify(trainings));
    }
}
//Event: Desplay Trainings
document.addEventListener('DOMContentLoaded', UI.displayTraining); //DOMContentLoadedイベントはDOMツリーの構築が完了した時点で発火されます。一方、loadイベントはDOMツリーに加えて画像やすべてのスクリプトが読み込まれた時点で発火されます。よって特に画像に関する処理を行わない限りページの初期化はDOMContentLoadedイベントを利用するのが良いでしょう。
//Event: Add a Training
document.querySelector('#training-form').addEventListener('submit', (e) => {  //e:event
    //prevent actual submit
    e.preventDefault(); //Event インターフェースの preventDefault() メソッドは、ユーザーエージェントに、イベントが明示的に処理されない場合にその既定のアクションを通常どおりに行うべきではないことを伝えます。
    //Get form values
    const menu = document.querySelector('#menu').value;
    const weight = document.querySelector('#weight').value;
    const times = document.querySelector('#times').value;

    //validate
    if (menu === '' || weight === '' || times === '') {
        UI.showAlert('全てに記入してください','danger');
    } else {
    //Instatiate training //インスタンス化
    const training = new Training(menu, weight, times);
    
    //Add Training to UI
    UI.addTrainingToList(training);
        
    //Add training to store
    Store.addTraining(training);
        
    //Show success message
    UI.showAlert('追加されました', 'success');

    //Clear fields
    UI.clearFields();
    }
})
//Event: Remove a Training
document.querySelector('#training-list').addEventListener('click', (e) => {
    //Remove training from UI
    UI.deleteTraining(e.target);

    //Remove training from store   //store:リロードしても消えない
    Store.removeTraining(e.target.parentElement.previousElementSibling.textContent);

     //Show success message
     UI.showAlert('削除されました', 'success');
})