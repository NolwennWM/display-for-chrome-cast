class MainApp
{
    contentElement = document.querySelector('#content');
    currentModule = null;
    
    constructor()
    {
        this.handleAppAPI();
        this.loadPage("dashboard");
    }

     handleAppAPI()
    {
        if(!window.appAPI) return;
        if(window.appAPI.openBrowser && typeof window.appAPI.openBrowser === 'function') 
        {
            document.getElementById('openBtn')?.addEventListener('click', window.appAPI.openBrowser);
        }
        if(window.appAPI.routeTo && typeof window.appAPI.routeTo === 'function')
        {        
            document.querySelectorAll('[data-page]').forEach(element => {
                element.addEventListener('click', this.handleRouteClick.bind(this));
            });
        }
    }

    handleRouteClick(event)
    {
        event.preventDefault();
        const page = event.currentTarget.getAttribute('data-page');
        if(!page) return;
        this.loadPage(page);
    }

    async loadPage(page = 'dashboard') 
    {
        if(!this.contentElement) return;
        const content = await window.appAPI.routeTo(page);
        this.contentElement.innerHTML = content;
        this.contentElement.className = `page-${page}`;

        const module = await import(`./${page}.js?t=${Date.now()}`);

        this.currentModule?.cleanup?.();
        this.currentModule = new module.default();

        this.handleAppAPI();
    }


}

window.MainApp = new MainApp();