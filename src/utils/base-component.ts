import Vue from 'vue'

export class BaseComponent extends Vue {
    translations: any;
    declare $http: any;

    t(key: string): string {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${'django_language'}=`);
        let locale = 'en';
        if (parts.length === 2) { // @ts-ignore
            locale = parts.pop().split(';').shift();
        }
        if (locale === 'en') return key;
        if (!this['translations']) return key;
        if (!this['translations'][locale]) return key;
        if (!this['translations'][locale][key]) return key;
        return this.translations[locale][key];
    }
}