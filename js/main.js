var desktop = {
        self        : $('#desktop'),
        taskbar     : $('#taskbar'),
        launcher    : $('.launcher'),
        icons       : $('.desktop-icons')
    },
    settings = {
        height              : 350,
        width               : 500,
        left                : 200,
        top                 : 20,
        animation_fast      : 200,
        animation_normal    : 400,
        animation_slow      : 600,
    },
    aWindow = {
        window        : '<div class="window" data-o="{src}"><div class="head"><span class="icon">{icon}</span>'+
        '<span class="title">{title}</span><div class="controlbox"><span class="close"></span>'+
        '<span class="max"></span><span class="min"></span></div></div><div class="wbody"></div></div>',
        task          : '<li><span data-task="{src}"></span></li>',
        resizeHandler : '<div class="reshandler"></div>',
        resizeHandles : [
            '<div class="res-n"></div>',
            '<div class="res-e"></div>',
            '<div class="res-s"></div>',
            '<div class="res-w"></div>',
            '<div class="res-nw"></div>',
            '<div class="res-ne"></div>',
            '<div class="res-sw"></div>',
            '<div class="res-se"></div>'
        ],
    }
    ;

(function($){


    reinit();







    $(window)
        .resize(function () {
            reinit();
        });
	$(document)
        .on('click', '.controlbox .close', function () {destroyTask($(this).closest('.window').dt('o'))})
        .on('click', '.controlbox .min', function () {hideWindow($(this).closest('.window'))})
        .on('click', '.controlbox .max', function () {
            var win = $(this).closest('.window')
            if(win.dt('s')=='max'){
                minimWindow(win)
            }else{
                maximWindow(win)
            }
        })
        .on('dblclick', '.head .title', function () {
            $(this).next().find('.max').trigger('click')
        })
        .on('click', '#taskbar > ul > li', function () {
            var win = $('.window[data-o="'+$(this).find('span').dt('task')+'"]');
            if(win.dt().s=='hidden')
                showWindow(win);
            else
                hideWindow(win);
        })
        .on('mousedown', '.window', function(){
            $('.window').each(function(){losefocusWindow($(this))})
            focusWindow($(this));

        })
        .on('click', '[data-action]', function(){
            eval(actions[this.dataset.action])

        })
        .on('click', '[data-app]', function(){
            launchApp(this.dataset.app);
            toggleLaucnher(undefined, false)
        })
        .on('click', '.launcher > .trigger', toggleLaucnher)
        .on('contextmenu', function(e){
            showContextMenu(e);
            return false;

        })
        .on('click', function(e){
            console.log(e.target);
            var n = $(e.target).recr('[data-wtype]');
            var act = $(e.target).recr('[data-act]');

            if(n.dt('wtype')!=='float'){
                $('[data-wtype="float"]').hide();
            }
            if(act.dt('act')!=='launcher' && desktop.launcher.find('ul').dt('on')===true){
                toggleLaucnher(undefined, false);
            }
        })




        .ready(function () {
            //reinit();

            createNotification('work', 'Hey you', 'Welcome to our website, you can now get started with our new step by step guide. and have fun')
            createNotification('about', 'Hey you', 'Welcome to our website, you can now get started with our new step by step guide. and have fun')
            createNotification('resources', 'Hey you', 'Welcome to our website, you can now get started with our new step by step guide. and have fun')
        })
    ;









})(jQuery);


function neighbor(el, d) {
    if(d=='prev')
        return $(el).parent().prev().find('span');
    else
        return $(el).parent().next().find('span');

}
function showWindow(win){
    focusWindow(win
        .animate({
            top     : win.dt('y') || settings.top,
            left    : win.dt('x') || settings.left,
            opacity : 1,
            width   : win.dt('w') || settings.width
        }, settings.animation_slow)
        .dt('s', 'normal'));

}
function hideWindow(win){
    var task = $('[data-task="'+win.dt('o')+'"]');
    win
        .dt('x', win.position().left).dt('y', win.position().top)
        .animate({
            top     : desktop.height + 2,
            left    : task.position().left,
            opacity : 0,
            width   : win.width() / (settings.animation_fast / 50)
        }, settings.animation_slow)
        .dt('s', 'hidden')
}
function maximWindow(win){
    console.log(desktop);
    win
        .dt('h', win.height()).dt('w', win.width())
        .dt('x', win.position().left).dt('y', win.position().top)
        .animate({
            top     : 0,
            left    : 0,
            width   : desktop.width,
            height  : desktop.height
        }, settings.animation_fast)
        .dt('s', 'max')
}
function minimWindow(win){
    win

        .animate({
            top     : win.dt('y') || settings.top,
            left    : win.dt('x') || settings.left,
            width   : win.dt('w') || settings.width,
            height  : win.dt('h') || settings.height
        }, settings.animation_fast)
        .dt('s', 'normal')

}
function focusWindow(win){
    win
        .dt('z', win.css('z-index'))
        .css({
            'z-index'       : $('.window').length+1
        })

}
function losefocusWindow(win){
    win.css('z-index', $('.window').length);
}
function hideNotification(n){
    n.animate({
        top : desktop.self.height()
    }, 500, 'swing', function(){$(this).remove(); reorderNotifications();})
}
function destroyTask(e){
    var win = $('.window[data-o="'+e+'"]'),
        task = $('[data-task="'+e+'"]').parent();
    console.log(win, task)
    win.fadeOut(settings.animation_fast, function(){
        $(this).remove();
    })
    task.hide(settings.animation_fast, function(){
        $(this).remove();
    })
}
function tick(){
    setTimeout(tick, 1000);
}
function reinit(){
    loadApps(desktop.launcher);

    desktop.height = desktop.self.height() - desktop.taskbar.height();
    desktop.width = desktop.self.width();
    desktop.tasks = desktop.taskbar.find('> ul');
    $('.window[data-s="max"]').each(function(){
        $(this)
            .height(desktop.height)
            .width(desktop.width)
    });
    $('[data-nav], [data-task]')
        .each(function () {
            var i = $(this).dt().nav || $(this).dt().task;
            console.log(i);
            this.innerHTML = apps[i].icon+'<title>'+apps[i].title+'</title>';
        })
        .hover(function(){
            neighbor(neighbor(this).addClass('sh1')).addClass('sh2');
            neighbor(neighbor(this, 'prev').addClass('sh1'), 'prev').addClass('sh2');
        }, function () {
            neighbor(neighbor(this).removeClass('sh1')).removeClass('sh2');
            neighbor(neighbor(this, 'prev').removeClass('sh1'), 'prev').removeClass('sh2');
        });
    $('[data-act]').each(function () {
        var act = $(this).dt().act;

        switch (act){
            case 'clock':
                bindClock($(this));
                break;
            case 'date':
                bindDate($(this));
                break;
            case 'launcher':
                $(this).find('.trigger').html(icons('launcher', 24, 24, '#ccc', '#fff'));
                break;
        }
    });
    $('[data-app]').each(function () {
        $(this)
            .html('<span class="icon">'+apps[$(this).dt().app].icon+'</span>')
            .append('<span class="title">'+apps[this.dataset.app].title+'</span>');
    });


}

function showContextMenu(e){
    var act = $(e.target).recr('[data-act]').dt('act');

    var h = $('[data-act="context-menu"]').html('');
    if(!contextMenus.hasOwnProperty(act)) act = 'global-ui';
    for(var c in contextMenus[act]){
        h.append('<li data-action="'+contextMenus[act][c]+'">'+c+'</li>')
    }
    h.css({
        top:    e.clientY,
        left:    e.clientX,
    }).show().find('li').click(function(){hideContextMenu();})
}
function hideContextMenu(){
    $('.context-menu').fadeOut('fast');
}
function createWindow(e, c){
    var dis = aWindow.window.replace('{src}', e).replace('{title}', e).replace('{icon}', apps[e].icon);
    dis = $(dis).appendTo(desktop.self)
    /*for(var i = 0;i<aWindow.resizeHandles.length;i++){
     dis.append(aWindow.resizeHandles[i])
     }*/
    dis.append(aWindow.resizeHandler)
    showWindow(dis); Ps.initialize(dis.find('.wbody').append(c)[0])

    settings.top += 5;
    settings.left += 5;
    reinit();


    return dis
        .draggable({handle: '.head'})
        .resizable({handles: {'nw': '.reshandler'}})
        .css('z-index', $('.window').length)
}
function createTask(e, content, url, urlType){
    var dis = aWindow.task.replace('{src}', e);
    $(dis).appendTo(desktop.tasks);
    var win = createWindow(e, content || '');

    if(windows.hasOwnProperty(e)){
        url = globalSettings.url + 'views/' + e + '.html';
        urlType = 'ajax';
    }

    if(url!==undefined) getContent(win, url, urlType);
    return win
}
function createNotification(task, title, text, action) {
    var html = $('<div class="notification" data-s=""><title></title><span class="icon"></span><span class="message"></span><span class="clear" data-action="close"></span></div>');
    var sv = apps[task].icon, ic = icons('close', 16,16, 'rgb(99, 98, 98);', 'rgb(142, 141, 141);');

    html
        .dt('s', task)
        .find('title').html(title)
        .next().html(sv)
        .next().html(text)
        .parent().find('.clear').html(ic)
        .parent()
        .appendTo(desktop.self)
        .css('bottom', (($('.notification').length-1) * (html.height() + 5)) + 55);

    setTimeout(function(){
        hideNotification(html);
        }, globalSettings.notification_timeout);











}
function reorderNotifications(){
    $('.notification').each(function (i) {
        $(this).animate({bottom:(i * ($(this).height() + 5)) + 55})
    })
}
function bindClock(e) {
    var d = new Date();
    var sep = ':';
    /*e.r = !e.r;
    sep = (e.r) ? ' ' : ':';*/
    e.html(d.getHours()+sep+d.getMinutes()+sep+d.getSeconds());
    setTimeout(function(){bindClock(e)}, 1000)
}
function bindDate(e) {
    var d = new Date();
    e.html(d.getDay()+'/'+d.getMonth()+'/'+d.getYear());
    setTimeout(function(){bindDate(e)}, 3600000)
}
function toggleLaucnher(e, show){
    var launcher = $('.launcher > ul');
    if(show) launcher.dt('on', !show);
    if(launcher.dt().on===true){
        launcher.hide().dt('on', false);
        launcher.prev('.trigger').removeClass('active');
    }else{
        launcher.show().dt('on', true);
        launcher.prev('.trigger').addClass('active');
    }
}
function launchApp(app){
    createTask(app, '', apps[app].url, apps[app].data_type);
    createNotification(app, app, 'has been laucnhed');
}
function iframeLoad(ifr, callback){
    console.log('..')
    var el = $('body', ifr.contents());
    if (el.length !== 1) {
        setTimeout(function(){iframeLoad(ifr, callback);}, 100);
        return;
    }
    callback();
}

function loadApps(el){
    var appslist = desktop.launcher.find('ul').html('');
    var icons = desktop.icons.html('');



    for(var app in apps){
        //createTask(app, 'loading...', apps[app].url, apps[app].data_type);
        appslist.append('<li data-app="'+app+'"></li>');
        icons.append('<li data-app="'+app+'"></li>');

    }
}
function getContent(win, url, type){
    if(url===undefined || url.length<5) return false;
    var id = randID(20, 'content');

    win.find('.wbody').html('<div class="preloader"></div>');

    if(type==='ajax'){
        $.ajax({
            url     : url,
            method  :'GET',
            success : function (e) {
                console.log(e);
                win.find('.wbody').html(e);
            }
        })
    }else{
        win.find('.wbody').html('<iframe id="'+id+'" src="'+url+'"></iframe>');

        iframeLoad($('#'+id), function () {
            console.log('done')
        })
    }

}
function randID(length, k){
    var p = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
        ret = "";
    for(var i = 0; i<(length || 5); i++)
        ret += p.charAt(Math.floor(Math.random() * p.length))
    return (k || '')+'_'+ret;
}
function log(all){
    for(var i in arguments){
        console.log('=>', arguments[i]);
    }


}
