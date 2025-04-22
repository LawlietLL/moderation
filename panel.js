// ==UserScript==
// @name         Бинды для модеров + Подсветка и редактор фильтра слов
// @namespace    http://tampermonkey.net/
// @version      2.18
// @description  Добавляет кнопку рядом со временем в сообщениях и открывает модальное окно со спойлерами с возможностью редактирования, перемещения, добавления и удаления спойлеров/кнопок; полноэкранное на мобилках; авто‑placeholder для ника; без затемнения фонового экрана; вставка ника и команд в чат; перетаскивание по заголовку; можно взаимодействовать с элементами вне модалки; отступы у спойлеров по бокам одинаковые на мобилках.
// @author       You
// @match        https://game.league17.ru/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    let selectedNickname = '';

    const css = `
.button.gray { font-family: Verdana,sans-serif; border:1px solid #b5bdca; height:18px;
    color:#454a52; border-radius:4px; box-shadow:0 0 1px 1px #ecf2fa;
    background:url(//img.league17.ru/pub/interface/grbg1.png) 0 0 #e5ecf3 repeat-x;
    text-shadow:none; font-size:11px; padding-top:2px; }
.button.withtext .icon { vertical-align:middle; display:inline-block; margin:-4px 6px -2px 0; font-size:16px; }
.button.gray.withtextt { padding-top:0!important; width:auto!important; }

/* обёртка модалки без затемнения */
#custom-modal-wrapper { display:none; position:fixed; top:0; left:0; width:100%; height:100%; background-color:transparent; z-index:999; }

/* окно */
#custom-modal {
    position:absolute;
    top:50%; left:50%;
    transform: translate(-50%, -50%);
    width:350px; height:500px;
    padding:10px;
    background-color:#e5eef8;
    border:1px solid #f0f6fc;
    border-radius:5px;
    box-shadow:1px 1px 2px #434854;
    overflow-y:auto;
    z-index:1000;
}
/* заголовок */
.divDockPanelsTitle {
    display:flex; align-items:start;
    margin-top:-7px; margin-bottom:5px;
    font-family:'HaginCapsMedium'; font-size:20px;
    color:#040405; text-shadow:0 1px 1px #FFF;
    cursor: grab;
}
/* кнопка закрыть */
#custom-modal .button.close.justicon {
    display:block;
    position:absolute;
    top:5px;
    right:5px;
    cursor:pointer;
}

/* поиск и ник */
.custom-search-input,
.custom-nickname-input {
    width:90%; padding:4px; font-size:14px;
    border:1px solid #ccc; border-radius:5px; outline:none;
    box-sizing:border-box;
}
.custom-search-input { margin:15px 0 10px; }
.custom-nickname-input { margin-bottom:10px; }

/* спойлер */
.custom-spoiler { border:1px solid #ccc; border-radius:5px;
    margin-bottom:10px; padding:10px; background:#f8f9fa; }
.title-container { display:flex; justify-content:space-between; align-items:center; }
.spoiler-title { cursor:pointer; font-weight:bold; margin:0 0 5px; }
.delete-spoiler { cursor:pointer; margin-left:6px; }
.spoiler-info { font-size:10px; margin:0 0 10px; color:#555; cursor:pointer; }
.spoiler-content { display:none; padding:10px; background:#fff; border:1px solid #ddd; border-radius:5px; margin-top:5px; }
.form-wrapper { display:flex; flex-wrap:wrap; gap:5px; width:100%; font-weight:normal; }

/* кнопка “М” */
.custom-button { border:none; background:transparent; cursor:pointer; color:#3498db; font-size:10px; margin-left:4px; }

/* добавить/сброс */
.add-spoiler-btn,
.reset-btn {
    display:block; width:100%; margin-top:10px; padding:5px; box-shadow:none; cursor:pointer;
}

/* мобильная адаптация: полноэкранная */
@media (max-width:768px) {
    #custom-modal .button.close.justicon {
    display:block; position:absolute;
    top:5px;
    right:5px;
    cursor:pointer;
    }
    .custom-search-input { margin:35px 0 10px; }
    .custom-nickname-input { margin-bottom:10px; }
    #custom-modal {
        position: fixed !important;
        top: 0 !important; left: 0 !important;
        transform: none !important;
        width: 100% !important;
        height: 100% !important;
        padding: 10px;
        border-radius: 0 !important;
        overflow-y: auto !important;
        border: 0 !important;
        box-shadow: none !important;
    }
    #custom-modal-wrapper {
        position: fixed !important;
        width: 100% !important;
        height: 100% !important;
    }
        .custom-spoiler {
        position: relative;
        width: 85%;
        margin-top: 10px !important;
        margin-bottom: 10px !important;
        margin-left: 10px !important;
        margin-right: 10px !important;
    }
    .divDockPanelsTitle {
    margin-bottom:5px!important;
    }

    #custom-modal .button.close.justicon {
    display: block;
    position: absolute;
    top: 0px;
    right: 30px;
    cursor: pointer;
    }
}
`;
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);

        const defaultSpoilers = [
      { title: 'Неправильная публикация торгового сообщения в чате «Торговля»', info: '', buttons: [{ name: 'Предупреждение', text: "/m Чат «Торговля» предназначен для публикации ваших сообщений, относящихся к торговле. Допускается публикация иного текста при соблюдении правила смешанного сообщения: Торговое сообщение должно состоять на половину или более из текста, относящегося напрямую к чату «Торговля»." }, { name: 'Мут', text: "/s 10m /Неправильная публикация торгового сообщения в чате «Торговля»." }] },
      { title: 'Размещение торговой рекламы вне спец.чата «Торговля»', info: '', buttons: [{ name: 'Предупреждение', text: "/m Отправка торговой рекламы должна осуществляться только в спец.чат («Торговля»). Публикация в остальные чаты (Регион, Локация, Личные сообщения и т.д.) запрещена. Чаты «Регион и «Локация» предназначены для общения и публикации сообщений о предложении боя, событиях и мероприятиях, а так же для некоторых популярных услуг." }, { name: 'Мут', text: "/s 10m /Размещение торговой рекламы вне спец.чата «Торговля»" }] },
      { title: 'Несоблюдение временного промежутка между отправкой рекламы в чаты Региона и Локации.', info: '', buttons: [{ name: 'Предупреждение', text: "/m Разрешенные временные промежутки между отправкой рекламы в чаты Региона и Локации: реклама услуг (объявления о событиях и мероприятиях) не чаще 1 раза в 10 минут; предложения боя, ап, разведение монстров, вылупка яиц не чаще 1 раза в 4 минуты. При наличии в смешанном сообщении рекламы услуг — интервал 1 раз в 10 минут, в остальных случаях — 1 раз в 4 минуты." }, { name: 'Мут', text: "/s 10m /Несоблюдение временного промежутка между отправкой рекламы в чаты Региона и Локации." }] },
      { title: 'Злоупотребление Капсом (Caps Lock).', info: '', buttons: [{ name: 'Предупреждение', text: "/m Не пишите заглавными буквами. Отключите Капс (Caps Lock)." }, { name: 'Мут', text: "/s 10m / Злоупотребление Капсом (Caps Lock)." }] },
      { title: 'Флуд', info: '', buttons: [{ name: 'Предупреждение', text: "/m Не флудите." }, { name: 'Мут 10 мин.', text: "/s 10m /Флуд." }, { name: 'Мут 10 мин. (Флешмоб)', text: "/s 10m /Флуд (Флешмоб)." }, { name: 'Мут 30 мин. (Мультипост)', text: "/s 30m /Флуд (Мультипост)." }, { name: 'Мут 60 мин. (Мультипост)', text: "/s 1h /Флуд (Мультипост)." }] },
      { title: 'Ненормативная лексика', info: '', buttons: [{ name: 'Предупреждение', text: "/m Не злоупотребляйте ненормативной лексикой." }, { name: 'Мут 1ч.', text: "/s 1h /Ненормативная лексика." }, { name: 'Мут 3ч.', text: "/s 3h /Ненормативная лексика." }, { name: 'Очистка статуса', text: "/clear_status 1h /Ненормативная лексика" }] },
      { title: 'ЗПТ Темы 18+', info: '', buttons: [{ name: 'Мут', text: "/s 60 /Запрещенная тема (п.1)." }, { name: 'Очистка статуса', text: "/clear_status 1h / Запрещенная тема (п.1)." }] },
      { title: 'ЗПТ Алкогольные напитки', info: '', buttons: [{ name: 'Предупреждение', text: "/m Запрещенная тема (п.2.1)." }, { name: 'Мут', text: "/s 1h /Запрещенная тема (п.2.1)." }] },
      { title: 'ЗПТ Наркотические вещества', info: '', buttons: [{ name: 'Мут', text: "/s 6h /Запрещенная тема (п.2.2)." }] },
      { title: 'ЗПТ Высказывания, содержащие или пропагандирующие...', info: '', buttons: [{ name: 'Мут', text: "/s 6h /Запрещенная тема (п.3)." }] },
      { title: 'ЗПТ Обсуждения, высказывания о сторонних игровых онлайн-проектах', info: '', buttons: [{ name: 'Предупреждение', text: "/m Запрещенная тема (п.4)." }, { name: 'Мут', text: "/s 1h /Запрещенная тема (п.4)." }] },
      { title: 'ЗПТ СПАМ. Реклама сторонних игровых онлайн-проектов. Агитация к уходу из проекта или его смене.', info: '', buttons: [{ name: 'Мут', text: "/s 12h /Запрещенная тема (п.5.1)." }] },
      { title: 'ЗПТ Обсуждение, распространение закрытой информации.', info: '', buttons: [{ name: 'Мут', text: "/s 12h /Запрещенная тема (п.6)." }] },
      { title: 'ЗПТ Обсуждение должностных.', info: '', buttons: [{ name: 'Мут', text: "/s 1h /Запрещенная тема (п.8)." }, { name: 'Очистка статуса', text: "/clear_status 12h /Запрещенная тема (п.8). Оскорбление админов" }] },
      { title: 'ЗПТ Обсуждения, высказывания о родственниках игроков в некорректной форме', info: '', buttons: [{ name: 'Мут', text: "/s 6h /Запрещенная тема (п.9)." }] },
      { title: 'п.13 общих правил игры.', info: '', buttons: [{ name: 'Мут', text: "/s 12h /п.13 общих правил игры." }, { name: 'Очистка статуса', text: "/clear_status 12h /п.13 общих правил игры. Война" }] },
      { title: 'Попытка покупки или продажи аккаунта или вещей, монстров.', info: '', buttons: [{ name: 'Мут', text: "/s 12h /Попытка покупки или продажи аккаунта или вещей, монстров." }] },
      { title: 'Попытка покупки или продажи сторонних вещей или услуг.', info: '', buttons: [{ name: 'Мут', text: "/s 12h /Попытка покупки или продажи сторонних вещей или услуг." }] },
      { title: 'Попытка передачи или получения реквизитов.', info: '', buttons: [{ name: 'Мут', text: "/s 12h /Попытка передачи или получения реквизитов." }] },
      { title: 'Безвозмездная и несоответствующая средней рыночной стоимости передача монстров/вещей/кредитов кому-либо.', info: '', buttons: [{ name: 'Предупреждение', text: "/m Запрещена безвозмездная и несоответствующая средней рыночной стоимости передача монстров/вещей/кредитов кому-либо." }] },
      { title: 'Попытка покупки или продажи аккаунта или вещей, монстров в Торговле', info: '', buttons: [{ name: 'Предупреждение', text: "/m Попытка покупки или продажи аккаунта или вещей, монстров в Торговле" }] },
      { title: 'Использование и распространение сторонних программных средств, в т.ч. скриптов!', info: '', buttons: [{ name: 'Предупреждение', text: "/m Запрещено использование и распространение сторонних программных средств, в т.ч. скриптов!" }] },
      { title: 'Взаимная прокачка (ранговая) и/или заведомый проигрыш/выигрыш боя(-ев) за кредиты/вещи/монстров.', info: '', buttons: [{ name: 'Предупреждение', text: "/m Запрещена взаимная прокачка (ранговая) и/или заведомый проигрыш/выигрыш боя(-ев) за кредиты/вещи/монстров." }] },
      { title: 'Намеренное нарушение правил перед выходом из игры.', info: '', buttons: [{ name: 'Мут', text: "/s 12h /Намеренное нарушение правил перед выходом из игры." }] }
    ];
    
    let spoilers = JSON.parse(localStorage.getItem('customSpoilers')) ||
                   JSON.parse(JSON.stringify(defaultSpoilers));
    function saveSpoilers() {
        localStorage.setItem('customSpoilers', JSON.stringify(spoilers));
    }

    function makeDraggable(el, handle) {
        let startX, startY, origX, origY;
        handle.onmousedown = function(e) {
            e.preventDefault();
            startX = e.clientX; startY = e.clientY;
            const rect = el.getBoundingClientRect();
            origX = rect.left; origY = rect.top;
            document.addEventListener('mousemove', onMove);
            document.addEventListener('mouseup', onUp);
            handle.style.cursor = 'grabbing';
        };
        function onMove(e) {
            e.preventDefault();
            el.style.left = origX + (e.clientX - startX) + 'px';
            el.style.top  = origY + (e.clientY - startY) + 'px';
            el.style.transform = '';
        }
        function onUp() {
            document.removeEventListener('mousemove', onMove);
            document.removeEventListener('mouseup', onUp);
            handle.style.cursor = 'grab';
        }
    }

    function createModal() {
        const wrapper = document.createElement('div');
        wrapper.id = 'custom-modal-wrapper';

        const modal = document.createElement('div');
        modal.id = 'custom-modal';

        const header = document.createElement('div');
        header.className = 'divDockPanelsTitle';
        header.innerHTML = '<div class="divDockPanelsTitleText">Панель наказаний</div>';
        modal.appendChild(header);

        const closeBtn = document.createElement('div');
        closeBtn.className = 'button close justicon';
        closeBtn.innerHTML = '<span class="icon icomoon icon-x"></span>';
        closeBtn.onclick = () => wrapper.style.display = 'none';
        modal.appendChild(closeBtn);

        makeDraggable(modal, header);

        const search = document.createElement('input');
        search.type = 'text';
        search.placeholder = 'Поиск...';
        search.className = 'custom-search-input';
        search.oninput = () => {
            const q = search.value.toLowerCase();
            document.querySelectorAll('.custom-spoiler').forEach(sp =>
                sp.style.display = sp.querySelector('.spoiler-title').textContent.toLowerCase().includes(q) ? 'block' : 'none'
            );
        };
        modal.appendChild(search);

        const nick = document.createElement('input');
        nick.type = 'text';
        nick.id = 'custom-nickname';
        nick.placeholder = 'Кому...';
        nick.className = 'custom-nickname-input';
        modal.appendChild(nick);

        const container = document.createElement('div');
        container.id = 'spoilers-container';
        modal.appendChild(container);

        const add = document.createElement('button');
        add.className = 'button gray withtextt add-spoiler-btn';
        add.innerHTML = '<span class="icon icomoon icon-plus"></span><span class="btn-text">Добавить спойлер</span>';
        add.onclick = () => {
            const t = prompt("Заголовок нового спойлера", "Новый спойлер");
            if (!t) return;
            const info = prompt("Описание", "") || "";
            spoilers.push({ title: t, info, buttons: [] });
            saveSpoilers(); renderSpoilers(container);
        };
        modal.appendChild(add);

        const reset = document.createElement('button');
        reset.className = 'button gray withtextt reset-btn';
        reset.innerHTML = '<span class="icon icomoon icon-trash"></span><span class="btn-text">Сбросить настройки</span>';
        reset.onclick = () => {
            if (!confirm("Сбросить все настройки?")) return;
            localStorage.removeItem('customSpoilers');
            spoilers = JSON.parse(JSON.stringify(defaultSpoilers));
            saveSpoilers(); renderSpoilers(container);
        };
        modal.appendChild(reset);

        document.body.appendChild(wrapper);
        wrapper.appendChild(modal);
        return { wrapper, container };
    }

    function createSpoiler(s, idx, container) {
        const wr = document.createElement('div');
        wr.className = 'custom-spoiler';

        const tc = document.createElement('div');
        tc.className = 'title-container';
        const t = document.createElement('p');
        t.className = 'spoiler-title';
        t.textContent = s.title;
        t.ondblclick = () => { t.contentEditable = true; t.focus(); };
        t.onblur = () => {
            t.contentEditable = false;
            spoilers[idx].title = t.textContent; saveSpoilers();
        };
        const del = document.createElement('span');
        del.className = 'delete-spoiler';
        del.innerHTML = '<span class="icon icomoon icon-trash"></span>';
        del.onclick = e => {
            e.stopPropagation();
            if (!confirm("Удалить спойлер?")) return;
            spoilers.splice(idx,1); saveSpoilers(); renderSpoilers(container);
        };
        tc.append(t, del);
        wr.appendChild(tc);

        const info = document.createElement('p');
        info.className = 'spoiler-info';
        info.textContent = s.info;
        info.ondblclick = () => { info.contentEditable = true; info.focus(); };
        info.onblur = () => {
            info.contentEditable = false;
            spoilers[idx].info = info.textContent; saveSpoilers();
        };
        wr.appendChild(info);

        const content = document.createElement('div');
        content.className = 'spoiler-content';
        t.onclick = () => {
            content.style.display = content.style.display === 'block' ? 'none' : 'block';
        };
        const form = document.createElement('div');
        form.className = 'form-wrapper';

        s.buttons.forEach((b, bi) => {
            const span = document.createElement('span');
            const btn = document.createElement('button');
            btn.className = 'button gray withtextt';
            btn.innerHTML = '<span class="icon icomoon icon-x"></span><span class="btn-text">'+b.name+'</span>';
            btn.onclick = e => {
                if (e.target.closest('.icon')) return;
                const nameField = document.querySelector('#divInputFields .txtToName');
                const textField = document.querySelector('#divInputFields .txtInput');
                if (nameField) nameField.value = selectedNickname;
                if (textField) textField.value = b.text;
            };
            btn.ondblclick = e => {
                if (e.target.closest('.icon')) return;
                const nn = prompt("Новое имя кнопки", b.name);
                if (nn!==null){ b.name=nn; btn.querySelector('.btn-text').textContent=nn; }
                const nt = prompt("Новая команда", b.text);
                if (nt!==null) b.text=nt;
                saveSpoilers();
            };
            const ic = btn.querySelector('.icon');
            ic.onclick = e => {
                e.stopPropagation();
                if (!confirm("Удалить кнопку?")) return;
                spoilers[idx].buttons.splice(bi,1); saveSpoilers(); renderSpoilers(container);
            };
            span.append(btn);
            form.append(span);
        });

        const addBtn = document.createElement('button');
        addBtn.className = 'button gray withtextt';
        addBtn.innerHTML = '<span class="icon icomoon icon-plus"></span><span class="btn-text">Добавить кнопку</span>';
        addBtn.onclick = () => {
            const nm = prompt("Имя кнопки");
            if (!nm) return;
            const cmd = prompt("Команда");
            if (cmd===null) return;
            spoilers[idx].buttons.push({ name: nm, text: cmd });
            saveSpoilers(); renderSpoilers(container);
        };
        form.append(addBtn);

        content.append(form);
        wr.appendChild(content);
        return wr;
    }

    function renderSpoilers(container) {
        container.innerHTML = '';
        spoilers.forEach((s,i) => container.appendChild(createSpoiler(s,i,container)));
    }

    function waitForPosts() {
        new MutationObserver(() => {
            document.querySelectorAll('.post').forEach(post => {
                if (post.querySelector('.custom-button')) return;
                const timeEl = post.querySelector('.time');
                const userEl = post.querySelector('.users .label');
                if (timeEl && userEl) {
                    const btn = document.createElement('button');
                    btn.className = 'custom-button';
                    btn.textContent = 'М';
                    btn.onclick = () => {
                        selectedNickname = userEl.textContent;
                        const nickInput = document.getElementById('custom-nickname');
                        nickInput.value = '';
                        nickInput.placeholder = selectedNickname;
                        modal.wrapper.style.display = 'block';
                    };
                    timeEl.parentNode.insertBefore(btn, timeEl.nextSibling);
                }
            });
        }).observe(document.body, { childList: true, subtree: true });
    }

    const modal = createModal();
    renderSpoilers(modal.container);
    if (document.readyState === 'complete') {
        waitForPosts();
    } else {
        window.addEventListener('load', waitForPosts);
    }

})();
