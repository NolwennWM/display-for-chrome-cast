
handleAppAPI();


function handleAppAPI()
{
    if(!window.appAPI) return;
    if(typeof window.appAPI.openBrowser === 'function') {
        document.getElementById('openBtn')?.addEventListener('click', appAPI.openBrowser);
    }
}


