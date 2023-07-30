async function getClients() {
    let response = await fetch('http://localhost:3000/api/clients');
    let data = response.json();
    return data;
}

async function getOneClient(id) {
    let response = await fetch('http://localhost:3000/api/clients/' + id);
    let data = response.json();
    return data;
}

async function deleteClient(id) {
    let response = await fetch('http://localhost:3000/api/clients/' + id, {
        method: "DELETE",
    })
    let data = await response.json();
}

let contactsArr = 0;
let contactsArrModalChange = 0;

const $siteMane = document.querySelector('.mane');

const $btnAddClient = document.querySelector('.btn__add-user');
const $tableBody = document.querySelector('.table__body');
const $modalWindow = document.querySelector('.modal-window');
const $modalWindowExit = document.querySelector('.modal-window__btn-exit');
const $modalWindowBtnSave = document.querySelector('.modal-window__btn-save');
const $phoneSite = document.querySelector('.site-phone');
const $btnAddContact = document.querySelector('.modal-window__btn-contact');
const $modalWindowBox = document.querySelector('.modal-window__bcg');

const $inputName = document.querySelector('.modal-window__input-name');
const $inputSurname = document.querySelector('.modal-window__input-surname');
const $inputLastname = document.querySelector('.modal-window__input-lastname');
const $modalWindowBtnReset = document.querySelector('.modal-window__btn-reset');

const $btnSortId = document.querySelector('.table__head-btn__id');
const $btnSortFio = document.querySelector('.table__head-btn__fio');
const $btnSortCreated = document.querySelector('.table__head-btn__created');
const $btnSortChanged = document.querySelector('.table__head-btn__changed');

const $headerSearch = document.querySelector('.header__search');

let sortBooleanFlag = true;
let sortTextFlag;

/***********Функция генерации всех пользователей ***************/
async function renderClients() {
    $tableBody.innerHTML = '';
    let data = await (getClients());
    let arrConverted = data;

    /************Подготовка к отрисовке***************/
    for (let client of arrConverted) {

        client.FIO = client.name[0].toUpperCase() + client.name.substring(1) + ' '
            + client.surname[0].toUpperCase() + client.surname.substring(1) + ' '
            + client.lastName[0].toUpperCase() + client.lastName.substring(1);



        const modifyCreatedTime = new Date(client.createdAt);
        const createdClientYear = modifyCreatedTime.getFullYear();
        let createdClientMonth = String(modifyCreatedTime.getMonth() + 1);

        if (createdClientMonth.length < 2) {
            createdClientMonth = '0' + createdClientMonth;
        }

        let createdClientDay = String(modifyCreatedTime.getDate());

        if (createdClientDay.length < 2) {
            createdClientDay = '0' + createdClientDay;
        }

        const createdClientHours = String(modifyCreatedTime.getHours());
        let createdClientMinutes = String(modifyCreatedTime.getMinutes());

        if (createdClientMinutes.length < 2) {
            createdClientMinutes = '0' + createdClientMinutes;
        }

        client.createdTime = createdClientDay + '.' + createdClientMonth + '.' + createdClientYear;
        client.createClientHoursAndMinutes = createdClientHours + ':' + createdClientMinutes;

        client.dateAndTimeCreated = client.createdTime + ' ' + client.createClientHoursAndMinutes;

        let modifyUpdateTime = new Date(client.updatedAt);
        const updateClientYear = modifyUpdateTime.getFullYear();
        let updateClientMonth = String(modifyUpdateTime.getMonth() + 1);
        if (updateClientMonth.length < 2) {
            updateClientMonth = '0' + updateClientMonth;
        }

        let updateClientDay = String(modifyUpdateTime.getDate());
        if (updateClientDay.length < 2) {
            updateClientDay = '0' + updateClientDay;
        }

        const updatedClientHours = String(modifyUpdateTime.getHours());
        let updatedClientMinutes = String(modifyUpdateTime.getMinutes());

        if (updatedClientMinutes.length < 2) {
            updatedClientMinutes = '0' + updatedClientMinutes;
        }

        client.updatedTime = updateClientDay + '.' + updateClientMonth + '.' + updateClientYear;
        client.updateClientHoursAndMinutes = updatedClientHours + ':' + updatedClientMinutes;

        client.dateAndTimeUpdated = client.updatedTime + ' ' + client.updateClientHoursAndMinutes;
    }

    if ($headerSearch.value.trim() !== '') {
        arrConverted = arrConverted.filter(item => item.FIO.toLowerCase().includes($headerSearch.value.toLowerCase())
            || item.id.includes($headerSearch.value.toLowerCase())
            || item.dateAndTimeCreated.includes($headerSearch.value.toLowerCase())
            || item.dateAndTimeUpdated.includes($headerSearch.value.toLowerCase()));
    }

    arrConverted.sort((a, b) => {
        if (sortBooleanFlag === true) {
            if (a[sortTextFlag] > b[sortTextFlag]) {
                return 1;
            } else {
                return -1;
            }
        } else {
            if (a[sortTextFlag] > b[sortTextFlag]) {
                return -1;
            } else {
                return 1;
            }
        }
    })

    for (let client of arrConverted) {
        renderOneClient(client);
    }
}

$btnAddClient.addEventListener('click', () => {
    modalWindowState();
    $btnAddContact.classList.remove('modal-window__btn-contact--active');
})

/*************Функция отрисовки одного клиента **************************/
function renderOneClient(client) {
    const $tableBodyTr = document.createElement('tr');
    const $tableBodyTdId = document.createElement('td');
    const $tableBodyTdFio = document.createElement('td');
    const $tableBodyTdCreateTime = document.createElement('td');
    const $tableBodyTdCreateTimeSpan = document.createElement('span');
    const $tableBodyTdCreateDateSpan = document.createElement('span');
    const $tableBodyTdModifyTime = document.createElement('td');
    const $tableBodyTdModifyTimeSpan = document.createElement('span');
    const $tableBodyTdModifyDateSpan = document.createElement('span');
    const $tableBodyTdContacts = document.createElement('td');
    const $tableBodyTdModifyAndDelete = document.createElement('td');
    const $tableBodyTdModifyButton = document.createElement('button');
    const $tableBodyTdDeleteButton = document.createElement('button');

    const $tableBodyTdDeleteButtonSvg = `<svg class="tbody__td-delete__btn-svg" width="12" height="12" style="margin-right: 3px" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 0C2.682 0 0 2.682 0 6C0 9.318 2.682 12 6 12C9.318 12 12 9.318 12 6C12 2.682 9.318 0 6 0ZM6 10.8C3.354 10.8 1.2 8.646 1.2 6C1.2 3.354 3.354 1.2 6 1.2C8.646 1.2 10.8 3.354 10.8 6C10.8 8.646 8.646 10.8 6 10.8ZM8.154 3L6 5.154L3.846 3L3 3.846L5.154 6L3 8.154L3.846 9L6 6.846L8.154 9L9 8.154L6.846 6L9 3.846L8.154 3Z"/>
    </svg>Удалить`;

    const $tableBodyTdModifyButtonSvg = `<svg class="tbody__td-modify__btn-svg" width="13" height="13" style="margin-right: 3px" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M0 10.5V13H2.5L9.87333 5.62662L7.37333 3.12662L0 10.5ZM11.8067 3.69329C12.0667 3.43329 12.0667 3.01329 11.8067 2.75329L10.2467 1.19329C9.98667 0.933291 9.56667 0.933291 9.30667 1.19329L8.08667 2.41329L10.5867 4.91329L11.8067 3.69329Z"/>
    </svg>Изменить`;

    const $contactIconVk = `<svg width="16" height="16"  viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g opacity="0.7">
    <path d="M8 0C3.58187 0 0 3.58171 0 8C0 12.4183 3.58187 16 8 16C12.4181 16 16 12.4183 16 8C16 3.58171 12.4181 0 8 0ZM12.058 8.86523C12.4309 9.22942 12.8254 9.57217 13.1601 9.97402C13.3084 10.1518 13.4482 10.3356 13.5546 10.5423C13.7065 10.8371 13.5693 11.1604 13.3055 11.1779L11.6665 11.1776C11.2432 11.2126 10.9064 11.0419 10.6224 10.7525C10.3957 10.5219 10.1853 10.2755 9.96698 10.037C9.87777 9.93915 9.78382 9.847 9.67186 9.77449C9.44843 9.62914 9.2543 9.67366 9.1263 9.90707C8.99585 10.1446 8.96606 10.4078 8.95362 10.6721C8.93577 11.0586 8.81923 11.1596 8.43147 11.1777C7.60291 11.2165 6.81674 11.0908 6.08606 10.6731C5.44147 10.3047 4.94257 9.78463 4.50783 9.19587C3.66126 8.04812 3.01291 6.78842 2.43036 5.49254C2.29925 5.2007 2.39517 5.04454 2.71714 5.03849C3.25205 5.02817 3.78697 5.02948 4.32188 5.03799C4.53958 5.04143 4.68362 5.166 4.76726 5.37142C5.05633 6.08262 5.4107 6.75928 5.85477 7.38684C5.97311 7.55396 6.09391 7.72059 6.26594 7.83861C6.45582 7.9689 6.60051 7.92585 6.69005 7.71388C6.74734 7.57917 6.77205 7.43513 6.78449 7.29076C6.82705 6.79628 6.83212 6.30195 6.75847 5.80943C6.71263 5.50122 6.53929 5.30218 6.23206 5.24391C6.07558 5.21428 6.0985 5.15634 6.17461 5.06697C6.3067 4.91245 6.43045 4.81686 6.67777 4.81686L8.52951 4.81653C8.82136 4.87382 8.88683 5.00477 8.92645 5.29874L8.92808 7.35656C8.92464 7.47032 8.98521 7.80751 9.18948 7.88198C9.35317 7.936 9.4612 7.80473 9.55908 7.70112C10.0032 7.22987 10.3195 6.67368 10.6029 6.09801C10.7279 5.84413 10.8358 5.58142 10.9406 5.31822C11.0185 5.1236 11.1396 5.02785 11.3593 5.03112L13.1424 5.03325C13.195 5.03325 13.2483 5.03374 13.3004 5.04274C13.6009 5.09414 13.6832 5.22345 13.5903 5.5166C13.4439 5.97721 13.1596 6.36088 12.8817 6.74553C12.5838 7.15736 12.2661 7.55478 11.9711 7.96841C11.7001 8.34652 11.7215 8.53688 12.058 8.86523Z" fill="#9873FF"/>
    </g>
    </svg>
    `;

    const $contactIconFacebook = `<svg width="16" height="16"  viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g opacity="0.7">
    <path d="M7.99999 0C3.6 0 0 3.60643 0 8.04819C0 12.0643 2.928 15.3976 6.75199 16V10.3775H4.71999V8.04819H6.75199V6.27309C6.75199 4.25703 7.94399 3.14859 9.77599 3.14859C10.648 3.14859 11.56 3.30121 11.56 3.30121V5.28514H10.552C9.55999 5.28514 9.24799 5.90362 9.24799 6.53815V8.04819H11.472L11.112 10.3775H9.24799V16C11.1331 15.7011 12.8497 14.7354 14.0879 13.2772C15.3261 11.819 16.0043 9.96437 16 8.04819C16 3.60643 12.4 0 7.99999 0Z" fill="#9873FF"/>
    </g>
    </svg>
    `;

    const $contactIconTel = `<svg width="16" height="16"  viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g opacity="0.7">
    <circle cx="8" cy="8" r="8" fill="#9873FF"/>
    <path d="M11.56 9.50222C11.0133 9.50222 10.4844 9.41333 9.99111 9.25333C9.83556 9.2 9.66222 9.24 9.54222 9.36L8.84444 10.2356C7.58667 9.63556 6.40889 8.50222 5.78222 7.2L6.64889 6.46222C6.76889 6.33778 6.80444 6.16444 6.75556 6.00889C6.59111 5.51556 6.50667 4.98667 6.50667 4.44C6.50667 4.2 6.30667 4 6.06667 4H4.52889C4.28889 4 4 4.10667 4 4.44C4 8.56889 7.43556 12 11.56 12C11.8756 12 12 11.72 12 11.4756V9.94222C12 9.70222 11.8 9.50222 11.56 9.50222Z" fill="white"/>
    </g>
    </svg>
    `;

    const $contactIconEmail = `<svg width="16" height="16"  viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path opacity="0.7" fill-rule="evenodd" clip-rule="evenodd" d="M8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16ZM4 5.75C4 5.3375 4.36 5 4.8 5H11.2C11.64 5 12 5.3375 12 5.75V10.25C12 10.6625 11.64 11 11.2 11H4.8C4.36 11 4 10.6625 4 10.25V5.75ZM8.424 8.1275L11.04 6.59375C11.14 6.53375 11.2 6.4325 11.2 6.32375C11.2 6.0725 10.908 5.9225 10.68 6.05375L8 7.625L5.32 6.05375C5.092 5.9225 4.8 6.0725 4.8 6.32375C4.8 6.4325 4.86 6.53375 4.96 6.59375L7.576 8.1275C7.836 8.28125 8.164 8.28125 8.424 8.1275Z" fill="#9873FF"/>
    </svg>
    `;

    const $contactIconOther = `<svg width="16" height="16"  viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g opacity="0.7">
    <path fill-rule="evenodd" clip-rule="evenodd" d="M8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16ZM3 8C3 5.24 5.24 3 8 3C10.76 3 13 5.24 13 8C13 10.76 10.76 13 8 13C5.24 13 3 10.76 3 8ZM9.5 6C9.5 5.17 8.83 4.5 8 4.5C7.17 4.5 6.5 5.17 6.5 6C6.5 6.83 7.17 7.5 8 7.5C8.83 7.5 9.5 6.83 9.5 6ZM5 9.99C5.645 10.96 6.75 11.6 8 11.6C9.25 11.6 10.355 10.96 11 9.99C10.985 8.995 8.995 8.45 8 8.45C7 8.45 5.015 8.995 5 9.99Z" fill="#9873FF"/>
    </g>
    </svg>
    `;

    $tableBodyTr.classList.add('tbody__tr');
    $tableBodyTdCreateTimeSpan.classList.add('tbody__td-time__span');
    $tableBodyTdCreateDateSpan.classList.add('tbody__td-date__span');
    $tableBodyTdModifyTimeSpan.classList.add('tbody__td-time__span');
    $tableBodyTdModifyDateSpan.classList.add('tbody__td-date__span');
    $tableBodyTdId.classList.add('tbody__td-id');
    $tableBodyTdFio.classList.add('tbody__td-fio');
    $tableBodyTdCreateTime.classList.add('tbody__td-create__time');
    $tableBodyTdModifyTime.classList.add('tbody__td-modify__time');
    $tableBodyTdContacts.classList.add('tbody__td-contacts');
    $tableBodyTdModifyAndDelete.classList.add('tbody__td-modify');
    $tableBodyTdModifyButton.classList.add('btn-reset');
    $tableBodyTdModifyButton.classList.add('tbody__td-modify__btn');
    $tableBodyTdDeleteButton.classList.add('btn-reset');
    $tableBodyTdDeleteButton.classList.add('tbody__td-delete__btn');

    $tableBodyTdCreateTimeSpan.textContent = client.createClientHoursAndMinutes;
    $tableBodyTdCreateDateSpan.textContent = client.createdTime;
    $tableBodyTdModifyTimeSpan.textContent = client.updateClientHoursAndMinutes;
    $tableBodyTdModifyDateSpan.textContent = client.updatedTime;
    $tableBodyTdModifyButton.textContent = 'Изменить';
    $tableBodyTdDeleteButton.textContent = 'Удалить';

    if (client.contacts.length != 0) {
        const $contactsList = document.createElement('ul');
        $contactsList.classList.add('list-reset');
        $contactsList.classList.add('contacts__list');
        $tableBodyTdContacts.classList.add('tbody__td-contacts__modified');
        let contactNum = 0;
        let contactFlag = true;
        for (let contact of client.contacts) {
            contactNum = contactNum + 1;
            let $contactsItem = document.createElement('li');
            $contactsItem.classList.add('contacts__item');

            if (contact.type == 'Email') {
                $contactsItem.innerHTML = $contactIconEmail;
            } else if (contact.type == 'Телефон') {
                $contactsItem.innerHTML = $contactIconTel;
            } else if (contact.type == 'Facebook') {
                $contactsItem.innerHTML = $contactIconFacebook;
            } else if (contact.type == 'VK') {
                $contactsItem.innerHTML = $contactIconVk;
            } else {
                $contactsItem.innerHTML = $contactIconOther;
            }
            $contactsList.append($contactsItem);
            $tableBodyTdContacts.append($contactsList);

            if (contactNum > 4) {
                $contactsItem.classList.add('contacts__item--display');

                let $contactsItemDisplayNum = client.contacts.length - 4;

                if (contactFlag === true) {

                    const $contactsItemPlus = document.createElement('li');
                    $contactsItemPlus.classList.add('contacts__item');
                    $contactsItemPlus.classList.add('contacts__item-plus');
                    $contactsItemPlus.innerHTML = `<svg class="contact__item-plus__svg" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="8" cy="8" r="7.5" stroke="#9873FF"/>
                    </svg>`;


                    const $contactsItemPlusNum = document.createElement('span');
                    $contactsItemPlusNum.classList.add('contacts__item-plus__num');
                    $contactsItemPlusNum.innerHTML = '+' + `${$contactsItemDisplayNum}`;


                    $contactsItemPlus.append($contactsItemPlusNum);
                    $contactsList.append($contactsItemPlus);
                    contactFlag = false;

                    $contactsItemPlus.addEventListener('click', () => {
                        $contactsList.querySelectorAll('.contacts__item--display').forEach((el) => {
                            el.classList.remove('contacts__item--display');
                            $contactsItemPlus.remove();
                        })
                    })
                }
            }

            const $contactsSvg = $contactsItem.querySelector('svg');
            $contactsSvg.addEventListener('mouseover', () => {
                if ($contactsItem.querySelector('.tooltip__body') !== null) {
                    return;
                } else {
                    const $tooltipBody = document.createElement('div');
                    const $tooltipArrow = document.createElement('div');

                    $tooltipBody.textContent = contact.type + ':' + ' ' + contact.value;

                    $tooltipBody.classList.add('tooltip__body');
                    $tooltipArrow.classList.add('tooltip__arrow');

                    $contactsItem.append($tooltipBody);
                    $contactsItem.append($tooltipArrow);
                }

            })

            $contactsSvg.addEventListener('mouseout', () => {
                if ($contactsItem.querySelector('.tooltip__body') == null) {
                    return;
                } else {
                    const $tooltipBody = document.querySelector('.tooltip__body');
                    const $tooltipArrow = document.querySelector('.tooltip__arrow');
                    $tooltipBody.classList.add('tooltip__body--reverse');
                    $tooltipArrow.classList.add('tooltip__arrow--reverse');
                    if ($tooltipBody) { $tooltipBody.remove(); }
                    if ($tooltipArrow) { $tooltipArrow.remove(); }
                }
            })

        }
    }

    $tableBodyTdModifyButton.innerHTML = $tableBodyTdModifyButtonSvg;
    $tableBodyTdDeleteButton.innerHTML = $tableBodyTdDeleteButtonSvg;

    $tableBodyTdModifyAndDelete.append($tableBodyTdModifyButton);
    $tableBodyTdModifyAndDelete.append($tableBodyTdDeleteButton);
    
    $tableBodyTdId.textContent = client.id.substring(7);
    $tableBodyTdFio.textContent = client.FIO;

    $tableBodyTdCreateTime.append($tableBodyTdCreateDateSpan)
    $tableBodyTdModifyTime.append($tableBodyTdModifyDateSpan)

    $tableBodyTdCreateTime.append($tableBodyTdCreateTimeSpan);
    $tableBodyTdModifyTime.append($tableBodyTdModifyTimeSpan);

    $tableBodyTr.append($tableBodyTdId);
    $tableBodyTr.append($tableBodyTdFio);
    $tableBodyTr.append($tableBodyTdCreateTime);
    $tableBodyTr.append($tableBodyTdModifyTime);
    $tableBodyTr.append($tableBodyTdContacts);
    $tableBodyTr.append($tableBodyTdModifyAndDelete);

    $tableBody.append($tableBodyTr);

    $tableBodyTdDeleteButton.addEventListener('click', () => {
        const deleteWindow = createDeleteWindow();

        deleteWindow.$deleteWindowBtnDelete.addEventListener('click', () => {
            $tableBodyTr.remove();
            deleteClient(client.id);

            deleteWindow.$deleteWindowBody.classList.add('delete__window-box--reverse');
            setTimeout(() => {
                deleteWindow.$deleteWindowBodyPhone.remove();
            }, 300);

        });

        deleteWindow.$deleteWindowBtnCancel.addEventListener('click', () => {
            deleteWindow.$deleteWindowBody.classList.add('delete__window-box--reverse');
            setTimeout(() => {
                deleteWindow.$deleteWindowBodyPhone.remove();
            }, 300);
        })
    })

    $tableBodyTdModifyButton.addEventListener('click', async () => {
        $modalWindowModalChange.classList.toggle('modal__change-window--active');
        $phoneSiteModalChange.classList.toggle('site__change-phone--active');

        $inputNameModalChange.value = client.name;
        $inputSurnameModalChange.value = client.surname;
        $inputLastnameModalChange.value = client.lastName;
        let $modalChangeWindowId = document.querySelector('.modal-window__id');
        $modalChangeWindowId.textContent = 'ID:' + ' ' + client.id;
        $modalWindowBtnSaveModalChange.dataset.id = `${client.id}`;

        if (client.contacts.length != 0) {
            $btnAddContactModalChange.classList.remove("modal__change-window__block2--active");
            $modalWindowBoxModalChange.classList.add('modal__change-window__bcg--active');
            contactsArrModalChange = 0;
            client.contacts.forEach((item) => {
                contactsArrModalChange = contactsArrModalChange + 1;
                addOneContactModalChange(item.type, item.value);
            })
        }
        if (contactsArrModalChange < 10) {
            $btnAddContactModalChange.classList.remove('modal__change-window__btn-contact--active');
        }
    })

}

let name = true;
let surname = true;
let lastname = true;

/*****************Кнопки для модального окна создания пользователя ********************/
function actionsModalWindow() {

    $modalWindowExit.addEventListener('click', () => {
        modalWindowState();
    })

    $btnAddContact.addEventListener('click', () => {
        $modalWindowBox.classList.add('modal-window__bcg--active');
        addOneContact();
        contactsArr = contactsArr + 1;
        if (contactsArr >= 10) {
            $btnAddContact.classList.add('modal-window__btn-contact--active');
            return;
        }
        if (!$btnAddContact.classList.contains("modal-window__block2--active")) {
            $btnAddContact.classList.add("modal-window__block2--active");
        }
    })

    $modalWindowBtnReset.addEventListener('click', () => {
        let allContactBoxes = document.querySelectorAll('.contact__box');
        if (allContactBoxes.length == 0 && $inputName.value == '' && $inputSurname.value == '' && $inputLastname.value == '') {
            modalWindowState();
            if ($inputName.nextElementSibling.tagName.toLowerCase() == 'h3') {
                $inputName.nextSibling.remove();
                name = true;
            }
            if ($inputSurname.nextElementSibling.tagName.toLowerCase() == 'h3') {
                $inputSurname.nextSibling.remove();
                surname = true;
            }
            if ($inputLastname.nextElementSibling.tagName.toLowerCase() == 'h3') {
                $inputLastname.nextSibling.remove();
                lastname = true;
            }
            return;
        }

        let answer = confirm('Вы действительно хотите отменить все изменения?');
        if (answer == false) {
            return;
        } else {
            cleanModalWindow();
            $btnAddContact.classList.remove('modal-window__btn-contact--active');
        }

        if ($inputName.nextElementSibling.tagName.toLowerCase() == 'h3') {
            $inputName.nextSibling.remove();
            name = true;
        }
        if ($inputSurname.nextElementSibling.tagName.toLowerCase() == 'h3') {
            $inputSurname.nextSibling.remove();
            surname = true;
        }
        if ($inputLastname.nextElementSibling.tagName.toLowerCase() == 'h3') {
            $inputLastname.nextSibling.remove();
            lastname = true;
        }
    })

    $modalWindowBtnSave.addEventListener('click', async (ev) => {
        ev.preventDefault();
        let contactInput = document.querySelectorAll('.contact__input');
        if ($inputName.value == '' && name === true) {
            createError($inputName);
            name = false;
        } else if ($inputName.value !== '') {
            if ($inputName.nextElementSibling.tagName.toLowerCase() == 'h3') {
                $inputName.nextSibling.remove();
            }
            name = true;
        }

        if ($inputSurname.value == '' && surname === true) {
            createError($inputSurname);
            surname = false;
        } else if ($inputSurname.value !== '') {
            if ($inputSurname.nextElementSibling.tagName.toLowerCase() == 'h3') {
                $inputSurname.nextSibling.remove();
            }
            surname = true;
        }

        if ($inputLastname.value == '' && lastname === true) {
            createError($inputLastname);
            lastname = false;
        } else if ($inputLastname.value !== '') {
            if ($inputLastname.nextElementSibling.tagName.toLowerCase() == 'h3') {
                $inputLastname.nextSibling.remove();
            }
            lastname = true;
        }

        for (let input of contactInput) {
            if (input.value == '' && !input.hasAttribute('data-value', 'true')) {
                input.dataset.value = 'true';
                const $errorText = document.createElement('h3');
                $errorText.classList.add('error__text-number');
                $errorText.textContent = 'Вы не заполнили контакт';
                input.after($errorText);
            } else if (input.value !== '') {
                if (input.nextElementSibling.tagName.toLowerCase() == 'h3') {
                    input.nextElementSibling.remove();
                }

            }
        }

        if ($inputName.value !== '' && $inputSurname.value !== '' && $inputLastname.value !== '' && Array.prototype.slice.call(contactInput).every(input => input.value !== '')) {
            let response = await fetch('http://localhost:3000/api/clients', {
                method: 'POST',
                body: JSON.stringify({
                    name: $inputName.value.trim(),
                    surname: $inputSurname.value.trim(),
                    lastName: $inputLastname.value.trim(),
                    contacts: userContactsPreparation(),
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            let data = await response.json();
            cleanModalWindow();
            modalWindowState();
            renderClients();
        }
    })
}

function modalWindowState() {
    $modalWindow.classList.toggle('modal-window--active');
    $phoneSite.classList.toggle('site-phone--active');
}

function modalWindowChangeState() {
    $modalWindowModalChange.classList.toggle('modal__change-window--active');
    $phoneSiteModalChange.classList.toggle('site__change-phone--active');
}

/*************Создание ошибки при пустом или недопустимом вводе**************/
function createError(element) {
    const $errorText = document.createElement('h3');
    $errorText.classList.add('error__text')
    if (element === $inputName) {
        $errorText.textContent = 'Вы не ввели Фамилию';
    } else if (element === $inputSurname) {
        $errorText.textContent = 'Вы не ввели Имя';
    } else {
        $errorText.textContent = 'Вы не ввели Отчество';
    }
    element.after($errorText);
}

actionsModalWindow();

/*******Создание контакта для пользователя *********/
function addOneContact() {
    if (contactsArr >= 10) {
        return;
    }
    const $contactBox = document.createElement('div');
    const $contactSelect = document.createElement('select');
    const $contactValueFirst = document.createElement('option');

    const $contactValueSecond = document.createElement('option');
    const $contactValueThird = document.createElement('option');
    const $contactValueFourth = document.createElement('option');
    const $contactValueFifth = document.createElement('option');
    const $contactInput = document.createElement('input');
    const $contactBtnDelete = document.createElement('button');

    const $ContentBtnDelete = `<svg class="contact__btn-delete__svg" width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 0C2.682 0 0 2.682 0 6C0 9.318 2.682 12 6 12C9.318 12 12 9.318 12 6C12 2.682 9.318 0 6 0ZM6 10.8C3.354 10.8 1.2 8.646 1.2 6C1.2 3.354 3.354 1.2 6 1.2C8.646 1.2 10.8 3.354 10.8 6C10.8 8.646 8.646 10.8 6 10.8ZM8.154 3L6 5.154L3.846 3L3 3.846L5.154 6L3 8.154L3.846 9L6 6.846L8.154 9L9 8.154L6.846 6L9 3.846L8.154 3Z"  />
    </svg >`;

    $contactSelect.classList.add('form-select');
    $contactSelect.classList.add('contact__select');

    $contactSelect.setAttribute('aria-label', 'Default select example');
    $contactBox.classList.add('contact__box');
    $contactInput.classList.add('contact__input');
    $contactBtnDelete.classList.add('btn-reset');
    $contactBtnDelete.classList.add('contact__btn-delete');

    $contactInput.type = 'tel';
    $contactInput.setAttribute('placeholder', 'Введите данные');

    $contactValueFirst.setAttribute('value', 'Телефон');
    $contactValueFirst.textContent = 'Телефон';

    $contactValueSecond.setAttribute('value', 'Email');
    $contactValueSecond.textContent = 'Email';

    $contactValueThird.setAttribute('value', 'Facebook');
    $contactValueThird.textContent = 'Facebook';

    $contactValueFourth.setAttribute('value', 'VK');
    $contactValueFourth.textContent = 'VK';

    $contactValueFifth.setAttribute('value', 'Другое');
    $contactValueFifth.textContent = 'Другое';

    $contactBtnDelete.innerHTML = $ContentBtnDelete;

    $contactBox.append($contactSelect);
    $contactBox.append($contactInput);
    $contactBox.append($contactBtnDelete);

    $contactSelect.appendChild($contactValueFirst);
    $contactSelect.appendChild($contactValueSecond);
    $contactSelect.appendChild($contactValueThird);
    $contactSelect.appendChild($contactValueFourth);
    $contactSelect.appendChild($contactValueFifth);

    $modalWindowBox.prepend($contactBox);

    $contactSelect.addEventListener('click', () => {
        $contactSelect.classList.toggle('contact__select--reverse');
    })

    $contactBtnDelete.addEventListener('click', () => {
        contactsArr = contactsArr - 1;
        if (contactsArr < 10) {
            $btnAddContact.classList.remove('modal-window__btn-contact--active');
        }
        $contactBox.remove();
        if (contactsArr == 0) {
            $btnAddContact.classList.remove("modal-window__block2--active");
            $modalWindowBox.classList.remove('modal-window__bcg--active');
        }
    })

    return {
        $modalWindowBox,
        $contactBtnDelete,
        $contactBox,
    };
}

/******************Очистка модального окна **********/
function cleanModalWindow() {
    $inputName.value = '';
    $inputSurname.value = '';
    $inputLastname.value = '';
    $btnAddContact.classList.remove("modal-window__block2--active");
    contactsArr = 0;
    $modalWindowBox.classList.remove('modal-window__bcg--active');
    let allContactBoxes = document.querySelectorAll('.contact__box');
    allContactBoxes.forEach((el) => {
        el.remove()
    })
}

/**********Преобразование контактов******************/
function userContactsPreparation() {
    const contactsArr = [];
    const contactsBoxes = document.querySelectorAll('.contact__box');
    for (const cont of contactsBoxes) {
        const obj = {};
        const contactSelect = cont.firstChild.value;
        const contactInput = cont.childNodes[1].value;
        obj.type = String(contactSelect);
        obj.value = String(contactInput);
        contactsArr.push(obj);
    }
    return contactsArr;
}

/*****************Создание кнопки удаления контакта***************/
function createDeleteWindow() {
    const $deleteWindowBodyPhone = document.createElement('div');
    const $deleteWindowBody = document.createElement('div');
    const $deleteWindowTitle = document.createElement('h3');
    const $deleteWindowText = document.createElement('p');

    const $deleteWindowBtns = document.createElement('div');
    const $deleteWindowBtnDelete = document.createElement('button');
    const $deleteWindowBtnCancel = document.createElement('button');

    $deleteWindowTitle.textContent = 'Удалить клиента';
    $deleteWindowText.textContent = 'Вы действительно хотите удалить данного клиента?';
    $deleteWindowBtnDelete.textContent = 'Удалить';
    $deleteWindowBtnCancel.textContent = 'Отмена';

    $deleteWindowBodyPhone.classList.add('delete__window-phone');
    $deleteWindowBody.classList.add('delete__window-box');
    $deleteWindowTitle.classList.add('delete__window-title');
    $deleteWindowText.classList.add('delete__window-text')
    $deleteWindowBtns.classList.add('delete__window-btns');
    $deleteWindowBtnDelete.classList.add('delete__window-btn__delete');
    $deleteWindowBtnCancel.classList.add('delete__window-btn__cancel');

    $deleteWindowBtns.append($deleteWindowBtnDelete);
    $deleteWindowBtns.append($deleteWindowBtnCancel);

    $deleteWindowBody.append($deleteWindowTitle);
    $deleteWindowBody.append($deleteWindowText);
    $deleteWindowBody.append($deleteWindowBtns);


    $deleteWindowBodyPhone.append($deleteWindowBody);
    $siteMane.append($deleteWindowBodyPhone);
    return {
        $deleteWindowBodyPhone,
        $deleteWindowBody,
        $deleteWindowBtnDelete,
        $deleteWindowBtnCancel,
    }
}

/**********************************************************************************************************************************/

const $modalWindowModalChange = document.querySelector('.modal__change-window');
const $phoneSiteModalChange = document.querySelector('.site__change-phone');
const $modalWindowExitModalChange = document.querySelector('.modal__change-window__btn-exit');
const $modalWindowBtnSaveModalChange = document.querySelector('.modal__change-window__btn-save');
const $btnAddContactModalChange = document.querySelector('.modal__change-window__btn-contact');
const $modalWindowBoxModalChange = document.querySelector('.modal__change-window__bcg');

const $inputNameModalChange = document.querySelector('.modal__change-window__input-name');
const $inputSurnameModalChange = document.querySelector('.modal__change-window__input-surname');
const $inputLastnameModalChange = document.querySelector('.modal__change-window__input-lastname');
const $modalWindowBtnResetModalChange = document.querySelector('.modal__change-window__btn-reset');

/***********добавление контакта для пользователя в модальном окне изменения**************/
function addOneContactModalChange(itemType, itemValue) {
    if (contactsArrModalChange >= 10) {
        return;
    }
    const $contactBox = document.createElement('div');
    const $contactSelect = document.createElement('select');
    const $contactValueFirst = document.createElement('option');
    const $contactValueSecond = document.createElement('option');
    const $contactValueThird = document.createElement('option');
    const $contactValueFourth = document.createElement('option');
    const $contactValueFifth = document.createElement('option');
    const $contactInput = document.createElement('input');
    const $contactBtnDelete = document.createElement('button');

    const $ContentBtnDelete = `<svg class="contact__btn-delete__svg" width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 0C2.682 0 0 2.682 0 6C0 9.318 2.682 12 6 12C9.318 12 12 9.318 12 6C12 2.682 9.318 0 6 0ZM6 10.8C3.354 10.8 1.2 8.646 1.2 6C1.2 3.354 3.354 1.2 6 1.2C8.646 1.2 10.8 3.354 10.8 6C10.8 8.646 8.646 10.8 6 10.8ZM8.154 3L6 5.154L3.846 3L3 3.846L5.154 6L3 8.154L3.846 9L6 6.846L8.154 9L9 8.154L6.846 6L9 3.846L8.154 3Z"  />
    </svg >`;

    $contactSelect.classList.add('form-select');
    $contactSelect.classList.add('contact__select');
    $contactSelect.setAttribute('aria-label', 'Default select example');
    $contactBox.classList.add('contact__box');
    $contactInput.classList.add('contact__input');
    $contactBtnDelete.classList.add('btn-reset');
    $contactBtnDelete.classList.add('contact__btn-delete');

    $contactInput.setAttribute('placeholder', 'Введите данные');

    $contactValueFirst.setAttribute('value', 'Телефон');
    $contactValueFirst.textContent = 'Телефон';

    $contactValueSecond.setAttribute('value', 'Email');
    $contactValueSecond.textContent = 'Email';

    $contactValueThird.setAttribute('value', 'Facebook');
    $contactValueThird.textContent = 'Facebook';

    $contactValueFourth.setAttribute('value', 'VK');
    $contactValueFourth.textContent = 'VK';

    $contactValueFifth.setAttribute('value', 'Другое');
    $contactValueFifth.textContent = 'Другое';

    if (itemType !== null && itemValue !== null) {
        if (itemType === 'Другое') {
            $contactValueFifth.selected = true;
        } else if (itemType === 'Email') {
            $contactValueSecond.selected = true;
        } else if (itemType === 'Facebook') {
            $contactValueThird.selected = true;
        } else if (itemType === 'VK') {
            $contactValueFourth.selected = true;
        } else {
            $contactValueFirst.selected = true;
        }
        if (itemValue !== null) {
            $contactInput.value = itemValue;
        } else {
            $contactInput.value = '';
        }
    }

    $contactBtnDelete.innerHTML = $ContentBtnDelete;

    $contactBox.append($contactSelect);
    $contactBox.append($contactInput);
    $contactBox.append($contactBtnDelete);

    $contactSelect.appendChild($contactValueFirst);
    $contactSelect.appendChild($contactValueSecond);
    $contactSelect.appendChild($contactValueThird);
    $contactSelect.appendChild($contactValueFourth);
    $contactSelect.appendChild($contactValueFifth);

    $modalWindowBoxModalChange.prepend($contactBox);

    $contactBtnDelete.addEventListener('click', () => {
        contactsArrModalChange = contactsArrModalChange - 1;
        if (contactsArrModalChange < 10) {
            $btnAddContactModalChange.classList.remove('modal__change-window__btn-contact--active');
        }
        $contactBox.remove();

        if (contactsArrModalChange == 0) {
            $modalWindowBoxModalChange.classList.remove('modal__change-window__bcg--active');
            $btnAddContactModalChange.classList.remove("modal__change-window__block2--active");
        }
    })

    return {
        $modalWindowBoxModalChange,
        $contactBtnDelete,
        $contactBox,
    };
}

let nameChange = true;
let surnameChange = true;
let lastnameChange = true;

/**********Кнопки для модального окна изменения клиента*************/
function actionsModalChangeWindow() {
    $modalWindowExitModalChange.addEventListener('click', () => {
        modalWindowChangeState();
        let allContactBoxes = $modalWindowBoxModalChange.querySelectorAll('.contact__box');
        contactsArrModalChange = 0;
        allContactBoxes.forEach((el) => {
            el.remove();
        });
        if ($inputNameModalChange.nextElementSibling.tagName.toLowerCase() == 'h3') {
            $inputNameModalChange.nextSibling.remove();
        }
        nameChange = true;
        if ($inputSurnameModalChange.nextElementSibling.tagName.toLowerCase() == 'h3') {
            $inputSurnameModalChange.nextSibling.remove();
        }
        surnameChange = true;
        if ($inputLastnameModalChange.nextElementSibling.tagName.toLowerCase() == 'h3') {
            $inputLastnameModalChange.nextSibling.remove();
        }
        lastnameChange = true;
        $modalWindowBoxModalChange.classList.remove('modal__change-window__bcg--active');
        $btnAddContactModalChange.classList.remove("modal__change-window__block2--active");
    });

    $btnAddContactModalChange.addEventListener('click', () => {
        addOneContactModalChange('', '');
        contactsArrModalChange = contactsArrModalChange + 1;
        console.log(contactsArrModalChange);
        if (contactsArrModalChange != 0) {
            $modalWindowBoxModalChange.classList.add('modal__change-window__bcg--active');
        }

        if (contactsArrModalChange >= 10) {
            $btnAddContactModalChange.classList.add('modal__change-window__btn-contact--active');
            return;
        }

        if (!$btnAddContactModalChange.classList.contains("modal__change-window__block2--active")) {
            $btnAddContactModalChange.classList.add("modal__change-window__block2--active");
        }
    });

    $modalWindowBtnResetModalChange.addEventListener('click', async () => {
        let answer = confirm('Вы действительно хотите удалить контакт?');
        if (answer == false) {
            return;
        } else {
            modalWindowChangeState();
            await deleteClient($modalWindowBtnSaveModalChange.dataset.id);
            renderClients();
        }
    })

    $modalWindowBtnSaveModalChange.addEventListener('click', async (ev) => {
        ev.preventDefault();
        let contactInput = $modalWindowBoxModalChange.querySelectorAll('.contact__input');

        if ($inputNameModalChange.value == '' && nameChange === true) {
            createErrorChange($inputNameModalChange);
            nameChange = false;
        } else if ($inputNameModalChange.value !== '') {
            if ($inputNameModalChange.nextElementSibling.tagName.toLowerCase() == 'h3') {
                $inputNameModalChange.nextSibling.remove();
            }
            nameChange = true;
        }

        if ($inputSurnameModalChange.value == '' && surnameChange === true) {
            createErrorChange($inputSurnameModalChange);
            surnameChange = false;
        } else if ($inputSurnameModalChange.value !== '') {
            if ($inputSurnameModalChange.nextElementSibling.tagName.toLowerCase() == 'h3') {
                $inputSurnameModalChange.nextSibling.remove();
            }
            surnameChange = true;
        }

        if ($inputLastnameModalChange.value == '' && lastnameChange === true) {
            createErrorChange($inputLastnameModalChange);
            lastnameChange = false;
        } else if ($inputLastnameModalChange.value !== '') {
            if ($inputLastnameModalChange.nextElementSibling.tagName.toLowerCase() == 'h3') {
                $inputLastnameModalChange.nextSibling.remove();
            }
            lastnameChange = true;
        }

        for (let input of contactInput) {
            if (input.value == '' && !input.hasAttribute('data-value', 'true')) {
                input.dataset.value = 'true';
                const $errorText = document.createElement('h3');
                $errorText.classList.add('error__text-change__number');
                $errorText.textContent = 'Вы не заполнили контакт';
                input.after($errorText);
            } else if (input.value !== '') {
                if (input.nextElementSibling.tagName.toLocaleLowerCase() == 'h3') {
                    input.nextElementSibling.remove();
                }
            }
        }

        let userId = $modalWindowBtnSaveModalChange.dataset.id;
        if ($inputNameModalChange.value !== '' && $inputSurnameModalChange.value !== '' && $inputLastnameModalChange.value !== '' && Array.prototype.slice.call(contactInput).every(input => input.value !== '')) {
            let response = await fetch('http://localhost:3000/api/clients/' + userId, {
                method: 'PATCH',
                body: JSON.stringify({
                    name: $inputNameModalChange.value.trim(),
                    surname: $inputSurnameModalChange.value.trim(),
                    lastName: $inputLastnameModalChange.value.trim(),
                    contacts: userContactsPreparation(),
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            $modalWindowBoxModalChange.querySelectorAll('.contact__box').forEach((el) => {
                el.remove();
            });
            modalWindowChangeState();
            renderClients();
        }
    })
}
actionsModalChangeWindow();

function createErrorChange(element) {
    const $errorText = document.createElement('h3');
    $errorText.classList.add('error__text-change');
    if (element === $inputNameModalChange) {
        $errorText.textContent = 'Вы не ввели Фамилию';
    } else if (element === $inputSurnameModalChange) {
        $errorText.textContent = 'Вы не ввели Имя';
    } else {
        $errorText.textContent = 'Вы не ввели Отчество';
    }
    element.after($errorText);
}

renderClients();

$btnSortFio.addEventListener('click', () => {
    $btnSortFio.firstElementChild.classList.toggle('sort__fio-svg');
    sortTextFlag = 'name';
    sortBooleanFlag = !sortBooleanFlag;
    renderClients();
});

$btnSortId.addEventListener('click', () => {
    $btnSortId.firstElementChild.classList.toggle('sort__id-svg');
    sortTextFlag = 'id';
    sortBooleanFlag = !sortBooleanFlag;
    renderClients();
});

$btnSortCreated.addEventListener('click', () => {
    $btnSortCreated.firstElementChild.classList.toggle('sort__created-svg');
    sortTextFlag = 'createdTime';
    sortBooleanFlag = !sortBooleanFlag;
    renderClients();
});

$btnSortChanged.addEventListener('click', () => {
    $btnSortChanged.firstElementChild.classList.toggle('sort__changed-svg');
    sortTextFlag = 'updatedTime';
    sortBooleanFlag = !sortBooleanFlag;
    renderClients();
});

let searchTimeout;
$headerSearch.addEventListener('input', () => {
    let searchFlag = true;
    if (searchFlag == true) {
        searchFlag = false;
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            renderClients();
            searchFlag = true;
        }, 300)
    }
})





