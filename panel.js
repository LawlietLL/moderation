

(function() {
    'use strict';

    let openedSpoiler = null;
    let selectedNickname = '';

    // Функция сохранения спойлеров в localStorage
    function saveSpoilers() {
        localStorage.setItem('customSpoilers', JSON.stringify(spoilers));
    }

    // Дефолтные спойлеры
    const defaultSpoilers = [
        {
            title: 'Неправильная публикация торгового сообщения в чате «Торговля»',
            info: '',
            buttons: [
                { name: 'Предупреждение', text: "/m Чат «Торговля» предназначен только для торговли." },
                { name: 'Мут', text: "/s 10m /Неправильная публикация в торге." }
            ]
        },
        {
            title: 'Размещение торговой рекламы вне спец.чата «Торговля»',
            info: '',
            buttons: [
                { name: 'Предупреждение', text: "/m Чат «Торговля» предназначен только для торговли." },
                { name: 'Мут', text: "/s 10m /Неправильная публикация в торге." }
            ]
        },
        {
            title: 'Несоблюдение временного промежутка между отправкой рекламы в чаты Региона и Локации.',
            info: '',
            buttons: [
                { name: 'Предупреждение', text: "/m Чат «Торговля» предназначен только для торговли." },
                { name: 'Мут', text: "/s 10m /Неправильная публикация в торге." }
            ]
        },
        {
            title: 'Злоупотребление Капсом (Caps Lock).',
            info: '',
            buttons: [
                { name: 'Предупреждение', text: "/m Чат «Торговля» предназначен только для торговли." },
                { name: 'Мут', text: "/s 10m /Неправильная публикация в торге." }
            ]
        },
        {
            title: 'Флуд',
            info: '',
            buttons: [
                { name: 'Предупреждение', text: "/m Не флудите." },
                { name: 'Мут 10 мин.', text: "/s 10m /Флуд." },
                { name: 'Мут 10 мин. (Флешмоб)', text: "/s 10m /Флуд (Флешмоб)." },
                { name: 'Мут 30 мин. (Мультипост)', text: "/s 30m /Флуд (Мультипост)." },
                { name: 'Мут 60 мин. (Мультипост)', text: "/s 1h /Флуд (Мультипост)." },

            ]
        },
        {
            title: 'Ненормативная лексика',
            info: '',
            buttons: [
                { name: 'Предупреждение', text: "/m Не злоупотребляйте ненормативной лексикой." },
                { name: 'Мут 1ч.', text: "/s 1h /Ненормативная лексика." },
                { name: 'Мут 3ч.', text: "/s 3h /Ненормативная лексика." },
                { name: 'Очистка статуса', text: "/clear 1h /Ненормативная лексика" }
            ]
        },
        {
            title: 'ЗПТ Темы 18+',
            info: '',
            buttons: [
                { name: 'Мут', text: "/s 60 /Запрещенная тема (п.1)." },
                { name: 'Очистка статуса', text: "/clear 1h / Запрещенная тема (п.1)." },
            ]
        },
        {
            title: 'ЗПТ Алкогольные напитки',
            info: '',
            buttons: [
                { name: 'Предупреждение', text: "/m Запрещенная тема (п.2.1)." },
                { name: 'Мут', text: "/s 1h /Запрещенная тема (п.2.1)." }
            ]
        },
        {
            title: 'ЗПТ Наркотические вещества',
            info: '',
            buttons: [
                { name: 'Мут', text: "/s 6h /Запрещенная тема (п.2.2)." }
            ]
        },
        {
            title: 'ЗПТ Высказывания, содержащие или пропагандирующие...',
            info: '',
            buttons: [
                { name: 'Мут', text: "/s 6h /Запрещенная тема (п.3)." }
            ]
        },
        {
            title: 'ЗПТ Обсуждения, высказывания о сторонних игровых онлайн-проектах',
            info: '',
            buttons: [
                { name: 'Предупреждение', text: "/m Запрещенная тема (п.4)." },
                { name: 'Мут', text: "/s 1h /Запрещенная тема (п.4)." }
            ]
        },
        {
            title: 'ЗПТ СПАМ. Реклама сторонних игровых онлайн-проектов. Агитация к уходу из проекта или его смене.',
            info: '',
            buttons: [
                { name: 'Мут', text: "/s 12h /Запрещенная тема (п.5.1)." }
            ]
        },
        {
            title: 'ЗПТ Обсуждение, распространение закрытой информации.',
            info: '',
            buttons: [
                { name: 'Мут', text: "/s 12h /Запрещенная тема (п.6)." }
            ]
        },
        {
            title: 'ЗПТ Обсуждение должностных.',
            info: '',
            buttons: [
                { name: 'Мут', text: "/s 1h /Запрещенная тема (п.8)." },
                { name: 'Очистка статуса', text: "/clear 12h /Запрещенная тема (п.8). Оскорбление админов" }
            ]
        },
        {
            title: 'ЗПТ Обсуждения, высказывания о родственниках игроков в некорректной форме',
            info: '',
            buttons: [
                { name: 'Мут', text: "/s 6h /Запрещенная тема (п.9)." }
            ]
        },
        {
            title: 'п.13 общих правил игры.',
            info: '',
            buttons: [
                { name: 'Мут', text: "/s 12h /п.13 общих правил игры." },
                { name: 'Очистка статуса', text: "/clear 12h /п.13 общих правил игры. Война" }
            ]
        },
        {
            title: 'Попытка покупки или продажи аккаунта или вещей, монстров.',
            info: '',
            buttons: [
                { name: 'Мут', text: "/s 12h /Попытка покупки или продажи аккаунта или вещей, монстров." }
            ]
        },
        {
            title: 'Попытка покупки или продажи сторонних вещей или услуг.',
            info: '',
            buttons: [
                { name: 'Мут', text: "/s 12h /Попытка покупки или продажи сторонних вещей или услуг." }
            ]
        },
        {
            title: 'Попытка передачи или получения реквизитов.',
            info: '',
            buttons: [
                { name: 'Мут', text: "/s 12h /Попытка передачи или получения реквизитов." }
            ]
        },
        {
            title: 'Безвозмездная и несоответствующая средней рыночной стоимости передача монстров/вещей/кредитов кому-либо.',
            info: '',
            buttons: [
                { name: 'Предупреждение', text: "/m Запрещена безвозмездная и несоответствующая средней рыночной стоимости передача монстров/вещей/кредитов кому-либо." }
            ]
        },
        {
            title: 'Попытка покупки или продажи аккаунта или вещей, монстров в Торговле',
            info: '',
            buttons: [
                { name: 'Предупреждение', text: "/m Попытка покупки или продажи аккаунта или вещей, монстров в Торговле" }
            ]
        },
        {
            title: 'Использование и распространение сторонних программных средств, в т.ч. скриптов!',
            info: '',
            buttons: [
                { name: 'Предупреждение', text: "/m Запрещено использование и распространение сторонних программных средств, в т.ч. скриптов!" }
            ]
        },
        {
            title: 'Взаимная прокачка (ранговая) и/или заведомый проигрыш/выигрыш боя(-ев) за кредиты/вещи/монстров.',
            info: '',
            buttons: [
                { name: 'Предупреждение', text: "/m Запрещена взаимная прокачка (ранговая) и/или заведомый проигрыш/выигрыш боя(-ев) за кредиты/вещи/монстров." }
            ]
        },
        {
            title: 'Намеренное нарушение правил перед выходом из игры.',
            info: '',
            buttons: [
                { name: 'Мут', text: "/s 12h /Намеренное нарушение правил перед выходом из игры." }
            ]
        }
    ];

    // Загружаем спойлеры из localStorage или используем дефолтные
    let spoilers = JSON.parse(localStorage.getItem('customSpoilers')) || defaultSpoilers;

    // Создание модального окна
    function createModal() {
        let modalWrapper = document.createElement('div');
        modalWrapper.id = 'custom-modal-wrapper';
        Object.assign(modalWrapper.style, {
            display: 'none',
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            backgroundColor: 'transparent',
            zIndex: '999'
        });

        let modal = document.createElement('div');
        modal.id = 'custom-modal';
        Object.assign(modal.style, {
            position: 'absolute',
            top: '100px',
            left: '100px',
            backgroundColor: '#e5eef8',
            borderRadius: '5px',
            border: '1px solid #f0f6fc',
            boxShadow: '1px 1px 2px 0 #434854',
            padding: '10px',
            zIndex: '1',
            width: '350px',
            height: '500px',
            overflowY: 'auto'
        });

        let modalHeader = document.createElement('div');
        Object.assign(modalHeader.style, {
            cursor: 'move',
            padding: '5px',
            backgroundColor: '#e5eef8',
            borderBottom: '1px solid #cccccc',
            marginBottom: '5px'
        });
        modalHeader.innerHTML = '<strong>Панель наказаний</strong>';
        modal.appendChild(modalHeader);

        (function makeDraggable(el, handle) {
            let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
            handle.onmousedown = dragMouseDown;
            function dragMouseDown(e) {
                e = e || window.event;
                e.preventDefault();
                pos3 = e.clientX;
                pos4 = e.clientY;
                document.onmouseup = closeDragElement;
                document.onmousemove = elementDrag;
            }
            function elementDrag(e) {
                e = e || window.event;
                e.preventDefault();
                pos1 = pos3 - e.clientX;
                pos2 = pos4 - e.clientY;
                pos3 = e.clientX;
                pos4 = e.clientY;
                el.style.top = (el.offsetTop - pos2) + "px";
                el.style.left = (el.offsetLeft - pos1) + "px";
            }
            function closeDragElement() {
                document.onmouseup = null;
                document.onmousemove = null;
            }
        })(modal, modalHeader);

        let closeButton = document.createElement('span');
        closeButton.textContent = '×';
        Object.assign(closeButton.style, {
            position: 'absolute',
            top: '5px',
            right: '10px',
            cursor: 'pointer',
            fontSize: '24px',
            fontWeight: 'bold'
        });
        closeButton.addEventListener('click', () => {
            modalWrapper.style.display = 'none';
        });
        modal.appendChild(closeButton);

        let searchInput = document.createElement('input');
        searchInput.type = 'text';
        searchInput.placeholder = 'Поиск...';
        Object.assign(searchInput.style, {
            width: '90%',
            padding: '4px',
            marginBottom: '10px',
            marginTop: '15px',
            fontSize: '14px',
            border: '1px solid #ccc',
            borderRadius: '5px',
            outline: 'none'
        });
        searchInput.addEventListener('input', () => {
            let query = searchInput.value.toLowerCase();
            document.querySelectorAll('.custom-spoiler').forEach(spoiler => {
                let title = spoiler.querySelector('p').textContent.toLowerCase();
                spoiler.style.display = title.includes(query) ? 'block' : 'none';
            });
        });
        modal.appendChild(searchInput);

        let nicknameInput = document.createElement('input');
        nicknameInput.type = 'text';
        nicknameInput.id = 'custom-nickname';
        nicknameInput.placeholder = 'Кому...';
        Object.assign(nicknameInput.style, {
            width: '90%',
            padding: '4px',
            marginBottom: '10px',
            fontSize: '14px',
            border: '1px solid #ccc',
            borderRadius: '5px',
            outline: 'none'
        });
        modal.appendChild(nicknameInput);

        modalWrapper.appendChild(modal);
        document.body.appendChild(modalWrapper);
        return modal;
    }


    function createSpoiler(title, infoText, buttons = [], spoilerIndex) {
        let wrapper = document.createElement('div');
        wrapper.className = 'custom-spoiler';
        wrapper.dataset.index = spoilerIndex;
        Object.assign(wrapper.style, {
            border: '1px solid #ccc',
            borderRadius: '5px',
            marginBottom: '10px',
            padding: '10px',
            backgroundColor: '#f8f9fa'
        });

        let titleContainer = document.createElement('div');
        titleContainer.style.display = 'flex';
        titleContainer.style.justifyContent = 'space-between';
        titleContainer.style.alignItems = 'center';

        let titleElement = document.createElement('p');
        titleElement.textContent = title;
        titleElement.style.cursor = 'pointer';
        titleElement.style.fontWeight = 'bold';
        titleElement.style.marginBottom = '5px';

        titleElement.addEventListener('dblclick', () => {
            titleElement.contentEditable = true;
            titleElement.focus();
        });
        titleElement.addEventListener('focus', () => {
            titleElement.style.outline = 'none';
            titleElement.style.backgroundColor = '#eef';
        });
        titleElement.addEventListener('blur', () => {
            titleElement.contentEditable = false;
            titleElement.style.backgroundColor = 'transparent';
            spoilers[spoilerIndex].title = titleElement.textContent;
            saveSpoilers();
        });

        let deleteSpoilerIcon = document.createElement('span');
        deleteSpoilerIcon.textContent = "🗑";
        deleteSpoilerIcon.style.color = 'gray';
        deleteSpoilerIcon.style.cursor = 'pointer';
        deleteSpoilerIcon.style.fontSize = '14px';
        deleteSpoilerIcon.addEventListener('click', (e) => {
            e.stopPropagation();
            if(confirm("Удалить этот спойлер?")) {
                spoilers.splice(spoilerIndex, 1);
                saveSpoilers();
                renderSpoilers(spoilersContainer);
            }
        });

        titleContainer.appendChild(titleElement);
        titleContainer.appendChild(deleteSpoilerIcon);
        wrapper.appendChild(titleContainer);

        let infoElement = document.createElement('p');
        infoElement.textContent = infoText;
        infoElement.style.fontSize = '10px';
        infoElement.style.marginBottom = '10px';
        infoElement.style.color = '#555';
        infoElement.style.cursor = 'pointer';
        infoElement.addEventListener('dblclick', () => {
            infoElement.contentEditable = true;
            infoElement.focus();
        });
        infoElement.addEventListener('focus', () => {
            infoElement.style.outline = 'none';
            infoElement.style.backgroundColor = '#eef';
        });
        infoElement.addEventListener('blur', () => {
            infoElement.contentEditable = false;
            infoElement.style.backgroundColor = 'transparent';
            spoilers[spoilerIndex].info = infoElement.textContent;
            saveSpoilers();
        });

        let content = document.createElement('div');
        content.style.display = 'none';
        content.style.padding = '10px';
        content.style.backgroundColor = '#ffffff';
        content.style.border = '1px solid #ddd';
        content.style.borderRadius = '5px';
        content.style.marginTop = '5px';

        titleElement.addEventListener('click', () => {
            if (openedSpoiler && openedSpoiler !== content) {
                openedSpoiler.style.display = 'none';
            }
            content.style.display = content.style.display === 'none' ? 'block' : 'none';
            openedSpoiler = content.style.display === 'block' ? content : null;
        });

        let formWrapper = document.createElement('div');
        Object.assign(formWrapper.style, {
            display: 'flex',
            flexWrap: 'wrap',
            gap: '5px',
            flex: '1 1 auto',
            paddingLeft: '0',
            width: '100%',
            fontWeight: 'normal'
        });

        buttons.forEach((btnData, btnIndex) => {
            let btnContainer = document.createElement('span');
            btnContainer.style.display = 'inline-flex';
            btnContainer.style.alignItems = 'center';

            let btn = document.createElement('button');
            btn.textContent = btnData.name;
            btn.className = 'button gray';
            Object.assign(btn.style, {
                width: 'auto',
                paddingLeft: '5px',
                paddingRight: '5px',
                boxShadow: 'none',
                cursor: 'pointer'
            });
            btn.addEventListener('click', () => {
                let siteInput = document.querySelector('.txtToName');
                let siteTextarea = document.querySelector('.txtInput');
                if (siteInput) {
                    siteInput.value = document.getElementById('custom-nickname').value;
                }
                if (siteTextarea) {
                    siteTextarea.value = btnData.text;
                }
            });

            btn.addEventListener('dblclick', () => {
                let newLabel = prompt("Редактировать название кнопки", btnData.name);
                if (newLabel !== null) {
                    btnData.name = newLabel;
                    btn.textContent = newLabel;
                }
                let newCommand = prompt("Редактировать команду", btnData.text);
                if (newCommand !== null) {
                    btnData.text = newCommand;
                }
                saveSpoilers();
            });
            btnContainer.appendChild(btn);

            let deleteIcon = document.createElement('span');
            deleteIcon.textContent = "×";
            Object.assign(deleteIcon.style, {
                marginLeft: '2px',
                color: 'red',
                cursor: 'pointer',
                fontSize: '12px'
            });
            deleteIcon.addEventListener('click', (e) => {
                e.stopPropagation();
                if(confirm("Удалить эту кнопку?")) {
                    spoilers[spoilerIndex].buttons.splice(btnIndex, 1);
                    saveSpoilers();
                    renderSpoilers(spoilersContainer);
                }
            });
            btnContainer.appendChild(deleteIcon);
            formWrapper.appendChild(btnContainer);
        });

        let addBtn = document.createElement('button');
        addBtn.textContent = "+ Добавить кнопку";
        addBtn.className = 'button gray';
        Object.assign(addBtn.style, {
            width: 'auto',
            paddingLeft: '5px',
            paddingRight: '5px',
            boxShadow: 'none',
            cursor: 'pointer'
        });
        addBtn.addEventListener('click', () => {
            let btnName = prompt("Введите название кнопки");
            if (!btnName) return;
            let btnCommand = prompt("Введите команду");
            if (btnCommand === null) return;
            spoilers[spoilerIndex].buttons.push({ name: btnName, text: btnCommand });
            saveSpoilers();
            renderSpoilers(spoilersContainer);
        });
        formWrapper.appendChild(addBtn);

        content.appendChild(infoElement);
        content.appendChild(formWrapper);
        wrapper.appendChild(content);
        return wrapper;
    }

    function renderSpoilers(container) {
        container.innerHTML = "";
        spoilers.forEach((spoiler, index) => {
            container.appendChild(createSpoiler(spoiler.title, spoiler.info, spoiler.buttons, index));
        });
    }

    function waitForPosts() {
        let observer = new MutationObserver(() => {
            if (document.querySelector('.post')) {
                document.querySelectorAll('.post').forEach(post => {
                    let timeSpan = post.querySelector('.time');
                    let usernameElement = post.querySelector('.users .label');
                    if (timeSpan && usernameElement && !post.querySelector('.custom-button')) {
                        let btn = document.createElement('button');
                        btn.className = 'custom-button';
                        btn.textContent = 'М';
                        Object.assign(btn.style, {
                            border: 'none',
                            background: 'transparent',
                            cursor: 'pointer',
                            color: '#3498db',
                            fontSize: '10px'
                        });
                        btn.addEventListener('click', function () {
                            selectedNickname = usernameElement.textContent;
                            document.getElementById('custom-nickname').value = selectedNickname;
                            document.getElementById('custom-modal-wrapper').style.display = 'block';
                        });
                        timeSpan.parentNode.insertBefore(btn, timeSpan.nextSibling);
                    }
                });
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    let modal = createModal();
    let spoilersContainer = document.createElement('div');
    modal.appendChild(spoilersContainer);

    renderSpoilers(spoilersContainer);

    let addSpoilerBtn = document.createElement('button');
    addSpoilerBtn.textContent = "+ Добавить спойлер";
    addSpoilerBtn.className = 'button gray';
    Object.assign(addSpoilerBtn.style, {
        width: '100%',
        marginTop: '10px',
        paddingLeft: '5px',
        paddingRight: '5px',
        boxShadow: 'none',
        cursor: 'pointer'
    });
    addSpoilerBtn.addEventListener('click', () => {
        let newTitle = prompt("Введите заголовок нового спойлера", "Новый спойлер");
        if (newTitle !== null) {
            let newInfo = prompt("Введите описание спойлера", "Описание спойлера") || "";
            let newSpoiler = { title: newTitle, info: newInfo, buttons: [] };
            spoilers.push(newSpoiler);
            saveSpoilers();
            renderSpoilers(spoilersContainer);
        }
    });
    modal.appendChild(addSpoilerBtn);

    let resetBtn = document.createElement('button');
    resetBtn.textContent = "Сбросить настройки";
    resetBtn.className = 'button gray';
    Object.assign(resetBtn.style, {
        width: '100%',
        marginTop: '10px',
        paddingLeft: '5px',
        paddingRight: '5px',
        boxShadow: 'none',
        cursor: 'pointer'
    });
    resetBtn.addEventListener('click', () => {
        if(confirm("Сбросить все настройки?")) {
            localStorage.removeItem('customSpoilers');
            spoilers = JSON.parse(JSON.stringify(defaultSpoilers));
            saveSpoilers();
            renderSpoilers(spoilersContainer);
        }
    });
    modal.appendChild(resetBtn);

    if (document.readyState !== 'complete') {
        window.addEventListener('load', waitForPosts);
    } else {
        waitForPosts();
    }
})();
