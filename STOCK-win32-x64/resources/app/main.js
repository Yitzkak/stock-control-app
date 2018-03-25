//'use strict';

const electron = require('electron');
//require('electron-reload')(__dirname);
const url = require('url');
const path = require('path');
const {app, BrowserWindow, Menu} = electron;
let mainWindow;
 
app.on("ready",function(){
    // main window
    mainWindow = new BrowserWindow({width:1366,height:692});
    mainWindow.maximize(true);
    mainWindow.setResizable(true);
    //load Main Window 
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname,'public/index.html'),
        protocol:'file',
        slashes:true
    }));

    mainWindow.webContents.openDevTools();
    //create menu file 
    //Build menu from template
    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
    //insert menu
    Menu.setApplicationMenu(mainMenu);
});

//Handle create add sales window
function createSalesWindow(){
    addSalesWindow = new BrowserWindow({
        parent:mainWindow,
        modal:true,
        width:900,
        height:640,
        title:"Add sales Record"
    });
    addSalesWindow.webContents.openDevTools();
    addSalesWindow.setResizable(false);
    //load Sales Window 
    addSalesWindow.loadURL(url.format({
        pathname: path.join(__dirname,'public/addSalesWindow.html'),
        protocol:'file',
        slashes:true
    }));

    addSalesWindow.on('close',()=>{
        addSwapWindow = null;
    });
}

//Handle create add swap window
function createSwapWindow(){
    addSwapWindow = new BrowserWindow({
        modal:true,
        width:750,
        height:550,
        title:"Add Swap Record"
    });

    //load Sales Window 
    addSwapWindow.loadURL(url.format({
        pathname: path.join(__dirname,'public/addSwapWindow.html'),
        protocol:'file',
        slashes:true
    }));

    //garbage collection
    addSwapWindow.on('close',()=>{
        addSwapWindow = null;
    }); 
}

//Handle create Sales window
function createViewSalesWindow(){
    viewSalesWindow = new BrowserWindow({
        modal:true,
        width:1366,
        height:692,
        title:"Sales Record"
    });

    viewSalesWindow.maximize(true);

    viewSalesWindow.webContents.openDevTools();
    //load Sales Window 
    viewSalesWindow.loadURL(url.format({
        pathname: path.join(__dirname,'public/viewSales.html'),
        protocol:'file',
        slashes:true
    }));

    //garbage collection
    viewSalesWindow.on('close',()=>{
        viewSalesWindow = null;
    }); 
}

//Create menu Template
const mainMenuTemplate = [
    {
        label:'File',
        submenu:[
            {
                label:'Add Sales Record',
                click(){
                    createSalesWindow();
                }
            },
            {
                label:'Add Swap Record',
                click(){
                    createSwapWindow();
                }
            },
            {
                label:'View Sales Record',
                click(){
                    createViewSalesWindow();
                }
            },
            {
                label:'Exit',
                click(){
                    app.quit();
                }
            }
        ]
    }
];


