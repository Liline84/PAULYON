export let translations = {};
export let currentLanguage = localStorage.getItem('lang') || 'fr';

export function setTranslations(data) {
    translations = data;
}

export function setLanguage(lang, dataConfig) {
    currentLanguage = lang;
    localStorage.setItem('lang', lang);
    document.documentElement.setAttribute('lang', lang);

    const currentTrans = translations[lang] || translations['fr'];

    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        let text = currentTrans[key] || '';
        
        const settings = dataConfig.generalSettings;
        text = text.replace('[YEAR]', settings?.copyrightYear || new Date().getFullYear());
        text = text.replace('[SITE_NAME]', settings?.siteName || 'PAULYON');
        text = text.replace('[EMAIL]', settings?.emailContact || '');
        const num = settings?.whatsappNumber || '';
        const formatted = num.replace(/(\+3̣)(4̣)(4̣)/, '12 $3');
        text = text.replace('[WHATSAPP]', formatted);

        el.innerHTML = text;
    });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (currentTrans[key]) el.placeholder = currentTrans[key];
    });
}
```

---

✅ Exemple d’importation dans `main.js`

```js
import { setLanguage, setTranslations } from './i18n.js';

setTranslations(translationData);
setLanguage(currentLanguage, dataConfig);
```

---

Souhaites-tu aussi une fonction de *switch de langue* ici, ou tu préfères la laisser dans `main.js` ?
